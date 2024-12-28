import type {
  ArrayFieldTemplateProps,
  FieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  ObjectFieldTemplateProps,
} from '@rjsf/utils';
import type { CSSProperties } from 'react';

export type CustomArrayFieldTemplateProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
> = ArrayFieldTemplateProps<T, S, F> & Pick<FieldProps<T, S, F>, 'onChange'> & { hasShownError: boolean };

export type CustomObjectFieldTemplateProps<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
> = ObjectFieldTemplateProps<T, S, F> & Pick<FieldProps<T, S, F>, 'onChange'>;

export interface TextEditorProps extends Pick<CSSProperties, 'width' | 'height'> {
  value: string;
  onChange(val: string): void;
}
