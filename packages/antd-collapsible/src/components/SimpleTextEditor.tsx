import React, { CSSProperties, FC, HTMLAttributes, useEffect, useRef } from 'react';
import { TextEditorProps } from '../types';

type SimpleTextEditorBaseProps = Omit<HTMLAttributes<HTMLPreElement>, 'onChange'>;

interface SimpleTextEditorProps extends SimpleTextEditorBaseProps, TextEditorProps {}

export const SimpleTextEditor: FC<SimpleTextEditorProps> = ({
  onChange,
  value,
  width,
  height,
  style = {},
  ...restProps
}) => {
  const textareaStyle: CSSProperties = {
    width,
    height,
    resize: 'vertical',
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    overflow: 'auto',
    padding: '4px 11px',
    boxSizing: 'border-box',
    ...style,
  };

  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = value;
    }
  }, [value]);

  const onContentChange = (e: React.FormEvent<HTMLPreElement>) => {
    onChange((e.target as HTMLPreElement).textContent as string);
  };

  return <pre ref={ref} {...restProps} style={textareaStyle} onInput={onContentChange} contentEditable />;
};

export default SimpleTextEditor;
