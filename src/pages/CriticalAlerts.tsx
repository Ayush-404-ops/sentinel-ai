import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { type RiskLevel, type Container } from "@/data/mockData";
import { fetchCriticalContainers } from "@/lib/apiClient";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CriticalAlerts = () => {
  const [filterLevel, setFilterLevel] = useState<RiskLevel | "All">("All");
  const [search, setSearch] = useState("");
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCriticalContainers(100)
      .then(setContainers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = containers.filter(c => {
    if (filterLevel !== "All" && c.riskLevel !== filterLevel) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.shipper.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout title="Critical Alerts">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-wrap gap-3 items-center">
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value as RiskLevel | "All")}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring"
          >
            <option value="All">All Levels</option>
            <option value="Critical">Critical</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Clear">Clear</option>
          </select>
          <input
            type="text"
            placeholder="Search Container ID or Shipper..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground flex-1 min-w-[200px] focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={() => { setFilterLevel("All"); setSearch(""); }}
            className="px-3 py-2 text-sm border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading critical alerts...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card border rounded-lg p-5 card-hover ${c.riskLevel === "Critical" ? "border-l-4 border-l-risk-critical glow-critical" :
                    c.riskLevel === "Low Risk" ? "border-l-4 border-l-risk-low" : "border-l-4 border-l-risk-clear"
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <RiskBadge level={c.riskLevel} />
                  <span className="font-mono-data text-xs text-muted-foreground">Score: {c.riskScore}/100</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Container ID:</span>
                    <span className="font-mono-data text-xs text-chart-blue">{c.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Origin:</span>
                    <span>{c.originFlag} {c.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HS Code:</span>
                    <span className="font-mono-data text-xs">{c.hsCode} — {c.hsDesc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Declared Wt:</span>
                    <span className="font-mono-data text-xs">{c.declaredWeight.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Measured Wt:</span>
                    <span className="font-mono-data text-xs">
                      {c.measuredWeight.toLocaleString()} kg
                      {c.weightDiscrepancy > 10 && <span className="text-risk-critical ml-1">⚠️ +{c.weightDiscrepancy}%</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipper:</span>
                    <span className="text-xs">{c.shipper}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dwell Time:</span>
                    <span className="font-mono-data text-xs">
                      {c.dwellTime} days
                      {c.dwellTime > 7 && <span className="text-risk-low ml-1">⚠️ Excessive</span>}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No containers match your current filters.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CriticalAlerts;
