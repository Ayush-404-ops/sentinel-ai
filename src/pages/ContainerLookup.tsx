import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { containers } from "@/data/mockData";
import { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";

const ContainerLookup = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof containers[0] | null>(null);

  const handleSearch = () => {
    const found = containers.find(c => c.id.toLowerCase() === query.toLowerCase());
    setResult(found || null);
  };

  const shapFactors = result ? [
    { factor: "Weight Discrepancy", value: Math.min(result.weightDiscrepancy / 60, 1) * 0.82, positive: true },
    { factor: "Late Night Decl.", value: result.shipmentDate.includes("0") ? 0.54 : 0.1, positive: true },
    { factor: "Dwell Time", value: Math.min(result.dwellTime / 15, 1) * 0.41, positive: result.dwellTime > 5 },
    { factor: "Shipper Risk", value: result.shipperRiskRate / 100 * 0.33, positive: result.shipperRiskRate > 30 },
    { factor: "Value-per-KG", value: result.valuePerKg < 5 ? 0.22 : -0.15, positive: result.valuePerKg < 5 },
    { factor: "Country Risk", value: result.countryRiskRate / 100 * 0.18, positive: result.countryRiskRate > 20 },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)) : [];

  return (
    <DashboardLayout title="Container Lookup">
      <div className="space-y-6">
        {/* Search */}
        <div className="flex gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter Container ID (e.g., MSCU7483920)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full bg-background border border-input rounded-md pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Analyze
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* Detail Card */}
              <div className={`bg-card border rounded-lg p-6 space-y-4 ${
                result.riskLevel === "Critical" ? "border-l-4 border-l-risk-critical glow-critical" :
                result.riskLevel === "Low Risk" ? "border-l-4 border-l-risk-low" : "border-l-4 border-l-risk-clear"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-sm text-chart-blue">{result.id}</span>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <div className="text-xs space-y-2.5 text-foreground">
                  <Row label="Risk Score" value={`${result.riskScore}/100`} warn={result.riskScore > 70} />
                  <Row label="Origin" value={`${result.originFlag} ${result.origin}`} />
                  <Row label="Destination" value={result.destination} />
                  <Row label="HS Code" value={`${result.hsCode} — ${result.hsDesc}`} />
                  <div className="border-t border-border pt-2" />
                  <Row label="Declared Weight" value={`${result.declaredWeight.toLocaleString()} kg`} />
                  <Row label="Measured Weight" value={`${result.measuredWeight.toLocaleString()} kg`} warn={result.weightDiscrepancy > 10} />
                  <Row label="Discrepancy" value={`+${result.weightDiscrepancy}%`} warn={result.weightDiscrepancy > 10} />
                  <div className="border-t border-border pt-2" />
                  <Row label="Declared Value" value={`$${result.declaredValue.toLocaleString()}`} />
                  <Row label="Value per KG" value={`$${result.valuePerKg.toFixed(2)}`} />
                  <div className="border-t border-border pt-2" />
                  <Row label="Shipper" value={result.shipper} />
                  <Row label="Importer" value={result.importer} />
                  <Row label="Shipment Date" value={result.shipmentDate} />
                  <Row label="Dwell Time" value={`${result.dwellTime} days`} warn={result.dwellTime > 7} />
                  <div className="border-t border-border pt-2" />
                  <Row label="Shipper Risk Rate" value={`${result.shipperRiskRate}%`} warn={result.shipperRiskRate > 50} />
                  <Row label="Country Risk Rate" value={`${result.countryRiskRate}%`} warn={result.countryRiskRate > 40} />
                  <Row label="HS Code Risk Rate" value={`${result.hsRiskRate}%`} />
                </div>

                {/* Weight comparison bar */}
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Weight Comparison</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-muted-foreground">Declared</span>
                      <div className="flex-1 bg-secondary rounded h-3">
                        <div className="bg-primary h-3 rounded" style={{ width: `${(result.declaredWeight / result.measuredWeight) * 100}%` }} />
                      </div>
                      <span className="font-mono-data w-16 text-right">{result.declaredWeight.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-muted-foreground">Measured</span>
                      <div className="flex-1 bg-secondary rounded h-3">
                        <div className="bg-risk-critical h-3 rounded" style={{ width: "100%" }} />
                      </div>
                      <span className="font-mono-data w-16 text-right">{result.measuredWeight.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">🤖 Why is this container flagged?</h3>
                <div className="text-xs text-muted-foreground mb-2">Top Contributing Factors (SHAP Values)</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={shapFactors} layout="vertical" margin={{ left: 100 }}>
                    <XAxis type="number" tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 10 }} domain={[-0.3, 0.9]} />
                    <YAxis type="category" dataKey="factor" tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 11 }} width={95} />
                    <Tooltip contentStyle={{ background: "hsl(215, 22%, 11%)", border: "1px solid hsl(215, 14%, 18%)", borderRadius: "6px", color: "hsl(213, 27%, 92%)", fontSize: 12 }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {shapFactors.map((entry, i) => (
                        <Cell key={i} fill={entry.positive ? "hsl(0, 72%, 63%)" : "hsl(140, 60%, 48%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="bg-secondary/50 border border-border rounded-md p-4 text-xs leading-relaxed text-foreground">
                  <p>
                    This container was flagged as <strong>{result.riskLevel}</strong> primarily due to a{" "}
                    <strong>{result.weightDiscrepancy}%</strong> weight discrepancy between declared (
                    {result.declaredWeight.toLocaleString()} kg) and measured ({result.measuredWeight.toLocaleString()} kg) weight.
                    {result.dwellTime > 7 && ` The ${result.dwellTime}-day dwell time is considered excessive.`}
                    {result.shipperRiskRate > 50 && ` The shipper has a historically high risk rate of ${result.shipperRiskRate}%.`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && query && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No container found with ID "{query}". Try one of: {containers.slice(0, 3).map(c => c.id).join(", ")}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono-data ${warn ? "text-risk-critical" : ""}`}>
        {value} {warn && "⚠️"}
      </span>
    </div>
  );
}

export default ContainerLookup;
