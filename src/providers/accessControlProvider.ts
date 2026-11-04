import { AccessControlProvider } from "@refinedev/core";
import { getStoredUser } from "./authProvider";
import {
  toSystemRole,
  getStoredRolePermissions,
  hasRolePermission,
} from "../mocks/rolePermissions";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const user = getStoredUser();
    const systemRole = toSystemRole(user?.role);

    // Super Admin selalu memiliki hak akses penuh ke seluruh resource dan aksi
    if (
      systemRole === "Super Admin" ||
      user?.role === "super_admin" ||
      (user?.role as any) === "Super Admin"
    ) {
      return { can: true };
    }

    const rolePermissions = getStoredRolePermissions();
    const currentPermissions = rolePermissions[systemRole] || [];

    // 0. Pengecekan parameter izin spesifik
    if (params?.permission) {
      const allowed = currentPermissions.includes(params.permission);
      return {
        can: allowed,
        reason: allowed
          ? undefined
          : `Izin '${params.permission}' tidak diberikan untuk peran ${systemRole}`,
      };
    }

    // 1. Pemetaan Hak Akses Halaman (Page Permissions)
    const resourcePagePermissionMap: Record<string, string> = {
      dashboard: "page.dashboard",
      keselamatan: "page.keselamatan",
      "hazard-reports": "page.bahaya_resiko",
      hiradc: "page.hiradc",
      investigations: "page.investigasi",
      "accident-reports": "page.kecelakaan",
      inspections: "page.inspeksi",
      kesehatan: "page.kesehatan",
      diseases: "page.penyakit",
      "psychologist-bookings": "page.konsultasi",
      "media-informasi": "page.media_informasi",
      announcements: "page.pemberitahuan",
      articles: "page.edukasi",
      posters: "page.edukasi",
      edukasi: "page.edukasi",
      "kelola-user": "page.kelola_user",
      "kelola-user-pengguna": "pengguna.kelola",
      "managed-users": "pengguna.kelola",
      users: "pengguna.kelola",
      "kelola-user-hak-akses": "hakakses.kelola",
      "hak-akses": "hakakses.kelola",
      "kelola-user-master-data": "masterdata.kelola",
      "master-data": "masterdata.kelola",
    };

    const requiredPagePerm = resourcePagePermissionMap[resource || ""];
    if (requiredPagePerm) {
      if (requiredPagePerm === "masterdata.kelola") {
        return {
          can: false,
          reason: "Halaman Master Data hanya dapat diakses secara eksklusif oleh Super Admin.",
        };
      }
      if (!currentPermissions.includes(requiredPagePerm)) {
        return {
          can: false,
          reason: `Peran ${systemRole} tidak memiliki hak akses untuk halaman ini (${requiredPagePerm}).`,
        };
      }
    }

    // 2. Modul Investigasi (Pemeriksaan Aksi Khusus)
    if (resource === "investigations") {
      if (action === "create" || action === "edit") {
        const canEdit =
          currentPermissions.includes("investigasi.kelola") ||
          systemRole === "Pengelola K3";
        return {
          can: canEdit,
          reason: canEdit
            ? undefined
            : "Hanya peran dengan izin 'Susun & ubah investigasi' yang berwenang mengubah investigasi.",
        };
      }
      if (action === "sahkan" || action === "periksa") {
        const canSahkan =
          currentPermissions.includes("laporan.periksa") ||
          systemRole === "Kepala Biro KU" ||
          systemRole === "Pengelola K3";
        return {
          can: canSahkan,
          reason: canSahkan
            ? undefined
            : "Hanya peran dengan izin 'Periksa & sahkan laporan' yang berhak memeriksa & mengesahkan.",
        };
      }
      if (action === "export" || action === "ekspor") {
        const canExport =
          currentPermissions.includes("laporan.ekspor") ||
          systemRole === "Kepala Biro KU" ||
          systemRole === "Pengelola K3" ||
          systemRole === "Admin Sistem";
        return {
          can: canExport,
          reason: canExport
            ? undefined
            : "Peran tidak memiliki izin untuk mengekspor PDF laporan investigasi.",
        };
      }
      if (action === "delete") {
        const canDelete =
          systemRole === "Pengelola K3" || systemRole === "Admin Sistem";
        return {
          can: canDelete,
          reason: canDelete
            ? undefined
            : "Tidak berwenang menghapus berkas investigasi.",
        };
      }
    }

    // 3. Modul Pembuatan Laporan (Bahaya & Kecelakaan)
    if (
      (resource === "hazard-reports" || resource === "accident-reports") &&
      action === "create"
    ) {
      const canCreate = currentPermissions.includes("laporan.buat");
      return {
        can: canCreate,
        reason: canCreate
          ? undefined
          : "Peran Anda tidak memiliki izin untuk membuat laporan baru.",
      };
    }

    // 4. Modul Konseling / Psikolog (Aksi Khusus)
    if (resource === "psychologist-bookings") {
      if (action === "rujuk_wajib") {
        const canRefer = currentPermissions.includes("konseling.rujuk_wajib");
        return {
          can: canRefer,
          reason: canRefer ? undefined : "Hanya pimpinan yang dapat merujuk konseling wajib.",
        };
      }
      if (action === "atur_jadwal") {
        const canSchedule = currentPermissions.includes("konseling.atur_jadwal");
        return {
          can: canSchedule,
          reason: canSchedule ? undefined : "Tidak berwenang mengatur jadwal konseling.",
        };
      }
      if (action === "lihat_catatan") {
        const canViewNotes =
          currentPermissions.includes("konseling.lihat_catatan") &&
          systemRole === "Psikolog";
        return {
          can: canViewNotes,
          reason: canViewNotes
            ? undefined
            : "Catatan sesi konseling hanya dapat dilihat oleh Psikolog.",
        };
      }
    }

    // 5. Modul Media & Informasi (Aksi Kelola Konten)
    if (
      (resource === "announcements" ||
        resource === "articles" ||
        resource === "posters" ||
        resource === "edukasi") &&
      (action === "create" || action === "edit" || action === "delete")
    ) {
      const canManageMedia = currentPermissions.includes("pengumuman.kelola");
      return {
        can: canManageMedia,
        reason: canManageMedia
          ? undefined
          : "Hanya pengelola yang memiliki izin kelola konten pengumuman/edukasi.",
      };
    }

    // Default: Izinkan jika hak akses halaman sudah terpenuhi
    return { can: true };
  },
};
