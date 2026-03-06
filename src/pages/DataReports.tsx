import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { containers } from "@/data/mockData";
import { motion } from "framer-motion";

const DataReports = () => {
  return (
    <DashboardLayout title="Data & Reports">
      <div className="space-y-6">
        {/* Export Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Export Reports</h3>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">Risk Level</label>
              <select className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                <option>All</option>
                <option>Critical</option>
                <option>Low Risk</option>
                <option>Clear</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground block mb-1.5">Format</label>
              <select className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground">
                <option>CSV</option>
                <option>Excel</option>
                <option>PDF</option>
              </select>
            </div>
            <button className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* Full Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">All Processed Containers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Origin", "HS Code", "Decl. Wt", "Meas. Wt", "Discrepancy", "Score", "Level", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {containers.map(c => (
                  <tr
                    key={c.id}
                    className={`border-b border-border/50 hover:bg-primary/5 transition-colors ${
                      c.riskLevel === "Critical" ? "bg-risk-critical/5" : c.riskLevel === "Low Risk" ? "bg-risk-low/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono-data text-xs text-chart-blue">{c.id}</td>
                    <td className="px-4 py-3 text-xs">{c.originFlag} {c.origin}</td>
                    <td className="px-4 py-3 font-mono-data text-xs">{c.hsCode}</td>
                    <td className="px-4 py-3 font-mono-data text-xs">{c.declaredWeight.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono-data text-xs">{c.measuredWeight.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono-data text-xs">
                      <span className={c.weightDiscrepancy > 10 ? "text-risk-critical" : "text-risk-clear"}>
                        +{c.weightDiscrepancy}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono-data text-xs font-semibold">{c.riskScore}</td>
                    <td className="px-4 py-3"><RiskBadge level={c.riskLevel} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.shipmentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Model Performance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Model Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Accuracy", value: "94.2%" },
              { label: "Precision", value: "91.8%" },
              { label: "Recall", value: "89.5%" },
              { label: "F1 Score", value: "90.6%" },
            ].map(m => (
              <div key={m.label} className="bg-secondary/50 rounded-md p-4 text-center">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                <p className="font-mono-data text-2xl font-bold text-primary">{m.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DataReports;
