import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Code2, Settings } from "lucide-react";

const menuItems = [
  { icon: Code2, label: "Coding Tests", href: "/" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-sidebar-foreground">CodeTest AI</h1>
      </div>
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
