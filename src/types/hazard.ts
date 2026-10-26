export type HazardCategory =
  | "near_miss"
  | "unsafe_action"
  | "unsafe_condition"
  | "fire_hazard"
  | "ergonomic_hazard"
  | string;

export type HazardStatus = "reported" | "verified" | "in_progress" | "resolved";

export interface IHazardCategoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

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
