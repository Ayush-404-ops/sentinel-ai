import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─── Icons ─── */
import {
  Settings, Target, Bell, Plug, User, Shield, Palette,
  Check, RefreshCw, AlertTriangle, ChevronDown, Eye, EyeOff,
  Plus, Trash2, Wifi, WifiOff, MonitorSmartphone, Smartphone,
  Globe, Sun, Moon, Layers
} from "lucide-react";

/* ══════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════ */

const inputCls =
  "w-full bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] transition-all";

const sectionLabelCls =
  "text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3";

const dividerCls = "border-t border-[#21262D]";

/* Animated toggle switch */
const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!on)}
    className={cn(
      "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
      on ? "bg-[#1F6FEB]" : "bg-[#30363D]"
    )}
  >
    <motion.div
      animate={{ x: on ? 22 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
    />
  </button>
);

/* Row with label + description + control */
const SettingRow = ({
  label, desc, children, last = false,
}: { label: string; desc: string; children: React.ReactNode; last?: boolean }) => (
  <div className={cn("flex items-center justify-between gap-6 py-5", !last && "border-b border-[#21262D]")}>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

/* Dark select */
const Select = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#0D1117] border border-[#21262D] rounded-[6px] px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#1F6FEB] cursor-pointer"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
  </div>
);

/* Toggle group (pill selector) */
const ToggleGroup = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex bg-[#0D1117] border border-[#21262D] rounded-[6px] p-0.5">
    {options.map(o => (
      <button
        key={o}
        onClick={() => onChange(o)}
        className={cn(
          "px-3 py-1.5 text-xs rounded-[4px] transition-all whitespace-nowrap",
          value === o ? "bg-[#1F6FEB] text-white font-semibold" : "text-gray-400 hover:text-white"
        )}
      >
        {o}
      </button>
    ))}
  </div>
);

/* Card container */
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-[#161B22] border border-[#21262D] rounded-[8px] p-6 mb-6", className)}>
    {children}
  </div>
);

/* Save button */
const SaveBar = ({ onSave, onReset }: { onSave: () => void; onReset: () => void }) => {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const handle = () => {
    setStatus("saving");
    setTimeout(() => { setStatus("saved"); onSave(); setTimeout(() => setStatus("idle"), 2000); }, 1000);
  };
  return (
    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#21262D]">
      <button
        onClick={handle}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-sm font-bold transition-all",
          status === "saved" ? "bg-[#238636] text-white" : "bg-[#1F6FEB] hover:bg-[#388BFD] text-white"
        )}
      >
        {status === "saving" ? <RefreshCw className="w-4 h-4 animate-spin" /> :
          status === "saved" ? <Check className="w-4 h-4" /> : null}
        {status === "saving" ? "Saving..." : status === "saved" ? "✓ Saved" : "Save Changes"}
      </button>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-[6px] text-sm font-medium text-gray-400 border border-[#21262D] hover:border-gray-500 hover:text-white transition-all"
      >
        Reset to Defaults
      </button>
    </div>
  );
};

/* Unsaved warning banner */
const UnsavedBanner = ({ dirty, onDiscard }: { dirty: boolean; onDiscard: () => void }) => (
  <AnimatePresence>
    {dirty && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-between bg-[#2D1F00] border border-[#F0883E40] rounded-[6px] px-4 py-3 mb-6 text-sm"
      >
        <span className="flex items-center gap-2 text-[#F0883E]">
          <AlertTriangle className="w-4 h-4" />
          You have unsaved changes — Save or Discard
        </span>
        <button onClick={onDiscard} className="text-gray-400 hover:text-white text-xs underline">Discard</button>
      </motion.div>
    )}
  </AnimatePresence>
);

/* Panel fade wrapper */
const Panel = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18 }}
  >
    {children}
  </motion.div>
);

/* ══════════════════════════════════════════
   PANEL 1 — GENERAL
══════════════════════════════════════════ */
const GeneralPanel = () => {
  const [dirty, setDirty] = useState(false);
  const [refresh, setRefresh] = useState("1 minute");
  const [defaultPage, setDefaultPage] = useState("Overview");
  const [limit, setLimit] = useState("50");
  const [date, setDate] = useState("DD/MM/YYYY");
  const [num, setNum] = useState("1,234.56");
  const [tz, setTz] = useState("Asia/Kolkata (IST)");
  const [lang, setLang] = useState("🇬🇧 English");
  const mark = () => setDirty(true);

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">General Settings</h2>
      <Card>
        <SettingRow label="Dashboard Refresh Rate" desc="How often the dashboard auto-refreshes live data">
          <Select options={["30 seconds", "1 minute", "5 minutes", "Manual only"]} value={refresh} onChange={v => { setRefresh(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Default Page" desc="Page shown when you first open the app">
          <Select options={["Overview", "Critical Alerts", "Container Lookup", "Geographic Risk"]} value={defaultPage} onChange={v => { setDefaultPage(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Data Display Limit" desc="Max containers shown per page in tables">
          <Select options={["25", "50", "100", "250"]} value={limit} onChange={v => { setLimit(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Date Format" desc="How dates appear throughout the dashboard">
          <ToggleGroup options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} value={date} onChange={v => { setDate(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Number Format" desc="Decimal and thousand separator style">
          <ToggleGroup options={["1,234.56", "1.234,56"]} value={num} onChange={v => { setNum(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Timezone" desc="Timezone for all timestamps">
          <Select
            options={["Asia/Kolkata (IST)", "UTC+0 (GMT)", "America/New_York (EST)", "America/Los_Angeles (PST)", "Europe/London (BST)", "Asia/Tokyo (JST)", "Asia/Dubai (GST)"]}
            value={tz}
            onChange={v => { setTz(v); mark(); }}
          />
        </SettingRow>
        <SettingRow label="Language" desc="Interface language" last>
          <Select options={["🇬🇧 English", "🇮🇳 Hindi", "🇮🇳 Gujarati"]} value={lang} onChange={v => { setLang(v); mark(); }} />
        </SettingRow>
      </Card>
      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 2 — RISK THRESHOLDS
══════════════════════════════════════════ */
const RangeSlider = ({
  label, desc, min, max, step = 1, value, onChange, unit, pillColor,
}: {
  label: string; desc: string; min: number; max: number; step?: number;
  value: number; onChange: (v: number) => void; unit: string; pillColor: string;
}) => (
  <div className="py-5 border-b border-[#21262D] last:border-0">
    <div className="flex items-center justify-between mb-1">
      <p className="text-sm font-medium text-white">{label}</p>
      <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full", pillColor)}>
        {value}{unit}
      </span>
    </div>
    <p className="text-xs text-gray-500 mb-3">{desc}</p>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full cursor-pointer accent-[#1F6FEB]"
      style={{
        background: `linear-gradient(to right, #238636 0%, #238636 ${((value - min) / (max - min)) * 100}%, #F85149 ${((value - min) / (max - min)) * 100}%, #F85149 100%)`
      }}
    />
    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
      <span>{min}{unit}</span><span>{max}{unit}</span>
    </div>
  </div>
);

const RiskThresholdsPanel = () => {
  const [dirty, setDirty] = useState(false);
  const [weightCritical, setWeightCritical] = useState(40);
  const [weightLow, setWeightLow] = useState(20);
  const [dwellTime, setDwellTime] = useState(7);
  const [riskScore, setRiskScore] = useState(75);
  const [valuePerKg, setValuePerKg] = useState("3.00");
  const [lateFrom, setLateFrom] = useState("22:00");
  const [lateTo, setLateTo] = useState("05:00");
  const mark = () => setDirty(true);

  const clearZone = Math.min(weightLow, weightCritical);
  const lowZone = Math.max(weightLow, weightCritical) - clearZone;

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-1">Risk Threshold Configuration</h2>
      <p className="text-sm text-gray-400 mb-6">Define the boundaries that classify containers as Critical, Low Risk, or Clear. Changes affect future predictions only.</p>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-[#2D1F00] border border-[#F0883E40] rounded-[8px] px-4 py-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-[#F0883E] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#F0883E]">Changing thresholds will affect how new containers are classified. Historical predictions will not be recalculated.</p>
      </div>

      <Card>
        <RangeSlider label="Weight Discrepancy — Critical Threshold" desc="Containers with weight discrepancy above this % are flagged Critical" min={0} max={100} value={weightCritical} onChange={v => { setWeightCritical(v); mark(); }} unit="%" pillColor="bg-[#F8514920] text-[#F85149]" />
        <RangeSlider label="Weight Discrepancy — Low Risk Threshold" desc="Containers above this % but below Critical threshold flagged as Low Risk" min={0} max={100} value={weightLow} onChange={v => { setWeightLow(v); mark(); }} unit="%" pillColor="bg-[#F0883E20] text-[#F0883E]" />
        <RangeSlider label="Dwell Time — Excessive Threshold" desc="Containers dwelling longer than this many days are flagged" min={1} max={30} value={dwellTime} onChange={v => { setDwellTime(v); mark(); }} unit=" days" pillColor="bg-[#F0883E20] text-[#F0883E]" />
        <RangeSlider label="Risk Score — Critical Minimum" desc="Minimum XGBoost score to classify as Critical" min={50} max={100} step={1} value={riskScore} onChange={v => { setRiskScore(v); mark(); }} unit="%" pillColor="bg-[#F8514920] text-[#F85149]" />

        {/* Value per KG */}
        <div className="py-5 border-b border-[#21262D]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-white">Value per KG — Low Threshold (USD)</p>
          </div>
          <p className="text-xs text-gray-500 mb-3">Containers with value/kg below this are flagged as suspicious</p>
          <div className="relative w-36">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
            <input type="number" step="0.01" min="0" value={valuePerKg} onChange={e => { setValuePerKg(e.target.value); mark(); }} className={cn(inputCls, "pl-7")} />
          </div>
        </div>

        {/* Late Night Hours */}
        <div className="py-5">
          <p className="text-sm font-medium text-white mb-1">Late Night Hours</p>
          <p className="text-xs text-gray-500 mb-3">Hours considered late-night for declaration flag</p>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">From</label>
              <input type="time" value={lateFrom} onChange={e => { setLateFrom(e.target.value); mark(); }} className={inputCls + " w-36"} />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">To</label>
              <input type="time" value={lateTo} onChange={e => { setLateTo(e.target.value); mark(); }} className={inputCls + " w-36"} />
            </div>
          </div>
        </div>
      </Card>

      {/* Visual threshold preview */}
      <Card>
        <p className={sectionLabelCls}>Visual Threshold Preview</p>
        <div className="relative h-8 rounded-lg overflow-hidden flex">
          <div style={{ width: `${Math.min(weightLow, weightCritical)}%` }} className="bg-[#238636] flex items-center justify-center">
            {weightLow > 10 && <span className="text-[10px] text-white font-bold">Clear</span>}
          </div>
          <div style={{ width: `${Math.abs(weightCritical - weightLow)}%` }} className="bg-[#F0883E] flex items-center justify-center">
            {Math.abs(weightCritical - weightLow) > 10 && <span className="text-[10px] text-white font-bold">Low Risk</span>}
          </div>
          <div style={{ width: `${100 - Math.max(weightLow, weightCritical)}%` }} className="bg-[#F85149] flex items-center justify-center">
            {100 - Math.max(weightLow, weightCritical) > 10 && <span className="text-[10px] text-white font-bold">Critical</span>}
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-2">
          <span>0%</span>
          <span className="text-[#3FB950]">Clear → Low Risk: {Math.min(weightLow, weightCritical)}%</span>
          <span className="text-[#F0883E]">Low Risk → Critical: {Math.max(weightLow, weightCritical)}%</span>
          <span>100%</span>
        </div>
      </Card>

      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 3 — NOTIFICATIONS
══════════════════════════════════════════ */
const NotificationsPanel = () => {
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  const [triggers, setTriggers] = useState({
    critical: true, lowRisk: false, weight: true, lateNight: false, daily: true, modelErr: true,
  });
  const [delivery, setDelivery] = useState({ inApp: true, email: false, slack: false });
  const [emailAddr, setEmailAddr] = useState("");
  const [slackUrl, setSlackUrl] = useState("");
  const [interval, setInterval] = useState("15 minutes");

  const toggleTrigger = (k: keyof typeof triggers) => { setTriggers(p => ({ ...p, [k]: !p[k] })); mark(); };
  const toggleDelivery = (k: keyof typeof delivery) => { setDelivery(p => ({ ...p, [k]: !p[k] })); mark(); };

  const triggerRows = [
    { key: "critical" as const, icon: "🔴", label: "New Critical Container Detected", desc: "Get alerted when a new Critical container is flagged" },
    { key: "lowRisk" as const, icon: "🟠", label: "New Low Risk Container", desc: "Alert for Low Risk flagged containers" },
    { key: "weight" as const, icon: "⚠️", label: "Weight Discrepancy > Threshold", desc: "Alert when any container exceeds weight threshold" },
    { key: "lateNight" as const, icon: "🌙", label: "Late Night Declaration", desc: "Alert for containers declared between late-night hours" },
    { key: "daily" as const, icon: "📊", label: "Daily Summary Report", desc: "Receive a daily summary of all flagged containers" },
    { key: "modelErr" as const, icon: "🤖", label: "Model Prediction Errors", desc: "Alert if the ML model returns unexpected errors" },
  ];

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">Notification Settings</h2>

      <Card>
        <p className={sectionLabelCls}>Alert Triggers</p>
        {triggerRows.map((row, i) => (
          <div key={row.key} className={cn("flex items-center justify-between py-4", i < triggerRows.length - 1 && "border-b border-[#21262D]")}>
            <div>
              <p className="text-sm font-medium text-white">{row.icon} {row.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{row.desc}</p>
            </div>
            <Toggle on={triggers[row.key]} onChange={() => toggleTrigger(row.key)} />
          </div>
        ))}
      </Card>

      <Card>
        <p className={sectionLabelCls}>Delivery Methods</p>
        <div className="flex items-center justify-between py-4 border-b border-[#21262D]">
          <div>
            <p className="text-sm font-medium text-white">In-App Notifications</p>
            <p className="text-xs text-gray-500">Show bell icon alerts in the dashboard</p>
          </div>
          <Toggle on={delivery.inApp} onChange={() => toggleDelivery("inApp")} />
        </div>
        <div className="py-4 border-b border-[#21262D]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Email Alerts</p>
              <p className="text-xs text-gray-500">Send email for critical alerts</p>
            </div>
            <Toggle on={delivery.email} onChange={() => toggleDelivery("email")} />
          </div>
          <AnimatePresence>
            {delivery.email && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <input className={cn(inputCls, "mt-3")} placeholder="Enter email address" value={emailAddr} onChange={e => setEmailAddr(e.target.value)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Slack Webhook</p>
              <p className="text-xs text-gray-500">Post alerts to a Slack channel</p>
            </div>
            <Toggle on={delivery.slack} onChange={() => toggleDelivery("slack")} />
          </div>
          <AnimatePresence>
            {delivery.slack && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <input className={cn(inputCls, "mt-3")} placeholder="Enter Slack webhook URL" value={slackUrl} onChange={e => setSlackUrl(e.target.value)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Alert Frequency</p>
        <SettingRow label="Minimum Alert Interval" desc="Don't send duplicate alerts for the same container within:" last>
          <Select options={["5 minutes", "15 minutes", "1 hour", "1 day"]} value={interval} onChange={v => { setInterval(v); mark(); }} />
        </SettingRow>
      </Card>

      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 4 — API & BACKEND
══════════════════════════════════════════ */
const ApiPanel = () => {
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  const [apiUrl, setApiUrl] = useState("http://localhost:8000");
  const [timeout, setTimeout_] = useState("10");
  const [retries, setRetries] = useState("3");
  const [xgbPath, setXgbPath] = useState("models/xgb_model.pkl");
  const [isoPath, setIsoPath] = useState("models/isolation_forest.pkl");
  const [predPath, setPredPath] = useState("final_predictions.csv");
  const [verified, setVerified] = useState<null | Record<string, boolean>>(null);
  const [testing, setTesting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const testConnection = () => {
    setTesting(true);
    setTimeout(() => setTesting(false), 1500);
  };
  const verifyPaths = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerified({ xgb: true, iso: true, pred: true });
      setVerifying(false);
    }, 1500);
  };

  const StatusDot = ({ ok, label, sub }: { ok: boolean; label: string; sub?: string }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#21262D] last:border-0">
      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", ok ? "bg-[#3FB950] shadow-[0_0_6px_#3FB95080]" : "bg-[#F85149] shadow-[0_0_6px_#F8514980]")} />
      <div className="flex-1">
        <span className="text-sm text-white font-medium">{label}</span>
        {sub && <span className="text-xs text-[#58A6FF] font-mono ml-2">{sub}</span>}
      </div>
      <span className={cn("text-xs font-bold", ok ? "text-[#3FB950]" : "text-[#F85149]")}>{ok ? "Online" : "Offline"}</span>
    </div>
  );

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">API & Backend Configuration</h2>

      <Card>
        <p className={sectionLabelCls}>Connection Status</p>
        <StatusDot ok label="FastAPI Backend" sub="http://localhost:8000" />
        <StatusDot ok label="XGBoost Model" />
        <StatusDot ok label="Isolation Forest" />
        <StatusDot ok label="Data File — 54,000 rows loaded" />
        <div className="pt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">Last refresh: {new Date().toLocaleTimeString()}</span>
          <button onClick={testConnection} className="flex items-center gap-1.5 text-xs border border-[#21262D] rounded px-3 py-1.5 text-gray-300 hover:border-[#1F6FEB] hover:text-[#58A6FF] transition-all">
            {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
            Test Connection
          </button>
        </div>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Configuration</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Backend API URL</label>
            <input className={cn(inputCls, "font-mono")} value={apiUrl} onChange={e => { setApiUrl(e.target.value); mark(); }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Request Timeout (s)</label>
              <input type="number" className={inputCls} value={timeout} onChange={e => { setTimeout_(e.target.value); mark(); }} />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Max Retries</label>
              <input type="number" className={inputCls} value={retries} onChange={e => { setRetries(e.target.value); mark(); }} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className={sectionLabelCls + " mb-0"}>Model File Paths</p>
          <button onClick={verifyPaths} className="flex items-center gap-1.5 text-xs border border-[#1F6FEB40] text-[#58A6FF] rounded px-3 py-1.5 hover:bg-[#1F6FEB10] transition-all">
            {verifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
            Verify Paths
          </button>
        </div>
        {[
          { label: "XGBoost Model Path", val: xgbPath, set: setXgbPath, key: "xgb" },
          { label: "Isolation Forest Path", val: isoPath, set: setIsoPath, key: "iso" },
          { label: "Predictions Data Path", val: predPath, set: setPredPath, key: "pred" },
        ].map(({ label, val, set, key }) => (
          <div key={key} className="mb-4 last:mb-0">
            <label className="text-xs text-gray-400 uppercase font-bold block mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
              <input className={cn(inputCls, "font-mono flex-1")} value={val} onChange={e => { set(e.target.value); mark(); }} />
              {verified && (
                <span className={cn("text-xs flex items-center gap-1", verified[key] ? "text-[#3FB950]" : "text-[#F85149]")}>
                  {verified[key] ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </span>
              )}
            </div>
          </div>
        ))}
      </Card>

      <Card>
        <p className={sectionLabelCls}>External Integrations</p>
        <p className="text-sm text-gray-500 italic mb-4">No external API keys configured</p>
        <button className="flex items-center gap-2 text-sm border border-[#21262D] rounded-[6px] px-4 py-2 text-gray-300 hover:border-[#1F6FEB] hover:text-[#58A6FF] transition-all">
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </Card>

      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 5 — USER PROFILE
══════════════════════════════════════════ */
const UserProfilePanel = () => {
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  const [name, setName] = useState("Inspector Nate");
  const [email, setEmail] = useState("nate.v@ops.maritime.gov");
  const [role, setRole] = useState("Risk Analyst");
  const [dept, setDept] = useState("Port Sector 7G");
  const [badge, setBadge] = useState("00-SF-4829");
  const [org, setOrg] = useState("SmartContainer Authority");

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">User Profile</h2>
      <Card>
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1F6FEB] to-[#58A6FF] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-[#1F6FEB40] flex-shrink-0">IN</div>
          <div>
            <button className="text-sm text-[#58A6FF] hover:text-[#79C0FF] transition-colors">Change Avatar</button>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF — max 2MB</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Full Name", val: name, set: setName, type: "text" },
            { label: "Email Address", val: email, set: setEmail, type: "email" },
            { label: "Department", val: dept, set: setDept, type: "text" },
            { label: "Badge / Employee ID", val: badge, set: setBadge, type: "text", mono: true },
            { label: "Organization", val: org, set: setOrg, type: "text" },
          ].map(({ label, val, set, type, mono }) => (
            <div key={label}>
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5">{label}</label>
              <input type={type} value={val} onChange={e => { set(e.target.value); mark(); }} className={cn(inputCls, mono && "font-mono")} />
            </div>
          ))}
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1.5">Role</label>
            <Select options={["Customs Officer", "Risk Analyst", "Supervisor", "Administrator"]} value={role} onChange={v => { setRole(v); mark(); }} />
          </div>
        </div>
      </Card>
      <Card className="bg-[#0D1117]">
        <p className={sectionLabelCls}>Activity Summary</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Member Since", "Jan 15, 2024"],
            ["Last Login", "Today, 06:22 IST"],
            ["Total Lookups Performed", "1,847"],
            ["Predictions Run", "342"],
            ["Reports Generated", "28"],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#161B22] border border-[#21262D] rounded-[6px] px-4 py-3">
              <p className="text-[10px] text-gray-500 uppercase font-bold">{k}</p>
              <p className="text-sm text-white font-mono mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </Card>
      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 6 — SECURITY
══════════════════════════════════════════ */
const SecurityPanel = () => {
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [autoLogout, setAutoLogout] = useState("30 min");
  const [rememberMe, setRememberMe] = useState("7 days");

  const pwdStrength = newPwd.length === 0 ? -1 : newPwd.length < 6 ? 0 : newPwd.length < 10 ? 1 : 2;
  const strengthLabel = ["Weak", "Fair", "Strong"];
  const strengthColor = ["bg-[#F85149]", "bg-[#F0883E]", "bg-[#3FB950]"];
  const strengthText = ["text-[#F85149]", "text-[#F0883E]", "text-[#3FB950]"];

  const sessions = [
    { browser: "Chrome 120", os: "Windows 11", ip: "192.168.1.100", last: "Just now", current: true },
    { browser: "Firefox 121", os: "Android 14", ip: "103.21.44.22", last: "2 hours ago", current: false },
    { browser: "Safari 17", os: "macOS 14", ip: "49.36.88.15", last: "Yesterday", current: false },
  ];

  const PwdInput = ({ show, setShow, placeholder }: any) => (
    <div className="relative">
      <input type={show ? "text" : "password"} placeholder={placeholder} className={cn(inputCls, "pr-10")} />
      <button onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-gray-500 hover:text-white transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">Security Settings</h2>

      <Card>
        <p className={sectionLabelCls}>Change Password</p>
        <div className="space-y-3">
          <PwdInput show={showCur} setShow={setShowCur} placeholder="Current password" />
          <div>
            <input
              type={showNew ? "text" : "password"}
              placeholder="New password"
              value={newPwd}
              onChange={e => { setNewPwd(e.target.value); mark(); }}
              className={cn(inputCls, "pr-10")}
            />
            {newPwd.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= pwdStrength ? strengthColor[pwdStrength] : "bg-[#21262D]")} />
                  ))}
                </div>
                <p className={cn("text-xs", strengthText[pwdStrength])}>{strengthLabel[pwdStrength]}</p>
              </div>
            )}
          </div>
          <PwdInput show={showConf} setShow={setShowConf} placeholder="Confirm new password" />
        </div>
        <button className="mt-4 px-5 py-2.5 bg-[#1F6FEB] hover:bg-[#388BFD] text-white text-sm font-bold rounded-[6px] transition-all">Update Password</button>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Session Settings</p>
        <SettingRow label="Auto Logout After Inactivity" desc="Automatically sign out when idle">
          <Select options={["15 min", "30 min", "1 hour", "Never"]} value={autoLogout} onChange={v => { setAutoLogout(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Remember Me Duration" desc="How long to stay signed in" last>
          <Select options={["1 day", "7 days", "30 days"]} value={rememberMe} onChange={v => { setRememberMe(v); mark(); }} />
        </SettingRow>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Two-Factor Authentication</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Enable 2FA</p>
            <p className="text-xs text-gray-500">Require a verification code on each login</p>
          </div>
          <Toggle on={twoFA} onChange={v => { setTwoFA(v); mark(); }} />
        </div>
        <AnimatePresence>
          {twoFA && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 p-4 bg-[#0D1117] border border-[#21262D] rounded-[6px] flex items-center gap-4">
                <div className="w-24 h-24 bg-[#21262D] rounded flex items-center justify-center text-gray-500 text-xs text-center">QR Code Placeholder</div>
                <div>
                  <p className="text-sm text-white font-medium">Scan with your authenticator app</p>
                  <p className="text-xs text-gray-500 mt-1">Use Google Authenticator, Authy, or any TOTP app to scan this QR code. Then enter the 6-digit code to verify.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Active Sessions</p>
          <button className="text-xs border border-[#F8514940] text-[#F85149] rounded px-3 py-1.5 hover:bg-[#F8514910] transition-all">Revoke All Other Sessions</button>
        </div>
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#21262D] last:border-0">
              <MonitorSmartphone className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{s.browser} · {s.os}</p>
                <p className="text-xs text-gray-500">{s.ip} — Last active: {s.last}</p>
              </div>
              {s.current ? (
                <span className="text-[10px] bg-[#3FB95020] text-[#3FB950] px-2 py-0.5 rounded-full font-bold">Current</span>
              ) : (
                <button className="text-xs border border-[#F8514940] text-[#F85149] rounded px-3 py-1.5 hover:bg-[#F8514910] transition-all">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   PANEL 7 — APPEARANCE
══════════════════════════════════════════ */
const AppearancePanel = () => {
  const [dirty, setDirty] = useState(false);
  const mark = () => setDirty(true);
  const [theme, setTheme] = useState("Dark");
  const [accent, setAccent] = useState("Blue");
  const [sidebar, setSidebar] = useState("Expanded");
  const [density, setDensity] = useState("Normal");
  const [chartAnim, setChartAnim] = useState(true);
  const [chartScheme, setChartScheme] = useState("Default");
  const [tooltips, setTooltips] = useState(true);

  const themes = [
    { id: "Dark", bg: "#0D1117", accent: "#1F6FEB", card: "#161B22" },
    { id: "Dark Blue", bg: "#0A1628", accent: "#4C9FFF", card: "#0F1F3D" },
    { id: "Midnight", bg: "#000000", accent: "#7C3AED", card: "#111111" },
  ];
  const accents = [
    { name: "Blue", color: "#1F6FEB" }, { name: "Purple", color: "#7C3AED" },
    { name: "Green", color: "#238636" }, { name: "Orange", color: "#F0883E" },
    { name: "Red", color: "#F85149" }, { name: "Cyan", color: "#39C5CF" },
  ];
  const accentColor = accents.find(a => a.name === accent)?.color ?? "#1F6FEB";

  return (
    <Panel>
      <UnsavedBanner dirty={dirty} onDiscard={() => setDirty(false)} />
      <h2 className="text-lg font-bold text-white mb-6">Appearance</h2>

      <Card>
        <p className={sectionLabelCls}>Color Theme</p>
        <div className="grid grid-cols-3 gap-4">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); mark(); }}
              className={cn("rounded-[8px] border-2 overflow-hidden transition-all", theme === t.id ? "border-[#1F6FEB]" : "border-[#21262D] hover:border-gray-500")}
            >
              <div style={{ background: t.bg }} className="h-16 p-2 flex flex-col gap-1">
                <div style={{ background: t.card }} className="h-2.5 rounded w-full" />
                <div style={{ background: t.accent }} className="h-1.5 rounded w-3/4" />
                <div style={{ background: t.card }} className="h-1.5 rounded w-1/2" />
              </div>
              <div className={cn("py-2 text-xs font-medium text-center", theme === t.id ? "text-[#1F6FEB]" : "text-gray-400")} style={{ background: t.bg }}>
                {t.id} {theme === t.id && <span className="text-[10px] text-[#3FB950] ml-1">✓ Current</span>}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Accent Color</p>
        <div className="flex gap-3">
          {accents.map(a => (
            <button
              key={a.name}
              onClick={() => { setAccent(a.name); mark(); }}
              style={{ background: a.color }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              title={a.name}
            >
              {accent === a.name && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Sidebar Style</p>
        <ToggleGroup options={["Expanded", "Compact", "Auto-collapse"]} value={sidebar} onChange={v => { setSidebar(v); mark(); }} />
      </Card>

      <Card>
        <p className={sectionLabelCls}>Chart Settings</p>
        <SettingRow label="Chart Animation" desc="Animate charts when data loads">
          <Toggle on={chartAnim} onChange={v => { setChartAnim(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Chart Color Scheme" desc="Colors used in all data visualizations">
          <Select options={["Default", "Colorblind Friendly", "High Contrast"]} value={chartScheme} onChange={v => { setChartScheme(v); mark(); }} />
        </SettingRow>
        <SettingRow label="Show Chart Tooltips" desc="Show data labels on hover" last>
          <Toggle on={tooltips} onChange={v => { setTooltips(v); mark(); }} />
        </SettingRow>
      </Card>

      <Card>
        <p className={sectionLabelCls}>Interface Density</p>
        <ToggleGroup options={["Comfortable", "Normal", "Compact"]} value={density} onChange={v => { setDensity(v); mark(); }} />
      </Card>

      {/* Live preview */}
      <Card className="bg-[#0D1117]">
        <p className={sectionLabelCls}>Live Preview</p>
        <div style={{ background: "#161B22", borderColor: "#21262D", borderWidth: 1 }} className="rounded-[8px] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-white">CONT-20240315-4829</p>
              <p className="text-xs text-gray-500">Origin: 🇨🇳 Shanghai</p>
            </div>
            <span style={{ background: accentColor + "20", color: accentColor }} className="text-[10px] font-bold px-2.5 py-1 rounded-full">
              CRITICAL
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[#21262D] overflow-hidden">
            <div style={{ width: "78%", background: accentColor }} className="h-full rounded-full transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5">Risk Score: 78/100</p>
        </div>
      </Card>

      <SaveBar onSave={() => setDirty(false)} onReset={() => setDirty(false)} />
    </Panel>
  );
};

/* ══════════════════════════════════════════
   SIDEBAR NAV CATEGORIES
══════════════════════════════════════════ */
const categories = [
  { id: "general", label: "General", emoji: "⚙️" },
  { id: "thresholds", label: "Risk Thresholds", emoji: "🎯" },
  { id: "notifications", label: "Notifications", emoji: "🔔" },
  { id: "api", label: "API & Backend", emoji: "🔌" },
  { id: "profile", label: "User Profile", emoji: "👤" },
  { id: "security", label: "Security", emoji: "🛡️" },
  { id: "appearance", label: "Appearance", emoji: "🎨" },
];

/* ══════════════════════════════════════════
   MAIN SETTINGS PAGE
══════════════════════════════════════════ */
const SettingsPage = () => {
  const [active, setActive] = useState("general");

  const panelMap: Record<string, React.ReactNode> = {
    general: <GeneralPanel />,
    thresholds: <RiskThresholdsPanel />,
    notifications: <NotificationsPanel />,
    api: <ApiPanel />,
    profile: <UserProfilePanel />,
    security: <SecurityPanel />,
    appearance: <AppearancePanel />,
  };

  return (
    <DashboardLayout title="Settings">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure system preferences, thresholds, and account settings.</p>
      </div>

      <div className="flex gap-0 min-h-[calc(100vh-200px)]">
        {/* ── SIDEBAR ── */}
        <aside className="w-[220px] flex-shrink-0 bg-[#161B22] border border-[#21262D] rounded-l-[8px] p-3 flex flex-col">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-sm transition-all mb-0.5 text-left relative",
                active === cat.id
                  ? "text-[#58A6FF] bg-[#1F6FEB15]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#21262D]"
              )}
            >
              {active === cat.id && (
                <motion.div
                  layoutId="active-border"
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-[#1F6FEB]"
                />
              )}
              <span className="text-base leading-none">{cat.emoji}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </aside>

        {/* ── CONTENT ── */}
        <main className="flex-1 bg-[#0D1117] border border-l-0 border-[#21262D] rounded-r-[8px] p-8 overflow-auto">
          <AnimatePresence mode="wait">
            <div key={active}>
              {panelMap[active]}
            </div>
          </AnimatePresence>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
