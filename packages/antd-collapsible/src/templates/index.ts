import { FormContextType, RJSFSchema, StrictRJSFSchema, TemplatesType } from '@rjsf/utils';
import ArrayFieldTemplate from './ArrayFieldTemplate';
import ArrayFieldItemTemplate from './ArrayFieldItemTemplate';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import { generateTemplates as generateTemplatesAntd } from '@rjsf/antd';

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): Partial<TemplatesType<T, S, F>> {
  return {
    ...generateTemplatesAntd(),
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
  };
}

export default generateTemplates();
