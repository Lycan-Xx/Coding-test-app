import * as monaco from "monaco-editor";

// Initialize Monaco Editor
export function initMonaco() {
  // Define the base path for Monaco workers
  (self as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      const workerPath = `/monaco-editor/esm/vs/editor/editor.worker.js`;

      if (label === 'javascript') {
        return `/monaco-editor/esm/vs/language/typescript/ts.worker.js`;
      }
      if (label === 'typescript') {
        return `/monaco-editor/esm/vs/language/typescript/ts.worker.js`;
      }
      if (label === 'python') {
        return `/monaco-editor/esm/vs/basic-languages/python/python.js`;
      }

      return workerPath;
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