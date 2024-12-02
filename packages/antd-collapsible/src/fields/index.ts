import { Field, FormContextType, RegistryFieldsType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import ArrayField from './ArrayField';
import ObjectField from './ObjectField';

export function generateFields<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): RegistryFieldsType<T, S, F> {
  return {
    ArrayField: ArrayField as unknown as Field<T, S, F>,
    // ArrayField falls back to SchemaField if ArraySchemaField is not defined, which it isn't by default
    ObjectField,
  };
}

export default generateFields();
