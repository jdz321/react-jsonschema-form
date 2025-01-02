import { useMemo, type ComponentType } from 'react';
import type { FormContextType } from '@rjsf/utils';
import type { TextEditorProps } from '../types';
import SimpleTextEditor from './SimpleTextEditor';
import withSpin from './withSpin';

export default function useTextEditor(formContext?: FormContextType): ComponentType<TextEditorProps>;
export default function useTextEditor(formContext?: FormContextType) {
  return useMemo(() => {
    if (formContext && 'TextEditor' in formContext) {
      return withSpin(formContext.TextEditor, 'Loading TextEditor ...');
    }
    return SimpleTextEditor;
  }, [formContext]);
}
