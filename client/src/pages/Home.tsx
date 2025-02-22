import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/CodeEditor";
import Console from "@/components/Console";
import QuestionPanel from "@/components/QuestionPanel";
import { Play, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { runCode } from "@/lib/codeSandbox";

export default function Home() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const { toast } = useToast();

  const question = {
    title: "Two Sum",
    difficulty: "easy" as const,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
      },
    ],
  };

  const handleRun = async () => {
    try {
      const result = await runCode(code);
      setOutput(result.split("\n"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        variant: "destructive",
        title: "Error running code",
        description: message,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await apiRequest("POST", "/api/submissions", {
        code,
        question: question.title,
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your solution has been submitted.",
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        variant: "destructive",
        title: "Error submitting code",
        description: message,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-x-2">
            <Button onClick={handleRun} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button onClick={handleSubmit} size="sm" variant="secondary">
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
        <CodeEditor value={code} onChange={setCode} />
        <Console output={output} />
      </div>
      <QuestionPanel question={question} />
    </div>
  );
}