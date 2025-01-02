import classNames from 'classnames';
import isObject from 'lodash/isObject';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import {
  FormContextType,
  GenericObjectType,
  ObjectFieldTemplatePropertyType,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
  titleId,
} from '@rjsf/utils';
import { Col, Row, ConfigProvider, Collapse, type CollapseProps, Modal, Button } from 'antd';
import { ComponentType, useContext, useState } from 'react';
import { errorSchemaHasError } from '../utils';
import { CustomObjectFieldTemplateProps } from '../types';
import useTextEditor from '../components/useTextEditor';
import { FormOutlined } from '@ant-design/icons';

const DESCRIPTION_COL_STYLE = {
  paddingBottom: '8px',
};

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
function ObjectFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: CustomObjectFieldTemplateProps<T, S, F>
) {
  const {
    description,
    disabled,
    formContext,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    required,
    registry,
    schema,
    title,
    uiSchema,
    errorSchema,
    onChange,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, uiOptions);
  const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>(
    'DescriptionFieldTemplate',
    registry,
    uiOptions
  );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  const { colSpan = 24, labelAlign = 'right', rowGutter = 24 } = formContext as GenericObjectType;

  const findSchema = (element: ObjectFieldTemplatePropertyType): S => element.content.props.schema;

  const findSchemaType = (element: ObjectFieldTemplatePropertyType) => findSchema(element).type;

  const findUiSchema = (element: ObjectFieldTemplatePropertyType): UiSchema<T, S, F> | undefined =>
    element.content.props.uiSchema;

  const findUiSchemaField = (element: ObjectFieldTemplatePropertyType) => getUiOptions(findUiSchema(element)).field;

  const findUiSchemaWidget = (element: ObjectFieldTemplatePropertyType) => getUiOptions(findUiSchema(element)).widget;

  const calculateColSpan = (element: ObjectFieldTemplatePropertyType) => {
    const type = findSchemaType(element);
    const field = findUiSchemaField(element);
    const widget = findUiSchemaWidget(element);

    const defaultColSpan =
      properties.length < 2 || // Single or no field in object.
      type === 'object' ||
      type === 'array' ||
      widget === 'textarea'
        ? 24
        : 12;

    if (isObject(colSpan)) {
      const colSpanObj: GenericObjectType = colSpan;
      if (isString(widget)) {
        return colSpanObj[widget];
      }
      if (isString(field)) {
        return colSpanObj[field];
      }
      if (isString(type)) {
        return colSpanObj[type];
      }
    }
    if (isNumber(colSpan)) {
      return colSpan;
    }
    return defaultColSpan;
  };

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('form');
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === 'left' && `${labelClsBasic}-left`
    // labelCol.className,
  );
  const TextEditor = useTextEditor(formContext);

  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<string>();
  const defaultActiveKey = [idSchema.$id];
  const [activeKey, setActiveKey] = useState<string[] | string>(defaultActiveKey);
  const hasShownError = errorSchemaHasError(errorSchema);

  const onEditOk = () => {
    onChange(JSON.parse(draft || '{}'));
    setShowEditor(false);
    setActiveKey(defaultActiveKey);
  };
  const onEditCancel = () => {
    setShowEditor(false);
  };
  const openEditor = () => {
    setDraft(JSON.stringify(formData || {}, null, 2));
    setShowEditor(true);
  };

  const label = (
    <>
      <Col className={labelColClassName} span={24} style={{ whiteSpace: 'nowrap' }}>
        <TitleFieldTemplate
          id={titleId<T>(idSchema)}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
        <Button
          icon={<FormOutlined />}
          onClick={openEditor}
          disabled={disabled || readonly}
          style={{ marginLeft: '8px' }}
        >
          edit
        </Button>
      </Col>
      {description && (
        <Col span={24} style={DESCRIPTION_COL_STYLE}>
          <DescriptionFieldTemplate
            id={descriptionId<T>(idSchema)}
            description={description}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Col>
      )}
    </>
  );

  const body = (
    <>
      {properties
        .filter((e) => !e.hidden)
        .map((element: ObjectFieldTemplatePropertyType) => (
          <Col key={element.name} span={calculateColSpan(element)}>
            {element.content}
          </Col>
        ))}
      {canExpand(schema, uiSchema, formData) && (
        <Col span={24}>
          <Row gutter={rowGutter} justify='end'>
            <Col flex='192px'>
              <AddButton
                className='object-property-expand'
                disabled={disabled || readonly}
                onClick={onAddClick(schema)}
                uiSchema={uiSchema}
                registry={registry}
              />
            </Col>
          </Row>
        </Col>
      )}
    </>
  );

  const collapseItems: CollapseProps['items'] = [
    {
      key: idSchema.$id,
      label,
      children: body,
      forceRender: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      styles: {
        header: {
          alignItems: 'center',
        },
      },
    },
  ];

  return (
    <fieldset id={idSchema.$id}>
      <Modal title='编辑JSON' open={showEditor} onOk={onEditOk} onCancel={onEditCancel} destroyOnClose width='70vw'>
        <TextEditor
          width='100%'
          height='70vh'
          value={JSON.stringify(formData || {}, null, 2)}
          onChange={(val) => {
            setDraft(val);
          }}
        />
      </Modal>
      <Row>
        <Collapse
          activeKey={hasShownError ? defaultActiveKey : activeKey}
          collapsible='icon'
          items={collapseItems}
          onChange={setActiveKey}
        />
      </Row>
    </fieldset>
  );
}

export default ObjectFieldTemplate as ComponentType<any>;
