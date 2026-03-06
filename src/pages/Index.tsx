import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { containers, weeklyTrend } from "@/data/mockData";
import { Package, AlertTriangle, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";

const ShippingContainer3D = lazy(() => import("@/components/3d/ShippingContainer3D"));

const pieData = [
  { name: "Critical", value: 312, color: "hsl(0, 72%, 63%)" },
  { name: "Low Risk", value: 1847, color: "hsl(25, 87%, 59%)" },
  { name: "Clear", value: 12661, color: "hsl(140, 60%, 48%)" },
];

const Index = () => {
  const criticalContainers = containers.filter(c => c.riskLevel === "Critical");

  return (
    <DashboardLayout title="Overview Dashboard">
      <div className="space-y-6">
        {/* 3D Container Hero */}
        <Suspense fallback={<div className="w-full h-[320px] rounded-lg bg-card border border-border animate-pulse" />}>
          <ShippingContainer3D />
        </Suspense>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard icon={Package} label="Total Processed" value="14,820" delta="12.3% vs last month" deltaUp variant="blue" />
          <KPICard icon={AlertTriangle} label="Critical Flagged" value="312" delta="8.1% increase" deltaUp={false} variant="critical" />
          <KPICard icon={AlertCircle} label="Low Risk" value="1,847" delta="3.2% decrease" deltaUp variant="low" />
          <KPICard icon={CheckCircle} label="Cleared / Safe" value="12,661" delta="15.4% increase" deltaUp variant="clear" />
        </div>

        {/* ROI Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Projected ROI — Inspection Savings</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hours Saved This Month</p>
              <p className="text-xl font-bold font-mono-data text-foreground">1,240 hrs</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Wage Cost Avoided</p>
              <p className="text-xl font-bold font-mono-data text-foreground">$62,000</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Random Inspection Avoidance</p>
              <p className="text-xl font-bold font-mono-data text-risk-clear mb-2">87.3%</p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-risk-clear h-2 rounded-full transition-all" style={{ width: "87.3%" }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Donut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <h3 className="text-sm font-semibold mb-4 text-foreground">Container Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(215, 22%, 11%)", border: "1px solid hsl(215, 14%, 18%)", borderRadius: "6px", color: "hsl(213, 27%, 92%)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}: {d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <h3 className="text-sm font-semibold mb-4 text-foreground">Weekly Risk Trend (Last 12 Weeks)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 14%, 18%)" />
                <XAxis dataKey="week" tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(215, 22%, 11%)", border: "1px solid hsl(215, 14%, 18%)", borderRadius: "6px", color: "hsl(213, 27%, 92%)" }} />
                <Line type="monotone" dataKey="critical" stroke="hsl(0, 72%, 63%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="low" stroke="hsl(25, 87%, 59%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clear" stroke="hsl(140, 60%, 48%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs"><span className="h-2 w-4 rounded bg-risk-critical" /> <span className="text-muted-foreground">Critical</span></div>
              <div className="flex items-center gap-2 text-xs"><span className="h-2 w-4 rounded bg-risk-low" /> <span className="text-muted-foreground">Low Risk</span></div>
              <div className="flex items-center gap-2 text-xs"><span className="h-2 w-4 rounded bg-risk-clear" /> <span className="text-muted-foreground">Clear</span></div>
            </div>
          </motion.div>
        </div>

        {/* Recent Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent High-Risk Containers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Container ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Origin</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">HS Code</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Score</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk Level</th>
                  <th className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Flagged Reason</th>
                </tr>
              </thead>
              <tbody>
                {criticalContainers.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="px-5 py-3 font-mono-data text-xs text-chart-blue">{c.id}</td>
                    <td className="px-5 py-3">{c.originFlag} {c.origin}</td>
                    <td className="px-5 py-3 font-mono-data text-xs">{c.hsCode}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-data text-xs font-semibold">{c.riskScore}</span>
                        <div className="w-16 bg-secondary rounded-full h-1.5">
                          <div className="bg-risk-critical h-1.5 rounded-full" style={{ width: `${c.riskScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3"><RiskBadge level={c.riskLevel} /></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{c.flaggedReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
