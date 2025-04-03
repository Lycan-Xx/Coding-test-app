import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

function Console({ output }) {
  return (
    <Card className="bg-card h-full">
      <ScrollArea className="h-full p-4">
        <div className="font-mono text-sm space-y-1">
          {output.map((line, i) => (
            <div key={i} className="text-muted-foreground">
              {line}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export default Console;