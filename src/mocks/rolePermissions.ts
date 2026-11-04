import {
  SystemRole,
  IPermissionItem,
  RolePermissionsMatrix,
} from "../types/userManagement";

export const SYSTEM_ROLES: SystemRole[] = [
  "Super Admin",
  "Pegawai",
  "Pimpinan Unit Kerja",
  "Kepala Biro KU",
  "Pengelola K3",
  "Psikolog",
  "Admin Sistem",
];

export const PERMISSION_DEFINITIONS: IPermissionItem[] = [
  // ==========================================
  // 1. DASHBOARD
  // ==========================================
  {
    code: "page.dashboard",
    name: "Halaman Dashboard",
    category: "DASHBOARD",
    isPage: true,
    pageRoute: "/dashboard",
    description: "Membuka halaman ringkasan dan statistik utama PRIMA K3",
  },
  {
    code: "dashboard.lihat_kesehatan",
    name: "Lihat Ringkasan Kesehatan",
    category: "DASHBOARD",
    description: "Melihat kartu status dan statistik kesehatan kerja pada dashboard",
  },

  // ==========================================
  // 2. KESELAMATAN (Halaman & Aksi)
  // ==========================================
  {
    code: "page.keselamatan",
    name: "Modul Menu Keselamatan",
    category: "KESELAMATAN",
    isPage: true,
    description: "Menampilkan grup menu Keselamatan pada bilah navigasi sidebar",
  },
  {
    code: "page.bahaya_resiko",
    name: "Halaman Bahaya dan Resiko",
    category: "KESELAMATAN",
    isPage: true,
    pageRoute: "/keselamatan/bahaya-resiko",
    description: "Melihat dan mengelola daftar pelaporan potensi bahaya & risiko kerja",
  },
  {
    code: "page.hiradc",
    name: "Halaman HIRADC",
    category: "KESELAMATAN",
    isPage: true,
    pageRoute: "/keselamatan/hiradc",
    description: "Melihat dan menyusun dokumen Hazard Identification, Risk Assessment and Determining Control",
  },
  {
    code: "page.investigasi",
    name: "Halaman Investigasi",
    category: "KESELAMATAN",
    isPage: true,
    pageRoute: "/keselamatan/investigasi",
    description: "Membuka halaman rekapitulasi berkas investigasi insiden K3",
  },
  {
    code: "page.kecelakaan",
    name: "Halaman Pelaporan Kecelakaan",
    category: "KESELAMATAN",
    isPage: true,
    pageRoute: "/keselamatan/kecelakaan",
    description: "Membuka halaman dan formulir pelaporan kecelakaan kerja resmi",
  },
  {
    code: "page.inspeksi",
    name: "Halaman Inspeksi K3",
    category: "KESELAMATAN",
    isPage: true,
    pageRoute: "/keselamatan/inspeksi",
    description: "Membuka halaman pelaksanaan dan audit inspeksi keselamatan kerja",
  },
  {
    code: "laporan.buat",
    name: "Buat Laporan Insiden & Bahaya",
    category: "KESELAMATAN",
    description: "Mengisi dan mengirim formulir pelaporan bahaya atau kecelakaan",
  },
  {
    code: "laporan.lihat_semua",
    name: "Lihat Semua Laporan Keselamatan",
    category: "KESELAMATAN",
    description: "Melihat seluruh data laporan keselamatan dari semua unit kerja",
  },
  {
    code: "investigasi.kelola",
    name: "Susun & Ubah Investigasi",
    category: "KESELAMATAN",
    description: "Menyusun fakta temuan, analisis akar masalah, dan rencana tindakan",
  },
  {
    code: "laporan.periksa",
    name: "Periksa & Sahkan Laporan",
    category: "KESELAMATAN",
    description: "Meninjau laporan investigasi dan memberikan tanda pengesahan/verifikasi",
  },
  {
    code: "laporan.ekspor",
    name: "Ekspor / Cetak PDF Laporan",
    category: "KESELAMATAN",
    description: "Mengunduh atau mencetak berkas investigasi dan laporan dalam format PDF",
  },

  // ==========================================
  // 3. KESEHATAN (Halaman & Aksi)
  // ==========================================
  {
    code: "page.kesehatan",
    name: "Modul Menu Kesehatan",
    category: "KESEHATAN",
    isPage: true,
    description: "Menampilkan grup menu Kesehatan pada bilah navigasi sidebar",
  },
  {
    code: "page.penyakit",
    name: "Halaman Penyakit",
    category: "KESEHATAN",
    isPage: true,
    pageRoute: "/kesehatan/penyakit",
    description: "Melihat direktori jenis penyakit dan panduan kesehatan kerja",
  },
  {
    code: "page.konsultasi",
    name: "Halaman Konsultasi Psikolog",
    category: "KESEHATAN",
    isPage: true,
    pageRoute: "/kesehatan/konsultasi",
    description: "Membuka riwayat permohonan dan jadwal konsultasi psikologi kerja",
  },
  {
    code: "konseling.ajukan",
    name: "Ajukan Konseling Mandiri",
    category: "KESEHATAN",
    description: "Mengajukan sesi konsultasi psikologi atas inisiatif pribadi",
  },
  {
    code: "konseling.rujuk_wajib",
    name: "Rujuk Konseling Wajib",
    category: "KESEHATAN",
    description: "Menerbitkan surat rujukan konsultasi psikologis wajib untuk staf",
  },
  {
    code: "konseling.atur_jadwal",
    name: "Atur Jadwal Konseling",
    category: "KESEHATAN",
    description: "Menetapkan waktu, tempat, dan penerimaan sesi konsultasi konseling",
  },
  {
    code: "konseling.lihat_catatan",
    name: "Lihat Catatan Sesi Rahasia",
    category: "KESEHATAN",
    isLocked: true,
    lockedRoles: ["Psikolog"],
    description: "Melihat rekam medis & catatan observasi sesi (khusus psikolog)",
  },

  // ==========================================
  // 4. MEDIA & INFORMASI (Halaman & Aksi)
  // ==========================================
  {
    code: "page.media_informasi",
    name: "Modul Menu Media & Informasi",
    category: "MEDIA & INFORMASI",
    isPage: true,
    description: "Menampilkan grup menu Media & Informasi pada navigasi sidebar",
  },
  {
    code: "page.pemberitahuan",
    name: "Halaman Pemberitahuan",
    category: "MEDIA & INFORMASI",
    isPage: true,
    pageRoute: "/media/pemberitahuan",
    description: "Membuka halaman siaran informasi dan notifikasi edaran K3",
  },
  {
    code: "page.edukasi",
    name: "Halaman Edukasi & Poster",
    category: "MEDIA & INFORMASI",
    isPage: true,
    pageRoute: "/media/edukasi",
    description: "Membuka repositori artikel edukasi K3, infografis, dan poster digital",
  },
  {
    code: "pengumuman.kelola",
    name: "Kelola Pengumuman & Konten Media",
    category: "MEDIA & INFORMASI",
    description: "Membuat, memperbarui, atau menghapus materi pengumuman dan edukasi",
  },

  // ==========================================
  // 5. ADMINISTRASI & KELOLA USER (Halaman & Aksi)
  // ==========================================
  {
    code: "page.kelola_user",
    name: "Modul Menu Kelola User",
    category: "ADMINISTRASI",
    isPage: true,
    description: "Menampilkan grup menu Kelola User pada navigasi sidebar",
  },
  {
    code: "pengguna.kelola",
    name: "Halaman Manajemen Pengguna",
    category: "ADMINISTRASI",
    isPage: true,
    pageRoute: "/kelola-user/pengguna",
    requiredRoles: ["Admin Sistem"],
    description: "Menambah, mengedit, mengundang, atau menonaktifkan akun user",
  },
  {
    code: "hakakses.kelola",
    name: "Halaman Hak Akses User",
    category: "ADMINISTRASI",
    isPage: true,
    pageRoute: "/kelola-user/hak-akses",
    requiredRoles: ["Admin Sistem"],
    description: "Mengatur matriks izin akses per halaman dan per fitur untuk setiap peran",
  },
  {
    code: "masterdata.kelola",
    name: "Halaman Master Data (Super Admin)",
    category: "ADMINISTRASI",
    isPage: true,
    pageRoute: "/master-data",
    isLocked: true,
    lockedRoles: ["Super Admin"],
    requiredRoles: ["Super Admin"],
    description: "Mengakses dan mengelola seluruh master data sistem K3 (khusus Super Admin)",
  },
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMatrix = {
  "Super Admin": PERMISSION_DEFINITIONS.map((p) => p.code),

  Pegawai: [
    "page.dashboard",
    "page.keselamatan",
    "page.bahaya_resiko",
    "page.hiradc",
    "page.kecelakaan",
    "laporan.buat",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "konseling.ajukan",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
  ],

  "Pimpinan Unit Kerja": [
    "page.dashboard",
    "dashboard.lihat_kesehatan",
    "page.keselamatan",
    "page.bahaya_resiko",
    "page.hiradc",
    "page.investigasi",
    "page.kecelakaan",
    "page.inspeksi",
    "laporan.buat",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
  ],

  "Kepala Biro KU": [
    "page.dashboard",
    "dashboard.lihat_kesehatan",
    "page.keselamatan",
    "page.bahaya_resiko",
    "page.hiradc",
    "page.investigasi",
    "page.kecelakaan",
    "page.inspeksi",
    "laporan.lihat_semua",
    "laporan.periksa",
    "laporan.ekspor",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
  ],

  "Pengelola K3": [
    "page.dashboard",
    "dashboard.lihat_kesehatan",
    "page.keselamatan",
    "page.bahaya_resiko",
    "page.hiradc",
    "page.investigasi",
    "page.kecelakaan",
    "page.inspeksi",
    "laporan.lihat_semua",
    "laporan.buat",
    "investigasi.kelola",
    "laporan.periksa",
    "laporan.ekspor",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "konseling.ajukan",
    "konseling.rujuk_wajib",
    "konseling.atur_jadwal",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
    "pengumuman.kelola",
  ],

  Psikolog: [
    "page.dashboard",
    "dashboard.lihat_kesehatan",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "konseling.atur_jadwal",
    "konseling.lihat_catatan",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
  ],

  "Admin Sistem": [
    "page.dashboard",
    "dashboard.lihat_kesehatan",
    "page.keselamatan",
    "page.bahaya_resiko",
    "page.hiradc",
    "page.investigasi",
    "page.kecelakaan",
    "page.inspeksi",
    "laporan.lihat_semua",
    "laporan.ekspor",
    "page.kesehatan",
    "page.penyakit",
    "page.konsultasi",
    "page.media_informasi",
    "page.pemberitahuan",
    "page.edukasi",
    "pengumuman.kelola",
    "page.kelola_user",
    "pengguna.kelola",
    "hakakses.kelola",
  ],
};

const PERMISSIONS_STORAGE_KEY = "prima_k3_role_permissions";
const PERMISSIONS_STORAGE_VER_KEY = "prima_k3_role_permissions_ver";
const CURRENT_PERMISSIONS_VERSION = "2.2_master_data";

/**
 * Normalisasi role dari berbagai format (RBAC lama/baru) ke SystemRole
 */
export const toSystemRole = (role?: string | null): SystemRole => {
  if (!role) return "Pegawai";
  const normalized = role.toLowerCase().trim();

  if (
    normalized === "super admin" ||
    normalized === "super_admin" ||
    normalized === "superadmin" ||
    normalized.includes("super")
  ) {
    return "Super Admin";
  }
  if (normalized === "admin" || normalized === "admin sistem" || normalized === "admin_sistem") {
    return "Admin Sistem";
  }
  if (normalized === "tim_k3" || normalized === "pengelola k3" || normalized === "pengelola_k3") {
    return "Pengelola K3";
  }
  if (
    normalized === "kepala_unit" ||
    normalized === "pimpinan unit kerja" ||
    normalized === "pimpinan_unit_kerja" ||
    normalized === "pimpinan unit"
  ) {
    return "Pimpinan Unit Kerja";
  }
  if (
    normalized === "kepala biro ku" ||
    normalized === "kepala_biro_ku" ||
    normalized === "biro ku"
  ) {
    return "Kepala Biro KU";
  }
  if (normalized === "psikolog") {
    return "Psikolog";
  }
  return "Pegawai";
};

/**
 * Mengambil matriks hak akses dari localStorage atau fallback ke DEFAULT_ROLE_PERMISSIONS.
 * Dilengkapi auto-migrasi jika versi hak akses diperbarui (misal penambahan hak akses per page).
 */
export const getStoredRolePermissions = (): RolePermissionsMatrix => {
  if (typeof window === "undefined") return { ...DEFAULT_ROLE_PERMISSIONS };

  const currentVer = localStorage.getItem(PERMISSIONS_STORAGE_VER_KEY);
  const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);

  // Belum pernah tersimpan sama sekali
  if (!raw) {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    localStorage.setItem(PERMISSIONS_STORAGE_VER_KEY, CURRENT_PERMISSIONS_VERSION);
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }

  try {
    const parsed: RolePermissionsMatrix = JSON.parse(raw);

    // Jika versi berbeda atau belum memiliki page permissions, gabungkan default page permissions
    if (currentVer !== CURRENT_PERMISSIONS_VERSION) {
      const merged: RolePermissionsMatrix = { ...DEFAULT_ROLE_PERMISSIONS };

      SYSTEM_ROLES.forEach((role) => {
        const storedList = parsed[role] || [];
        const defaultList = DEFAULT_ROLE_PERMISSIONS[role] || [];
        // Gabungkan izin bawaan baru dengan perubahan yang mungkin sudah ada
        const combined = Array.from(new Set([...defaultList, ...storedList]));
        merged[role] = combined;
      });

      // Simpan hasil migrasi
      saveStoredRolePermissions(merged);
      localStorage.setItem(PERMISSIONS_STORAGE_VER_KEY, CURRENT_PERMISSIONS_VERSION);
      return merged;
    }

    return {
      ...DEFAULT_ROLE_PERMISSIONS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_ROLE_PERMISSIONS };
  }
};

/**
 * Menyimpan matriks hak akses dengan validasi ketat (UI & data handler)
 */
export const saveStoredRolePermissions = (matrix: RolePermissionsMatrix): RolePermissionsMatrix => {
  const sanitized: RolePermissionsMatrix = { ...matrix };

  for (const role of SYSTEM_ROLES) {
    const list = new Set(sanitized[role] || []);

    // 0. Aturan Khusus: Super Admin selalu memiliki semua hak akses
    if (role === "Super Admin") {
      PERMISSION_DEFINITIONS.forEach((p) => list.add(p.code));
    }

    // 1. Aturan Khusus: konseling.lihat_catatan HANYA untuk Psikolog dan Super Admin
    if (role === "Psikolog" || role === "Super Admin") {
      list.add("konseling.lihat_catatan");
    } else {
      list.delete("konseling.lihat_catatan");
    }

    // 2. Aturan Khusus: Admin Sistem tidak boleh kehilangan modul kelola user
    if (role === "Admin Sistem") {
      list.add("page.kelola_user");
      list.add("pengguna.kelola");
      list.add("hakakses.kelola");
    }

    // 3. Aturan Khusus: masterdata.kelola HANYA untuk Super Admin
    if (role === "Super Admin") {
      list.add("masterdata.kelola");
    } else {
      list.delete("masterdata.kelola");
    }

    sanitized[role] = Array.from(list);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));
    localStorage.setItem(PERMISSIONS_STORAGE_VER_KEY, CURRENT_PERMISSIONS_VERSION);
    window.dispatchEvent(new CustomEvent("prima_permissions_updated", { detail: sanitized }));
  }
  return sanitized;
};

/**
 * Reset matriks hak akses ke bawaan
 */
export const resetStoredRolePermissions = (): RolePermissionsMatrix => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    localStorage.setItem(PERMISSIONS_STORAGE_VER_KEY, CURRENT_PERMISSIONS_VERSION);
    window.dispatchEvent(new CustomEvent("prima_permissions_updated", { detail: DEFAULT_ROLE_PERMISSIONS }));
  }
  return { ...DEFAULT_ROLE_PERMISSIONS };
};

/**
 * Helper untuk memeriksa apakah suatu role memiliki permission code tertentu
 */
export const hasRolePermission = (role: string | null | undefined, permissionCode: string): boolean => {
  const systemRole = toSystemRole(role);
  if (systemRole === "Super Admin") return true;

  const matrix = getStoredRolePermissions();
  const perms = matrix[systemRole] || [];
  return perms.includes(permissionCode);
};
