import { IManagedUser, SystemRole, UserStatus } from "../types/userManagement";
import { getStoredManagedUsers, saveStoredManagedUsers } from "../mocks/managedUsers";
import { mockDb } from "../mocks";
import { getAuthToken } from "../providers/authProvider";

export const getApiBaseUrl = (): string => {
  return (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
};

/**
 * Normalisasi data pengguna dari format backend (Laravel/Express/Supabase)
 * ke tipe IManagedUser yang dipakai oleh komponen frontend PRIMA K3
 */
export const normalizeApiUserToManaged = (raw: any, index = 0): IManagedUser => {
  const rawRole = String(raw.role || raw.role_name || raw.roleName || raw.system_role || "").toLowerCase().trim();
  let systemRole: SystemRole = "Pegawai";

  if (
    rawRole === "super_admin" ||
    rawRole === "superadmin" ||
    rawRole === "super admin" ||
    rawRole.includes("super")
  ) {
    systemRole = "Super Admin";
  } else if (
    rawRole === "admin" ||
    rawRole === "admin sistem" ||
    rawRole === "admin_sistem" ||
    rawRole === "administrator"
  ) {
    systemRole = "Admin Sistem";
  } else if (
    rawRole === "tim_k3" ||
    rawRole === "pengelola k3" ||
    rawRole === "pengelola_k3" ||
    rawRole.includes("k3")
  ) {
    systemRole = "Pengelola K3";
  } else if (
    rawRole === "kepala biro ku" ||
    rawRole === "kepala_biro_ku" ||
    rawRole === "biro ku"
  ) {
    systemRole = "Kepala Biro KU";
  } else if (
    rawRole === "kepala_unit" ||
    rawRole === "pimpinan unit kerja" ||
    rawRole === "pimpinan_unit_kerja" ||
    rawRole.includes("pimpinan")
  ) {
    systemRole = "Pimpinan Unit Kerja";
  } else if (rawRole === "psikolog") {
    systemRole = "Psikolog";
  }

  const rawStatus = String(raw.status || "").toLowerCase().trim();
  let status: UserStatus = "Aktif";
  if (
    rawStatus === "nonaktif" ||
    rawStatus === "non-aktif" ||
    rawStatus === "inactive" ||
    rawStatus === "disabled"
  ) {
    status = "Nonaktif";
  } else if (
    rawStatus === "undangan terkirim" ||
    rawStatus === "undangan" ||
    rawStatus === "pending" ||
    rawStatus === "invited"
  ) {
    status = "Undangan terkirim";
  }

  return {
    id: Number(raw.id) || index + 1,
    name: raw.name || raw.nama || raw.username || raw.email || `Pengguna ${index + 1}`,
    email: raw.email || "",
    unit:
      raw.unit ||
      raw.unit_kerja ||
      raw.department ||
      raw.departemen ||
      raw.division ||
      "Klinik Pratama ANRI",
    role: systemRole,
    status,
    lastLogin:
      raw.lastLogin ||
      raw.last_login ||
      raw.last_login_at ||
      raw.login_terakhir ||
      null,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
  };
};

/**
 * Fetch daftar pengguna langsung dari BE API
 */
export const fetchUsersFromApi = async (timeoutMs = 6000): Promise<{
  success: boolean;
  users: IManagedUser[];
  source: "api" | "local";
  message?: string;
}> => {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: true,
      users: getStoredManagedUsers(),
      source: "local",
      message: "VITE_API_URL belum dikonfigurasi, menggunakan data lokal.",
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const token = getAuthToken();

    const response = await fetch(`${baseUrl}/users`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    let rawList: any[] = [];

    if (Array.isArray(json)) {
      rawList = json;
    } else if (Array.isArray(json.data)) {
      rawList = json.data;
    } else if (Array.isArray(json.users)) {
      rawList = json.users;
    } else if (Array.isArray(json.data?.users)) {
      rawList = json.data.users;
    } else if (json.data && typeof json.data === "object") {
      // Objek tunggal
      rawList = [json.data];
    }

    if (rawList.length > 0) {
      const normalizedUsers = rawList.map((item, idx) =>
        normalizeApiUserToManaged(item, idx)
      );

      // Sinkronkan ke mockDb memori dan localStorage
      mockDb["users"] = normalizedUsers;
      mockDb["kelola-user-pengguna"] = normalizedUsers;
      mockDb["managed-users"] = normalizedUsers;
      saveStoredManagedUsers(normalizedUsers);

      window.dispatchEvent(
        new CustomEvent("prima_managed_users_updated", { detail: normalizedUsers })
      );

      return {
        success: true,
        users: normalizedUsers,
        source: "api",
        message: `Berhasil memuat ${normalizedUsers.length} pengguna dari BE API.`,
      };
    }

    // Jika response kosong dari API, gunakan data lokal
    return {
      success: true,
      users: getStoredManagedUsers(),
      source: "local",
      message: "API merespon tetapi data kosong, memuat fallback lokal.",
    };
  } catch (err: any) {
    const isTimeout = err?.name === "AbortError";
    const warnMsg = isTimeout
      ? "Koneksi ke BE API timeout, menggunakan data lokal."
      : `Gagal memuat pengguna dari BE API (${err?.message || "Koneksi terputus"}), beralih ke data lokal.`;

    console.warn(`[PRIMA K3 Users API] ${warnMsg}`);

    return {
      success: false,
      users: getStoredManagedUsers(),
      source: "local",
      message: warnMsg,
    };
  }
};
