import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Info,
  Search,
  Calendar,
  Globe,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Loader2
} from "lucide-react";
import type { RiskLevel } from "@/data/mockData";
import { fetchContainerPredict } from "@/lib/apiClient";
import { cn } from "@/lib/utils";

interface RiskFactor {
  severity: "Critical" | "Warning" | "Info";
  factor: string;
  detail: string;
}

interface Prediction {
  riskLevel: RiskLevel;
  confidence: number;
  xgboostScore: number;
  anomalyScore: number;
  probabilities: {
    Critical: number;
    "Low Risk": number;
    Clear: number;
  };
  riskFactors: RiskFactor[];
  recommendation: string;
}

interface FormData {
  containerId: string;
  origin: string;
  hsCode: string;
  declaredWeight: string;
  measuredWeight: string;
  declaredValue: string;
  shipmentDate: string;
  dwellTime: string;
  shipperId: string;
  importerId: string;
}

const LivePredictor = () => {
  const [form, setForm] = useState<FormData>({
    containerId: "",
    origin: "",
    hsCode: "",
    declaredWeight: "",
    measuredWeight: "",
    declaredValue: "",
    shipmentDate: "",
    dwellTime: "",
    shipperId: "",
    importerId: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Real-time Calculators
  const declW = parseFloat(form.declaredWeight) || 0;
  const measW = parseFloat(form.measuredWeight) || 0;
  const weightDisc = declW > 0 ? ((measW - declW) / declW) * 100 : 0;

  const declVal = parseFloat(form.declaredValue) || 0;
  const vpk = declW > 0 ? declVal / declW : 0;

  const hour = form.shipmentDate ? new Date(form.shipmentDate).getHours() : -1;
  const isLateNight = hour !== -1 && (hour >= 22 || hour < 5);

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.origin) newErrors.origin = "This field is required";
    if (!form.hsCode) newErrors.hsCode = "This field is required";
    if (!form.dwellTime) newErrors.dwellTime = "This field is required";
    if (!form.declaredWeight) newErrors.declaredWeight = "This field is required";
    if (!form.measuredWeight) newErrors.measuredWeight = "This field is required";
    if (!form.declaredValue) newErrors.declaredValue = "This field is required";
    if (!form.shipmentDate) newErrors.shipmentDate = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validate()) return;

    setLoading(true);
    setPrediction(null);

    try {
      // Small artificial delay for "ML processing" feel
      await new Promise(r => setTimeout(r, 1500));
      const result = await fetchContainerPredict(form);
      setPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Live Risk Predictor">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Live Risk Predictor</h1>
        <p className="text-sm text-gray-500 mt-1">
          For new containers not yet in the system. For existing containers use{" "}
          <span className="text-[#58A6FF] cursor-pointer hover:underline">Container Lookup</span> instead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT PANEL: INPUT FORM */}
        <div className="lg:col-span-5 bg-[#161B22] border border-[#21262D] rounded-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#21262D]">
            <h3 className="text-base font-bold text-white">Enter Container Details</h3>
          </div>

          <div className="p-6 space-y-8">
            {/* Section 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Container Identity</span>
                <div className="h-px bg-[#21262D] flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Container ID"
                  value={form.containerId}
                  onChange={v => update("containerId", v)}
                  placeholder="e.g. MSCU7483920"
                />
                <InputField
                  label="Origin Country"
                  value={form.origin}
                  onChange={v => update("origin", v)}
                  placeholder="e.g. China"
                  required
                  error={errors.origin}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="HS Code"
                  value={form.hsCode}
                  onChange={v => update("hsCode", v)}
                  placeholder="e.g. 84.71"
                  required
                  error={errors.hsCode}
                  mono
                />
                <InputField
                  label="Dwell Time (Days)"
                  value={form.dwellTime}
                  onChange={v => update("dwellTime", v)}
                  placeholder="e.g. 11"
                  type="number"
                  required
                  error={errors.dwellTime}
                />
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Weight & Value</span>
                <div className="h-px bg-[#21262D] flex-1" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <InputField
                    label="Declared Weight (KG)"
                    value={form.declaredWeight}
                    onChange={v => update("declaredWeight", v)}
                    placeholder="e.g. 12400"
                    type="number"
                    required
                    error={errors.declaredWeight}
                  />
                </div>

                {/* Real-time Weight Pill */}
                {declW > 0 && measW > 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "mt-6 px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap border flex items-center gap-1.5",
                      weightDisc > 40 ? "bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149]" :
                        weightDisc > 20 ? "bg-[#F0883E]/10 border-[#F0883E]/30 text-[#F0883E]" :
                          "bg-[#3FB950]/10 border-[#3FB950]/30 text-[#3FB950]"
                    )}
                  >
                    {weightDisc > 20 ? "⚠️" : "✓"} Weight Discrepancy: {weightDisc > 0 ? "+" : ""}{weightDisc.toFixed(1)}% — {weightDisc > 40 ? "CRITICAL ANOMALY" : weightDisc > 20 ? "Elevated" : "Normal"}
                  </motion.div>
                )}

                <div className="flex-1">
                  <InputField
                    label="Measured Weight (KG)"
                    value={form.measuredWeight}
                    onChange={v => update("measuredWeight", v)}
                    placeholder="e.g. 18920"
                    type="number"
                    required
                    error={errors.measuredWeight}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <InputField
                  label="Declared Value (USD)"
                  value={form.declaredValue}
                  onChange={v => update("declaredValue", v)}
                  placeholder="e.g. 145000"
                  type="number"
                  required
                  error={errors.declaredValue}
                />

                {vpk > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "text-[11px] font-semibold flex items-center gap-1.5 ml-1",
                      vpk < 3.0 ? "text-[#F0883E]" : "text-[#3FB950]"
                    )}
                  >
                    <Info className="h-3.5 w-3.5" />
                    Value per KG: ${vpk.toFixed(2)} — {vpk < 3.0 ? "Low value warning" : "Normal range"}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Timing & Entities</span>
                <div className="h-px bg-[#21262D] flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <InputField
                    label="Shipment Date & Time"
                    value={form.shipmentDate}
                    onChange={v => update("shipmentDate", v)}
                    type="datetime-local"
                    required
                    error={errors.shipmentDate}
                  />
                  <AnimatePresence>
                    {isLateNight && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#D29922]/10 border border-[#D29922]/20 p-2 rounded text-[10px] text-[#D29922] font-semibold flex items-center gap-2"
                      >
                        <Clock className="h-3 w-3" />
                        ⚠️ Late-night declaration detected (high risk indicator)
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <InputField
                  label="Shipper ID"
                  value={form.shipperId}
                  onChange={v => update("shipperId", v)}
                  placeholder="e.g. SH-001"
                />
              </div>

              <InputField
                label="Importer ID"
                value={form.importerId}
                onChange={v => update("importerId", v)}
                placeholder="e.g. IMP-001"
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className={cn(
                "w-full h-12 rounded-md font-bold text-white transition-all flex items-center justify-center gap-2",
                loading ? "bg-[#1F6FEB]/50 cursor-not-allowed" : "bg-[#1F6FEB] hover:bg-[#388BFD] active:scale-[0.98] shadow-[0_0_15px_rgba(31,111,235,0.3)]"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Predict Risk Level
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: RESULT DISPLAY */}
        <div className="lg:col-span-7 h-full">
          <div className="bg-[#161B22] border border-[#21262D] rounded-lg min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="p-5 border-b border-[#21262D]">
              <h3 className="text-base font-bold text-white">Risk Prediction Result</h3>
            </div>

            <AnimatePresence mode="wait">
              {!loading && !prediction && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="text-6xl mb-4">⚡</div>
                  <h4 className="text-xl font-bold text-white mb-2">Ready for prediction</h4>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Fill all required fields and click Predict to run AI risk analysis models.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 space-y-8"
                >
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-[#58A6FF] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-[#58A6FF]/40" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-400">Running ML models...</p>
                    <p className="text-xs text-gray-600 mt-1">Cross-referencing entity history and anomaly signatures</p>
                  </div>

                  <div className="w-full space-y-4 max-w-sm">
                    <div className="h-12 bg-gray-800/20 rounded animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-gray-800/20 rounded animate-pulse" />
                      <div className="h-16 bg-gray-800/20 rounded animate-pulse" />
                    </div>
                    <div className="h-32 bg-gray-800/20 rounded animate-pulse" />
                  </div>
                </motion.div>
              )}

              {prediction && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Result Header Band */}
                  <div className={cn(
                    "p-6 flex items-center justify-between border-b border-[#21262D]",
                    prediction.riskLevel === "Critical" ? "bg-[#F85149]/5 text-[#F85149]" :
                      prediction.riskLevel === "Low Risk" ? "bg-[#F0883E]/5 text-[#F0883E]" :
                        "bg-[#3FB950]/5 text-[#3FB950]"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        prediction.riskLevel === "Critical" ? "bg-[#F85149] text-white" :
                          prediction.riskLevel === "Low Risk" ? "bg-[#F0883E] text-white" :
                            "bg-[#3FB950] text-white"
                      )}>
                        {prediction.riskLevel}
                      </div>
                      <h2 className="text-2xl font-black italic tracking-tighter uppercase">{prediction.riskLevel} RISK</h2>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-black font-mono-data tracking-tighter">{prediction.confidence}%</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-8">
                    {/* Score Boxes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">XGBoost Score</p>
                        <p className="text-2xl font-bold font-mono-data text-[#58A6FF]">{prediction.xgboostScore.toFixed(4)}</p>
                      </div>
                      <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Anomaly Score</p>
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-2xl font-bold font-mono-data",
                            prediction.anomalyScore < 0 ? "text-[#F85149]" : "text-[#3FB950]"
                          )}>
                            {prediction.anomalyScore.toFixed(4)}
                          </p>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            prediction.anomalyScore < 0 ? "text-[#F85149]" : "text-[#3FB950]"
                          )}>
                            {prediction.anomalyScore < 0 ? "⚠️ Anomaly" : "✓ Normal"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Probability Bars */}
                    <div className="bg-[#0D1117] border border-[#21262D] rounded-lg p-5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Probability Breakdown</p>
                      <div className="space-y-4">
                        <ProbBar label="Critical" value={prediction.probabilities.Critical} color="#F85149" />
                        <ProbBar label="Low Risk" value={prediction.probabilities["Low Risk"]} color="#F0883E" />
                        <ProbBar label="Clear" value={prediction.probabilities.Clear} color="#3FB950" />
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top Risk Factors</p>
                      <div className="flex flex-wrap gap-2">
                        {prediction.riskFactors.length > 0 ? (
                          prediction.riskFactors.map((f, i) => (
                            <div
                              key={i}
                              className={cn(
                                "px-3 py-1.5 rounded-md text-[11px] font-medium flex items-center gap-2 border",
                                f.severity === "Critical" ? "bg-[#F85149]/10 border-[#F85149]/20 text-[#F85149]" :
                                  f.severity === "Warning" ? "bg-[#F0883E]/10 border-[#F0883E]/20 text-[#F0883E]" :
                                    "bg-gray-500/10 border-gray-500/20 text-gray-400"
                              )}
                            >
                              <span>{f.severity === "Critical" ? "🔴" : f.severity === "Warning" ? "⚠️" : "ℹ️"}</span>
                              <span className="font-bold">{f.factor}:</span>
                              <span>{f.detail}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 italic">No significant risk factors detected</p>
                        )}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-[#0D1117] border-l-4 border-[#388BFD] rounded-r-lg p-5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recommendation</p>
                      <p className="text-sm text-white font-medium leading-relaxed">
                        {prediction.recommendation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Disclaimer */}
            <div className="p-6 mt-auto border-t border-[#21262D]">
              <p className="text-[10px] text-gray-600 italic leading-tight">
                * Same inputs will always return the same prediction. Entity risk rates are computed from historical data at server startup and remain fixed per session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Sub-components ---

const InputField = ({ label, value, onChange, placeholder, type = "text", required, error, mono }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  mono?: boolean;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
      {label} {required && <span className="text-[#F85149]">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-10 bg-[#0D1117] border rounded-md px-3 text-sm text-[#C9D1D9] placeholder:text-gray-600 transition-all focus:outline-none focus:ring-1",
        error ? "border-[#F85149] focus:ring-[#F85149]" : "border-[#21262D] focus:ring-[#58A6FF]",
        mono && "font-mono-data"
      )}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-[#F85149] font-semibold"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const ProbBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
      <span className="text-gray-500">{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div className="h-2 bg-[#161B22] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  </div>
);

export default LivePredictor;
