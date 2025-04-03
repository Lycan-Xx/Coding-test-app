import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  (self as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      const workers = {
        json: "/monaco-editor/esm/vs/language/json/json.worker.js",
        css: "/monaco-editor/esm/vs/language/css/css.worker.js",
        html: "/monaco-editor/esm/vs/language/html/html.worker.js",
        typescript: "/monaco-editor/esm/vs/language/typescript/ts.worker.js",
        javascript: "/monaco-editor/esm/vs/language/typescript/ts.worker.js",
      };

      return workers[label] || "/monaco-editor/esm/vs/editor/editor.worker.js";
    },
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