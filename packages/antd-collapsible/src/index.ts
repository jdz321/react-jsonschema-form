import { ComponentType } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { FormProps, ThemeProps, withTheme } from '@rjsf/core';

import Templates, { generateTemplates } from './templates';
import Fields, { generateFields } from './fields';

export function generateTheme<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): ThemeProps<T, S, F> {
  return {
    fields: generateFields<T, S, F>(),
    templates: generateTemplates<T, S, F>(),
  };
}

const Theme = generateTheme();

export function generateForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>(generateTheme<T, S, F>());
}

const Form = generateForm();

export { Form, Fields, Templates, Theme, generateTemplates };

export default Form;
