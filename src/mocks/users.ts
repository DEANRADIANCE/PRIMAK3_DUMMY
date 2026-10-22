import { IUser } from "../types/user";

export const initialUsers: IUser[] = [
  {
    id: 1,
    name: "Dr. Budi Santoso, M.K.K.",
    email: "admin@anri.go.id",
    role: "admin",
    unit: "Klinik Pratama ANRI",
    nip: "198005122005011002",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 2,
    name: "Siti Rahmawati, S.Tr.Kes",
    email: "timk3@anri.go.id",
    role: "tim_k3",
    unit: "Unit Keselamatan dan Kesehatan Kerja",
    nip: "198804152010122001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    createdAt: "2024-01-05T08:00:00Z",
  },
  {
    id: 3,
    name: "Ir. Hendra Gunawan, M.M.",
    email: "kepalaunit@anri.go.id",
    role: "kepala_unit",
    unit: "Direktorat Pengolahan Arsip",
    nip: "197509201999031001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: 4,
    name: "Ahmad Fauzi, A.Md.",
    email: "pegawai@anri.go.id",
    role: "pegawai",
    unit: "Subbagian Rumah Tangga dan Sarpras",
    nip: "199411032019021004",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fauzi",
    createdAt: "2024-02-01T08:00:00Z",
  },
];
