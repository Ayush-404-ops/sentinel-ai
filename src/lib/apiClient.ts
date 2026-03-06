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

export const fetchCriticalContainers = async (limit: number = 50): Promise<Container[]> => {
  const res = await fetch(`${API_BASE_URL}/containers/critical?limit=${limit}`);
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
