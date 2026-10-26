import { AccessControlProvider } from "@refinedev/core";
import { getStoredUser } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const user = getStoredUser();
    const role = user?.role || "pegawai";

    // 1. Admin dan Tim K3 memiliki akses penuh untuk semua aksi & resource
    if (role === "admin" || role === "tim_k3") {
      return { can: true };
    }

    if (resource === "hazard-categories") {
      return { can: true };
    }

    // 2. Kepala Unit
    if (role === "kepala_unit") {
      // Kepala unit boleh ikut investigasi (list, show, edit, create)
      if (resource === "investigations") {
        return { can: true };
      }
      // Boleh melihat dashboard & modul keselamatan
      if (
        resource === "dashboard" ||
        resource === "hazard-reports" ||
        resource === "hiradc" ||
        resource === "accident-reports" ||
        resource === "inspections" ||
        resource === "announcements" ||
        resource === "articles" ||
        resource === "posters" ||
        resource === "diseases"
      ) {
        // Hanya bisa list & show (dan edit tindak lanjut unit)
        if (action === "list" || action === "show" || action === "edit") {
          return { can: true };
        }
      }
      if (resource === "psychologist-bookings") {
        return { can: true };
      }
      return {
        can: false,
        reason: "Akses terbatas untuk Kepala Unit",
      };
    }

    // 3. Pegawai
    if (role === "pegawai") {
      // Boleh buka dashboard
      if (resource === "dashboard") {
        return { can: true };
      }
      // Boleh lapor bahaya (list, create, show)
      if (resource === "hazard-reports") {
        return {
          can: action === "list" || action === "create" || action === "show",
          reason: action === "edit" || action === "delete" ? "Hanya Tim K3 yang berwenang mengubah status" : undefined,
        };
      }
      // Boleh konsultasi psikolog
      if (resource === "psychologist-bookings") {
        return { can: true };
      }
      // Boleh melihat media & informasi
      if (
        resource === "announcements" ||
        resource === "articles" ||
        resource === "posters" ||
        resource === "diseases"
      ) {
        return {
          can: action === "list" || action === "show",
          reason: action === "create" || action === "edit" || action === "delete" ? "Hanya Admin/Tim K3 yang berwenang mengelola konten" : undefined,
        };
      }
      // Pegawai boleh melihat HIRADC & laporan kecelakaan untuk awareness
      if (resource === "hiradc" || resource === "accident-reports") {
        return {
          can: action === "list" || action === "show" || action === "create",
        };
      }
      // Investigasi & Inspeksi hanya untuk tim K3 & Kepala Unit
      if (resource === "investigations" || resource === "inspections") {
        return {
          can: action === "list" || action === "show",
          reason: "Hanya Tim K3 yang dapat melakukan audit inspeksi",
        };
      }
      return { can: false };
    }

    return { can: true };
  },
};
