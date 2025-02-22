import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  try {
    // Define the base path for Monaco workers
    self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        const workerPaths = {
          typescript: '/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
          javascript: '/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
          html: '/node_modules/monaco-editor/esm/vs/language/html/html.worker.js',
          json: '/node_modules/monaco-editor/esm/vs/language/json/json.worker.js',
          css: '/node_modules/monaco-editor/esm/vs/language/css/css.worker.js',
          default: '/node_modules/monaco-editor/esm/vs/editor/editor.worker.js'
        };

        const workerUrl = workerPaths[label] || workerPaths.default;
        try {
          return new Worker(workerUrl, { type: 'module' });
        } catch (e) {
          console.warn(`Failed to create worker for ${label}, falling back to main thread`);
          return null;
        }
      }
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