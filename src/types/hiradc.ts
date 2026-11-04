import { IStatusHistory } from "./hazard";

export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type HiradcStatus = "draft" | "reviewed" | "approved" | "in_progress" | "resolved";

export type ActivityType = "Rutin (R)" | "Non Rutin (NR)";
export type HazardClassification = "Health (H)" | "Safety (S)" | "Environment (E)";
export type ControlStatus = "Open" | "Close";
export type NfrRiskLevel = "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";

export interface IHiradc {
  id: number;
  activity: string; // Aktivitas / Proses Kerja
  unit: string; // Unit Kerja
  location: string; // Lokasi
  activityType?: ActivityType; // Rutin (R) / Non Rutin (NR)
  hazardClassification?: HazardClassification[]; // Health (H), Safety (S), Environment (E)
  assessor?: string; // Pemeriksa / Tim Penilai
  assessmentDate?: string; // Tanggal Penilaian

  // Identifikasi 5 Faktor Bahaya (Sesuai Form Excel)
  hazardPhysics?: string; // Bahaya Fisika (Bising, Getaran, Suhu, Radiasi, Pencahayaan)
  hazardChemical?: string; // Bahaya Kimia (Bahan Kimia, Gas, Debu, Pelarut)
  hazardBiology?: string; // Bahaya Biologi (Bakteri, Virus, Jamur, Parasit)
  hazardErgonomics?: string; // Bahaya Ergonomi (Manual handling, Awkward position, Repetitif)
  hazardPsychosocial?: string; // Bahaya Psikososial (Stres kerja, Shift, Beban kerja)
  riskImpact?: string; // Risiko / Penyakit Yang Ditimbulkan

  // Pengendalian Saat Ini (Existing Control - 5 Hirarki K3)
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
