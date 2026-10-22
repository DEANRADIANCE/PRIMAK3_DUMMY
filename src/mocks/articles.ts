import { IArticle, IArticleCategory } from "../types/article";

export const initialArticleCategories: IArticleCategory[] = [
  { id: 1, name: "Semua Kategori", slug: "all" },
  { id: 2, name: "Ergonomi Perkantoran", slug: "ergonomi" },
  { id: 3, name: "Tanggap Darurat & Kebakaran", slug: "kebakaran" },
  { id: 4, name: "Alat Pelindung Diri (APD)", slug: "apd" },
  { id: 5, name: "Kesehatan Mental & Stres Kerja", slug: "kesehatan-mental" },
  { id: 6, name: "Keselamatan Kelistrikan", slug: "listrik" },
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
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },
];
