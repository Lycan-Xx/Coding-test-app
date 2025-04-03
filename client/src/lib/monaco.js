import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  try {
    self.MonacoEnvironment = {
      getWorkerUrl: function (_moduleId, label) {
        if (label === "json") {
          return "/node_modules/monaco-editor/esm/vs/language/json/json.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
          return "/node_modules/monaco-editor/esm/vs/language/css/css.worker.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return "/node_modules/monaco-editor/esm/vs/language/html/html.worker.js";
        }
        if (label === "typescript" || label === "javascript") {
          return "/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js";
        }
        return "/node_modules/monaco-editor/esm/vs/editor/editor.worker.js";
      },
    };
  } catch (error) {
    console.error('Failed to initialize Monaco environment:', error);
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