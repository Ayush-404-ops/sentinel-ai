import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Settings,
  Search,
  Filter,
  RefreshCw,
  Download,
  ChevronRight,
  ChevronDown,
  Calendar,
  Check,
  FileSpreadsheet,
  FileJson,
  BarChart4,
  Target,
  Zap,
  Activity,
  ChevronLeft,
  MoreVertical,
  ExternalLink,
  Loader2
} from "lucide-react";
import {
  fetchCriticalContainers,
  fetchModelPerformance,
  fetchOverviewStats
} from "@/lib/apiClient";
import type { Container } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
  Cell
} from "recharts";

type Tab = "historical" | "export" | "performance";

const DataReports = () => {
  const [activeTab, setActiveTab] = useState<Tab>("historical");
  const [loading, setLoading] = useState(true);

  // Tab 1: Historical Data State
  const [containers, setContainers] = useState<Container[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    level: "All",
    origin: "All",
    from: "",
    to: ""
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 54000 });

  // Tab 2: Export State
  const [selectedFormat, setSelectedFormat] = useState("CSV");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, icon: <FileSpreadsheet className="text-[#3FB950]" />, name: "March_Risk_Analysis.csv", date: "Today, 09:42 AM", size: "2.4 MB" },
    { id: 2, icon: <Activity className="text-[#F0883E]" />, name: "Quarterly_Report_Q1.xlsx", date: "Yesterday, 04:15 PM", size: "4.8 MB" },
    { id: 3, icon: <FileJson className="text-[#F85149]" />, name: "Critical_Incidents_Log.pdf", date: "05 Mar 2024", size: "1.2 MB" },
    { id: 4, icon: <FileSpreadsheet className="text-[#3FB950]" />, name: "Customs_Audit_Data.csv", date: "02 Mar 2024", size: "8.4 MB" },
    { id: 5, icon: <FileSpreadsheet className="text-[#3FB950]" />, name: "Origin_Stats_China.csv", date: "28 Feb 2024", size: "1.1 MB" }
  ]);
  const [reportConfig, setReportConfig] = useState({
    from: "2024-01-01",
    to: "2024-03-07",
    riskLevels: ["Critical", "Low Risk", "Clear"],
    columns: ["Container ID", "Origin", "HS Code", "Declared Weight", "Measured Weight", "Risk Level"]
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate generation duration
    await new Promise(r => setTimeout(r, 2000));

    const newExport = {
      id: Date.now(),
      name: `Risk_Report_${new Date().toISOString().split('T')[0]}_${Math.floor(Math.random() * 1000)}.${selectedFormat.toLowerCase()}`,
      date: "Just now",
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      icon: selectedFormat === "CSV" ? <FileSpreadsheet className="text-[#3FB950]" /> :
        selectedFormat === "Excel" ? <Activity className="text-[#F0883E]" /> :
          <FileJson className="text-[#F85149]" />
    };

    setExportHistory([newExport, ...exportHistory.slice(0, 4)]);
    setIsGenerating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Tab 3: Performance State
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab, pagination.page, pagination.limit]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "historical") {
        const data = await fetchCriticalContainers(filters.level, filters.search, pagination.limit, (pagination.page - 1) * pagination.limit);
        setContainers(data.containers);
        setPagination(prev => ({ ...prev, total: data.total }));
      } else if (activeTab === "performance") {
        const perf = await fetchModelPerformance();
        setPerformance(perf);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      search: "",
      level: "All",
      origin: "All",
      from: "",
      to: ""
    });
    setPagination({ ...pagination, page: 1 });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const pageNumbers = [];
  for (let i = Math.max(1, pagination.page - 1); i <= Math.min(totalPages, pagination.page + 1); i++) {
    pageNumbers.push(i);
  }

  return (
    <DashboardLayout title="Data & Reports">
      <div className="flex flex-col h-full">
        {/* Tab Bar */}
        <div className="flex items-center gap-2 mb-6">
          <TabButton
            active={activeTab === "historical"}
            onClick={() => setActiveTab("historical")}
            icon={<FileText className="w-4 h-4" />}
            label="Historical Data"
          />
          <TabButton
            active={activeTab === "export"}
            onClick={() => setActiveTab("export")}
            icon={<Upload className="w-4 h-4" />}
            label="Export Reports"
          />
          <TabButton
            active={activeTab === "performance"}
            onClick={() => setActiveTab("performance")}
            icon={<BarChart4 className="w-4 h-4" />}
            label="Model Performance"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "historical" && (
            <motion.div
              key="historical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Filter Bar */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4 flex flex-wrap items-end gap-4">
                <div className="flex-grow">
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search Container ID, Shipper, Origin..."
                      className="w-full bg-[#0D1117] border border-[#21262D] rounded-md pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1F6FEB]"
                      value={filters.search}
                      onChange={e => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="w-40">
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">Risk Level</label>
                  <select
                    className="w-full bg-[#0D1117] border border-[#21262D] rounded-md px-3 py-2 text-sm text-white focus:outline-none"
                    value={filters.level}
                    onChange={e => setFilters({ ...filters, level: e.target.value })}
                  >
                    <option value="All">All Levels</option>
                    <option value="Critical">Critical</option>
                    <option value="Low Risk">Low Risk</option>
                    <option value="Clear">Clear</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-36">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">From</label>
                    <input
                      type="date"
                      className="w-full bg-[#0D1117] border border-[#21262D] rounded-md px-3 py-1.5 text-sm text-white"
                      value={filters.from}
                      onChange={e => setFilters({ ...filters, from: e.target.value })}
                    />
                  </div>
                  <div className="w-36">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">To</label>
                    <input
                      type="date"
                      className="w-full bg-[#0D1117] border border-[#21262D] rounded-md px-3 py-1.5 text-sm text-white"
                      value={filters.to}
                      onChange={e => setFilters({ ...filters, to: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={loadData} className="bg-[#1F6FEB] hover:bg-[#388BFD] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors">
                    Apply Filters
                  </button>
                  <button onClick={handleReset} className="border border-[#21262D] hover:bg-[#21262D] text-gray-400 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                    Reset
                  </button>
                </div>
              </div>

              {/* Table Toolbar */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-gray-500">
                  Showing <span className="text-white font-medium">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-white font-medium">{pagination.total.toLocaleString()}</span> containers
                </span>
                <button className="text-xs text-[#58A6FF] hover:underline flex items-center gap-1.5 font-medium">
                  Export filtered results <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Data Table */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0D1117] border-b border-[#21262D]">
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase w-48">ID</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase w-20">Origin</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase w-24">HS Code</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Decl. WT</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Meas. WT</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Discrepancy</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Score</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Level</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 15 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : (
                      containers.map(container => (
                        <ContainerRow
                          key={container.id}
                          container={container}
                          expanded={expandedRow === container.id}
                          onToggle={() => setExpandedRow(expandedRow === container.id ? null : container.id)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center bg-[#161B22] border border-[#21262D] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rows per page:</span>
                  <select
                    className="bg-[#0D1117] border border-[#21262D] rounded px-1.5 py-0.5 text-xs text-white"
                    value={pagination.limit}
                    onChange={e => setPagination({ ...pagination, limit: parseInt(e.target.value), page: 1 })}
                  >
                    {[10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <PageButton disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}>
                    <ChevronLeft className="w-4 h-4" />
                  </PageButton>

                  {pagination.page > 2 && <PageButton onClick={() => setPagination({ ...pagination, page: 1 })}>1</PageButton>}
                  {pagination.page > 3 && <span className="text-gray-600 px-1 text-xs">...</span>}

                  {pageNumbers.map(n => (
                    <PageButton key={n} active={pagination.page === n} onClick={() => setPagination({ ...pagination, page: n })}>
                      {n}
                    </PageButton>
                  ))}

                  {pagination.page < totalPages - 2 && <span className="text-gray-600 px-1 text-xs">...</span>}
                  {pagination.page < totalPages - 1 && <PageButton onClick={() => setPagination({ ...pagination, page: totalPages })}>{totalPages}</PageButton>}

                  <PageButton disabled={pagination.page * pagination.limit >= pagination.total} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}>
                    <ChevronRight className="w-4 h-4" />
                  </PageButton>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "export" && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Configure Section */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6 flex flex-col">
                <h3 className="text-base font-bold text-white mb-6">Configure Report</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="From Date"
                      type="date"
                      value={reportConfig.from}
                      onChange={(e: any) => setReportConfig({ ...reportConfig, from: e.target.value })}
                    />
                    <InputField
                      label="To Date"
                      type="date"
                      value={reportConfig.to}
                      onChange={(e: any) => setReportConfig({ ...reportConfig, to: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block">Risk Levels to Include</label>
                    <div className="flex gap-2">
                      {["Critical", "Low Risk", "Clear"].map(level => (
                        <RiskToggleChip
                          key={level}
                          label={level}
                          color={level === "Critical" ? "#F85149" : level === "Low Risk" ? "#F0883E" : "#3FB950"}
                          active={reportConfig.riskLevels.includes(level)}
                          onClick={() => {
                            const newLevels = reportConfig.riskLevels.includes(level)
                              ? reportConfig.riskLevels.filter(l => l !== level)
                              : [...reportConfig.riskLevels, level];
                            setReportConfig({ ...reportConfig, riskLevels: newLevels });
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block">Columns to Include</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
                      {["Container ID", "Origin", "HS Code", "Declared Weight", "Measured Weight", "Discrepancy %", "Risk Score", "Risk Level", "Date", "Shipper ID", "Flagged Reason"].map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={reportConfig.columns.includes(c)}
                            onChange={() => {
                              const newCols = reportConfig.columns.includes(c)
                                ? reportConfig.columns.filter(col => col !== c)
                                : [...reportConfig.columns, c];
                              setReportConfig({ ...reportConfig, columns: newCols });
                            }}
                          />
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                            reportConfig.columns.includes(c) ? "bg-[#1F6FEB] border-[#1F6FEB]" : "bg-[#0D1117] border-[#21262D] group-hover:border-[#58A6FF]"
                          )}>
                            {reportConfig.columns.includes(c) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={cn(
                            "text-xs transition-colors",
                            reportConfig.columns.includes(c) ? "text-white font-medium" : "text-gray-400 group-hover:text-white"
                          )}>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-3 block">Export Format</label>
                    <div className="flex gap-2">
                      <FormatButton
                        icon={<FileSpreadsheet className="w-4 h-4" />}
                        label="CSV"
                        active={selectedFormat === "CSV"}
                        onClick={() => setSelectedFormat("CSV")}
                      />
                      <FormatButton
                        icon={<Activity className="w-4 h-4" />}
                        label="Excel"
                        active={selectedFormat === "Excel"}
                        onClick={() => setSelectedFormat("Excel")}
                      />
                      <FormatButton
                        icon={<FileJson className="w-4 h-4" />}
                        label="PDF"
                        active={selectedFormat === "PDF"}
                        onClick={() => setSelectedFormat("PDF")}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#21262D]">
                    <p className="text-xs text-gray-500 mb-4">This report will include approximately <span className="text-white font-bold">12,450</span> rows based on current filters.</p>
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating || reportConfig.columns.length === 0}
                      className={cn(
                        "w-full h-11 text-white font-bold rounded-md flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                        isGenerating ? "bg-[#21262D] cursor-wait" :
                          showSuccess ? "bg-[#3FB950]" : "bg-[#1F6FEB] hover:bg-[#388BFD] shadow-[0_4px_12px_rgba(31,111,235,0.2)]"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                        </>
                      ) : showSuccess ? (
                        <>
                          <Check className="w-4 h-4" /> Report Ready
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" /> Generate Report
                        </>
                      )}

                      {isGenerating && (
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 bg-[#58A6FF]"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2 }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Exports */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Recent Exports</h3>
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {exportHistory.map((item: any) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                      >
                        <ExportItem
                          icon={item.icon}
                          name={item.name}
                          date={item.date}
                          size={item.size}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-6"
            >
              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <PerfCard label="Accuracy" value={performance?.metrics?.accuracy || 0} color="#58A6FF" delay={0.1} />
                <PerfCard label="Precision" value={performance?.metrics?.precision || 0} color="#D2A8FF" delay={0.2} />
                <PerfCard label="Recall" value={performance?.metrics?.recall || 0} color="#F0883E" delay={0.3} />
                <PerfCard label="F1 Score" value={performance?.metrics?.f1 || 0} color="#3FB950" delay={0.4} />
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
                  <h3 className="text-base font-bold text-white mb-6">Confusion Matrix</h3>
                  <ConfusionMatrix data={performance?.confusionMatrix} />
                </div>
                <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
                  <h3 className="text-base font-bold text-white mb-6">Top 15 Feature Importance</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={performance?.featureImportance} margin={{ left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="feature"
                          stroke="#6e7681"
                          fontSize={10}
                          width={120}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#161B22", border: "1px solid #21262D" }}
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        />
                        <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                          {performance?.featureImportance?.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={`rgba(88, 166, 255, ${1 - index * 0.05})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Third Row: ROC Curve */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-white">ROC Curve (Multi-class)</h3>
                  <div className="flex gap-4">
                    <LegendItem color="#F85149" label={`Critical (AUC = ${performance?.rocCurve?.auc?.critical})`} />
                    <LegendItem color="#F0883E" label={`Low Risk (AUC = ${performance?.rocCurve?.auc?.lowRisk})`} />
                    <LegendItem color="#3FB950" label={`Clear (AUC = ${performance?.rocCurve?.auc?.clear})`} />
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
                      <XAxis type="number" dataKey="fpr" domain={[0, 1]} stroke="#6e7681" fontSize={11} name="False Positive Rate" />
                      <YAxis type="number" domain={[0, 1]} stroke="#6e7681" fontSize={11} name="True Positive Rate" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#161B22", border: "1px solid #21262D" }}
                      />
                      <Line data={performance?.rocCurve?.critical} type="monotone" dataKey="tpr" stroke="#F85149" strokeWidth={3} dot={false} />
                      <Line data={performance?.rocCurve?.lowRisk} type="monotone" dataKey="tpr" stroke="#F0883E" strokeWidth={3} dot={false} />
                      <Line data={performance?.rocCurve?.clear} type="monotone" dataKey="tpr" stroke="#3FB950" strokeWidth={3} dot={false} />
                      <Line data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} type="linear" dataKey="tpr" stroke="#484f58" strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
      active
        ? "bg-[#1F6FEB] text-white shadow-[0_4px_12px_rgba(31,111,235,0.3)]"
        : "text-gray-500 hover:text-white hover:bg-gray-800/30"
    )}
  >
    {icon}
    {label}
  </button>
);

const ContainerRow = ({ container, expanded, onToggle }: { container: Container, expanded: boolean, onToggle: () => void }) => (
  <>
    <tr
      onClick={onToggle}
      className={cn(
        "border-b border-[#21262D]/50 hover:bg-[#1c2330] transition-colors cursor-pointer group",
        container.riskLevel === "Critical" && "border-l-2 border-l-[#F85149]"
      )}
    >
      <td className="px-4 py-3 font-mono-data text-xs text-[#58A6FF]">{container.id}</td>
      <td className="px-4 py-3 text-xs text-white font-medium">{container.origin}</td>
      <td className="px-4 py-3 font-mono-data text-xs text-gray-400">{container.hsCode}</td>
      <td className="px-4 py-3 font-mono-data text-xs text-right text-gray-300">{container.declaredWeight.toFixed(1)}</td>
      <td className="px-4 py-3 font-mono-data text-xs text-right text-gray-300">{container.measuredWeight.toFixed(1)}</td>
      <td className={cn(
        "px-4 py-3 font-mono-data text-xs text-right font-bold",
        container.weightDiscrepancy > 20 ? "text-[#F85149]" :
          container.weightDiscrepancy > 10 ? "text-[#F0883E]" :
            "text-[#3FB950]"
      )}>
        {container.weightDiscrepancy > 0 ? "+" : ""}{container.weightDiscrepancy.toFixed(1)}%
      </td>
      <td className="px-4 py-3 font-mono-data text-xs text-right text-white font-bold">{container.riskScore}</td>
      <td className="px-4 py-3"><RiskBadge level={container.riskLevel} /></td>
      <td className="px-4 py-3 text-[10px] text-right font-bold text-gray-500">{container.shipmentDate || "07 MAR 2024"}</td>
    </tr>
    <AnimatePresence>
      {expanded && (
        <tr>
          <td colSpan={9} className="p-0 bg-[#0D1117]/50 border-b border-[#21262D]">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 grid grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Shipping Line / Shipper</p>
                    <p className="text-sm text-white font-medium">{container.shipper}</p>
                    <p className="text-xs text-gray-400 font-mono-data">{container.shipperId}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Destination</p>
                    <p className="text-sm text-white font-medium">Lagos Port Complex, Nigeria</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">HS Description</p>
                    <p className="text-sm text-white leading-snug">{container.hsDesc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Declared Value</p>
                    <p className="text-sm text-[#3FB950] font-mono-data font-bold">${(container.declaredValue || 15000).toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-[#161B22] border border-[#21262D] rounded-lg p-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-3">Flagged Reason</p>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    "{container.explanation || "No anomaly explanation available for this record."}"
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-[#1F6FEB] hover:bg-[#388BFD] text-white text-[10px] font-bold py-2 rounded transition-colors uppercase">
                      View Full Details
                    </button>
                    <button className="p-2 bg-[#21262D] text-gray-400 hover:text-white rounded transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </td>
        </tr>
      )}
    </AnimatePresence>
  </>
);

const SkeletonRow = () => (
  <tr className="border-b border-[#21262D]/30 animate-pulse">
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-2 bg-gray-800 rounded w-full" />
      </td>
    ))}
  </tr>
);

const PerfCard = ({ label, value, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-[#161B22] border-b-2 rounded-lg p-6 relative overflow-hidden"
    style={{ borderBottomColor: color }}
  >
    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-baseline gap-1">
      <Counter value={value} />
      <span className="text-lg font-bold" style={{ color }}>%</span>
    </div>
  </motion.div>
);

const Counter = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(progress * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span className="text-4xl font-mono-data font-black text-white">{display.toFixed(1)}</span>;
};

const ConfusionMatrix = ({ data }: { data: number[][] }) => {
  if (!data) return null;
  const labels = ["Clear", "Low", "Crit"];
  const max = Math.max(...data.flat());

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full">
        <div className="w-12" /> {/* Space for sidebar */}
        <div className="flex-1 grid grid-cols-3 mb-2">
          {labels.map(l => (
            <div key={l} className="text-center text-[10px] font-bold text-gray-500 uppercase">{l}</div>
          ))}
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col justify-around pr-4 w-12 py-2">
          {labels.map(l => (
            <div key={l} className="text-right text-[10px] font-bold text-gray-500 uppercase">{l}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-1 aspect-square max-w-[300px]">
          {data.flat().map((val, i) => {
            const isDiagonal = i % 4 === 0;
            const opacity = val / max;
            return (
              <div
                key={i}
                className="relative flex items-center justify-center rounded border border-[#21262D]"
                style={{
                  backgroundColor: isDiagonal
                    ? `rgba(88, 166, 255, ${0.1 + opacity * 0.9})`
                    : `rgba(88, 166, 255, ${opacity * 0.3})`
                }}
              >
                <span className="font-mono-data font-bold text-white text-sm">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-6 text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#58A6FF] rounded-sm" />
          <span className="text-gray-500 uppercase font-bold tracking-widest text-[8px]">Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-[#21262D] rounded-sm" />
          <span className="text-gray-500 uppercase font-bold tracking-widest text-[8px]">Actual</span>
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{label}</span>
  </div>
);

const PageButton = ({ children, active, disabled, onClick }: any) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all",
      active ? "bg-[#1F6FEB] text-white" : "text-gray-500 hover:bg-[#21262D] hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
    )}
  >
    {children}
  </button>
);

const InputField = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 block">{label}</label>
    <input
      {...props}
      className="w-full bg-[#0D1117] border border-[#21262D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#1F6FEB]"
    />
  </div>
);

const RiskToggleChip = ({ label, color, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 cursor-pointer border transition-all",
      active ? "bg-opacity-10 border-opacity-30" : "bg-transparent border-[#21262D] text-gray-600 grayscale"
    )} style={{
      backgroundColor: active ? `${color}20` : undefined,
      borderColor: active ? `${color}50` : undefined,
      color: active ? color : undefined
    }}>
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    {label}
  </div>
);

const FormatButton = ({ icon, label, active, onClick }: any) => (
  <div
    onClick={onClick}
    className={cn(
      "flex-1 h-16 rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all",
      active ? "bg-[#1F6FEB]/10 border-[#1F6FEB] text-[#1F6FEB]" : "bg-[#0D1117] border-[#21262D] text-gray-500 hover:border-gray-600"
    )}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const ExportItem = ({ icon, name, date, size }: any) => (
  <div className="flex items-center justify-between p-3 rounded-md hover:bg-[#1c2330] transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#0D1117] rounded border border-[#21262D] group-hover:border-[#21262D]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-white">{name}</p>
        <p className="text-[10px] text-gray-500">{date} • {size}</p>
      </div>
    </div>
    <button className="text-xs font-bold text-[#58A6FF] hover:underline">Download</button>
  </div>
);

export default DataReports;
