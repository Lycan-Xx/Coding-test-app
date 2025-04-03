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
  const [output, setOutput] = useState([]);
  const { toast } = useToast();

  const question = {
    title: "Two Sum",
    difficulty: "easy",
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
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4">
        <div className="flex flex-col h-full gap-4">
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
          <div className="flex-grow">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="h-[200px]">
            <Console output={output} />
          </div>
        </div>
        <div className="h-full overflow-y-auto">
          <QuestionPanel question={question} />
        </div>
      </div>
    </div>
  );
}