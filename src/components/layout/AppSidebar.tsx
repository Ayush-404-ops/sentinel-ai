import { BarChart3, AlertTriangle, Search, Globe, Zap, FolderOpen, Settings, User, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Overview", url: "/", icon: BarChart3 },
  { title: "Critical Alerts", url: "/critical", icon: AlertTriangle },
  { title: "Container Lookup", url: "/lookup", icon: Search },
  { title: "Geographic Risk", url: "/geographic", icon: Globe },
  { title: "Live Predictor", url: "/predictor", icon: Zap },
];

const secondaryNav = [
  { title: "Data & Reports", url: "/reports", icon: FolderOpen },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-200 z-40",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-2">
        <Shield className="h-6 w-6 text-primary flex-shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-sm text-foreground truncate">
            SmartContainer RE
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        <div className="mb-1">
          {!collapsed && (
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
              Analysis
            </span>
          )}
          {mainNav.map((item) => {
            const active = location.pathname === item.url;
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-secondary",
                  collapsed && "justify-center px-0"
                )}
                activeClassName="bg-primary/10 text-primary border-l-2 border-primary font-medium"
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", active && "text-primary")} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </div>

        <div className="border-t border-sidebar-border my-2" />

        {!collapsed && (
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-2 mb-2 block">
            System
          </span>
        )}
        {secondaryNav.map((item) => {
          const active = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-sidebar-foreground hover:bg-secondary",
                collapsed && "justify-center px-0"
              )}
              activeClassName="bg-primary/10 text-primary border-l-2 border-primary font-medium"
            >
              <item.icon className={cn("h-4 w-4 flex-shrink-0", active && "text-primary")} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <div className={cn("flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground", collapsed && "justify-center px-0")}>
          <User className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Inspector</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
