import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Card } from "@/components/ui/card";
import { initMonaco, createEditorConfig } from "@/lib/monaco";
import ErrorBoundary from "./ErrorBoundary";

// Initialize Monaco globally but with error handling
try {
  initMonaco();
} catch (error) {
  console.error("Failed to initialize Monaco globally:", error);
}

function CodeEditorContent({ value, onChange, language = "javascript" }) {
  const editorRef = useRef(null);
  const editor = useRef();

  useEffect(() => {
    let mounted = true;
    let cleanupFunctions = [];

    const initEditor = async () => {
      if (editorRef.current && !editor.current && mounted) {
        try {
          const config = createEditorConfig(language);
          editor.current = monaco.editor.create(editorRef.current, {
            ...config,
            value,
          });

          // Add content change handler
          const changeDisposable = editor.current.onDidChangeModelContent(() => {
            if (mounted) {
              const newValue = editor.current?.getValue() || "";
              onChange(newValue);
            }
          });
          cleanupFunctions.push(() => changeDisposable.dispose());

          // Handle window resize
          const resizeEditor = () => {
            if (editor.current) {
              editor.current.layout();
            }
          };
          window.addEventListener('resize', resizeEditor);
          cleanupFunctions.push(() => window.removeEventListener('resize', resizeEditor));

        } catch (error) {
          console.error("Failed to initialize Monaco editor:", error);
          throw new Error("Failed to initialize code editor");
        }
      }
    };

    initEditor().catch(console.error);

    return () => {
      mounted = false;
      // Clean up all registered event listeners
      cleanupFunctions.forEach(cleanup => cleanup());
      // Dispose editor instance
      if (editor.current) {
        try {
          editor.current.dispose();
          editor.current = null;
        } catch (error) {
          console.error("Error disposing Monaco editor:", error);
        }
      }
    };
  }, [language]);

  // Update editor content when value prop changes
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
      <div ref={editorRef} className="h-full" />
    </Card>
  );
}

function CodeEditor(props) {
  return (
    <ErrorBoundary>
      <CodeEditorContent {...props} />
    </ErrorBoundary>
  );
}

export default CodeEditor;