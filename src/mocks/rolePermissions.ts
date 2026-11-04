import {
  SystemRole,
  IPermissionItem,
  RolePermissionsMatrix,
} from "../types/userManagement";

export const SYSTEM_ROLES: SystemRole[] = [
  "Super Admin",
  "Pegawai",
  "Pimpinan Unit Kerja",
  "Kepala Biro KU",
  "Pengelola K3",
  "Psikolog",
  "Admin Sistem",
];

export const PERMISSION_DEFINITIONS: IPermissionItem[] = [
  // INVESTIGASI
  {
    code: "laporan.lihat_semua",
    name: "Lihat semua laporan",
    category: "INVESTIGASI",
  },
  {
    code: "laporan.buat",
    name: "Buat laporan insiden",
    category: "INVESTIGASI",
  },
  {
    code: "investigasi.kelola",
    name: "Susun & ubah investigasi",
    category: "INVESTIGASI",
  },
  {
    code: "laporan.periksa",
    name: "Periksa & tinjau laporan",
    category: "INVESTIGASI",
  },
  {
    code: "laporan.ekspor",
    name: "Ekspor / cetak PDF",
    category: "INVESTIGASI",
  },

  // KONSELING
  {
    code: "konseling.ajukan",
    name: "Ajukan konseling",
    category: "KONSELING",
  },
  {
    code: "konseling.rujuk_wajib",
    name: "Rujuk konseling wajib",
    category: "KONSELING",
  },
  {
    code: "konseling.atur_jadwal",
    name: "Atur jadwal konseling",
    category: "KONSELING",
  },
  {
    code: "konseling.lihat_catatan",
    name: "Lihat catatan sesi",
    category: "KONSELING",
    isLocked: true,
    lockedRoles: ["Psikolog"],
  },

  // PENGUMUMAN & DASHBOARD
  {
    code: "pengumuman.kelola",
    name: "Kelola pengumuman",
    category: "PENGUMUMAN & DASHBOARD",
  },
  {
    code: "dashboard.lihat_kesehatan",
    name: "Lihat dashboard kesehatan",
    category: "PENGUMUMAN & DASHBOARD",
  },

  // ADMINISTRASI
  {
    code: "pengguna.kelola",
    name: "Kelola pengguna",
    category: "ADMINISTRASI",
    requiredRoles: ["Admin Sistem"],
  },
  {
    code: "hakakses.kelola",
    name: "Kelola hak akses",
    category: "ADMINISTRASI",
    requiredRoles: ["Admin Sistem"],
  },
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMatrix = {
  "Super Admin": [
    "laporan.lihat_semua",
    "laporan.buat",
    "investigasi.kelola",
    "laporan.periksa",
    "laporan.ekspor",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "konseling.atur_jadwal",
    "konseling.lihat_catatan",
    "pengumuman.kelola",
    "dashboard.lihat_kesehatan",
    "pengguna.kelola",
    "hakakses.kelola",
  ],
  Pegawai: [
    "laporan.buat",
    "konseling.ajukan",
  ],
  "Pimpinan Unit Kerja": [
    "laporan.buat",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "dashboard.lihat_kesehatan",
  ],
  "Kepala Biro KU": [
    "laporan.lihat_semua",
    "laporan.periksa",
    "laporan.ekspor",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "dashboard.lihat_kesehatan",
  ],
  "Pengelola K3": [
    "laporan.lihat_semua",
    "laporan.buat",
    "investigasi.kelola",
    "laporan.periksa",
    "laporan.ekspor",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "konseling.atur_jadwal",
    "pengumuman.kelola",
    "dashboard.lihat_kesehatan",
  ],
  Psikolog: [
    "konseling.atur_jadwal",
    "konseling.lihat_catatan",
  ],
  "Admin Sistem": [
    "laporan.lihat_semua",
    "laporan.ekspor",
    "pengumuman.kelola",
    "dashboard.lihat_kesehatan",
    "pengguna.kelola",
    "hakakses.kelola",
  ],
};

const PERMISSIONS_STORAGE_KEY = "prima_k3_role_permissions";

/**
 * Normalisasi role dari berbagai format (RBAC lama/baru) ke SystemRole
 */
export const toSystemRole = (role?: string | null): SystemRole => {
  if (!role) return "Pegawai";
  const normalized = role.toLowerCase().trim();

  if (
    normalized === "super admin" ||
    normalized === "super_admin" ||
    normalized === "superadmin" ||
    normalized.includes("super")
  ) {
    return "Super Admin";
  }
  if (normalized === "admin" || normalized === "admin sistem" || normalized === "admin_sistem") {
    return "Admin Sistem";
  }
  if (normalized === "tim_k3" || normalized === "pengelola k3" || normalized === "pengelola_k3") {
    return "Pengelola K3";
  }
  if (
    normalized === "kepala_unit" ||
    normalized === "pimpinan unit kerja" ||
    normalized === "pimpinan_unit_kerja" ||
    normalized === "pimpinan unit"
  ) {
    return "Pimpinan Unit Kerja";
  }
  if (
    normalized === "kepala biro ku" ||
    normalized === "kepala_biro_ku" ||
    normalized === "biro ku"
  ) {
    return "Kepala Biro KU";
  }
  if (normalized === "psikolog") {
    return "Psikolog";
  }
  return "Pegawai";
};

/**
 * Mengambil matriks hak akses dari localStorage atau fallback ke DEFAULT_ROLE_PERMISSIONS
 */
export const getStoredRolePermissions = (): RolePermissionsMatrix => {
  if (typeof window === "undefined") return { ...DEFAULT_ROLE_PERMISSIONS };

  const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ROLE_PERMISSIONS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }
};

/**
 * Menyimpan matriks hak akses dengan validasi ketat (UI & data handler)
 */
export const saveStoredRolePermissions = (matrix: RolePermissionsMatrix): RolePermissionsMatrix => {
  const sanitized: RolePermissionsMatrix = { ...matrix };

  for (const role of SYSTEM_ROLES) {
    const list = new Set(sanitized[role] || []);

    // 0. Aturan Khusus: Super Admin selalu memiliki semua hak akses
    if (role === "Super Admin") {
      PERMISSION_DEFINITIONS.forEach((p) => list.add(p.code));
    }

    // 1. Aturan Khusus: konseling.lihat_catatan HANYA untuk Psikolog dan dikunci (kecuali Super Admin)
    if (role === "Psikolog" || role === "Super Admin") {
      list.add("konseling.lihat_catatan");
    } else {
      list.delete("konseling.lihat_catatan");
    }

    // 2. Aturan Khusus: Admin Sistem tidak boleh kehilangan pengguna.kelola dan hakakses.kelola
    if (role === "Admin Sistem") {
      list.add("pengguna.kelola");
      list.add("hakakses.kelola");
    }

    sanitized[role] = Array.from(list);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent("prima_permissions_updated", { detail: sanitized }));
  }
  return sanitized;
};

/**
 * Reset matriks hak akses ke bawaan
 */
export const resetStoredRolePermissions = (): RolePermissionsMatrix => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    window.dispatchEvent(new CustomEvent("prima_permissions_updated", { detail: DEFAULT_ROLE_PERMISSIONS }));
  }
  return { ...DEFAULT_ROLE_PERMISSIONS };
};

/**
 * Helper untuk memeriksa apakah suatu role memiliki permission code tertentu
 */
export const hasRolePermission = (role: string | null | undefined, permissionCode: string): boolean => {
  const systemRole = toSystemRole(role);
  const matrix = getStoredRolePermissions();
  const perms = matrix[systemRole] || [];
  return perms.includes(permissionCode);
};
