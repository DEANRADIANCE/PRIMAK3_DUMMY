import { IStatusHistory } from "./hazard";

export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type HiradcStatus = "draft" | "reviewed" | "approved" | "in_progress" | "resolved";

export interface IHiradc {
  id: number;
  activity: string;
  hazard: string;
  risk: string;
  likelihood: number; // 1-5
  severity: number; // 1-5
  riskScore: number; // likelihood * severity
  riskLevel: RiskLevel;
  existingControl: string;
  additionalControl: string;
  responsiblePerson: string;
  targetDate: string;
  unit: string;
  location: string;
  category: string;
  description: string;
  potentialImpact: string;
  photos: string[];
  status: HiradcStatus;
  statusHistory: IStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export function calculateRiskLevel(score: number): RiskLevel {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "extreme";
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "low": return "#52c41a";
    case "medium": return "#faad14";
    case "high": return "#fa8c16";
    case "extreme": return "#f5222d";
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "low": return "Rendah";
    case "medium": return "Sedang";
    case "high": return "Tinggi";
    case "extreme": return "Ekstrem";
  }
}
