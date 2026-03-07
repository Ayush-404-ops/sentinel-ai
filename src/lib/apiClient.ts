import type { RiskLevel, Container } from "@/data/mockData";

const API_BASE_URL = "http://localhost:8000/api";

export const fetchOverviewStats = async () => {
  const res = await fetch(`${API_BASE_URL}/overview/stats`);
  if (!res.ok) throw new Error("Failed to fetch overview stats");
  return res.json();
};

export const fetchROI = async () => {
  const res = await fetch(`${API_BASE_URL}/overview/roi`);
  if (!res.ok) throw new Error("Failed to fetch ROI metrics");
  return res.json();
};

export const fetchCriticalContainers = async (
  level: string = "All",
  search: string = "",
  limit: number = 50,
  offset: number = 0
): Promise<{ total: number, containers: Container[] }> => {
  const url = new URL(`${API_BASE_URL}/containers/critical`);
  url.searchParams.append("level", level);
  url.searchParams.append("search", search);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("offset", offset.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch critical containers");
  return res.json();
};

export const fetchGeographicRisk = async () => {
  const res = await fetch(`${API_BASE_URL}/containers/geographic`);
  if (!res.ok) throw new Error("Failed to fetch geographic risk data");
  return res.json();
};

export const fetchTrends = async () => {
  const res = await fetch(`${API_BASE_URL}/containers/trends`);
  if (!res.ok) throw new Error("Failed to fetch trends data");
  return res.json();
};

export const fetchContainerPredict = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to fetch prediction");
  return res.json();
};

export const fetchContainerLookup = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/containers/${id}`);
  if (!res.ok) throw new Error("Failed to lookup container");
  return res.json();
};

export const fetchScoreDistribution = async () => {
  const res = await fetch(`${API_BASE_URL}/overview/score_distribution`);
  if (!res.ok) throw new Error("Failed to fetch score distribution");
  return res.json();
};

export const fetchHSRates = async () => {
  const res = await fetch(`${API_BASE_URL}/overview/hs_rates`);
  if (!res.ok) throw new Error("Failed to fetch HS rates");
  return res.json();
};

export const fetchShippingRates = async () => {
  const res = await fetch(`${API_BASE_URL}/overview/shipping_rates`);
  if (!res.ok) throw new Error("Failed to fetch shipping rates");
  return res.json();
};
export const fetchModelPerformance = async () => {
  const res = await fetch(`${API_BASE_URL}/model/performance`);
  if (!res.ok) throw new Error("Failed to fetch model performance");
  return res.json();
};
