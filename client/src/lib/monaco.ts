import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  // Define the base path for Monaco workers
  (self as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      const workers = {
        typescript: '/monaco-editor/esm/vs/language/typescript/ts.worker',
        javascript: '/monaco-editor/esm/vs/language/typescript/ts.worker',
        html: '/monaco-editor/esm/vs/language/html/html.worker',
        css: '/monaco-editor/esm/vs/language/css/css.worker',
        json: '/monaco-editor/esm/vs/language/json/json.worker',
      };

      return workers[label] || '/monaco-editor/esm/vs/editor/editor.worker';
    }
  };
}

// Configure editor settings
export function createEditorConfig(language: string = 'javascript'): monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    value: '',
    language,
    theme: 'vs-dark',
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 14,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    roundedSelection: false,
    padding: { top: 16 },
    lineHeight: 21,
    fontFamily: "'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
    fontLigatures: true,
  };
}

export type MonacoEditorConfig = ReturnType<typeof createEditorConfig>;