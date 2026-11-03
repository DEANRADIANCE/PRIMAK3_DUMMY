import { IManagedUser } from "../types/userManagement";

export const initialManagedUsers: IManagedUser[] = [
  {
    id: 1,
    name: "Pegawai A",
    email: "pegawai.a@contoh.go.id",
    unit: "Unit Arsip",
    role: "Pegawai",
    status: "Aktif",
    lastLogin: "2026-10-22T08:30:00Z",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 2,
    name: "Pegawai D",
    email: "pegawai.d@contoh.go.id",
    unit: "Unit Arsip",
    role: "Pimpinan Unit Kerja",
    status: "Aktif",
    lastLogin: "2026-10-21T10:15:00Z",
    createdAt: "2026-01-12T08:00:00Z",
  },
  {
    id: 3,
    name: "Pegawai K",
    email: "pegawai.k@contoh.go.id",
    unit: "Biro KU",
    role: "Kepala Biro KU",
    status: "Aktif",
    lastLogin: "2026-10-22T09:00:00Z",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: 4,
    name: "Petugas K3",
    email: "petugas.k3@contoh.go.id",
    unit: "Tim K3",
    role: "Pengelola K3",
    status: "Aktif",
    lastLogin: "2026-10-22T07:45:00Z",
    createdAt: "2026-01-05T08:00:00Z",
  },
  {
    id: 5,
    name: "Psikolog A",
    email: "psikolog.a@contoh.go.id",
    unit: "Layanan Konseling",
    role: "Psikolog",
    status: "Aktif",
    lastLogin: "2026-10-20T11:20:00Z",
    createdAt: "2026-01-08T08:00:00Z",
  },
  {
    id: 6,
    name: "Admin Sistem",
    email: "admin@contoh.go.id",
    unit: "Tim Pengembang",
    role: "Admin Sistem",
    status: "Aktif",
    lastLogin: "2026-10-22T06:30:00Z",
    createdAt: "2026-01-01T08:00:00Z",
  },
  {
    id: 7,
    name: "Pegawai M",
    email: "pegawai.m@contoh.go.id",
    unit: "Unit Umum",
    role: "Pegawai",
    status: "Undangan terkirim",
    lastLogin: null,
    createdAt: "2026-10-18T08:00:00Z",
  },
  {
    id: 8,
    name: "Pegawai N",
    email: "pegawai.n@contoh.go.id",
    unit: "Unit Keuangan",
    role: "Pegawai",
    status: "Nonaktif",
    lastLogin: "2026-09-02T15:10:00Z",
    createdAt: "2026-02-01T08:00:00Z",
  },
];

const MANAGED_USERS_KEY = "prima_k3_managed_users";

export const getStoredManagedUsers = (): IManagedUser[] => {
  if (typeof window === "undefined") return [...initialManagedUsers];
  const raw = localStorage.getItem(MANAGED_USERS_KEY);
  if (!raw) {
    localStorage.setItem(MANAGED_USERS_KEY, JSON.stringify(initialManagedUsers));
    return [...initialManagedUsers];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...initialManagedUsers];
    }
    return parsed;
  } catch {
    return [...initialManagedUsers];
  }
};

export const saveStoredManagedUsers = (users: IManagedUser[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MANAGED_USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent("prima_managed_users_updated", { detail: users }));
  }
};

export const resetStoredManagedUsers = (): IManagedUser[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(MANAGED_USERS_KEY, JSON.stringify(initialManagedUsers));
    window.dispatchEvent(new CustomEvent("prima_managed_users_updated", { detail: initialManagedUsers }));
  }
  return [...initialManagedUsers];
};
