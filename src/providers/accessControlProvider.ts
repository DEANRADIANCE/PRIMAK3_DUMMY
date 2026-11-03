import { AccessControlProvider } from "@refinedev/core";
import { getStoredUser } from "./authProvider";
import {
  toSystemRole,
  getStoredRolePermissions,
} from "../mocks/rolePermissions";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    const user = getStoredUser();
    const systemRole = toSystemRole(user?.role);
    const rolePermissions = getStoredRolePermissions();
    const currentPermissions = rolePermissions[systemRole] || [];

    // 0. Pengecekan parameter izin spesifik
    if (params?.permission) {
      const allowed = currentPermissions.includes(params.permission);
      return {
        can: allowed,
        reason: allowed ? undefined : `Izin '${params.permission}' tidak diberikan untuk peran ${systemRole}`,
      };
    }

    // 1. Modul Kelola User: Manajemen Pengguna (izin 'pengguna.kelola')
    if (
      resource === "kelola-user-pengguna" ||
      resource === "users" ||
      resource === "managed-users"
    ) {
      const canManage = currentPermissions.includes("pengguna.kelola");
      return {
        can: canManage,
        reason: canManage
          ? undefined
          : "Hanya Admin Sistem (izin 'Kelola pengguna') yang berhak mengakses Manajemen Pengguna.",
      };
    }

    // 2. Modul Kelola User: Hak Akses Peran (izin 'hakakses.kelola')
    if (
      resource === "kelola-user-hak-akses" ||
      resource === "hak-akses"
    ) {
      const canManage = currentPermissions.includes("hakakses.kelola");
      return {
        can: canManage,
        reason: canManage
          ? undefined
          : "Hanya Admin Sistem (izin 'Kelola hak akses') yang berhak mengakses Hak Akses Peran.",
      };
    }

    // 3. Parent Resource "kelola-user"
    if (resource === "kelola-user") {
      const canAccess =
        currentPermissions.includes("pengguna.kelola") ||
        currentPermissions.includes("hakakses.kelola");
      return {
        can: canAccess,
        reason: canAccess
          ? undefined
          : "Hanya Admin Sistem yang berhak mengakses menu Kelola User.",
      };
    }

    // 4. Modul investigasi & laporan
    if (resource === "investigations") {
      if (action === "create" || action === "edit") {
        const canEdit = currentPermissions.includes("investigasi.kelola");
        return {
          can: canEdit,
          reason: canEdit ? undefined : "Peran tidak memiliki izin mengelola investigasi.",
        };
      }
    }

    const role = user?.role || "pegawai";

    // 5. Admin & Tim K3 default fallback untuk resource keselamatan & lainnya
    if (role === "admin" || role === "tim_k3" || systemRole === "Admin Sistem" || systemRole === "Pengelola K3") {
      return { can: true };
    }

    if (resource === "hazard-categories") {
      return { can: true };
    }

    // 6. Kepala Unit
    if (role === "kepala_unit" || systemRole === "Pimpinan Unit Kerja" || systemRole === "Kepala Biro KU") {
      if (resource === "investigations") {
        return { can: true };
      }
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
        if (action === "list" || action === "show" || action === "edit") {
          return { can: true };
        }
      }
      if (resource === "psychologist-bookings") {
        return { can: true };
      }
      return {
        can: false,
        reason: "Akses terbatas untuk Kepala Unit Kerja",
      };
    }

    // 7. Pegawai
    if (role === "pegawai" || systemRole === "Pegawai") {
      if (resource === "dashboard") {
        return { can: true };
      }
      if (resource === "hazard-reports") {
        return {
          can: action === "list" || action === "create" || action === "show",
          reason: action === "edit" || action === "delete" ? "Hanya Tim K3 yang berwenang mengubah status" : undefined,
        };
      }
      if (resource === "psychologist-bookings") {
        return { can: true };
      }
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
      if (resource === "hiradc" || resource === "accident-reports") {
        return {
          can: action === "list" || action === "show" || action === "create",
        };
      }
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
