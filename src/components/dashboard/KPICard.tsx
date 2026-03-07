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
  blue: "border-[#21262D]",
  critical: "border-[#21262D]",
  low: "border-[#21262D]",
  clear: "border-[#21262D]",
};

const iconColors = {
  blue: "bg-[#388BFD]/10 text-[#388BFD]",
  critical: "bg-[#F85149]/10 text-[#F85149]",
  low: "bg-[#F0883E]/10 text-[#F0883E]",
  clear: "bg-[#3FB950]/10 text-[#3FB950]",
};

export function KPICard({ icon: Icon, label, value, delta, deltaUp, variant = "blue" }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-[#161B22] border rounded-lg p-5 flex items-center gap-4 transition-all hover:border-[#30363D]",
        variantStyles[variant]
      )}
    >
      <div className={cn("p-3 rounded-full flex-shrink-0", iconColors[variant])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold font-mono-data text-white leading-none">{value}</p>
        {delta && (
          <p className={cn("text-[10px] mt-2 font-semibold flex items-center gap-1",
            deltaUp ? "text-[#3FB950]" : "text-[#F85149]"
          )}>
            {delta}
          </p>
        )}
      </div>
    </motion.div>
  );
}
