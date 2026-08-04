import type { Container, RiskLevel } from "@/data/mockData";

export interface OverviewStats {
  total: number;
  critical: number;
  lowRisk: number;
  clear: number;
  anomalies: number;
}

export interface RoiMetrics {
  hoursSaved: number;
  wagesSaved: number;
  avoidanceRate: number;
  inspectionsReduced: number;
  detectionEfficiency: string;
}

export interface ScoreDistributionPoint {
  bin: number;
  Clear: number;
  "Low Risk": number;
  Critical: number;
}

export interface ChapterRiskRate {
  chapter: string;
  rate: number;
}

export interface ShippingRiskRate {
  line: string;
  rate: number;
}

export interface GeographicRiskPoint {
  country: string;
  flag: string;
  pct: number;
  count: number;
}

export interface TrendPoint {
  week: string;
  Critical: number;
  "Low Risk": number;
  Clear: number;
}

export interface PredictionRequest {
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

export interface RiskFactor {
  severity: "Critical" | "Warning" | "Info";
  factor: string;
  detail: string;
}

export interface PredictionResponse {
  riskLevel: RiskLevel;
  confidence: number;
  xgboostScore: number;
  anomalyScore: number;
  probabilities: Record<RiskLevel, number>;
  riskFactors: RiskFactor[];
  recommendation: string;
}

export interface ContainerLookupResponse extends Container {
  declaredValue: number;
  isAnomaly: boolean;
  xgboostProb: number;
  anomalyScore: number;
}

export interface FeatureImportancePoint {
  feature: string;
  importance: number;
}

export interface RocPoint {
  fpr: number;
  tpr: number;
}

export interface ModelPerformance {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
  confusionMatrix: number[][];
  featureImportance: FeatureImportancePoint[];
  rocCurve: {
    critical: RocPoint[];
    lowRisk: RocPoint[];
    clear: RocPoint[];
    auc: {
      critical: number;
      lowRisk: number;
      clear: number;
    };
  };
}
