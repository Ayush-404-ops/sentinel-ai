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
  declaredValue: number;
  valuePerKg: number;
  shipper: string;
  importer: string;
  shipmentDate: string;
  dwellTime: number;
  riskScore: number;
  riskLevel: RiskLevel;
  shipperRiskRate: number;
  countryRiskRate: number;
  hsRiskRate: number;
  flaggedReason: string;
}

export const containers: Container[] = [
  { id: "MSCU7483920", origin: "China", originFlag: "🇨🇳", destination: "Mumbai, India", hsCode: "84.71", hsDesc: "Computers", declaredWeight: 12400, measuredWeight: 18920, weightDiscrepancy: 52.6, declaredValue: 145000, valuePerKg: 7.67, shipper: "Shenzhen LogiTech Co.", importer: "Mumbai Trade Corp.", shipmentDate: "2026-02-14 02:17", dwellTime: 11, riskScore: 94, riskLevel: "Critical", shipperRiskRate: 78, countryRiskRate: 62, hsRiskRate: 55, flaggedReason: "Weight discrepancy +52.6%" },
  { id: "TRIU5529103", origin: "Nigeria", originFlag: "🇳🇬", destination: "Rotterdam, NL", hsCode: "27.09", hsDesc: "Crude Petroleum", declaredWeight: 24000, measuredWeight: 31200, weightDiscrepancy: 30.0, declaredValue: 89000, valuePerKg: 2.85, shipper: "Lagos Petro Exports", importer: "NL Energy BV", shipmentDate: "2026-02-20 23:45", dwellTime: 14, riskScore: 91, riskLevel: "Critical", shipperRiskRate: 85, countryRiskRate: 71, hsRiskRate: 48, flaggedReason: "Excessive dwell time" },
  { id: "CMAU8834210", origin: "UAE", originFlag: "🇦🇪", destination: "Hamburg, DE", hsCode: "71.08", hsDesc: "Gold", declaredWeight: 800, measuredWeight: 1340, weightDiscrepancy: 67.5, declaredValue: 2400000, valuePerKg: 1791.0, shipper: "Dubai Precious Metals", importer: "Frankfurt Gold AG", shipmentDate: "2026-03-01 01:30", dwellTime: 8, riskScore: 97, riskLevel: "Critical", shipperRiskRate: 92, countryRiskRate: 45, hsRiskRate: 72, flaggedReason: "Weight discrepancy +67.5%" },
  { id: "HLCU3394821", origin: "Vietnam", originFlag: "🇻🇳", destination: "Los Angeles, US", hsCode: "62.04", hsDesc: "Garments", declaredWeight: 5600, measuredWeight: 6100, weightDiscrepancy: 8.9, declaredValue: 32000, valuePerKg: 5.25, shipper: "Hanoi Textile Ltd.", importer: "US Fashion Inc.", shipmentDate: "2026-02-18 10:30", dwellTime: 4, riskScore: 38, riskLevel: "Low Risk", shipperRiskRate: 22, countryRiskRate: 18, hsRiskRate: 12, flaggedReason: "Slightly low value-per-kg" },
  { id: "EISU2210394", origin: "Brazil", originFlag: "🇧🇷", destination: "Shanghai, CN", hsCode: "12.01", hsDesc: "Soybeans", declaredWeight: 28000, measuredWeight: 28400, weightDiscrepancy: 1.4, declaredValue: 14000, valuePerKg: 0.49, shipper: "São Paulo Agro", importer: "Shanghai Foods Co.", shipmentDate: "2026-02-25 08:15", dwellTime: 3, riskScore: 12, riskLevel: "Clear", shipperRiskRate: 5, countryRiskRate: 8, hsRiskRate: 3, flaggedReason: "—" },
  { id: "MSKU9912384", origin: "Pakistan", originFlag: "🇵🇰", destination: "Felixstowe, UK", hsCode: "52.09", hsDesc: "Cotton Fabric", declaredWeight: 9200, measuredWeight: 12800, weightDiscrepancy: 39.1, declaredValue: 41000, valuePerKg: 3.20, shipper: "Karachi Textiles", importer: "London Cloth Ltd.", shipmentDate: "2026-02-22 22:10", dwellTime: 9, riskScore: 82, riskLevel: "Critical", shipperRiskRate: 68, countryRiskRate: 55, hsRiskRate: 30, flaggedReason: "Weight + late-night declaration" },
  { id: "TCLU4482910", origin: "South Korea", originFlag: "🇰🇷", destination: "Busan, KR", hsCode: "85.17", hsDesc: "Telephones", declaredWeight: 3400, measuredWeight: 3480, weightDiscrepancy: 2.4, declaredValue: 220000, valuePerKg: 63.22, shipper: "Seoul Electronics", importer: "KR Mobile Corp.", shipmentDate: "2026-03-02 14:00", dwellTime: 2, riskScore: 8, riskLevel: "Clear", shipperRiskRate: 3, countryRiskRate: 6, hsRiskRate: 5, flaggedReason: "—" },
  { id: "OOLU7781234", origin: "Turkey", originFlag: "🇹🇷", destination: "Marseille, FR", hsCode: "72.14", hsDesc: "Iron Bars", declaredWeight: 40000, measuredWeight: 43200, weightDiscrepancy: 8.0, declaredValue: 28000, valuePerKg: 0.65, shipper: "Istanbul Steel Corp.", importer: "France Metals SA", shipmentDate: "2026-02-16 17:30", dwellTime: 6, riskScore: 45, riskLevel: "Low Risk", shipperRiskRate: 32, countryRiskRate: 28, hsRiskRate: 20, flaggedReason: "Moderate weight variance" },
  { id: "SUDU3394856", origin: "India", originFlag: "🇮🇳", destination: "Jebel Ali, UAE", hsCode: "09.02", hsDesc: "Tea", declaredWeight: 18200, measuredWeight: 18500, weightDiscrepancy: 1.6, declaredValue: 72000, valuePerKg: 3.89, shipper: "Assam Tea Exports", importer: "Dubai Beverages LLC", shipmentDate: "2026-03-04 09:00", dwellTime: 2, riskScore: 6, riskLevel: "Clear", shipperRiskRate: 2, countryRiskRate: 10, hsRiskRate: 4, flaggedReason: "—" },
  { id: "GCXU1129384", origin: "Mexico", originFlag: "🇲🇽", destination: "Houston, US", hsCode: "08.04", hsDesc: "Avocados", declaredWeight: 22000, measuredWeight: 24800, weightDiscrepancy: 12.7, declaredValue: 55000, valuePerKg: 2.22, shipper: "Michoacán Farms", importer: "Texas Fresh Foods", shipmentDate: "2026-02-28 03:45", dwellTime: 7, riskScore: 52, riskLevel: "Low Risk", shipperRiskRate: 35, countryRiskRate: 24, hsRiskRate: 15, flaggedReason: "Late-night + moderate discrepancy" },
  { id: "APLU2294812", origin: "Indonesia", originFlag: "🇮🇩", destination: "Yokohama, JP", hsCode: "15.11", hsDesc: "Palm Oil", declaredWeight: 35000, measuredWeight: 35200, weightDiscrepancy: 0.6, declaredValue: 28000, valuePerKg: 0.80, shipper: "Jakarta Palm Co.", importer: "Tokyo Oils Ltd.", shipmentDate: "2026-03-03 11:20", dwellTime: 3, riskScore: 5, riskLevel: "Clear", shipperRiskRate: 4, countryRiskRate: 12, hsRiskRate: 6, flaggedReason: "—" },
  { id: "YMLU8839201", origin: "Russia", originFlag: "🇷🇺", destination: "Piraeus, GR", hsCode: "27.01", hsDesc: "Coal", declaredWeight: 50000, measuredWeight: 58900, weightDiscrepancy: 17.8, declaredValue: 35000, valuePerKg: 0.59, shipper: "Siberian Mining Co.", importer: "Greece Energy SA", shipmentDate: "2026-02-12 00:15", dwellTime: 16, riskScore: 88, riskLevel: "Critical", shipperRiskRate: 74, countryRiskRate: 68, hsRiskRate: 42, flaggedReason: "Excessive dwell + weight" },
];

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
