export type SystemRole =
  | "Super Admin"
  | "Pegawai"
  | "Pimpinan Unit Kerja"
  | "Kepala Biro KU"
  | "Pengelola K3"
  | "Psikolog"
  | "Admin Sistem";

export type UserStatus = "Aktif" | "Undangan terkirim" | "Nonaktif";

export interface IManagedUser {
  id: number;
  name: string;
  email: string;
  unit: string;
  role: SystemRole;
  status: UserStatus;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type PermissionCategory =
  | "DASHBOARD"
  | "KESELAMATAN"
  | "KESEHATAN"
  | "MEDIA & INFORMASI"
  | "ADMINISTRASI";

export interface IPermissionItem {
  code: string;
  name: string;
  category: PermissionCategory;
  isPage?: boolean;
  pageRoute?: string;
  description?: string;
  isLocked?: boolean;
  lockedRoles?: SystemRole[];
  requiredRoles?: SystemRole[];
}

export type RolePermissionsMatrix = Record<SystemRole, string[]>;
