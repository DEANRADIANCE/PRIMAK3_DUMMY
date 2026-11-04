import {
  IMasterUser,
  IMasterRole,
  IMasterCategory,
  IMasterUnit,
  IMasterLocation,
  IMasterDisease,
} from "../types/masterData";
import { getStoredManagedUsers, saveStoredManagedUsers } from "./managedUsers";

// ==========================================
// 1. INITIAL DATA
// ==========================================

export const initialMasterRoles: IMasterRole[] = [
  {
    id: 1,
    code: "super_admin",
    name: "Super Admin",
    level: 1,
    description: "Akses penuh tanpa batasan ke seluruh modul, master data, dan konfigurasi sistem",
    color: "#d97706",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 2,
    code: "admin_sistem",
    name: "Admin Sistem",
    level: 2,
    description: "Mengelola pengguna, hak akses peran, audit log, dan administrasi umum",
    color: "#2563eb",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 3,
    code: "pengelola_k3",
    name: "Pengelola K3",
    level: 3,
    description: "Koordinator teknis pelaksanaan K3, investigasi kecelakaan, dan inspeksi lapangan",
    color: "#ea580c",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 4,
    code: "kepala_biro_ku",
    name: "Kepala Biro KU",
    level: 4,
    description: "Pemeriksa tingkat tinggi, penandatangan berkas sah investigasi, dan monitoring",
    color: "#7c3aed",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 5,
    code: "pimpinan_unit_kerja",
    name: "Pimpinan Unit Kerja",
    level: 5,
    description: "Kepala unit kerja dengan wewenang rujukan konseling dan tinjauan laporan staf",
    color: "#0891b2",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 6,
    code: "psikolog",
    name: "Psikolog",
    level: 6,
    description: "Konselor berlisensi pengelola jadwal konsultasi dan pemilik catatan rekam medis",
    color: "#db2777",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
  {
    id: 7,
    code: "pegawai",
    name: "Pegawai",
    level: 7,
    description: "Pengguna standar yang berhak membuat laporan insiden dan mengajukan konseling",
    color: "#16a34a",
    status: "Aktif",
    createdAt: "2024-01-01T08:00:00Z",
  },
];

export const initialMasterCategories: IMasterCategory[] = [
  {
    id: 1,
    code: "near_miss",
    name: "Near Miss (Hampir Celaka)",
    description: "Insiden yang tidak mengakibatkan cedera fisik, namun berpotensi bahaya jika terulang.",
    color: "orange",
    severityDefault: "Sedang",
    status: "Aktif",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 2,
    code: "unsafe_action",
    name: "Unsafe Action (Tindakan Tidak Aman)",
    description: "Perilaku berbahaya atau kelalaian pekerja yang tidak mematuhi SOP keselamatan.",
    color: "volcano",
    severityDefault: "Tinggi",
    status: "Aktif",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 3,
    code: "unsafe_condition",
    name: "Unsafe Condition (Kondisi Tidak Aman)",
    description: "Kondisi fisik lingkungan kerja, sarana kerja atau peralatan yang rusak dan membahayakan.",
    color: "red",
    severityDefault: "Tinggi",
    status: "Aktif",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 4,
    code: "fire_hazard",
    name: "Fire Hazard (Bahaya Kebakaran)",
    description: "Potensi pemicu api, bahan mudah terbakar, sambungan kabel konslet, atau jalur evakuasi tertutup.",
    color: "magenta",
    severityDefault: "Kritis",
    status: "Aktif",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: 5,
    code: "ergonomic_hazard",
    name: "Ergonomic Hazard (Bahaya Ergonomi)",
    description: "Desain meja/kursi tidak ergonomis, posisi angkat beban salah, berisiko gangguan tulang rangka.",
    color: "blue",
    severityDefault: "Sedang",
    status: "Aktif",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: 6,
    code: "chemical_hazard",
    name: "Chemical Hazard (Bahan Kimia & B3)",
    description: "Paparan cairan kimia preservasi arsip, debu mikroskopis, atau ventilasi kimia yang minim.",
    color: "purple",
    severityDefault: "Kritis",
    status: "Aktif",
    createdAt: "2026-02-01T08:00:00Z",
  },
];

export const initialMasterUnits: IMasterUnit[] = [
  {
    id: 1,
    code: "UNIT-ARSIP-DINAMIS",
    name: "Direktorat Preservasi & Arsip Dinamis",
    headOfUnit: "Drs. H. Mulyadi, M.Hum",
    location: "Gedung A Lantai 3",
    employeeCount: 42,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 2,
    code: "UNIT-ARSIP-STATIS",
    name: "Direktorat Pengolahan Arsip Statis",
    headOfUnit: "Dr. Sri Wahyuni, M.Si",
    location: "Gedung B Lantai 2",
    employeeCount: 38,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 3,
    code: "BIRO-KU",
    name: "Biro Keuangan dan Umum",
    headOfUnit: "Rahmat Hidayat, S.E., M.M.",
    location: "Gedung A Lantai 1",
    employeeCount: 65,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 4,
    code: "PUSDATIN-K3",
    name: "Pusat Data dan Informasi (Pusdatin)",
    headOfUnit: "Ir. Hendra Gunawan, M.Kom",
    location: "Gedung C Lantai 4",
    employeeCount: 28,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 5,
    code: "KLINIK-PRATAMA",
    name: "Klinik Pratama & Layanan Kesehatan ANRI",
    headOfUnit: "dr. Budi Santoso, Sp.Ok",
    location: "Gedung Pelayanan Lantai 1",
    employeeCount: 14,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 6,
    code: "TIM-K3",
    name: "Sekretariat Pengelola K3 & Tanggap Darurat",
    headOfUnit: "Ahmad Fauzi, S.T., M.K3",
    location: "Gedung A Lantai 1",
    employeeCount: 12,
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
];

export const initialMasterLocations: IMasterLocation[] = [
  {
    id: 1,
    code: "LOK-GD-A-L1",
    name: "Lobi & Ruang Pelayanan Terpadu",
    building: "Gedung A",
    floor: "Lantai 1",
    riskLevel: "Rendah",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 2,
    code: "LOK-GD-A-L2",
    name: "Ruang Kerja Perkantoran Biro KU",
    building: "Gedung A",
    floor: "Lantai 2",
    riskLevel: "Rendah",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 3,
    code: "LOK-GD-B-BSM",
    name: "Ruang Depo Penyimpanan Berkas Arsip",
    building: "Gedung B",
    floor: "Basement",
    riskLevel: "Tinggi",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 4,
    code: "LOK-GD-C-LAB",
    name: "Laboratorium Preservasi & Restorasi Kimia",
    building: "Gedung C",
    floor: "Lantai 2",
    riskLevel: "Tinggi",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 5,
    code: "LOK-GD-C-SVR",
    name: "Ruang Server & Panel Distribusi Listrik Utama",
    building: "Gedung C",
    floor: "Lantai 1",
    riskLevel: "Tinggi",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 6,
    code: "LOK-OUTDOOR-PK",
    name: "Area Parkir Kendaraan & Titik Kumpul Darurat",
    building: "Area Terbuka",
    floor: "Lantai Dasar",
    riskLevel: "Sedang",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
];

export const initialMasterDiseases: IMasterDisease[] = [
  {
    id: 1,
    code: "DIS-001",
    name: "Muskuloskeletal Disorders (Low Back Pain)",
    category: "Penyakit Akibat Kerja",
    riskLevel: "Tinggi",
    description: "Nyeri punggung bawah kronis akibat postur duduk salah saat mengetik atau mengangkat dokumen berat.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 2,
    code: "DIS-002",
    name: "Influenza / ISPA Akut",
    category: "Penyakit Umum",
    riskLevel: "Sedang",
    description: "Infeksi saluran pernapasan atas akibat sirkulasi AC tertutup atau interaksi di ruang pelayanan.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 3,
    code: "DIS-003",
    name: "Sindrom Burnout & Kelelahan Mental",
    category: "Kesehatan Mental",
    riskLevel: "Tinggi",
    description: "Kondisi stres berkepanjangan, beban kerja tinggi, dan keletihan emosional yang butuh pendampingan psikolog.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 4,
    code: "DIS-004",
    name: "Computer Vision Syndrome (Asthenopia)",
    category: "Penyakit Akibat Kerja",
    riskLevel: "Sedang",
    description: "Ketegangan otot mata, penglihatan kabur, dan mata kering akibat menatap layar monitor lebih dari 6 jam.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 5,
    code: "DIS-005",
    name: "Dermatitis Kontak & Alergi Debu Arsip",
    category: "Penyakit Akibat Kerja",
    riskLevel: "Sedang",
    description: "Iritasi kulit atau saluran napas akibat spora jamur dan debu buku/kertas arsip tua tanpa APD memadai.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: 6,
    code: "DIS-006",
    name: "Hipertensi Esensial & Dislipidemia",
    category: "Penyakit Umum",
    riskLevel: "Sedang",
    description: "Tekanan darah tinggi dan kolesterol akibat pola makan dan kurangnya aktivitas gerak selama jam kerja.",
    status: "Aktif",
    createdAt: "2025-01-10T08:00:00Z",
  },
];

// ==========================================
// 2. STORAGE HELPERS
// ==========================================

const ROLES_KEY = "prima_k3_master_roles";
const CATEGORIES_KEY = "prima_k3_master_categories";
const UNITS_KEY = "prima_k3_master_units";
const LOCATIONS_KEY = "prima_k3_master_locations";
const DISEASES_KEY = "prima_k3_master_diseases";

const getFromStorage = <T>(key: string, initial: T[]): T[] => {
  if (typeof window === "undefined") return [...initial];
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(initial));
    return [...initial];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...initial];
  } catch {
    return [...initial];
  }
};

const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("prima_master_data_updated", { detail: { key, data } }));
  }
};

// Users (sinkron dengan managedUsers)
export const getMasterUsers = (): IMasterUser[] => {
  const users = getStoredManagedUsers();
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    unit: u.unit,
    role: u.role,
    status: u.status,
    phone: "0812-" + (1000 + u.id) + "-9876",
    nip: "1988" + String(u.id).padStart(4, "0") + "2015021001",
    createdAt: u.createdAt || "2025-01-01T08:00:00Z",
  }));
};

export const saveMasterUsers = (users: IMasterUser[]) => {
  const managed = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    unit: u.unit,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt || new Date().toISOString(),
  }));
  saveStoredManagedUsers(managed);
};

// Roles
export const getMasterRoles = (): IMasterRole[] => getFromStorage(ROLES_KEY, initialMasterRoles);
export const saveMasterRoles = (data: IMasterRole[]) => saveToStorage(ROLES_KEY, data);

// Categories
export const getMasterCategories = (): IMasterCategory[] => getFromStorage(CATEGORIES_KEY, initialMasterCategories);
export const saveMasterCategories = (data: IMasterCategory[]) => saveToStorage(CATEGORIES_KEY, data);

// Units
export const getMasterUnits = (): IMasterUnit[] => getFromStorage(UNITS_KEY, initialMasterUnits);
export const saveMasterUnits = (data: IMasterUnit[]) => saveToStorage(UNITS_KEY, data);

// Locations
export const getMasterLocations = (): IMasterLocation[] => getFromStorage(LOCATIONS_KEY, initialMasterLocations);
export const saveMasterLocations = (data: IMasterLocation[]) => saveToStorage(LOCATIONS_KEY, data);

// Diseases
export const getMasterDiseases = (): IMasterDisease[] => getFromStorage(DISEASES_KEY, initialMasterDiseases);
export const saveMasterDiseases = (data: IMasterDisease[]) => saveToStorage(DISEASES_KEY, data);
