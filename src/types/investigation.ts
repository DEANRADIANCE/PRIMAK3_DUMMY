export type InvestigationStatus =
  | "Draf"
  | "Menunggu Pengesahan"
  | "Disahkan"
  | "Dikembalikan";

export type IncidentSeverity = "Ringan" | "Sedang" | "Berat" | "Fatal";

export type IncidentType =
  | "Near Miss"
  | "Unsafe Action"
  | "Unsafe Condition"
  | "Kecelakaan Kerja";

export type VictimCondition = "Sembuh" | "Rawat" | "Cacat" | "Meninggal";

export type ActionType = "Koreksi" | "Korektif" | "Pencegahan";

export type ControlHierarchy =
  | "Eliminasi"
  | "Substitusi"
  | "Rekayasa teknik"
  | "Administratif"
  | "APD";

export type ActionStatus = "Belum" | "Sedang" | "Selesai";

export interface InvestigationInsiden {
  judul: string;
  tanggal_jam: string; // ISO / "YYYY-MM-DD HH:mm"
  lokasi: string;
  unit: string;
  jenis: IncidentType;
  tingkat_keparahan: IncidentSeverity;
  deskripsi: string;
  lampiran?: Array<{
    uid?: string;
    name: string;
    url?: string;
    size?: number;
    type?: string;
  }>;
}

export interface InvestigationKorban {
  id?: string | number;
  nama: string;
  nip_id?: string;
  unit: string;
  jabatan: string;
  jenis_cedera: string;
  bagian_tubuh: string[];
  tingkat_keparahan_cedera: "Ringan" | "Sedang" | "Berat";
  tindakan_medis: string;
  dirujuk_ke?: string;
  hari_kerja_hilang: number;
  status_kondisi: VictimCondition;
}

export interface KronologiItem {
  id?: string | number;
  waktu: string;
  uraian: string;
}

export interface SaksiItem {
  id?: string | number;
  nama: string;
  unit: string;
  jabatan?: string;
  keterangan: string;
}

export interface FiveWhys {
  why1: string;
  why2?: string;
  why3?: string;
  why4?: string;
  why5?: string;
}

export interface InvestigationDetail {
  tim_investigator: string[];
  ketua_tim: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  kronologi: KronologiItem[];
  saksi: SaksiItem[];
  penyebab_langsung: {
    kategori: ("Tindakan tidak aman" | "Kondisi tidak aman")[];
    uraian: string;
  };
  faktor_kontribusi: string[]; // Manusia, Peralatan, Material, Metode, Lingkungan, Manajemen
  analisis_akar_masalah: {
    five_whys: FiveWhys;
    akar_penyebab: string;
  };
  bukti_pendukung?: Array<{
    uid?: string;
    name: string;
    url?: string;
    size?: number;
    type?: string;
  }>;
  hiradc_id?: string | number;
  hiradc_nomor?: string;
  catatan_bahaya_hiradc?: string;
}

export interface InvestigationPerbaikan {
  id?: string | number;
  uraian: string;
  jenis: ActionType;
  hirarki: ControlHierarchy;
  penanggung_jawab: string;
  target_selesai: string;
  status: ActionStatus;
  bukti_penyelesaian?: Array<{
    uid?: string;
    name: string;
    url?: string;
  }>;
}

export interface InvestigationPengesahan {
  pemeriksa: string; // e.g. "Kepala Biro KU"
  pemeriksa_nama?: string;
  catatan_pengajuan?: string;
  pernyataan_benar: boolean;
  tanggal_pengesahan?: string;
  catatan_pengesah?: string; // used when approved or returned
}

export interface InvestigationTimestamps {
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface Investigation {
  id: number;
  nomor: string; // e.g. "INV-2026-001"
  laporan_id?: number | null;
  laporan_nomor?: string;
  insiden: InvestigationInsiden;
  ada_korban?: boolean;
  korban: InvestigationKorban[];
  investigasi: InvestigationDetail;
  perbaikan: InvestigationPerbaikan[];
  pengesahan: InvestigationPengesahan;
  status: InvestigationStatus;
  lastStep?: number;
  created_by?: string;
  timestamps: InvestigationTimestamps;

  // Backward compatibility fields for legacy views if any
  relatedReportId?: number;
  relatedReportType?: "hazard" | "accident";
  relatedReportNumber?: string;
  incidentDate?: string;
  incidentTime?: string;
  incidentLocation?: string;
  incidentDescription?: string;
  chronology?: string;
  witnesses?: SaksiItem[];
  directCauses?: string[];
  indirectCauses?: string[];
  rootCauses?: string[];
  recommendations?: string[];
  correctiveActions?: Array<{ action: string; responsiblePerson: string; targetDate: string; status: string }>;
  k3TeamSignature?: { name: string; position: string; date: string; signed: boolean };
  unitHeadSignature?: { name: string; position: string; date: string; signed: boolean };
  investigatorId?: number;
  investigatorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IInvestigation = Investigation;
