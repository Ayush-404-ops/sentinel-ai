import { Bell, Wifi } from "lucide-react";

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-risk-clear">
          <Wifi className="h-3.5 w-3.5" />
          <span>Model Active</span>
        </div>
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-risk-critical rounded-full" />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
          IN
        </div>
      </div>
    </header>
  );
}
