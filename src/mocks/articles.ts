import { IArticle, IArticleCategory } from "../types/article";

export const initialArticleCategories: IArticleCategory[] = [
  { id: 1, name: "Semua Kategori", slug: "all" },
  { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
  { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
  { id: 4, name: "Alat Pelindung Diri (APD)", slug: "apd" },
  { id: 5, name: "Kesehatan Mental & Stres Kerja", slug: "kesehatan-mental" },
  { id: 6, name: "Keselamatan Kelistrikan", slug: "listrik" },
  { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
];

export const initialArticles: IArticle[] = [
  {
    id: 1,
    title: "Mencegah Carpal Tunnel Syndrome & Nyeri Punggung pada Pengguna Komputer Aktif",
    categoryId: 2,
    category: { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
    summary: "Panduan praktis mengatur posisi duduk, ketinggian kursi, posisi monitor, dan latihan peregangan tangan 5 menit setiap 2 jam bekerja.",
    content: `## Ergonomi Bekerja dengan Komputer di Meja Kerja

Bekerja di depan komputer selama lebih dari 6 jam sehari dapat memicu keluhan muskuloskeletal, terutama *Carpal Tunnel Syndrome* (CTS) pada pergelangan tangan dan *Low Back Pain* pada punggung bawah.

### 1. Prinsip Sudut 90 Derajat
- **Lengan**: Siku ditekuk membentuk sudut 90-100 derajat bersandar di armrest atau meja.
- **Lutut**: Kaki menapak rata di lantai dengan sudut paha dan betis 90 derajat. Gunakan footrest jika kaki menggantung.
- **Mata**: Bagian atas layar monitor harus sejajar lurus dengan arah pandang mata tanpa menunduk.

### 2. Aturan 20-20-20
Setiap 20 menit menatap layar:
- Istirahatkan mata selama 20 detik.
- Pandang objek yang berjarak minimal 20 kaki (sekitar 6 meter) di kejauhan.

### 3. Peregangan Singkat
Regangkan jari jemari, putar pergelangan tangan searah dan berlawanan arah jarum jam, lalu busungkan dada ke arah belakang secara berkala.`,
    image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Budi Santoso",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
  },
  {
    id: 2,
    title: "Mengenal Kode Warna dan Jenis Tabung APAR serta Teknik PASS",
    categoryId: 3,
    category: { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
    summary: "Jangan salah memilih media pemadam! Pahami perbedaan APAR bubuk kimia (Dry Chemical), CO2, dan busa (Foam) beserta metode PASS yang aman.",
    content: `## Memahami Penggunaan Tabung Pemadam Api Ringan (APAR)

Kebakaran dini di gedung arsip dan perkantoran dapat dipadamkan secara cepat jika personil mengerti jenis APAR dan tata cara penggunaannya.

### Klasifikasi Kebakaran
1. **Kelas A**: Kebakaran benda padat mudah terbakar (kertas, kayu, kain arsip) -> Gunakan APAR Dry Chemical atau Foam.
2. **Kelas B**: Kebakaran cairan / gas mudah menyala (bensin, thiner, cat).
3. **Kelas C**: Kebakaran akibat instalasi listrik bertegangan -> **Wajib gunakan APAR CO2 atau Dry Powder**, DILARANG menggunakan air!

### Teknik Pengoperasian PASS:
- **P (Pull)**: Tarik pin pengaman segel.
- **A (Aim)**: Arahkan corong/nozzle ke dasar pangkal api (bukan ke lidah api).
- **S (Squeeze)**: Tekan tuas pengatup secara mantap.
- **S (Sweep)**: Sapukan semprotan dari sisi ke sisi secara merata hingga api padam.`,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    author: "Siti Rahmawati",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-02-28T14:00:00Z",
    updatedAt: "2026-02-28T14:00:00Z",
  },
  {
    id: 3,
    title: "Mengelola Burnout dan Stres Beban Kerja di Lingkungan Birokrasi Modern",
    categoryId: 5,
    category: { id: 5, name: "Kesehatan Mental & Stres Kerja", slug: "kesehatan-mental" },
    summary: "Kenali sinyal kelelahan emosional, depersonalisasi, dan penurunan efikasi pribadi, serta manfaatkan program konseling psikolog internal ANRI.",
    content: `## Menjaga Kesehatan Mental di Tempat Kerja

Kesehatan kerja tidak hanya berfokus pada fisik, melainkan juga kesejahteraan psikologis pegawai.

### Gejala Umum Burnout:
1. Kelelahan fisik dan emosional berkepanjangan meskipun sudah tidur cukup.
2. Kehilangan motivasi kerja dan sinisme terhadap rekan atau pekerjaan.
3. Sulit berkonsentrasi dan sering melakukan kesalahan sepele dalam administrasi.

### Tindakan Mandiri:
- Tetapkan batasan jelas antara jam kerja dan waktu pribadi (Work-Life Boundary).
- Konsultasikan kendala kepada atasan langsung atau manfaatkan layanan konseling Klinik Pratama ANRI secara rahasia dan gratis.`,
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
    author: "Klinik Pratama ANRI",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },
  {
    id: 4,
    title: "Prosedur Evakuasi Mandiri Saat Gempa Bumi di Gedung Bertingkat ANRI",
    categoryId: 3,
    category: { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
    summary: "Langkah terpadu Drop, Cover, Hold On saat guncangan gempa, penggunaan tangga darurat evakuasi, dan larangan memakai lift.",
    content: `## Protokol Keselamatan Gempa Bumi di Gedung Perkantoran
Saat gempa bumi terjadi, keselamatan Anda bergantung pada ketenangan dan tindakan yang tepat tanpa panik.`,
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    author: "Tim Tanggap Darurat",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-02-10T11:00:00Z",
  },
  {
    id: 5,
    title: "Panduan Ergonomi Mengangkat Beban Box Arsip Statis Secara Aman",
    categoryId: 2,
    category: { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
    summary: "Gunakan kekuatan otot paha bukan pinggang saat mengangkat box arsip seberat lebih dari 10 kg untuk menghindari saraf terjepit.",
    content: `## Teknik Manual Handling Arsip
Teknik mengangkat beban berat dengan tumpuan kaki dan punggung lurus untuk melindungi tulang belakang.`,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    author: "Direktorat Preservasi",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-02-05T08:30:00Z",
    updatedAt: "2026-02-05T08:30:00Z",
  },
  {
    id: 6,
    title: "Pertolongan Pertama pada Kecelakaan (P3K) Dasar di Area Kerja",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Penanganan awal luka sayat kertas arsip, pingsan akibat dehidrasi, hingga cedera terkilir di tangga kantor sebelum bantuan medis tiba.",
    content: `## Langkah Praktis P3K Kantor
Mengenal kotak P3K dan tindakan pertama saat rekan kerja mengalami insiden medis ringan.`,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Budi Santoso",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-01-28T13:20:00Z",
    updatedAt: "2026-01-28T13:20:00Z",
  },
  {
    id: 7,
    title: "Pencahayaan Ideal dan Tips Menjaga Kesehatan Mata di Depo Arsip",
    categoryId: 2,
    category: { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
    summary: "Standar intensitas lux pencahayaan ruang baca dan ruang penyimpanan arsip untuk kenyamanan penglihatan pegawai.",
    content: `## Standar Pencahayaan Ruang Kerja
Pengaturan tata cahaya alami dan buatan yang ergonomis guna mencegah asthenopia (kelelahan mata).`,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    author: "Subbag Rumah Tangga",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-01-20T10:15:00Z",
    updatedAt: "2026-01-20T10:15:00Z",
  },
  {
    id: 8,
    title: "Manajemen Keselamatan Kelistrikan dan Penataan Kabel Rapi",
    categoryId: 6,
    category: { id: 6, name: "Keselamatan Kelistrikan", slug: "listrik" },
    summary: "Bahaya penggunaan colokan tumpuk (overload) dan bahaya tersandung kabel berserakan di kolong meja kerja kantor.",
    content: `## Bahaya Listrik di Perkantoran
Mencegah percikan arus pendek dan bahaya kebakaran listrik dengan audit rutin colokan daya.`,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    author: "Tim K3 ANRI",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: 9,
    title: "Wajib Gunakan Masker Partikulat & Sarung Tangan Nitril di Lab Restorasi",
    categoryId: 4,
    category: { id: 4, name: "Alat Pelindung Diri (APD)", slug: "apd" },
    summary: "Perlindungan maksimal pernapasan dari spora kapang dan debu kertas arsip asam abad ke-18 dan ke-19.",
    content: `## Penggunaan APD Restorasi Arsip
Standar sarung tangan nitril dan masker N95 saat membersihkan naskah arsip kuno.`,
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
    author: "Direktorat Preservasi",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-01-10T14:45:00Z",
    updatedAt: "2026-01-10T14:45:00Z",
  },
  {
    id: 10,
    title: "Postur Tubuh Dinamis: Manfaat Sit-to-Stand Desk di Meja Pelayanan",
    categoryId: 2,
    category: { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
    summary: "Mengapa bergantian posisi duduk dan berdiri setiap 45 menit meningkatkan sirkulasi darah dan mencegah varises.",
    content: `## Manfaat Meja Sit-Stand
Cara mengoptimalkan meja kerja fleksibel untuk menjaga postur tubuh tetap aktif selama jam operasional.`,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Budi Santoso",
    isPublished: true,
    status: "Terbit",
    createdAt: "2026-01-05T08:00:00Z",
    updatedAt: "2026-01-05T08:00:00Z",
  },
  {
    id: 11,
    title: "Mendeteksi Gangguan Kecemasan (Anxiety) dan Penanganannya",
    categoryId: 5,
    category: { id: 5, name: "Kesehatan Mental & Stres Kerja", slug: "kesehatan-mental" },
    summary: "Mengenali gejala palpitasi, sesak napas psikogenik, dan cara melakukan teknik grounding 5-4-3-2-1 saat cemas di kantor.",
    content: `## Mengatasi Kecemasan di Lingkungan Kerja
Teknik relaksasi grounding dan dukungan tim untuk rekan yang mengalami serangan panik.`,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    author: "Layanan Konseling Psikologi",
    isPublished: true,
    status: "Terbit",
    createdAt: "2025-12-28T11:30:00Z",
    updatedAt: "2025-12-28T11:30:00Z",
  },
  {
    id: 12,
    title: "Pedoman Kebugaran Jasmani Pegawai: Senam Peregangan Rutin Jam 10 Pagi",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Gerakan senam ringan 7 menit di lorong gedung untuk meregangkan otot leher, bahu, pinggang, dan betis.",
    content: `## Senam Kerja ANRI Bugar
Jadwal dan panduan gerakan senam peregangan mandiri di meja kerja setiap hari kerja.`,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    author: "Klinik Pratama ANRI",
    isPublished: true,
    status: "Terbit",
    createdAt: "2025-12-20T10:00:00Z",
    updatedAt: "2025-12-20T10:00:00Z",
  },
  {
    id: 13,
    title: "Etika Batuk dan Bersin serta Pencegahan Penularan ISPA di Ruang Ber-AC",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Gunakan lengan atas dalam saat batuk dan cuci tangan teratur dengan sabun antiseptik di wastafel kantor.",
    content: `## Higienitas Saluran Napas
Protokol kebersihan tangan dan etika batuk di ruangan berpendingin sentral gedung ANRI.`,
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80",
    author: "Tim Promosi Kesehatan",
    isPublished: true,
    status: "Terbit",
    createdAt: "2025-12-15T09:15:00Z",
    updatedAt: "2025-12-15T09:15:00Z",
  },
  {
    id: 14,
    title: "Bahaya Menahan Buang Air Kecil saat Lembur dan Pencegahan Infeksi Saluran Kemih",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Pastikan asupan cairan 2 liter per hari dan jangan abaikan panggilan buang air kecil saat menyelesaikan laporan dinas.",
    content: `## Hidrasi Sehat Pegawai
Tips menjaga asupan air putih hangat dan pola buang air teratur bagi staf administrasi.`,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    author: "Dr. Budi Santoso",
    isPublished: true,
    status: "Terbit",
    createdAt: "2025-12-10T14:00:00Z",
    updatedAt: "2025-12-10T14:00:00Z",
  },
  {
    id: 15,
    title: "Pencegahan Risiko Tertimpa Benda Jatuh di Gudang Logistik dan Depo Arsip",
    categoryId: 4,
    category: { id: 4, name: "Alat Pelindung Diri (APD)", slug: "apd" },
    summary: "Aturan penempatan beban berat di rak paling bawah dan kewajiban helm keselamatan (safety helmet) saat perapihan rak tinggi.",
    content: `## Keselamatan Pergudangan Arsip
Prinsip penyimpanan aman dan pemakaian helm pelindung kepala di area rak bertingkat.`,
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
    author: "Tim Keselamatan Kerja",
    isPublished: true,
    status: "Terbit",
    createdAt: "2025-12-05T08:30:00Z",
    updatedAt: "2025-12-05T08:30:00Z",
  },
  // Item berstatus Draf
  {
    id: 16,
    title: "Konsep Zero Accident di Seluruh Lingkungan Gedung ANRI (Draft Pedoman)",
    categoryId: 3,
    category: { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
    summary: "Rancangan pedoman komprehensif target nihil kecelakaan kerja tahun 2026-2027 yang sedang dalam tahap uji telaah internal.",
    content: `## Draft Pedoman Nihil Kecelakaan
Materi rancangan kebijakan K3 terpadu yang masih menunggu persetujuan pimpinan unit kerja.`,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    author: "Tim K3 ANRI",
    isPublished: false,
    status: "Draf",
    createdAt: "2026-03-01T15:00:00Z",
    updatedAt: "2026-03-01T15:00:00Z",
  },
  {
    id: 17,
    title: "Draft SOP Pengoperasian Mesin Shredder Dokumen Rahasia Skala Besar",
    categoryId: 4,
    category: { id: 4, name: "Alat Pelindung Diri (APD)", slug: "apd" },
    summary: "Petunjuk teknis pengoperasian alat pemusnah kertas, perlindungan dasi/rambut panjang, dan kacamata pelindung dari debu kertas tajam.",
    content: `## Standar Operasional Mesin Cacah
Rancangan SOP keselamatan kerja operator mesin penghancur arsip inaktif.`,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    author: "Direktorat Akuisisi",
    isPublished: false,
    status: "Draf",
    createdAt: "2026-02-27T10:15:00Z",
    updatedAt: "2026-02-27T10:15:00Z",
  },
  {
    id: 18,
    title: "Rancangan Panduan Nutrisi Sehat untuk Pegawai Shift Malam Pengamanan Gedung",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Pola makan bergizi seimbang, pembatasan kafein berlebih, dan jadwal camilan sehat bagi personil satpam shift dini hari.",
    content: `## Pola Hidup Sehat Petugas Keamanan
Tips menjaga kebugaran jantung dan kestabilan gula darah bagi personil jaga malam.`,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    author: "Klinik Pratama ANRI",
    isPublished: false,
    status: "Draf",
    createdAt: "2026-02-22T14:30:00Z",
    updatedAt: "2026-02-22T14:30:00Z",
  },
  // Item berstatus Dijadwalkan
  {
    id: 19,
    title: "Persiapan Menghadapi Musim Pancaroba: Sosialisasi Vaksinasi Influenza Gratis Pegawai",
    categoryId: 7,
    category: { id: 7, name: "Pencegahan Penyakit", slug: "penyakit" },
    summary: "Informasi jadwal pendaftaran dan alur skrining vaksinasi influenza musiman di Klinik Pratama ANRI bulan April 2026.",
    content: `## Program Vaksinasi Influenza Tahunan ANRI
Jadwal penyuntikan vaksin dan kriteria pegawai yang diprioritaskan menerima imunisasi.`,
    image: "https://images.unsplash.com/photo-1632053001859-994367c3cae8?auto=format&fit=crop&w=800&q=80",
    author: "Klinik Pratama ANRI",
    isPublished: false,
    status: "Dijadwalkan",
    scheduledAt: "2026-03-15T08:00:00Z",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: 20,
    title: "Simulasi Kebakaran Gabungan Gedung ANRI & Dinas Pemadam Kebakaran Jaksel",
    categoryId: 3,
    category: { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
    summary: "Pengumuman gladi evakuasi skala penuh, pembunyian sirine darurat berkala, dan penutupan sementara akses lobi utama.",
    content: `## Gladi Evakuasi Akbar Gedung ANRI
Pemberitahuan resmi simulasi tanggap darurat yang dijadwalkan tayang mendekati hari pelaksanaan latihan.`,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    author: "Tim Tanggap Darurat",
    isPublished: false,
    status: "Dijadwalkan",
    scheduledAt: "2026-03-20T07:30:00Z",
    createdAt: "2026-02-26T11:00:00Z",
    updatedAt: "2026-02-26T11:00:00Z",
  },
];
