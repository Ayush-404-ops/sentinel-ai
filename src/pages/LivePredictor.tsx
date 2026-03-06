import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskBadge } from "@/components/dashboard/RiskBadge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RiskLevel } from "@/data/mockData";

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

interface Prediction {
  riskLevel: RiskLevel;
  confidence: number;
  xgboostScore: number;
  anomalyScore: number;
  factors: string[];
  recommendation: string;
}

const LivePredictor = () => {
  const [form, setForm] = useState<FormData>({
    containerId: "", origin: "", hsCode: "", declaredWeight: "", measuredWeight: "",
    declaredValue: "", shipmentDate: "", dwellTime: "", shipperId: "", importerId: "",
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const update = (key: keyof FormData, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const declW = parseFloat(form.declaredWeight) || 0;
  const measW = parseFloat(form.measuredWeight) || 0;
  const discrepancy = declW > 0 ? (((measW - declW) / declW) * 100) : 0;
  const valuePerKg = declW > 0 ? (parseFloat(form.declaredValue) || 0) / declW : 0;
  const hour = form.shipmentDate ? new Date(form.shipmentDate).getHours() : -1;
  const isLateNight = hour >= 22 || (hour >= 0 && hour < 5);

  const predict = () => {
    let score = 0;
    const factors: string[] = [];

    if (Math.abs(discrepancy) > 20) { score += 35; factors.push(`Weight Discrepancy: +${discrepancy.toFixed(1)}%`); }
    else if (Math.abs(discrepancy) > 10) { score += 15; factors.push(`Weight Discrepancy: +${discrepancy.toFixed(1)}%`); }

    if (isLateNight) { score += 15; factors.push("Late-Night Declaration"); }

    const dwell = parseFloat(form.dwellTime) || 0;
    if (dwell > 10) { score += 20; factors.push(`Excessive Dwell Time: ${dwell}d`); }
    else if (dwell > 6) { score += 10; factors.push(`Elevated Dwell Time: ${dwell}d`); }

    if (valuePerKg < 2 && declW > 0) { score += 10; factors.push("Low Value-per-KG"); }

    score += Math.random() * 10;
    score = Math.min(100, Math.max(0, score));

    const riskLevel: RiskLevel = score > 70 ? "Critical" : score > 35 ? "Low Risk" : "Clear";

    setPrediction({
      riskLevel,
      confidence: Math.min(99, score + Math.random() * 5),
      xgboostScore: score / 100,
      anomalyScore: score > 60 ? -(Math.random() * 0.4 + 0.1) : Math.random() * 0.2,
      factors,
      recommendation: score > 70
        ? "⚠️ Flag for physical inspection immediately"
        : score > 35
        ? "📋 Schedule for secondary review"
        : "✅ Clear for processing",
    });
  };

  const glowClass = prediction
    ? prediction.riskLevel === "Critical" ? "glow-critical border-risk-critical/30"
    : prediction.riskLevel === "Low Risk" ? "glow-low border-risk-low/30"
    : "glow-clear border-risk-clear/30"
    : "";

  return (
    <DashboardLayout title="Live Risk Predictor">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <h3 className="text-sm font-semibold text-foreground">Enter Container Details</h3>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Container ID" value={form.containerId} onChange={v => update("containerId", v)} placeholder="MSCU7483920" />
            <Field label="Origin Country" value={form.origin} onChange={v => update("origin", v)} placeholder="China" />
            <Field label="HS Code" value={form.hsCode} onChange={v => update("hsCode", v)} placeholder="84.71" />
            <Field label="Dwell Time (days)" value={form.dwellTime} onChange={v => update("dwellTime", v)} type="number" />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Weight & Value</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Declared Weight (kg)" value={form.declaredWeight} onChange={v => update("declaredWeight", v)} type="number" />
              <Field label="Measured Weight (kg)" value={form.measuredWeight} onChange={v => update("measuredWeight", v)} type="number" />
            </div>
            {declW > 0 && measW > 0 && (
              <p className={`text-xs mt-2 font-mono-data ${Math.abs(discrepancy) > 10 ? "text-risk-critical" : "text-risk-clear"}`}>
                Weight Discrepancy: {discrepancy > 0 ? "+" : ""}{discrepancy.toFixed(1)}% {Math.abs(discrepancy) > 10 && "⚠️"}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Declared Value (USD)" value={form.declaredValue} onChange={v => update("declaredValue", v)} type="number" />
              <div>
                {valuePerKg > 0 && (
                  <p className="text-xs text-muted-foreground mt-6">Value/kg: <span className="font-mono-data text-foreground">${valuePerKg.toFixed(2)}</span></p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-3">Timing & Entities</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Field label="Shipment Date & Time" value={form.shipmentDate} onChange={v => update("shipmentDate", v)} type="datetime-local" />
                {isLateNight && hour >= 0 && <p className="text-xs text-risk-low mt-1">⚠️ Late-night declaration</p>}
              </div>
              <Field label="Shipper ID" value={form.shipperId} onChange={v => update("shipperId", v)} placeholder="SH-001" />
            </div>
          </div>

          <button
            onClick={predict}
            className="w-full py-3 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            🔍 Predict Risk Level
          </button>
        </div>

        {/* Result */}
        <div className={`bg-card border rounded-lg p-6 ${glowClass}`}>
          <AnimatePresence mode="wait">
            {prediction ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h3 className="text-sm font-semibold text-foreground">Risk Prediction Result</h3>
                <div className="text-center py-4">
                  <RiskBadge level={prediction.riskLevel} />
                  <p className="font-mono-data text-3xl font-bold mt-3 text-foreground">{prediction.confidence.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-secondary/50 rounded-md p-3">
                    <p className="text-muted-foreground mb-1">XGBoost Score</p>
                    <p className="font-mono-data font-bold text-foreground">{prediction.xgboostScore.toFixed(2)}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-md p-3">
                    <p className="text-muted-foreground mb-1">Anomaly Score</p>
                    <p className="font-mono-data font-bold text-foreground">{prediction.anomalyScore.toFixed(2)} {prediction.anomalyScore < -0.1 && "⚠️"}</p>
                  </div>
                </div>

                {prediction.factors.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Top Risk Factors:</p>
                    <ul className="space-y-1.5">
                      {prediction.factors.map(f => (
                        <li key={f} className="text-xs text-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-risk-critical" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-secondary/50 border border-border rounded-md p-4 text-sm font-medium text-foreground">
                  {prediction.recommendation}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="flex items-center justify-center h-full min-h-[400px]">
                <p className="text-sm text-muted-foreground">Enter container details to see AI risk prediction.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}

export default LivePredictor;
