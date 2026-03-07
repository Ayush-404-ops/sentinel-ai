export type RiskLevel = "Critical" | "Low Risk" | "Clear";

export interface Container {
  id: string;
  origin: string;
  originFlag: string;
  destination: string;
  hsCode: string;
  hsDesc: string;
  declaredWeight: number;
  measuredWeight: number;
  weightDiscrepancy: number;
  declaredValue?: number;
  valuePerKg?: number;
  shipper: string;
  shipperId: string;
  importer?: string;
  shipmentDate?: string;
  dwellTime: number;
  riskScore: number;
  riskLevel: RiskLevel;
  isLateNight?: boolean;
  isAnomaly?: boolean;
  explanation: string;
}

export const containers: Container[] = [];

export const weeklyTrend = [
  { week: "W1", critical: 22, low: 135, clear: 980 },
  { week: "W2", critical: 28, low: 142, clear: 1020 },
  { week: "W3", critical: 18, low: 128, clear: 1050 },
  { week: "W4", critical: 35, low: 155, clear: 990 },
  { week: "W5", critical: 30, low: 148, clear: 1010 },
  { week: "W6", critical: 42, low: 160, clear: 970 },
  { week: "W7", critical: 25, low: 138, clear: 1040 },
  { week: "W8", critical: 38, low: 152, clear: 995 },
  { week: "W9", critical: 20, low: 130, clear: 1060 },
  { week: "W10", critical: 32, low: 145, clear: 1025 },
  { week: "W11", critical: 27, low: 140, clear: 1035 },
  { week: "W12", critical: 31, low: 147, clear: 1015 },
];

export const countryRiskData = [
  { country: "Nigeria", flag: "🇳🇬", pct: 71, count: 84 },
  { country: "Russia", flag: "🇷🇺", pct: 68, count: 62 },
  { country: "Pakistan", flag: "🇵🇰", pct: 55, count: 48 },
  { country: "China", flag: "🇨🇳", pct: 42, count: 320 },
  { country: "UAE", flag: "🇦🇪", pct: 45, count: 56 },
  { country: "Turkey", flag: "🇹🇷", pct: 28, count: 90 },
  { country: "Mexico", flag: "🇲🇽", pct: 24, count: 72 },
  { country: "Vietnam", flag: "🇻🇳", pct: 18, count: 110 },
  { country: "Brazil", flag: "🇧🇷", pct: 8, count: 95 },
  { country: "India", flag: "🇮🇳", pct: 10, count: 280 },
];
