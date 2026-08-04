import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { type Container } from "@/data/mockData";
import { fetchOverviewStats, fetchROI, fetchCriticalContainers, fetchTrends, fetchScoreDistribution, fetchHSRates, fetchShippingRates, fetchGeographicRisk } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { Package, AlertTriangle, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import type { ChapterRiskRate, GeographicRiskPoint, ScoreDistributionPoint, ShippingRiskRate } from "@/lib/apiTypes";

const ShippingContainer3D = lazy(() => import("@/components/3d/ShippingContainer3D"));

// Pie data is now dynamic based on stats


const Index = () => {
  const [stats, setStats] = useState({ total: 0, critical: 0, lowRisk: 0, clear: 0, anomalies: 0 });
  const [roi, setRoi] = useState({ hoursSaved: 0, wagesSaved: 0, avoidanceRate: 0, inspectionsReduced: 0, detectionEfficiency: "0x" });
  const [criticalContainers, setCriticalContainers] = useState<Container[]>([]);
  const [scoreDist, setScoreDist] = useState<ScoreDistributionPoint[]>([]);
  const [hsRates, setHSRates] = useState<ChapterRiskRate[]>([]);
  const [shippingRates, setShippingRates] = useState<ShippingRiskRate[]>([]);
  const [geoRisk, setGeoRisk] = useState<GeographicRiskPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, roiData, containersData, scoreData, hsData, shipData, geoData] = await Promise.all([
          fetchOverviewStats(),
          fetchROI(),
          fetchCriticalContainers("Critical", "", 10),
          fetchScoreDistribution(),
          fetchHSRates(),
          fetchShippingRates(),
          fetchGeographicRisk()
        ]);
        setStats(statsData);
        setRoi(roiData);
        setCriticalContainers(containersData.containers);
        setScoreDist(scoreData);
        setHSRates(hsData);
        setShippingRates(shipData);
        setGeoRisk(geoData);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const heroContainer = criticalContainers[0] || null;

  const distributionData = [
    { name: "Critical", value: stats.critical, color: "#F85149" },
    { name: "Low Risk", value: stats.lowRisk, color: "#D29922" },
    { name: "Clear", value: stats.clear, color: "#3FB950" },
  ];

  return (
    <DashboardLayout title="Risk Intelligence Overview">
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">

        {/* Section 1: 3D HERO */}
        <section className="relative">
          <Suspense fallback={<div className="w-full h-[300px] bg-[#161B22] border border-[#21262D] rounded-lg animate-pulse" />}>
            <ShippingContainer3D
              containerId={heroContainer?.id}
              riskScore={heroContainer?.riskScore}
              riskLevel={heroContainer?.riskLevel}
            />
          </Suspense>
        </section>

        {/* Section 2: KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            icon={Package}
            label="Total Processed"
            value={loading ? "..." : stats.total.toLocaleString()}
            delta="▲ Live Data"
            deltaUp={true}
            variant="blue"
          />
          <KPICard
            icon={AlertTriangle}
            label="Critical Containers"
            value={loading ? "..." : stats.critical.toLocaleString()}
            delta={stats.critical > 50 ? "▲ High Volume" : "▼ Stability"}
            deltaUp={stats.critical > 50}
            variant="critical"
          />
          <KPICard
            icon={AlertCircle}
            label="Low Risk Units"
            value={loading ? "..." : stats.lowRisk.toLocaleString()}
            delta="▲ Active Alert"
            deltaUp={true}
            variant="low"
          />
          <KPICard
            icon={CheckCircle}
            label="Anomalies Caught"
            value={loading ? "..." : stats.anomalies.toLocaleString()}
            delta="▲ Model Efficiency"
            deltaUp={true}
            variant="blue"
          />
        </section>

        {/* Section 3: 5 CHARTS ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[320px]">
          {/* Chart 1: Donut */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Risk Distribution</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} innerRadius="60%" outerRadius="85%" dataKey="value" stroke="none">
                    {distributionData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #21262D', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              {distributionData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} /> {d.name}</div>
                  <span className="font-mono-data opacity-60">{stats.total > 0 ? ((d.value / stats.total) * 100).toFixed(1) : 0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Top Origins */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Top Origin Flags</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoRisk.slice(0, 10)} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="country" type="category" tick={{ fill: "#8B949E", fontSize: 11 }} width={30} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#21262D' }} contentStyle={{ background: '#0D1117', border: '1px solid #21262D' }} />
                  <Bar dataKey="count" fill="#F85149" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Score Distribution (LOG) */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Risk Score Log Map</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDist}>
                  <CartesianGrid vertical={false} stroke="#21262D" strokeDasharray="3 3" />
                  <XAxis dataKey="bin" tick={{ fill: "#8B949E", fontSize: 10 }} ticks={[5, 20, 35, 50, 65, 80, 95]} />
                  <YAxis scale="log" domain={['auto', 'auto']} tick={{ fill: "#8B949E", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #21262D' }} />
                  <Bar dataKey="Clear" fill="#3FB950" stackId="a" />
                  <Bar dataKey="Critical" fill="#F85149" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: HS CHAPTERS */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Risk by HS Chapter</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hsRates.slice(0, 8)}>
                  <XAxis dataKey="chapter" tick={{ fill: "#8B949E", fontSize: 10 }} />
                  <Tooltip labelStyle={{ color: '#F0883E' }} contentStyle={{ background: '#0D1117', border: '1px solid #21262D' }} />
                  <Bar dataKey="rate" fill="#F0883E" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: SHIPPING LINES */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Risk by Ship Line</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shippingRates.slice(0, 8)}>
                  <XAxis dataKey="line" tick={{ fill: "#8B949E", fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                  <Tooltip contentStyle={{ background: '#0D1117', border: '1px solid #21262D' }} />
                  <Bar dataKey="rate" fill="#388BFD" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Section 4: BOTTOM PANELS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* ROI Cards */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Business Impact & ROI</h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono-data">ESTIMATED SAVINGS</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Manhours Saved</span>
                <p className="text-xl font-bold text-[#3FB950] font-mono-data">{roi.hoursSaved.toLocaleString()} hrs</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Wages Saved</span>
                <p className="text-xl font-bold text-[#3FB950] font-mono-data">${roi.wagesSaved.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Inspections Reduced</span>
                <p className="text-xl font-bold text-[#388BFD] font-mono-data">{roi.inspectionsReduced.toLocaleString()}</p>
              </div>
              <div className="bg-[#388BFD]/10 border border-[#388BFD]/20 p-3 rounded-lg relative">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Detection Index</span>
                <p className="text-xl font-bold text-[#F0883E] font-mono-data">{roi.detectionEfficiency}</p>
                <span className="absolute -top-1 -right-1 bg-[#388BFD]/20 text-[8px] px-1 rounded text-[#58A6FF]">Better than Random</span>
              </div>
            </div>
            <p className="mt-8 text-[10px] text-gray-600 italic border-t border-[#21262D] pt-4">
              * Figures are automated estimates based on recursive analysis of detection strike rates vs random inspection probability.
            </p>
          </div>

          {/* Recent High Risk Table */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#21262D]">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Recent High-Risk Containers</h3>
            </div>
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="p-10 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-800/50 rounded animate-pulse" />)}
                </div>
              ) : criticalContainers.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">No data available</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#0D1117] text-gray-500 uppercase tracking-widest">
                      <th className="px-5 py-3">ID</th>
                      <th className="px-4 py-3 text-center">Country</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Level</th>
                      <th className="px-5 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalContainers.map((c, i) => (
                      <tr key={i} className={`border-b border-[#21262D] hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                        <td className="px-5 py-3 font-mono-data text-[#58A6FF]">{c.id}</td>
                        <td className="px-4 py-3 text-center">{c.origin}</td>
                        <td className="px-4 py-3 text-center font-mono-data font-bold">{c.riskScore}</td>
                        <td className="px-4 py-3 text-center"><RiskBadge level={c.riskLevel} /></td>
                        <td className="px-5 py-3 text-gray-500 truncate max-w-[120px]">{c.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Index;
