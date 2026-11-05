import { IStatusHistory } from "./hazard";

export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type HiradcStatus = "draft" | "reviewed" | "approved" | "in_progress" | "resolved";

export type ActivityType = "Rutin (R)" | "Non Rutin (NR)";
export type HazardClassification = "Health (H)" | "Safety (S)" | "Environment (E)";
export type ControlStatus = "Open" | "Close";
export type NfrRiskLevel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";
export type HazardCategoryType = "Fisika" | "Kimia" | "Biologi" | "Ergonomi" | "Psikososial";
export type ControlHierarchyType = "Eliminasi" | "Subtitusi" | "Engineering Control" | "Administrasi" | "APD";

export interface IHazardDetailItem {
  id: string;
  deskripsi: string;
  risikoList: string[]; // Bisa lebih dari 1 risiko
  dampakList: string[]; // Bisa lebih dari 1 dampak
}

// Tabel baris Deskripsi Bahaya ke bawah (1 deskripsi bisa pilih > 1 jenis bahaya)
export interface IHazardDetailRow {
  id: string;
  deskripsi: string;
  jenisBahaya: HazardCategoryType[]; // Bisa centang lebih dari 1 jenis bahaya!
  risikoList: string[]; // Bisa lebih dari 1 risiko
  dampakList: string[]; // Bisa lebih dari 1 dampak
}

export type HazardDetailsMap = {
  [key in HazardCategoryType]?: IHazardDetailItem[];
};

export interface IHiradcSubActivity {
  id: string; // ID unik tahapan proses kerja, misal "step-1"
  activity: string; // Aktivitas / Proses Kerja spesifik (contoh: "Mengambil arsip dari brankas")
  location?: string; // Lokasi proses kerja
  activityType?: ActivityType; // Rutin (R) / Non Rutin (NR)
  hazardClassification?: HazardClassification[]; // Health (H), Safety (S), Environment (E)

  // Tabel baris Deskripsi Bahaya ke bawah
  hazardRows?: IHazardDetailRow[];

  // Pilihan Jenis Bahaya (Centang-centang, bisa lebih dari 1)
  selectedHazardTypes?: HazardCategoryType[];
  // Rincian Deskripsi Bahaya, Risiko & Dampak per Jenis Bahaya
  hazardDetails?: HazardDetailsMap;

  // Identifikasi 5 Faktor Bahaya (kompatibilitas ringkasan string)
  hazardPhysics?: string; // Bahaya Fisika
  hazardChemical?: string; // Bahaya Kimia
  hazardBiology?: string; // Bahaya Biologi
  hazardErgonomics?: string; // Bahaya Ergonomi
  hazardPsychosocial?: string; // Bahaya Psikososial
  riskImpact: string; // Risiko / Penyakit Yang Ditimbulkan

  // Pengendalian (Existing Control - 5 Hirarki K3 Sesuai Spreadsheet)
  controlDescription?: string; // Deskripsi Pengendalian
  selectedControls?: ControlHierarchyType[]; // Pilihan hirarki yang dicentang
  currentElimination?: string;
  currentSubstitution?: string;
  currentEngineering?: string;
  currentAdministrative?: string;
  currentApd?: string;
  currentLikelihood: number; // L (1 - 5)
  currentSeverity: number; // S (1 - 5)
  currentNfr: number; // Nilai Faktor Risiko (L × S)
  currentRiskLevel: NfrRiskLevel;

  // Pengendalian Lanjutan (Determining / Residual Control - 5 Hirarki K3)
  residualSelectedControls?: ControlHierarchyType[];
  residualElimination?: string;
  residualSubstitution?: string;
  residualEngineering?: string;
  residualAdministrative?: string;
  residualApd?: string;
  residualLikelihood?: number; // L (1 - 5)
  residualSeverity?: number; // S (1 - 5)
  residualNfr?: number; // Nilai Faktor Risiko (L × S)
  residualRiskLevel?: NfrRiskLevel;

  // Durasi, Status, PIC & Target
  controlDuration?: string;
  controlStatus?: ControlStatus;
  responsiblePerson?: string;
  targetDate?: string;
}

export interface IHiradc {
  id: number;
  parentActivity?: string; // Judul Kegiatan (Induk / Ibu, contoh: "Menata Arsip")
  activity: string; // Aktivitas / Proses Kerja (atau ringkasan kegiatan)
  subActivities?: IHiradcSubActivity[]; // Daftar tahapan proses kerja yang dinilai
  unit: string; // Unit Kerja
  location: string; // Lokasi
  activityType?: ActivityType; // Rutin (R) / Non Rutin (NR)
  hazardClassification?: HazardClassification[]; // Health (H), Safety (S), Environment (E)
  assessor?: string; // Pemeriksa / Tim Penilai
  assessmentDate?: string; // Tanggal Penilaian

  // Pilihan Jenis Bahaya (Centang-centang) & Rincian
  hazardRows?: IHazardDetailRow[];
  selectedHazardTypes?: HazardCategoryType[];
  hazardDetails?: HazardDetailsMap;

  // Identifikasi 5 Faktor Bahaya (Sesuai Form Excel)
  hazardPhysics?: string; // Bahaya Fisika (Bising, Getaran, Suhu, Radiasi, Pencahayaan)
  hazardChemical?: string; // Bahaya Kimia (Bahan Kimia, Gas, Debu, Pelarut)
  hazardBiology?: string; // Bahaya Biologi (Bakteri, Virus, Jamur, Parasit)
  hazardErgonomics?: string; // Bahaya Ergonomi (Manual handling, Awkward position, Repetitif)
  hazardPsychosocial?: string; // Bahaya Psikososial (Stres kerja, Shift, Beban kerja)
  riskImpact?: string; // Risiko / Penyakit Yang Ditimbulkan

  // Pengendalian Saat Ini (Existing Control - 5 Hirarki K3)
  controlDescription?: string; // Deskripsi Pengendalian
  selectedControls?: ControlHierarchyType[];
  currentElimination?: string; // Eliminasi
  currentSubstitution?: string; // Substitusi
  currentEngineering?: string; // Engineering Control
  currentAdministrative?: string; // Administrasi
  currentApd?: string; // APD
  currentLikelihood: number; // L (1 - 5)
  currentSeverity: number; // S (1 - 5)
  currentNfr: number; // Nilai Faktor Risiko (L × S)
  currentRiskLevel: NfrRiskLevel;

  // Pengendalian Lanjutan (Determining / Residual Control - 5 Hirarki K3)
  residualSelectedControls?: ControlHierarchyType[];
  residualElimination?: string; // Eliminasi
  residualSubstitution?: string; // Substitusi
  residualEngineering?: string; // Engineering Control
  residualAdministrative?: string; // Administrasi
  residualApd?: string; // APD
  residualLikelihood: number; // L (1 - 5)
  residualSeverity: number; // S (1 - 5)
  residualNfr: number; // Nilai Faktor Risiko (L × S)
  residualRiskLevel: NfrRiskLevel;

  // Durasi & Status Pengendalian Lanjutan
  controlDuration?: string; // Durasi Pengendalian (Waktu maksimal pengerjaan, contoh: 7 Hari, 30 Hari, 12 Bulan)
  controlStatus?: ControlStatus; // Status Pengendalian: Open / Close

  // Penanggung Jawab & Target
  responsiblePerson: string;
  targetDate: string;

  // Backward-compatibility fields
  hazard?: string;
  risk?: string;
  category?: string;
  likelihood: number;
  severity: number;
  riskScore: number;
  riskLevel: RiskLevel;
  existingControl?: string;
  additionalControl?: string;
  description?: string;
  potentialImpact?: string;
  photos?: string[];
  status: HiradcStatus;
  statusHistory?: IStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export function calculateRiskLevel(score: number): RiskLevel {
  if (score <= 4) return "low";
  if (score <= 9) return "medium";
  if (score <= 16) return "high";
  return "extreme";
}

export function calculateNfrRiskLevel(nfr: number): NfrRiskLevel {
  if (nfr <= 2) return "Rendah";
  if (nfr <= 4) return "Sedang";
  if (nfr <= 12) return "Tinggi";
  return "Sangat Tinggi";
}

export function getNfrColor(level: NfrRiskLevel): string {
  switch (level) {
    case "Rendah": return "#52c41a";
    case "Sedang": return "#faad14";
    case "Tinggi": return "#fa8c16";
    case "Sangat Tinggi": return "#f5222d";
  }
}

export function getNfrTagColor(level: NfrRiskLevel): string {
  switch (level) {
    case "Rendah": return "success";
    case "Sedang": return "gold";
    case "Tinggi": return "orange";
    case "Sangat Tinggi": return "error";
  }
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
