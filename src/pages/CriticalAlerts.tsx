import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { type RiskLevel, type Container } from "@/data/mockData";
import { fetchCriticalContainers } from "@/lib/apiClient";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

const SkeletonCard = () => (
  <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-5 h-[280px] animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="w-16 h-5 bg-gray-700/50 rounded-full" />
      <div className="w-24 h-4 bg-gray-700/50 rounded" />
    </div>
    <div className="w-32 h-5 bg-gray-700/50 rounded" />
    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="w-12 h-3 bg-gray-700/30 rounded" />
          <div className="w-20 h-4 bg-gray-700/50 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const AlertCard = ({ container }: { container: Container }) => {
  const isDangerousDiscrepancy = Math.abs(container.weightDiscrepancy) > 20;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group relative bg-[#161B22] border border-[#21262D] rounded-lg p-5 transition-all duration-300 hover:border-gray-600 ${container.riskLevel === "Critical" ? "border-l-4 border-l-[#F85149] shadow-[0_0_12px_rgba(248,81,73,0.15)]" :
        container.riskLevel === "Low Risk" ? "border-l-4 border-l-[#D29922]" : "border-l-4 border-l-[#3FB950]"
        }`}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <RiskBadge level={container.riskLevel} />
        <span className="text-gray-400">
          Score: <span className="text-white font-mono-data">{container.riskScore}</span><span className="text-gray-500">/100</span>
        </span>
      </div>

      {/* Container ID */}
      <h3 className="text-[#58A6FF] font-mono-data text-lg mb-4">
        {container.id}
      </h3>

      {/* Data Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm mb-4">
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Origin</span>
          <span className="text-gray-200">
            {container.originFlag} {container.origin}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">HS Code</span>
          <span className="text-gray-200 font-mono-data">{container.hsCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Declared Wt</span>
          <span className="text-gray-200 font-mono-data">{container.declaredWeight.toFixed(1)} <span className="text-gray-500 text-xs">kg</span></span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Measured Wt</span>
          <span className={`font-mono-data flex items-center gap-1.5 ${isDangerousDiscrepancy ? "text-[#F85149] font-bold" : "text-gray-200"}`}>
            {container.measuredWeight.toFixed(1)} <span className="text-gray-500 text-xs font-normal italic">kg</span>
            {isDangerousDiscrepancy && (
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                +{container.weightDiscrepancy}%
              </span>
            )}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Shipper</span>
          <span className="text-gray-200 font-mono-data truncate max-w-[140px]">{container.shipperId}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">Dwell Time</span>
          <span className={`font-mono-data flex items-center gap-1.5 ${container.dwellTime > 7 ? "text-[#D29922]" : "text-gray-200"}`}>
            {container.dwellTime.toFixed(1)} days
            {container.dwellTime > 7 && <span className="text-[10px] bg-[#D29922]/10 px-1 rounded flex items-center gap-0.5"><AlertTriangle className="h-2.5 w-2.5" /> Excessive</span>}
          </span>
        </div>
      </div>

      {/* Indicators */}
      {container.isLateNight && (
        <div className="border-t border-[#21262D] mt-3 pt-2">
          <div className="text-[10px] text-[#D29922] flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            ⚠️ Late-night declaration
          </div>
        </div>
      )}

      {/* Hover Reveal Button */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#161B22] via-[#161B22] to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-full py-2 flex items-center justify-center gap-2 text-[#58A6FF] text-sm hover:text-[#79C0FF] transition-colors border border-transparent hover:border-[#21262D] rounded-md bg-[#161B22]">
          View Details <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const CriticalAlerts = () => {
  const [filterLevel, setFilterLevel] = useState<RiskLevel | "All">("All");
  const [search, setSearch] = useState("");
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchCriticalContainers(filterLevel, search, 300)
      .then(res => setContainers(res.containers))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterLevel, search]);

  const totalPages = Math.ceil(containers.length / ITEMS_PER_PAGE);
  const paginatedResults = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return containers.slice(start, start + ITEMS_PER_PAGE);
  }, [containers, page]);

  const handleReset = () => {
    setFilterLevel("All");
    setSearch("");
    setPage(1);
  };

  const handleExport = () => {
    const headers = ["ID", "Risk Level", "Score", "Origin", "HS Code", "Declared Wt", "Measured Wt", "Discrepancy", "Dwell Time"];
    const csvContent = [
      headers.join(","),
      ...containers.map(c => [
        c.id, c.riskLevel, c.riskScore, c.origin, c.hsCode, c.declaredWeight, c.measuredWeight, c.weightDiscrepancy, c.dwellTime
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout title="Critical Alerts">
      <div className="flex flex-col min-h-full space-y-6">

        {/* Filter Bar */}
        <div className="sticky top-[-24px] z-20 bg-[#0D1117] py-2">
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg px-4 py-3 flex items-center gap-4 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search Container ID or Shipper..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0D1117] border border-[#21262D] pl-10 pr-4 py-2 rounded-md text-sm text-[#C9D1D9] placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#58A6FF] transition-all"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#21262D] hover:border-gray-500 rounded-md transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between z-10 px-1">
          <h2 className="text-[#8B949E] text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#58A6FF] rounded-full animate-pulse shadow-[0_0_8px_rgba(88,166,255,0.6)]" />
            Live Analysis Stream
          </h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2EA043] border border-[#21262D] rounded shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all active:scale-95 group"
          >
            <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            Export CSV Archive
          </button>
        </div>

        {/* Grid Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div key="loading" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : containers.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {paginatedResults.map((c) => (
                <AlertCard key={c.id} container={c} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 space-y-4"
            >
              <span className="text-6xl">📭</span>
              <p className="text-[#8B949E] text-lg">No containers match your filters</p>
              <button onClick={handleReset} className="text-[#58A6FF] hover:underline text-sm font-medium">
                Reset filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Bar */}
        {!loading && containers.length > 0 && (
          <div className="pt-8 pb-12 flex items-center justify-between border-t border-[#21262D]">
            <p className="text-sm text-gray-500">
              Showing <span className="text-gray-300 font-mono-data">{(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, containers.length)}</span> of <span className="text-gray-300 font-mono-data">{containers.length}</span> containers
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-[#21262D] rounded hover:bg-[#161B22] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center px-4 py-1.5 border border-[#21262D] rounded bg-[#161B22] text-xs font-mono-data">
                {page} / {totalPages}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-[#21262D] rounded hover:bg-[#161B22] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CriticalAlerts;
