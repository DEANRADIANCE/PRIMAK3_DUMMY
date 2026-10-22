# PRIMA K3 — Sistem Informasi Keselamatan & Kesehatan Kerja (Klinik Pratama ANRI)

Aplikasi web admin **PRIMA K3** dibangun menggunakan **Refine** (`@refinedev/core`), **React 19**, **Vite**, **TypeScript**, dan **Ant Design** (`antd` + `@refinedev/antd`). Desain antarmuka dirancang mengikuti wireframe dan tema resmi bernuansa abu-abu netral profesional Klinik Pratama Arsip Nasional Republik Indonesia (ANRI).

---

## 1. Fitur Utama & Modul Sistem

### A. Layout Global & Navigasi
- **Header Global**:
  - Tombol hamburger (toggle collapse/expand sidebar)
  - Logo & Judul **PRIMA K3** dengan sub-judul *"Klinik Pratama ANRI"*
  - **Tombol EMERGENCY (Pil Putih)**: Membuka modal kontak darurat (Ambulans 118/119, IGD Klinik Ext 119, Damkar 113, Tim K3, Polisi, RSUD Rujukan)
  - **Profil Pengguna & Pengalih Peran (RBAC Demo Switcher)**: Mengizinkan penguji langsung berpindah peran (Admin, Tim K3, Kepala Unit, Pegawai) tanpa repot logout
- **Sidebar Kustom**: Berwarna abu-abu, menu aktif dengan blok abu lebih gelap rounded, dukungan collapse grup submenu dan drawer responsif pada perangkat mobile.
- **Breadcrumb Navigasi**: Contoh: `Dashboard > Keselamatan > Bahaya dan Resiko`.
- **Footer**: `© 2026 Klinik Pratama ANRI – PRIMA K3. Hak Cipta Dilindungi Undang-Undang.`

### B. Dashboard Manajemen K3
- **4 Kartu Ringkasan (StatCard)**:
  1. *Laporan Kecelakaan Kerja (Bulan Ini)*
  2. *Jumlah Pegawai Terdata*
  3. *Jumlah Laporan Potensi Bahaya*
  4. *Skor Kepatuhan K3 (%)*
- **Grafik & Visualisasi**:
  - Grafik batang bulanan kunjungan klinik & laporan K3
  - Bar horizontal tren penyakit terbanyak (Flu/ISPA, Maag, Radang, DBD)
  - Grafik donut distribusi jenis kecelakaan kerja
  - Tren fluktuasi insiden kecelakaan bulanan
  - Progress bar status kesehatan kerja & gauge pegawai terdata rekam medis
  - Statistik kunjungan konseling psikolog & progress MCU Laki-laki/Perempuan
- **Blok Informasi Terkini**: Menampilkan kartu featured & kartu kecil pengumuman agenda K3 teraktual.
- **Filter**: Dropdown filter dinamis Bulan dan Tahun.

### C. Modul Keselamatan Kerja
1. **Bahaya dan Resiko**:
   - Tab filter kategori: *Near Miss*, *Unsafe Action*, *Unsafe Condition*
   - Pencarian real-time, filter status (*Dilaporkan*, *Diverifikasi*, *Dalam Penanganan*, *Selesai*)
   - Modal detail laporan dan modal update status cepat
   - Form pelaporan bahaya baru dengan upload foto bukti
   - Status tracker stepper & riwayat timeline penanganan
2. **HIRADC (Manajemen Risiko)**:
   - Evaluasi Peluang (Likelihood 1–5) × Keparahan (Severity 1–5) dengan skor otomatis (L × S)
   - **Dynamic Risk Alert**: Banner peringatan otomatis berganti warna sesuai skor (1-4 Rendah hijau, 5-9 Sedang kuning, 10-16 Tinggi oranye, 17-25 Ekstrem merah)
   - **Modal Panduan Matriks 5×5 Interaktif**: Kriteria skala peluang dan keparahan
   - Hierarki pengendalian (existing vs additional control), target selesai, dan PIC
3. **Pelaporan Kecelakaan Kerja**:
   - Pencatatan data insiden (tanggal, jam, lokasi, jenis kecelakaan, kronologi, keparahan)
   - Data korban (nama, NIP, status kepegawaian **ASN / PPPK**, cedera, tindakan medis)
   - Data penanganan Tim K3
   - **Warning Durasi Pengajuan TASPEN (JKK)**: Hitung mundur otomatis sisa hari pelaporan ke PT TASPEN (ASN batas 5 hari kerja, PPPK batas 3 hari kerja), disertai color badge dan warning banner.
4. **Investigasi Insiden**:
   - Formulir resmi investigasi standar K3 (data kejadian, saksi mata, analisis penyebab langsung/tidak langsung/akar masalah 5-Why, rekomendasi & tindakan korektif)
   - Lembar tanda tangan digital Tim K3 dan Kepala Unit
   - Cetak PDF siap cetak (`@media print` rapi)
   - Ditandai dengan catatan `TODO` untuk penyesuaian dokumen acuan spesifik
5. **Inspeksi K3 (Multi-Tab Audit Terpadu)**:
   - 6 Tab: **Pemantauan Lingkungan**, **Sarpras Tanggap Darurat**, **Perilaku Kerja**, **5R**, **APD**, **Alat Kerja**
   - Checklist dinamis (*Sesuai* / *Tidak Sesuai* / *N/A*)
   - Khusus Pemantauan Lingkungan: perbandingan nilai terukur vs Nilai Ambang Batas (NAB) pencahayaan, kebisingan, suhu, kelembapan, kadar CO
   - **Kalkulasi Skor Kepatuhan Otomatis (%)** per inspeksi yang terhubung ke dashboard

### D. Modul Kesehatan
1. **Surveilans Penyakit**:
   - Halaman dengan badge label **"Data Coming Soon"**
   - Grafik tren penyakit (bar kasus terbanyak & tren fluktuasi multi-bulan)
   - Tombol impor rekam medis CSV (placeholder disabled untuk integrasi SIMRS mendatang)
2. **Konsultasi Psikolog Klinis**:
   - Terbuka untuk seluruh pegawai (semua peran)
   - Alur satu halaman tiga langkah (*Steps*):
     1. *Panduan Layanan & Jaminan Kerahasiaan Medis*
     2. *Detail Pesanan (Nama Pasien, No HP, Alasan Konsultasi)*
     3. *Pilih Jadwal (Kalender + Slot Sesi 08:00 / 13:00, slot terisi non-aktif, checkbox konfirmasi)*
   - Kerahasiaan data terjaga: alasan konsultasi diproteksi khusus bagi Psikolog/Admin

### E. Modul Media dan Informasi
1. **Pemberitahuan**:
   - Grid kartu pengumuman (tanggal agenda, lokasi, deskripsi, lampiran berkas PDF)
   - Fitur CRUD bagi Admin/Tim K3
2. **Edukasi K3**:
   - Katalog artikel edukatif keselamatan kerja dengan sidebar filter kategori (Ergonomi, Kebakaran, APD, Kesehatan Mental, Listrik)
   - Editor teks artikel dan formulir penulisan
3. **Flayer & Poster**:
   - Grid 2 kolom kartu gambar visual kampanye K3
   - Modal preview pembesaran resolusi tinggi & tombol unduh file asli

---

## 2. Akun Demo Berdasarkan Peran (RBAC)

Aplikasi telah dilengkapi `authProvider` dan `accessControlProvider` dengan 4 akun demo:

| Peran | Email | Kata Sandi | Hak Akses Utama |
|---|---|---|---|
| **Admin** | `admin@anri.go.id` | *password apa saja* | Akses penuh seluruh modul, ubah status, hapus, manajemen risiko |
| **Tim K3** | `timk3@anri.go.id` | *password apa saja* | Input & verifikasi bahaya, audit inspeksi, investigasi insiden, pengumuman |
| **Kepala Unit** | `kepalaunit@anri.go.id` | *password apa saja* | Meninjau laporan unitnya, berpartisipasi dan tanda tangan berkas investigasi |
| **Pegawai** | `pegawai@anri.go.id` | *password apa saja* | Lapor bahaya, buat laporan kecelakaan, booking konsultasi psikolog, membaca media |

> **Tips Cepat:** Di menu profil pojok kanan atas, klik avatar Anda lalu pilih peran yang ingin didemokan pada menu **PILIH PERAN DEMO (RBAC)** untuk beralih peran seketika tanpa perlu login ulang!

---

## 3. Cara Menjalankan Aplikasi

### Prasyarat:
- Node.js versi 18+ (disarankan Node.js v20 atau v24)
- npm versi 9+

### Langkah-langkah:
1. Masuk ke direktori proyek:
   ```bash
   cd PRIMA_K3_V2
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka peramban (browser) di alamat yang muncul di terminal (biasanya `http://localhost:5173`).

4. Untuk build produksi:
   ```bash
   npm run build
   ```

---

## 4. Struktur Folder Proyek

```
PRIMA_K3_V2/
├── docs/                      # Dokumentasi & panduan
├── public/                    # Aset statis & favicon
├── src/
│   ├── components/
│   │   ├── common/            # Komponen reusable (StatCard, StatusStepper, RiskBadge,
│   │   │                      # RiskMatrixModal, TaspenCountdown, EmergencyModal)
│   │   └── layout/            # CustomLayout (Header, Sidebar Abu, Breadcrumb, Footer)
│   ├── mocks/                 # Data dummy statis TypeScript realistis
│   │   ├── users.ts           # 4 Akun pengguna demo
│   │   ├── hazardReports.ts   # Data bahaya & resiko
│   │   ├── hiradc.ts          # Data HIRADC & risk score
│   │   ├── accidents.ts       # Data kecelakaan kerja & Taspen
│   │   ├── investigations.ts  # Berkas investigasi insiden
│   │   ├── inspections.ts     # Data inspeksi 6 kategori
│   │   ├── psychologist.ts    # Sesi booking & ketersediaan slot
│   │   ├── diseases.ts        # Data surveilans penyakit
│   │   ├── announcements.ts   # Pengumuman kegiatan
│   │   ├── articles.ts        # Artikel edukasi K3
│   │   ├── posters.ts         # Poster K3
│   │   ├── settings.ts        # Pengaturan batas hari Taspen & kontak darurat
│   │   └── dashboard.ts       # Data agregat dashboard
│   ├── pages/                 # Halaman aplikasi Refine
│   │   ├── login/             # Halaman login dengan tombol login cepat
│   │   ├── dashboard/         # Dashboard utama Manajemen K3
│   │   ├── keselamatan/       # Modul keselamatan (5 submodul)
│   │   ├── kesehatan/         # Modul kesehatan (Penyakit & Psikolog)
│   │   └── media-informasi/   # Modul media (Pemberitahuan, Edukasi, Poster)
│   ├── providers/
│   │   ├── authProvider.ts         # Otentikasi demo & switchRole
│   │   ├── accessControlProvider.ts# Kontrol akses berbasis peran (RBAC)
│   │   └── dataProvider.ts         # In-memory REST Refine dataProvider
│   ├── types/                 # Definisi tipe TypeScript per modul
│   ├── App.tsx                # Konfigurasi routing & resources Refine
│   ├── index.tsx              # Entry point aplikasi
│   └── index.css              # Styling global & token tema Ant Design
├── package.json
└── tsconfig.json
```

---

## 5. Panduan Migrasi ke Backend REST API Asli

Aplikasi dirancang menggunakan arsitektur modular Refine:
- Semua manipulasi data saat ini dialirkan melalui `src/providers/dataProvider.ts` berbasis in-memory store (`mockDb`).
- Ketika REST API backend Anda telah selesai dibangun, Anda cukup:
  1. Pasang data provider resmi Refine REST (misalnya `@refinedev/simple-rest`):
     ```bash
     npm install @refinedev/simple-rest
     ```
  2. Buka `src/App.tsx` dan ubah:
     ```tsx
     import dataProvider from "@refinedev/simple-rest";

     const API_URL = import.meta.env.VITE_API_URL || "https://api.k3.anri.go.id";

     <Refine dataProvider={dataProvider(API_URL)} ... />
     ```
  3. Kode halaman pada folder `src/pages/**` **TIDAK PERLU DIUBAH**, karena telah mematuhi kontrak resource standar Refine (`getList`, `getOne`, `create`, `update`, `deleteOne`).

---

## 6. Daftar Asumsi & Catatan `TODO`

1. **Dokumen Acuan Formulir Investigasi K3**: Karena tautan Google Docs eksternal memerlukan otorisasi akses pribadi, formulir investigasi dibangun mengikuti standar baku Berita Acara Investigasi Kecelakaan Kerja Permenaker & ISO 45001 (data kejadian, saksi, penyebab langsung, penyebab tidak langsung, akar masalah sistem, tindakan korektif, pengesahan Tim K3 dan Kepala Unit). Komentar `TODO` telah disematkan di kode agar dapat disesuaikan persis jika ada format borang fisik khusus ANRI.
2. **Durasi Batas Klaim TASPEN JKK**: Nilai awal disetel 5 hari kerja untuk ASN dan 3 hari kerja untuk PPPK di `settings.ts`. Nilai ini dapat disesuaikan pada konfigurasi kebijakan ANRI/PT TASPEN.
3. **Penyimpanan Data Saat Ini**: Menggunakan in-memory state TypeScript, data yang diubah atau ditambah selama aplikasi berjalan akan langsung terlihat dan terupdate di UI, namun akan kembali ke data awal jika halaman di-*hard refresh* (sesuai spesifikasi tahap tampilan UI/UX).
