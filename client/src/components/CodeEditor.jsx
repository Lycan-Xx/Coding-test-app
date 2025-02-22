import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Card } from "@/components/ui/card";
import { initMonaco, createEditorConfig } from "@/lib/monaco";

// Initialize Monaco globally
initMonaco();

function CodeEditor({ value, onChange, language = "javascript" }) {
  const editorRef = useRef(null);
  const editor = useRef();

  useEffect(() => {
    if (editorRef.current && !editor.current) {
      const config = createEditorConfig(language);
      editor.current = monaco.editor.create(editorRef.current, {
        ...config,
        value,
      });

      editor.current.onDidChangeModelContent(() => {
        onChange(editor.current?.getValue() || "");
      });

      return () => editor.current?.dispose();
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      const currentValue = editor.current.getValue();
      if (currentValue !== value) {
        editor.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <Card className="h-full">
      <div ref={editorRef} className="h-full min-h-[400px]" />
    </Card>
  );
}

export default CodeEditor;
