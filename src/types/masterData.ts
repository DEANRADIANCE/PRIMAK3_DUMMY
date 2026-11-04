import { SystemRole, UserStatus } from "./userManagement";

export type MasterDataType =
  | "users"
  | "categories"
  | "roles"
  | "units"
  | "locations"
  | "diseases";

export interface IMasterUser {
  id: number;
  name: string;
  email: string;
  unit: string;
  role: SystemRole;
  status: UserStatus;
  phone?: string;
  nip?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IMasterRole {
  id: number;
  code: string;
  name: string;
  level: number;
  description: string;
  color: string;
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}

export interface IMasterCategory {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;
  severityDefault: "Rendah" | "Sedang" | "Tinggi" | "Kritis";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}

export interface IMasterUnit {
  id: number;
  code: string;
  name: string;
  headOfUnit: string;
  location: string;
  employeeCount: number;
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}

export interface IMasterLocation {
  id: number;
  code: string;
  name: string;
  building: string;
  floor: string;
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}

export interface IMasterDisease {
  id: number;
  code: string;
  name: string;
  category: "Penyakit Umum" | "Penyakit Akibat Kerja" | "Kesehatan Mental";
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  description: string;
  status: "Aktif" | "Nonaktif";
  createdAt: string;
}
