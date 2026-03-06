import { cn } from "@/lib/utils";

type RiskLevel = "Critical" | "Low Risk" | "Clear";

const styles: Record<RiskLevel, string> = {
  Critical: "risk-badge-critical",
  "Low Risk": "risk-badge-low",
  Clear: "risk-badge-clear",
};

const dots: Record<RiskLevel, string> = {
  Critical: "bg-risk-critical",
  "Low Risk": "bg-risk-low",
  Clear: "bg-risk-clear",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", styles[level])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dots[level])} />
      {level}
    </span>
  );
}
