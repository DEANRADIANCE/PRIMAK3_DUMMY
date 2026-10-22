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
  {
    id: 4,
    title: "Program Ergonomi Kerja & Senam Peregangan Jam 10 & 14 WIB di Seluruh Lantai",
    date: "2026-03-10",
    eventDate: "Mulai 15 Maret 2026 (Setiap Hari Kerja)",
    location: "Ruang Kerja Seluruh Unit ANRI",
    description: "Pencegahan keluhan muskuloskeletal (Low Back Pain & Carpal Tunnel) melalui panduan peregangan aktif 5 menit bersertifikasi K3.",
    content: `Yth. Seluruh Pegawai ANRI,

Berdasarkan data surveillance kesehatan kerja Klinik Pratama ANRI, keluhan Myalgia dan kekakuan leher merupakan salah satu gangguan kesehatan tertinggi pada pekerja kantoran.

Tim K3 ANRI meluncurkan program peregangan mandiri:
1. Waktu pelaksanaan: Pukul 10.00 WIB dan 14.00 WIB (disertai pengingat audio visual).
2. Durasinya: Cukup 3-5 menit di meja kerja masing-masing.
3. Gerakan peregangan: Leher, pundak, pergelangan tangan, dan pinggang.

Panduan poster dan video peraga peregangan ergonomis dapat diakses pada materi edukasi K3.`,
    attachments: ["Panduan_Ergonomi_Peregangan_ANRI.pdf"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Siti Rahmawati",
    createdAt: "2026-03-10T08:30:00Z",
    updatedAt: "2026-03-10T08:30:00Z",
  },
  {
    id: 5,
    title: "Hasil Inspeksi Higiene & Sanitasi Ruang Kerja dan Kantin Gedung ANRI",
    date: "2026-03-12",
    eventDate: "Berlaku Efektif Maret - Juni 2026",
    location: "Kantin Sehat Gedung C & Seluruh Pantry ANRI",
    description: "Laporan hasil pengujian kualitas air minum, ventilasi udara, dan kelayakan makanan kantin demi menunjang kenyamanan lingkungan kerja.",
    content: `Tim Inspeksi Keselamatan dan Kesehatan Lingkungan Kerja telah merampungkan audit sanitasi triwulanan:
1. Seluruh dispenser air minum telah melalui pembersihan ozonisasi dan uji mikrobiologi (Hasil: 100% Layak Minum).
2. Peningkatan filtrasi sirkulasi AC di ruang arsip dan ruang kerja staff.
3. Sertifikasi higienis bagi seluruh pengelola tenant kantin ANRI.

Mari bersama menjaga kebersihan ruang kerja dan membuang sampah sesuai pemilahan organik dan anorganik.`,
    attachments: ["Laporan_Sanitasi_Kantin_ANRI_2026.pdf"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Siti Rahmawati",
    createdAt: "2026-03-12T11:00:00Z",
    updatedAt: "2026-03-12T11:00:00Z",
  },
  {
    id: 6,
    title: "Layanan Hotline Konseling & Telekonsultasi Psikologi Kerja Klinik ANRI",
    date: "2026-03-15",
    eventDate: "Setiap Senin s.d. Jumat (08.30 - 15.30 WIB)",
    location: "Ruang Konseling Lantai 1 & Aplikasi Online PRIMA K3",
    description: "Dukungan kesehatan mental dan manajemen stres kerja secara privat, terpercaya, dan bebas biaya bagi seluruh pegawai ANRI.",
    content: `Kesehatan kerja yang paripurna mencakup kesehatan fisik dan mental yang seimbang.

Klinik Pratama ANRI menyediakan fasilitas konseling psikolog kerja profesional:
- Pendampingan stres kerja, burnout, kecemasan, dan adaptasi beban kerja.
- Konsultasi bersifat 100% rahasia (*confidential*) dan dilindungi etika profesi psikolog.
- Reservasi dapat dilakukan langsung melalui tab Konsultasi Psikolog di PRIMA K3.`,
    attachments: [],
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    createdBy: "Dr. Budi Santoso",
    createdAt: "2026-03-15T09:15:00Z",
    updatedAt: "2026-03-15T09:15:00Z",
  },
];
