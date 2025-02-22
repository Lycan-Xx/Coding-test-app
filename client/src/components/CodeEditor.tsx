import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Card } from "@/components/ui/card";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function CodeEditor({ value, onChange, language = "javascript" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (editorRef.current) {
      editor.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: "vs-dark",
        minimap: { enabled: false },
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        roundedSelection: false,
        padding: { top: 16 },
      });

      editor.current.onDidChangeModelContent(() => {
        onChange(editor.current?.getValue() || "");
      });

      return () => editor.current?.dispose();
    }
  }, []);

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
