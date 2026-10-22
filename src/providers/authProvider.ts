import { AuthProvider } from "@refinedev/core";
import { IUser, UserRole } from "../types/user";
import { initialUsers } from "../mocks/users";

const STORAGE_KEY = "prima_k3_current_user";

export const getStoredUser = (): IUser | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
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

// Default fallback login jika belum ada user tersimpan: Admin
if (!getStoredUser()) {
  setStoredUser(initialUsers[0]);
}

export const switchRole = (role: UserRole) => {
  const targetUser = initialUsers.find((u) => u.role === role) || initialUsers[0];
  setStoredUser(targetUser);
  window.location.reload();
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    // Cari user berdasarkan email demo, bila tidak cocok gunakan admin sebagai fallback
    const user =
      initialUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase()) ||
      initialUsers[0];

    setStoredUser(user);
    return {
      success: true,
      redirectTo: "/",
      successNotification: {
        message: "Login Berhasil",
        description: `Selamat datang kembali, ${user.name} (${user.role.toUpperCase()})`,
      },
    };
  },

  logout: async () => {
    setStoredUser(null);
    return {
      success: true,
      redirectTo: "/login",
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
    };
  },
};
