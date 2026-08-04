import type { Container } from "@/data/mockData";
import type {
  ChapterRiskRate,
  ContainerLookupResponse,
  GeographicRiskPoint,
  ModelPerformance,
  OverviewStats,
  PredictionRequest,
  PredictionResponse,
  RoiMetrics,
  ScoreDistributionPoint,
  ShippingRiskRate,
  TrendPoint,
} from "@/lib/apiTypes";

const API_BASE_URL = "http://localhost:8000/api";

export const fetchOverviewStats = async (): Promise<OverviewStats> => {
  const res = await fetch(`${API_BASE_URL}/overview/stats`);
  if (!res.ok) throw new Error("Failed to fetch overview stats");
  return res.json();
};

export const fetchROI = async (): Promise<RoiMetrics> => {
  const res = await fetch(`${API_BASE_URL}/overview/roi`);
  if (!res.ok) throw new Error("Failed to fetch ROI metrics");
  return res.json();
};

export const fetchCriticalContainers = async (
  level: string = "All",
  search: string = "",
  limit: number = 50,
  offset: number = 0
): Promise<{ total: number; containers: Container[] }> => {
  const url = new URL(`${API_BASE_URL}/containers/critical`);
  url.searchParams.append("level", level);
  url.searchParams.append("search", search);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch critical containers");
  return res.json();
};

export const fetchGeographicRisk = async (): Promise<GeographicRiskPoint[]> => {
  const res = await fetch(`${API_BASE_URL}/containers/geographic`);
  if (!res.ok) throw new Error("Failed to fetch geographic risk data");
  return res.json();
};

export const fetchTrends = async (): Promise<TrendPoint[]> => {
  const res = await fetch(`${API_BASE_URL}/containers/trends`);
  if (!res.ok) throw new Error("Failed to fetch trends data");
  return res.json();
};

export const fetchContainerPredict = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to fetch prediction");
  return res.json();
};

export const fetchContainerLookup = async (id: string): Promise<ContainerLookupResponse> => {
  const res = await fetch(`${API_BASE_URL}/containers/${id}`);
  if (!res.ok) throw new Error("Failed to lookup container");
  return res.json();
};

export const fetchScoreDistribution = async (): Promise<ScoreDistributionPoint[]> => {
  const res = await fetch(`${API_BASE_URL}/overview/score_distribution`);
  if (!res.ok) throw new Error("Failed to fetch score distribution");
  return res.json();
};

export const fetchHSRates = async (): Promise<ChapterRiskRate[]> => {
  const res = await fetch(`${API_BASE_URL}/overview/hs_rates`);
  if (!res.ok) throw new Error("Failed to fetch HS rates");
  return res.json();
};

export const fetchShippingRates = async (): Promise<ShippingRiskRate[]> => {
  const res = await fetch(`${API_BASE_URL}/overview/shipping_rates`);
  if (!res.ok) throw new Error("Failed to fetch shipping rates");
  return res.json();
};
export const fetchModelPerformance = async (): Promise<ModelPerformance> => {
  const res = await fetch(`${API_BASE_URL}/model/performance`);
  if (!res.ok) throw new Error("Failed to fetch model performance");
  return res.json();
};
