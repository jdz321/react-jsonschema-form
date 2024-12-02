import { ErrorSchema } from '@rjsf/utils';

export function errorSchemaHasError<T>(errorSchema: ErrorSchema<T> | undefined) {
  if (!errorSchema) {
    return false;
  }
  if (errorSchema.__errors) {
    return true;
  }
  for (const subSchema of Object.values(errorSchema as Record<string, ErrorSchema>)) {
    if (errorSchemaHasError(subSchema)) {
      return true;
    }
  }
  return false;
}
