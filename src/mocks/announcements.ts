import { IAnnouncement } from "../types/announcement";

export const initialAnnouncements: IAnnouncement[] = [
  {
    id: 1,
    title: "Pelaksanaan Pemeriksaan Kesehatan Berkala (Medical Check-Up) Pegawai ANRI Tahun 2026",
    date: "2026-03-01",
    eventDate: "2026-03-24 s.d. 2026-03-26",
    location: "Auditorium Noerhadi Magetsari & Klinik Pratama ANRI",
    description: "Seluruh pegawai ASN dan PPPK di lingkungan ANRI diwajibkan mengikuti MCU berkala yang mencakup pemeriksaan darah lengkap, rekam jantung (EKG), rontgen dada, dan konsultasi dokter.",
    content: `Yth. Bapak/Ibu Seluruh Pegawai ANRI,

Dalam rangka pemantauan status kesehatan kerja dan pencegahan dini penyakit akibat kerja (PAK), Klinik Pratama ANRI bersama Laboratorium Prodia akan menyelenggarakan Medical Check-Up (MCU) Berkala dengan ketentuan:

1. Waktu: 24 - 26 Maret 2026, Pukul 07.30 - 12.00 WIB
2. Tempat: Gedung A Lantai 2 (Auditorium Noerhadi Magetsari)
3. Persyaratan: Puasa 10-12 jam sebelum pengambilan darah (hanya diperkenankan minum air putih).

Jadwal pembagian per unit kerja dapat diunduh pada lampiran terlampir.`,
    attachments: ["Jadwal_MCU_Pegawai_ANRI_2026.pdf"],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Dr. Budi Santoso",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-01T08:00:00Z",
  },
  {
    id: 2,
    title: "Simulasi Evakuasi Tanggap Darurat Kebakaran dan Gempa Bumi",
    date: "2026-03-05",
    eventDate: "2026-03-28 Pukul 09.30 WIB",
    location: "Titik Kumpul (Assembly Point) Lapangan Upacara ANRI",
    description: "Kegiatan simulasi kesiapsiagaan seluruh penghuni gedung terhadap ancaman bencana gempa dan kebakaran bersama Tim Damkar Jakarta Selatan.",
    content: `Pemberitahuan kepada seluruh penghuni gedung ANRI:

Akan dilaksanakan Gladi Resik Simulasi Tanggap Darurat Bencana. Saat sirine tanda bahaya berbunyi panjang 3 kali, dimohon seluruh pegawai:
1. Menunduk dan berlindung di bawah meja (Drop, Cover, Hold On).
2. Segera berjalan cepat (tidak berlari) melalui tangga darurat menuju titik kumpul lapangan upacara.
3. Mengikuti instruksi Floor Warden masing-masing lantai.`,
    attachments: ["Peta_Jalur_Evakuasi_Gedung_ANRI.pdf"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Siti Rahmawati",
    createdAt: "2026-03-05T09:00:00Z",
    updatedAt: "2026-03-05T09:00:00Z",
  },
  {
    id: 3,
    title: "Vaksinasi Influenza Tahunan & Pemberian Multivitamin Pegawai",
    date: "2026-02-20",
    eventDate: "2026-02-25 s.d. 2026-02-27",
    location: "Ruang Tindakan Klinik Pratama ANRI",
    description: "Layanan vaksinasi influenza kuadrivalen gratis untuk meningkatkan imunitas pegawai menghadapi musim pancaroba.",
    content: `Program imunitas pegawai ANRI: Layanan vaksinasi influenza kuadrivalen batch 1 telah dibuka pendaftarannya melalui Klinik Pratama ANRI. Kuota terbatas 150 dosis.`,
    attachments: [],
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Dr. Budi Santoso",
    createdAt: "2026-02-20T10:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
];
