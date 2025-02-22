import { Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
