import { IInvestigation } from "../types/investigation";

export const initialInvestigations: IInvestigation[] = [
  {
    id: 1,
    relatedReportId: 1,
    relatedReportType: "accident",
    relatedReportNumber: "ACC-2026-001",
    incidentDate: "2026-03-04",
    incidentTime: "10:15",
    incidentLocation: "Tangga Utama Gedung B Lantai 1 Menuju Lantai 2",
    incidentDescription: "Insiden terpeleset saat menuruni tangga membawa berkas tebal, mengakibatkan cedera sprain pergelangan kaki kanan.",
    chronology: "Pukul 10.10 WIB korban membawa map tebal setinggi dada sehingga pandangan ke anak tangga sedikit terhalang. Di anak tangga ke-4 dari bawah, sisa air pembersih lantai belum kering sempurna dan tidak ada sign penanda basah. Korban kehilangan traksi dan tergelincir mendarat di bordes tangga.",
    witnesses: [
      {
        name: "Nurul Hidayati, S.AP.",
        position: "Arsiparis Pertama",
        unit: "Direktorat Pelayanan dan Informasi",
        statement: "Saya berjalan sekitar 3 meter di belakang korban. Korban berjalan dengan kecepatan normal, namun mendadak kakinya meluncur ke depan karena lantai licin berkilat.",
      },
      {
        name: "Yanto (Petugas Kebersihan)",
        position: "Cleaning Service",
        unit: "Subbagian Rumah Tangga dan Sarpras",
        statement: "Pengepelan selesai pukul 10.05 WIB. Papan peringatan 'Lantai Basah' sedang dipakai di toilet lantai 1 sehingga belum sempat dipasang di tangga.",
      },
    ],
    directCauses: [
      "Permukaan anak tangga licin akibat residu deterjen pembersih lantai yang basah",
      "Korban membawa tumpukan dokumen tebal yang menghalangi pandangan kaki",
    ],
    indirectCauses: [
      "Kurangnya ketersediaan sign peringatan 'Lantai Licin' di setiap lantai",
      "Jadwal pembersihan basah (wet mopping) dilakukan pada jam sibuk mobilitas pegawai (10.00 WIB)",
    ],
    rootCauses: [
      "Belum adanya SOP penjadwalan pembersihan basah khusus di luar jam sibuk (sebelum pukul 07.30 atau setelah 16.30)",
      "Ketidakcukupan sarana rambu keselamatan kerja portabel bagi tim kebersihan",
    ],
    recommendations: [
      "Revisi jadwal pembersihan basah tangga dan koridor utama hanya boleh dilakukan sebelum jam 07.30 WIB",
      "Pemasangan anti-slip rubber strip (step nosing) di seluruh anak tangga Gedung A, B, dan C",
      "Pengadaan minimal 2 unit standing warning sign per lantai",
    ],
    correctiveActions: [
      {
        action: "Pemasangan strip anti-slip di anak tangga Gedung B",
        responsiblePerson: "Ahmad Fauzi (Sarpras)",
        targetDate: "2026-03-18",
        status: "Selesai",
      },
      {
        action: "Penerbitan Surat Edaran SOP Jam Pembersihan Gedung ANRI",
        responsiblePerson: "Siti Rahmawati (Tim K3)",
        targetDate: "2026-03-20",
        status: "Dalam Proses",
      },
      {
        action: "Pengadaan 12 unit folding caution wet floor sign",
        responsiblePerson: "Ir. Hendra Gunawan",
        targetDate: "2026-03-25",
        status: "Dalam Proses",
      },
    ],
    k3TeamSignature: {
      name: "Siti Rahmawati, S.Tr.Kes",
      position: "Koordinator Tim K3",
      date: "2026-03-05",
      signed: true,
    },
    unitHeadSignature: {
      name: "Ir. Hendra Gunawan, M.M.",
      position: "Kepala Direktorat Pengolahan Arsip",
      date: "2026-03-05",
      signed: true,
    },
    status: "in_progress",
    investigatorId: 2,
    investigatorName: "Siti Rahmawati, S.Tr.Kes",
    createdAt: "2026-03-04T15:00:00Z",
    updatedAt: "2026-03-05T14:00:00Z",
  },
];
