import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { countryRiskData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Treemap } from "recharts";
import { motion } from "framer-motion";

const hsCodeRisk = [
  { name: "71 - Gold/Precious", size: 72, pct: 72 },
  { name: "27 - Minerals/Oil", size: 48, pct: 48 },
  { name: "84 - Machinery", size: 55, pct: 55 },
  { name: "52 - Cotton", size: 30, pct: 30 },
  { name: "72 - Iron/Steel", size: 20, pct: 20 },
  { name: "62 - Garments", size: 12, pct: 12 },
  { name: "85 - Electronics", size: 5, pct: 5 },
  { name: "12 - Seeds", size: 3, pct: 3 },
  { name: "09 - Coffee/Tea", size: 4, pct: 4 },
  { name: "08 - Fruits", size: 15, pct: 15 },
];

const getColor = (pct: number) => {
  if (pct > 60) return "hsl(0, 72%, 63%)";
  if (pct > 30) return "hsl(25, 87%, 59%)";
  return "hsl(140, 60%, 48%)";
};

const GeographicRisk = () => {
  const sorted = [...countryRiskData].sort((a, b) => b.pct - a.pct);

  return (
    <DashboardLayout title="Geographic Risk Analysis">
      <div className="space-y-6">
        {/* World Risk Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Global Risk Concentration by Country</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sorted.map(c => (
              <div
                key={c.country}
                className="bg-secondary/50 border border-border rounded-lg p-3 text-center card-hover"
                style={{ borderLeftColor: getColor(c.pct), borderLeftWidth: 3 }}
              >
                <div className="text-2xl mb-1">{c.flag}</div>
                <div className="text-xs font-medium text-foreground">{c.country}</div>
                <div className="font-mono-data text-lg font-bold mt-1" style={{ color: getColor(c.pct) }}>{c.pct}%</div>
                <div className="text-[10px] text-muted-foreground">{c.count} containers</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top 10 Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Top 10 High-Risk Origin Countries</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sorted} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 11 }} unit="%" />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fill: "hsl(215, 10%, 58%)", fontSize: 11 }}
                  width={70}
                  tickFormatter={(v, i) => `${sorted[i]?.flag || ""} ${v}`}
                />
                <Tooltip
                  contentStyle={{ background: "hsl(215, 22%, 11%)", border: "1px solid hsl(215, 14%, 18%)", borderRadius: "6px", color: "hsl(213, 27%, 92%)" }}
                  formatter={(v: number) => [`${v}%`, "Critical Rate"]}
                />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {sorted.map((entry, i) => (
                    <Cell key={i} fill={getColor(entry.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* HS Code Risk */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4">Risk Concentration by HS Code Chapter</h3>
            <div className="space-y-2">
              {hsCodeRisk.sort((a, b) => b.pct - a.pct).map(hs => (
                <div key={hs.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-36 truncate">{hs.name}</span>
                  <div className="flex-1 bg-secondary rounded-full h-4 relative">
                    <div
                      className="h-4 rounded-full transition-all"
                      style={{ width: `${hs.pct}%`, background: getColor(hs.pct) }}
                    />
                  </div>
                  <span className="font-mono-data text-xs w-10 text-right" style={{ color: getColor(hs.pct) }}>{hs.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeographicRisk;
