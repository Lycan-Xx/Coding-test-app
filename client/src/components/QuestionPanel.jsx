import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function QuestionPanel({ question }) {
  const difficultyColors = {
    easy: "bg-green-500",
    medium: "bg-yellow-500",
    hard: "bg-red-500",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{question.title}</CardTitle>
          <Badge className={difficultyColors[question.difficulty]}>
            {question.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-invert">
          <p>{question.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Examples:</h3>
          {question.examples.map((example, i) => (
            <div key={i} className="space-y-1">
              <div className="text-sm">
                <span className="text-muted-foreground">Input: </span>
                <code className="bg-muted px-1 py-0.5 rounded">{example.input}</code>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Output: </span>
                <code className="bg-muted px-1 py-0.5 rounded">{example.output}</code>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default QuestionPanel;