import {
  getTemplate,
  getUiOptions,
  ArrayFieldTemplateItemType,
  FormContextType,
  GenericObjectType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';
import classNames from 'classnames';
import { Col, Row, Modal, ConfigProvider, Button, Collapse, type CollapseProps } from 'antd';
import { PlusCircleOutlined, FormOutlined } from '@ant-design/icons';
import { ComponentType, useContext, useState } from 'react';

const DESCRIPTION_COL_STYLE = {
  paddingBottom: '8px',
};

import { CustomArrayFieldTemplateProps } from '../types';
import getTextEditor from '../components/getTextEditor';

/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
function ArrayFieldTemplate<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: CustomArrayFieldTemplateProps<T, S, F>
) {
  const {
    canAdd,
    className,
    disabled,
    formData,
    formContext,
    idSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
    onChange,
    hasShownError,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>(
    'ArrayFieldDescriptionTemplate',
    registry,
    uiOptions
  );
  const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>(
    'ArrayFieldItemTemplate',
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate', T, S, F>(
    'ArrayFieldTitleTemplate',
    registry,
    uiOptions
  );

  const { labelAlign = 'right' } = formContext as GenericObjectType;

  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const prefixCls = getPrefixCls('form');
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === 'left' && `${labelClsBasic}-left`
    // labelCol.className,
  );
  const TextEditor = getTextEditor(formContext);

  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<string>();
  const defaultActiveKey = [idSchema.$id];
  const [activeKey, setActiveKey] = useState<string[] | string>(defaultActiveKey);

  const onEditOk = () => {
    onChange(JSON.parse(draft || '[]'));
    setShowEditor(false);
    setActiveKey(defaultActiveKey);
  };
  const onEditCancel = () => {
    setShowEditor(false);
  };
  const openEditor = () => {
    setDraft(JSON.stringify(formData || [], null, 2));
    setShowEditor(true);
  };

  const label = (
    <>
      <Col className={labelColClassName} span={24} style={{ whiteSpace: 'nowrap' }}>
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          required={required}
          title={uiOptions.title || title}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
        <Button.Group style={{ marginLeft: '8px' }}>
          {canAdd && (
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={() => {
                onAddClick();
                setActiveKey(defaultActiveKey);
              }}
              disabled={disabled || readonly}
            >
              add
            </Button>
          )}
          <Button icon={<FormOutlined />} onClick={openEditor} disabled={disabled || readonly}>
            edit
          </Button>
        </Button.Group>
      </Col>
      {(uiOptions.description || schema.description) && (
        <Col span={24} style={DESCRIPTION_COL_STYLE}>
          <ArrayFieldDescriptionTemplate
            description={uiOptions.description || schema.description}
            idSchema={idSchema}
            schema={schema}
            uiSchema={uiSchema}
            registry={registry}
          />
        </Col>
      )}
    </>
  );

  const body = (
    <Col className='array-item-list' span={24}>
      {items &&
        items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
          <ArrayFieldItemTemplate key={key} {...itemProps} />
        ))}
    </Col>
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
    <fieldset className={className} id={idSchema.$id}>
      <Modal title='编辑JSON' open={showEditor} onOk={onEditOk} onCancel={onEditCancel} destroyOnClose width='70vw'>
        <TextEditor
          width='100%'
          height='70vh'
          value={JSON.stringify(formData || [], null, 2)}
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

export default ArrayFieldTemplate as ComponentType<any>;
