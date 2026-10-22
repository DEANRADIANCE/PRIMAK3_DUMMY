export type HazardCategory = "near_miss" | "unsafe_action" | "unsafe_condition";
export type HazardStatus = "reported" | "verified" | "in_progress" | "resolved";

export interface IStatusHistory {
  status: string;
  changedBy: string;
  changedAt: string;
  notes?: string;
}

export interface IHazardReport {
  id: number;
  reportNumber: string;
  date: string;
  location: string;
  unit: string;
  category: HazardCategory;
  description: string;
  potentialImpact: string;
  photos: string[];
  reporterId: number;
  reporterName: string;
  status: HazardStatus;
  statusHistory: IStatusHistory[];
  createdAt: string;
  updatedAt: string;
}
