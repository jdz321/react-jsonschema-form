import Editor, { OnChange } from '@monaco-editor/react';
import { theme } from 'antd';
import { ReactElement } from 'react';
import { xcodeDefault } from './themes';

interface QuietEditorProp {
  width?: string | number;
  height?: string | number;
  value?: string;
  language?: string;
  readOnly?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  folding?: boolean;
  renderLineHighlight?: 'all' | 'line' | 'none' | 'gutter';
  onChange?: OnChange;
  handleEditorDidMount?: (editor: any, monaco: any) => void;
}

const MonacoEditor = (props: QuietEditorProp): ReactElement => {
  const {
    width,
    lineNumbers = 'on',
    height,
    value,
    folding = true,
    language = 'json',
    readOnly = false,
    renderLineHighlight = 'all',
    onChange,
  } = props;

  const { token } = theme.useToken();

  function editorWillMount(monaco: any) {
    monaco.editor.defineTheme('x-code-default', xcodeDefault);
  }

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorder}`,
        width: width ? width : '100%',
      }}
    >
      <Editor
        height={height}
        width={width}
        value={value}
        language={language}
        onChange={onChange}
        onMount={props.handleEditorDidMount}
        beforeMount={editorWillMount}
        theme='x-code-default'
        options={{
          readOnly,
          lineNumbers,
          renderLineHighlight,
          folding,
          smoothScrolling: true,
          fontSize: 13,
          scrollBeyondLastLine: false,
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 3,
          scrollbar: {
            verticalScrollbarSize: 9,
            horizontalScrollbarSize: 9,
          },
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
