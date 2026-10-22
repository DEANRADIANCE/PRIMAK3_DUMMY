export type InspectionType =
  | "environment"
  | "emergency"
  | "behavior"
  | "5r"
  | "apd"
  | "tools";

export type ChecklistStatus = "compliant" | "non_compliant" | "na";

export interface IChecklistItem {
  id: number;
  item: string;
  status: ChecklistStatus;
  notes: string;
  photo?: string;
  // Khusus environment
  measuredValue?: number;
  threshold?: number;
  unit?: string;
}

export interface IInspection {
  id: number;
  type: InspectionType;
  date: string;
  inspector: string;
  inspectorId: number;
  unit: string;
  location: string;
  checklist: IChecklistItem[];
  findings: string;
  followUp: string;
  responsiblePerson: string;
  complianceScore: number; // percentage 0-100
  status: "draft" | "completed" | "reviewed";
  createdAt: string;
  updatedAt: string;
}

export const INSPECTION_TYPE_LABELS: Record<InspectionType, string> = {
  environment: "Pemantauan Lingkungan",
  emergency: "Sarpras Tanggap Darurat",
  behavior: "Perilaku Kerja",
  "5r": "5R",
  apd: "APD",
  tools: "Alat Kerja",
};

// Parameter lingkungan kerja default (bisa diedit admin)
export interface IEnvironmentParameter {
  id: number;
  name: string;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
}
