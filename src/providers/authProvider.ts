import { AuthProvider } from "@refinedev/core";
import { IUser, UserRole } from "../types/user";
import { initialUsers } from "../mocks/users";

const STORAGE_KEY = "prima_k3_current_user";
const TOKEN_KEY = "prima_k3_auth_token";

export const getStoredUser = (): IUser | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as IUser;
    // Sinkronisasi data awal jika ada field baru yang belum ada di local storage
    const fallback = initialUsers.find((u) => u.id === parsed.id || u.role === parsed.role);
    if (fallback) {
      return {
        ...fallback,
        ...parsed,
      };
    }
    return parsed;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: IUser | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const updateUserProfile = (updatedData: Partial<IUser>): IUser | null => {
  const current = getStoredUser();
  if (!current) return null;
  const updated: IUser = {
    ...current,
    ...updatedData,
  };
  setStoredUser(updated);

  // Perbarui mock user di memori
  const idx = initialUsers.findIndex((u) => u.id === current.id || u.role === current.role);
  if (idx !== -1) {
    initialUsers[idx] = updated;
  }

  // Notifikasi event agar komponen lain (seperti header) merespon perubahan secara instan
  window.dispatchEvent(new CustomEvent("prima_user_updated", { detail: updated }));
  return updated;
};

export const switchRole = (role: UserRole) => {
  const targetUser = initialUsers.find((u) => u.role === role) || initialUsers[0];
  setStoredUser(targetUser);
  window.location.reload();
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const rawApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

    // 1. Jika VITE_API_URL diset dan menunjuk ke endpoint eksternal (misal ngrok)
    if (rawApiUrl && rawApiUrl.startsWith("http")) {
      try {
        const response = await fetch(`${rawApiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ email, password }),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const resData = await response.json();

          if (response.ok) {
            const token =
              resData.token ||
              resData.access_token ||
              resData.data?.token ||
              resData.data?.access_token ||
              resData.data?.jwt;

            if (token) {
              setAuthToken(token);
            }

            const remoteUser =
              resData.user ||
              resData.data?.user ||
              (resData.data && !resData.data.token ? resData.data : null);

            if (remoteUser && typeof remoteUser === "object") {
              const formattedUser: IUser = {
                id: remoteUser.id || 1,
                name: remoteUser.name || email,
                email: remoteUser.email || email,
                role: remoteUser.role || "pegawai",
                unit: remoteUser.unit || "Klinik Pratama ANRI",
                nip: remoteUser.nip || "",
                createdAt: remoteUser.createdAt || remoteUser.created_at || new Date().toISOString(),
                avatar:
                  remoteUser.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    remoteUser.name || email
                  )}`,
                phone: remoteUser.phone || "",
                position: remoteUser.position || "",
              };
              setStoredUser(formattedUser);
              return {
                success: true,
                redirectTo: "/dashboard",
                successNotification: {
                  message: "Login Berhasil (API)",
                  description: `Selamat datang kembali, ${formattedUser.name}`,
                },
              };
            }
          } else if (response.status === 401 || response.status === 403) {
            const isDemoUser = initialUsers.some(
              (u) => u.email.toLowerCase() === email?.toLowerCase()
            );
            if (!isDemoUser) {
              return {
                success: false,
                error: {
                  name: "Login Error",
                  message: resData.message || "Email atau kata sandi tidak valid.",
                },
              };
            }
          }
        }
      } catch (err) {
        console.warn("Backend API tidak dapat dijangkau (fallback ke akun demo/lokal):", err);
      }
    }

    // 2. Fallback jika offline / ngrok belum menyala / login akun demo
    const user =
      initialUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase()) ||
      initialUsers[0];

    setStoredUser(user);
    setAuthToken("demo-token-" + Date.now());

    return {
      success: true,
      redirectTo: "/dashboard",
      successNotification: {
        message: "Login Berhasil",
        description: `Selamat datang kembali, ${user.name} (${user.role.toUpperCase()})`,
      },
    };
  },

  logout: async () => {
    setStoredUser(null);
    setAuthToken(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("prima_logout_success", "true");
    }
    return {
      success: true,
      redirectTo: "/",
      successNotification: {
        message: "Logout Berhasil",
        description: "Anda telah keluar dari sistem PRIMA K3.",
      },
    };
  },

  check: async () => {
    const user = getStoredUser();
    if (user) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
      logout: true,
    };
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },

  getPermissions: async () => {
    const user = getStoredUser();
    return user ? user.role : "pegawai";
  },

  getIdentity: async () => {
    const user = getStoredUser();
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      unit: user.unit,
      nip: user.nip,
      avatar: user.avatar,
      phone: user.phone,
      position: user.position,
      gender: user.gender,
      address: user.address,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  },
};
