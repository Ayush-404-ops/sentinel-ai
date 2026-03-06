import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  variant?: "blue" | "critical" | "low" | "clear";
}

const variantStyles = {
  blue: "text-primary border-primary/20",
  critical: "text-risk-critical border-risk-critical/20 glow-critical",
  low: "text-risk-low border-risk-low/20",
  clear: "text-risk-clear border-risk-clear/20",
};

const iconBg = {
  blue: "bg-primary/10",
  critical: "bg-risk-critical/10",
  low: "bg-risk-low/10",
  clear: "bg-risk-clear/10",
};

export function KPICard({ icon: Icon, label, value, delta, deltaUp, variant = "blue" }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "bg-card border rounded-lg p-5 flex items-start gap-4 card-hover",
        variantStyles[variant]
      )}
    >
      <div className={cn("p-2.5 rounded-lg", iconBg[variant])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold font-mono-data text-foreground">{value}</p>
        {delta && (
          <p className={cn("text-xs mt-1 font-medium", deltaUp ? "text-risk-clear" : "text-risk-critical")}>
            {deltaUp ? "▲" : "▼"} {delta}
          </p>
        )}
      </div>
    </motion.div>
  );
}
