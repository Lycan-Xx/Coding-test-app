import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  if (typeof window !== 'undefined') {
    window.MonacoEnvironment = {
      getWorkerUrl: function (_moduleId, label) {
        const workerPath = '/monaco-editor/esm/vs';
        
        if (label === 'typescript' || label === 'javascript') {
          return `${workerPath}/language/typescript/ts.worker?worker`;
        }
        if (label === 'json') {
          return `${workerPath}/language/json/json.worker?worker`;
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return `${workerPath}/language/css/css.worker?worker`;
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return `${workerPath}/language/html/html.worker?worker`;
        }
        return `${workerPath}/editor/editor.worker?worker`;
      },
    };
  }
}

// Configure editor settings
export function createEditorConfig(language = 'javascript') {
  return {
    value: '',
    language,
    theme: 'vs-dark',
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    roundedSelection: false,
    padding: { top: 16 },
    lineHeight: 21,
    fontFamily: "'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
    fontLigatures: true,
    folding: true,
    renderWhitespace: 'none',
    wordWrap: 'on',
    fixedOverflowWidgets: true,
    // Additional settings to reduce worker dependency
    quickSuggestions: false,
    formatOnType: false,
    formatOnPaste: false,
    parameterHints: { enabled: false },
    suggestOnTriggerCharacters: false
  };
}

export const MonacoEditorConfig = createEditorConfig;