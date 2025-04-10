import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ConsoleProps {
  output: string[];
}

export default function Console({ output }: ConsoleProps) {
  return (
    <Card className="bg-card h-[200px]">
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
