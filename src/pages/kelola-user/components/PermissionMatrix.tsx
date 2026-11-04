import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Tooltip,
  App as AntdApp,
  Space,
  Tag,
  Input,
  Radio,
  Select,
  theme,
} from "antd";
import {
  CheckCircleFilled,
  LockOutlined,
  UndoOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  FileProtectOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  BellOutlined,
  ReadOutlined,
  TeamOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  UserOutlined,
  SendOutlined,
  CalendarOutlined,
  AuditOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useWarnAboutChange } from "@refinedev/core";
import {
  SystemRole,
  RolePermissionsMatrix,
  IPermissionItem,
  PermissionCategory,
  IManagedUser,
} from "../../../types/userManagement";
import {
  SYSTEM_ROLES,
  PERMISSION_DEFINITIONS,
  DEFAULT_ROLE_PERMISSIONS,
  getStoredRolePermissions,
  saveStoredRolePermissions,
  resetStoredRolePermissions,
} from "../../../mocks/rolePermissions";
import { getStoredManagedUsers } from "../../../mocks/managedUsers";
import { RoleTag } from "./RoleTag";

interface MatrixRowItem {
  key: string;
  isCategoryHeader?: boolean;
  category?: PermissionCategory;
  categoryCount?: number;
  permission?: IPermissionItem;
}

const ALL_CATEGORIES: PermissionCategory[] = [
  "DASHBOARD",
  "KESELAMATAN",
  "KESEHATAN",
  "MEDIA & INFORMASI",
  "ADMINISTRASI",
];

const categoryMeta: Record<
  PermissionCategory,
  { label: string; icon: React.ReactNode; color: string; bg: string; borderColor: string }
> = {
  DASHBOARD: {
    label: "DASHBOARD",
    icon: <DashboardOutlined />,
    color: "#2563eb",
    bg: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  KESELAMATAN: {
    label: "KESELAMATAN (MODUL & HALAMAN)",
    icon: <WarningOutlined />,
    color: "#ea580c",
    bg: "#fff7ed",
    borderColor: "#fed7aa",
  },
  KESEHATAN: {
    label: "KESEHATAN (MODUL & HALAMAN)",
    icon: <HeartOutlined />,
    color: "#db2777",
    bg: "#fdf2f8",
    borderColor: "#fbcfe8",
  },
  "MEDIA & INFORMASI": {
    label: "MEDIA & INFORMASI (MODUL & HALAMAN)",
    icon: <BellOutlined />,
    color: "#0891b2",
    bg: "#ecfeff",
    borderColor: "#a5f3fc",
  },
  ADMINISTRASI: {
    label: "ADMINISTRASI & KELOLA USER",
    icon: <TeamOutlined />,
    color: "#4f46e5",
    bg: "#eef2ff",
    borderColor: "#c7d2fe",
  },
};

interface PermissionTheme {
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  shadow: string;
  tagBg: string;
  tagColor: string;
  tagBorder: string;
}

const getPermissionTheme = (perm: IPermissionItem): PermissionTheme => {
  const code = perm.code;

  switch (code) {
    // DASHBOARD
    case "page.dashboard":
      return {
        icon: <DashboardOutlined />,
        color: "#2563eb",
        bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "#93c5fd",
        shadow: "0 2px 6px rgba(37,99,235,0.18)",
        tagBg: "#eff6ff",
        tagColor: "#1d4ed8",
        tagBorder: "#bfdbfe",
      };
    case "dashboard.lihat_kesehatan":
      return {
        icon: <HeartOutlined />,
        color: "#db2777",
        bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        border: "#fbcfe8",
        shadow: "0 2px 5px rgba(219,39,119,0.12)",
        tagBg: "#fdf2f8",
        tagColor: "#be185d",
        tagBorder: "#fbcfe8",
      };

    // KESELAMATAN
    case "page.keselamatan":
      return {
        icon: <AppstoreOutlined />,
        color: "#ea580c",
        bg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        border: "#fdba74",
        shadow: "0 2px 6px rgba(234,88,12,0.16)",
        tagBg: "#fff7ed",
        tagColor: "#c2410c",
        tagBorder: "#fed7aa",
      };
    case "page.bahaya_resiko":
      return {
        icon: <WarningOutlined />,
        color: "#d97706",
        bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        border: "#fcd34d",
        shadow: "0 2px 6px rgba(217,119,6,0.2)",
        tagBg: "#fffbeb",
        tagColor: "#b45309",
        tagBorder: "#fde68a",
      };
    case "page.hiradc":
      return {
        icon: <SafetyCertificateOutlined />,
        color: "#059669",
        bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
        border: "#6ee7b7",
        shadow: "0 2px 6px rgba(5,150,105,0.2)",
        tagBg: "#ecfdf5",
        tagColor: "#047857",
        tagBorder: "#a7f3d0",
      };
    case "page.investigasi":
      return {
        icon: <SearchOutlined />,
        color: "#4f46e5",
        bg: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        border: "#a5b4fc",
        shadow: "0 2px 6px rgba(79,70,229,0.2)",
        tagBg: "#eef2ff",
        tagColor: "#4338ca",
        tagBorder: "#c7d2fe",
      };
    case "page.kecelakaan":
      return {
        icon: <FileProtectOutlined />,
        color: "#dc2626",
        bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
        border: "#fca5a5",
        shadow: "0 2px 6px rgba(220,38,38,0.2)",
        tagBg: "#fef2f2",
        tagColor: "#b91c1c",
        tagBorder: "#fecaca",
      };
    case "page.inspeksi":
      return {
        icon: <FireOutlined />,
        color: "#e11d48",
        bg: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
        border: "#fda4af",
        shadow: "0 2px 6px rgba(225,29,72,0.2)",
        tagBg: "#fff1f2",
        tagColor: "#be123c",
        tagBorder: "#fecdd3",
      };
    case "laporan.buat":
      return {
        icon: <FileTextOutlined />,
        color: "#ea580c",
        bg: "#fff7ed",
        border: "#fed7aa",
        shadow: "0 1px 3px rgba(234,88,12,0.12)",
        tagBg: "#fff7ed",
        tagColor: "#c2410c",
        tagBorder: "#fed7aa",
      };
    case "laporan.lihat_semua":
      return {
        icon: <FileTextOutlined />,
        color: "#475569",
        bg: "#f8fafc",
        border: "#cbd5e1",
        shadow: "0 1px 3px rgba(71,85,105,0.1)",
        tagBg: "#f8fafc",
        tagColor: "#334155",
        tagBorder: "#e2e8f0",
      };
    case "investigasi.kelola":
      return {
        icon: <AuditOutlined />,
        color: "#4f46e5",
        bg: "#eef2ff",
        border: "#c7d2fe",
        shadow: "0 1px 3px rgba(79,70,229,0.12)",
        tagBg: "#eef2ff",
        tagColor: "#4338ca",
        tagBorder: "#c7d2fe",
      };
    case "laporan.periksa":
      return {
        icon: <CheckCircleOutlined />,
        color: "#059669",
        bg: "#ecfdf5",
        border: "#a7f3d0",
        shadow: "0 1px 3px rgba(5,150,105,0.12)",
        tagBg: "#ecfdf5",
        tagColor: "#047857",
        tagBorder: "#a7f3d0",
      };
    case "laporan.ekspor":
      return {
        icon: <ExportOutlined />,
        color: "#c026d3",
        bg: "#fdf4ff",
        border: "#f0abfc",
        shadow: "0 1px 3px rgba(192,38,211,0.12)",
        tagBg: "#fdf4ff",
        tagColor: "#a21caf",
        tagBorder: "#f5d0fe",
      };

    // KESEHATAN
    case "page.kesehatan":
      return {
        icon: <HeartOutlined />,
        color: "#db2777",
        bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
        border: "#f472b6",
        shadow: "0 2px 6px rgba(219,39,119,0.18)",
        tagBg: "#fdf2f8",
        tagColor: "#be185d",
        tagBorder: "#fbcfe8",
      };
    case "page.penyakit":
      return {
        icon: <MedicineBoxOutlined />,
        color: "#0891b2",
        bg: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
        border: "#67e8f9",
        shadow: "0 2px 6px rgba(8,145,178,0.2)",
        tagBg: "#ecfeff",
        tagColor: "#0e7490",
        tagBorder: "#a5f3fc",
      };
    case "page.konsultasi":
      return {
        icon: <ScheduleOutlined />,
        color: "#7c3aed",
        bg: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
        border: "#c084fc",
        shadow: "0 2px 6px rgba(124,58,237,0.2)",
        tagBg: "#faf5ff",
        tagColor: "#6d28d9",
        tagBorder: "#ddd6fe",
      };
    case "konseling.ajukan":
      return {
        icon: <UserOutlined />,
        color: "#db2777",
        bg: "#fdf2f8",
        border: "#fbcfe8",
        shadow: "0 1px 3px rgba(219,39,119,0.1)",
        tagBg: "#fdf2f8",
        tagColor: "#be185d",
        tagBorder: "#fbcfe8",
      };
    case "konseling.rujuk_wajib":
      return {
        icon: <SendOutlined />,
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fecaca",
        shadow: "0 1px 3px rgba(220,38,38,0.1)",
        tagBg: "#fef2f2",
        tagColor: "#b91c1c",
        tagBorder: "#fecaca",
      };
    case "konseling.atur_jadwal":
      return {
        icon: <CalendarOutlined />,
        color: "#7c3aed",
        bg: "#faf5ff",
        border: "#ddd6fe",
        shadow: "0 1px 3px rgba(124,58,237,0.1)",
        tagBg: "#faf5ff",
        tagColor: "#6d28d9",
        tagBorder: "#ddd6fe",
      };
    case "konseling.lihat_catatan":
      return {
        icon: <LockOutlined />,
        color: "#475569",
        bg: "#f1f5f9",
        border: "#cbd5e1",
        shadow: "0 1px 3px rgba(71,85,105,0.1)",
        tagBg: "#f1f5f9",
        tagColor: "#334155",
        tagBorder: "#cbd5e1",
      };

    // MEDIA & INFORMASI
    case "page.media_informasi":
      return {
        icon: <AppstoreOutlined />,
        color: "#0d9488",
        bg: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
        border: "#5eead4",
        shadow: "0 2px 6px rgba(13,148,136,0.18)",
        tagBg: "#f0fdfa",
        tagColor: "#0f766e",
        tagBorder: "#99f6e4",
      };
    case "page.pemberitahuan":
      return {
        icon: <BellOutlined />,
        color: "#0284c7",
        bg: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        border: "#7dd3fc",
        shadow: "0 2px 6px rgba(2,132,199,0.2)",
        tagBg: "#f0f9ff",
        tagColor: "#0369a1",
        tagBorder: "#bae6fd",
      };
    case "page.edukasi":
      return {
        icon: <ReadOutlined />,
        color: "#65a30d",
        bg: "linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%)",
        border: "#bef264",
        shadow: "0 2px 6px rgba(101,163,13,0.2)",
        tagBg: "#f7fee7",
        tagColor: "#4d7c0f",
        tagBorder: "#d9f99d",
      };
    case "pengumuman.kelola":
      return {
        icon: <NotificationOutlined />,
        color: "#0891b2",
        bg: "#ecfeff",
        border: "#a5f3fc",
        shadow: "0 1px 3px rgba(8,145,178,0.1)",
        tagBg: "#ecfeff",
        tagColor: "#0e7490",
        tagBorder: "#a5f3fc",
      };

    // ADMINISTRASI
    case "page.kelola_user":
      return {
        icon: <TeamOutlined />,
        color: "#4f46e5",
        bg: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)",
        border: "#a5b4fc",
        shadow: "0 2px 6px rgba(79,70,229,0.18)",
        tagBg: "#eef2ff",
        tagColor: "#4338ca",
        tagBorder: "#c7d2fe",
      };
    case "pengguna.kelola":
      return {
        icon: <UserAddOutlined />,
        color: "#16a34a",
        bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: "#86efac",
        shadow: "0 2px 6px rgba(22,163,74,0.2)",
        tagBg: "#f0fdf4",
        tagColor: "#15803d",
        tagBorder: "#bbf7d0",
      };
    case "hakakses.kelola":
      return {
        icon: <SafetyCertificateOutlined />,
        color: "#7c3aed",
        bg: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
        border: "#c4b5fd",
        shadow: "0 2px 6px rgba(124,58,237,0.2)",
        tagBg: "#f5f3ff",
        tagColor: "#6d28d9",
        tagBorder: "#ddd6fe",
      };
    case "masterdata.kelola":
      return {
        icon: <DatabaseOutlined />,
        color: "#d97706",
        bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
        border: "#fcd34d",
        shadow: "0 2px 6px rgba(217,119,6,0.2)",
        tagBg: "#fffbeb",
        tagColor: "#b45309",
        tagBorder: "#fde68a",
      };

    default:
      return {
        icon: <FileTextOutlined />,
        color: "#64748b",
        bg: "#f8fafc",
        border: "#e2e8f0",
        shadow: "0 1px 2px rgba(0,0,0,0.04)",
        tagBg: "#f1f5f9",
        tagColor: "#475569",
        tagBorder: "#cbd5e1",
      };
  }
};

export const PermissionMatrix: React.FC = () => {
  const { message } = AntdApp.useApp();
  const { token } = theme.useToken();
  const { setWarnWhen } = useWarnAboutChange();

  const [savedMatrix, setSavedMatrix] = useState<RolePermissionsMatrix>(() =>
    getStoredRolePermissions()
  );
  const [currentMatrix, setCurrentMatrix] = useState<RolePermissionsMatrix>(() =>
    getStoredRolePermissions()
  );
  const [users, setUsers] = useState<IManagedUser[]>(() =>
    getStoredManagedUsers()
  );
  const [saving, setSaving] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Sinkronisasi data pengguna & perizinan saat ada update di localStorage
  useEffect(() => {
    const handleUsersUpdated = (e: any) => {
      setUsers(e.detail || getStoredManagedUsers());
    };
    const handlePermissionsUpdated = (e: any) => {
      if (e.detail) {
        setSavedMatrix(e.detail);
      }
    };
    window.addEventListener("prima_managed_users_updated", handleUsersUpdated);
    window.addEventListener("prima_permissions_updated", handlePermissionsUpdated);
    return () => {
      window.removeEventListener("prima_managed_users_updated", handleUsersUpdated);
      window.removeEventListener("prima_permissions_updated", handlePermissionsUpdated);
    };
  }, []);

  // Hitung apakah ada perubahan yang belum disimpan
  const hasChanges = useMemo(() => {
    return JSON.stringify(currentMatrix) !== JSON.stringify(savedMatrix);
  }, [currentMatrix, savedMatrix]);

  // Beritahu Refine & Browser perihal perubahan yang belum disimpan
  useEffect(() => {
    setWarnWhen(hasChanges);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "Ada perubahan hak akses yang belum disimpan.";
        return "Ada perubahan hak akses yang belum disimpan.";
      }
    };

    if (hasChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges, setWarnWhen]);

  // Hitung jumlah pengguna per peran dinamis
  const userCountPerRole = useMemo(() => {
    const counts: Record<SystemRole, number> = {
      "Super Admin": 0,
      Pegawai: 0,
      "Pimpinan Unit Kerja": 0,
      "Kepala Biro KU": 0,
      "Pengelola K3": 0,
      Psikolog: 0,
      "Admin Sistem": 0,
    };
    users.forEach((u) => {
      if (counts[u.role] !== undefined) {
        counts[u.role] += 1;
      }
    });
    return counts;
  }, [users]);

  // Hitung jumlah hak akses per peran dinamis dari matriks saat ini
  const permissionsCountPerRole = useMemo(() => {
    const counts: Record<SystemRole, number> = {
      "Super Admin": 0,
      Pegawai: 0,
      "Pimpinan Unit Kerja": 0,
      "Kepala Biro KU": 0,
      "Pengelola K3": 0,
      Psikolog: 0,
      "Admin Sistem": 0,
    };
    SYSTEM_ROLES.forEach((r) => {
      counts[r] = (currentMatrix[r] || []).length;
    });
    return counts;
  }, [currentMatrix]);

  // Handler toggle izin
  const handleToggle = useCallback(
    (role: SystemRole, code: string) => {
      // 0. Super Admin tidak dapat diubah (selalu memiliki semua akses)
      if (role === "Super Admin") {
        return;
      }

      // 1. Aturan khusus: konseling.lihat_catatan & masterdata.kelola tidak bisa diubah siapapun
      if (code === "konseling.lihat_catatan" || code === "masterdata.kelola") {
        return;
      }

      // 2. Aturan khusus: Admin Sistem wajib memiliki modul kelola user & hak akses
      if (
        role === "Admin Sistem" &&
        (code === "pengguna.kelola" || code === "hakakses.kelola" || code === "page.kelola_user")
      ) {
        return;
      }

      setCurrentMatrix((prev) => {
        const currentList = prev[role] || [];
        const isCurrentlyAllowed = currentList.includes(code);
        const updatedList = isCurrentlyAllowed
          ? currentList.filter((c) => c !== code)
          : [...currentList, code];

        return {
          ...prev,
          [role]: updatedList,
        };
      });
    },
    []
  );

  // Simpan perubahan matriks
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const saved = saveStoredRolePermissions(currentMatrix);
      setSavedMatrix(saved);
      setCurrentMatrix(saved);
      setSaving(false);
      setWarnWhen(false);
      message.success("Hak akses peran berhasil disimpan.");
    }, 350);
  };

  // Reset ke pengaturan bawaan
  const handleReset = () => {
    const resetData = resetStoredRolePermissions();
    setSavedMatrix(resetData);
    setCurrentMatrix(resetData);
    setWarnWhen(false);
    message.success("Hak akses peran berhasil dikembalikan ke pengaturan bawaan.");
  };

  // Siapkan baris data tabel dengan pengelompokan grup kategori dan filter
  const tableData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filteredPermissions = PERMISSION_DEFINITIONS.filter((perm) => {
      // Filter kategori
      if (categoryFilter !== "ALL" && perm.category !== categoryFilter) {
        return false;
      }
      // Filter tipe (halaman vs aksi)
      if (typeFilter === "PAGE" && !perm.isPage) {
        return false;
      }
      if (typeFilter === "ACTION" && perm.isPage) {
        return false;
      }
      // Filter teks pencarian
      if (q) {
        const matchName = perm.name.toLowerCase().includes(q);
        const matchCode = perm.code.toLowerCase().includes(q);
        const matchDesc = (perm.description || "").toLowerCase().includes(q);
        const matchRoute = (perm.pageRoute || "").toLowerCase().includes(q);
        return matchName || matchCode || matchDesc || matchRoute;
      }
      return true;
    });

    const activeCategories = ALL_CATEGORIES.filter(
      (cat) => categoryFilter === "ALL" || categoryFilter === cat
    );

    const rows: MatrixRowItem[] = [];

    activeCategories.forEach((cat) => {
      const itemsInCat = filteredPermissions.filter((p) => p.category === cat);
      if (itemsInCat.length === 0) return;

      // Baris Header Kategori
      rows.push({
        key: `header-${cat}`,
        isCategoryHeader: true,
        category: cat,
        categoryCount: itemsInCat.length,
      });

      // Baris Izin dalam Kategori
      itemsInCat.forEach((p) => {
        rows.push({
          key: p.code,
          isCategoryHeader: false,
          permission: p,
        });
      });
    });

    return rows;
  }, [categoryFilter, typeFilter, searchQuery]);

  // Total item yang ditemukan
  const totalDisplayCount = useMemo(() => {
    return tableData.filter((r) => !r.isCategoryHeader).length;
  }, [tableData]);

  // Definisi kolom tabel
  const columns: any[] = [
    {
      title: (
        <span style={{ fontWeight: 700, color: "#1f2937", fontSize: 13 }}>
          Hak Akses & Halaman
        </span>
      ),
      dataIndex: "permission",
      key: "permission",
      fixed: "left" as const,
      width: 360,
      render: (_: any, record: MatrixRowItem) => {
        if (record.isCategoryHeader) {
          const meta = categoryMeta[record.category!] || {
            label: record.category,
            icon: null,
            color: "#475569",
            bg: "#f8fafc",
            borderColor: "#e2e8f0",
          };

          return {
            children: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    color: meta.color,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{meta.icon}</span>
                  <span>{meta.label}</span>
                </div>
                <Tag
                  bordered={false}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 12,
                    padding: "1px 10px",
                    background: "#ffffff",
                    color: meta.color,
                    border: `1px solid ${meta.borderColor}`,
                    margin: 0,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {record.categoryCount} hak akses
                </Tag>
              </div>
            ),
            props: {
              colSpan: 8,
              style: {
                background: meta.bg,
                padding: "9px 16px",
                borderBottom: `1.5px solid ${meta.borderColor}`,
              },
            },
          };
        }

        const perm = record.permission!;
        const isLocked = perm.code === "konseling.lihat_catatan" || perm.code === "masterdata.kelola";
        const themeInfo = getPermissionTheme(perm);

        return {
          children: (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "4px 0",
              }}
            >
              {/* Badge Icon Berwarna & Menarik */}
              <div
                style={{
                  width: perm.isPage ? 36 : 30,
                  height: perm.isPage ? 36 : 30,
                  borderRadius: perm.isPage ? 10 : 8,
                  background: themeInfo.bg,
                  border: `1.5px solid ${themeInfo.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: themeInfo.color,
                  fontSize: perm.isPage ? 17 : 13,
                  boxShadow: themeInfo.shadow,
                  flexShrink: 0,
                  marginTop: 1,
                  transition: "all 0.2s ease",
                }}
              >
                {themeInfo.icon}
              </div>

              {/* Teks & Label */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontWeight: perm.isPage ? 700 : 600,
                      fontSize: perm.isPage ? 13.5 : 13,
                      color: perm.isPage ? "#0f172a" : "#1e293b",
                    }}
                  >
                    {perm.name}
                  </span>

                  {perm.isPage && (
                    <Tag
                      style={{
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 7px",
                        margin: 0,
                        background: themeInfo.tagBg,
                        color: themeInfo.tagColor,
                        border: `1px solid ${themeInfo.tagBorder}`,
                        letterSpacing: "0.02em",
                      }}
                    >
                      Akses Halaman
                    </Tag>
                  )}

                  {isLocked && (
                    <Tag
                      color="default"
                      style={{
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "0 6px",
                        background: "#f1f5f9",
                        color: "#475569",
                        border: "1px solid #cbd5e1",
                        margin: 0,
                      }}
                    >
                      <LockOutlined style={{ marginRight: 3 }} />
                      Terkunci
                    </Tag>
                  )}
                </div>

                {perm.description && (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#64748b",
                      lineHeight: 1.35,
                    }}
                  >
                    {perm.description}
                    {perm.pageRoute && (
                      <code
                        style={{
                          marginLeft: 6,
                          padding: "1px 5px",
                          background: "#f1f5f9",
                          borderRadius: 4,
                          fontSize: 10,
                          color: "#475569",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {perm.pageRoute}
                      </code>
                    )}
                  </div>
                )}
              </div>
            </div>
          ),
          props: {},
        };
      },
    },
    ...SYSTEM_ROLES.map((role) => ({
      title: (
        <div style={{ textAlign: "center", padding: "4px 0" }}>
          <RoleTag role={role} />
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#64748b",
              marginTop: 6,
              lineHeight: 1.2,
            }}
          >
            {permissionsCountPerRole[role]} hak akses
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 2,
              lineHeight: 1.2,
            }}
          >
            {userCountPerRole[role]} pengguna
          </div>
        </div>
      ),
      dataIndex: role,
      key: role,
      align: "center" as const,
      width: 140,
      render: (_: any, record: MatrixRowItem) => {
        if (record.isCategoryHeader) {
          return {
            props: {
              colSpan: 0,
            },
          };
        }

        const perm = record.permission!;
        const code = perm.code;
        const rolePermissions = currentMatrix[role] || [];
        const isAllowed = rolePermissions.includes(code);

        // Aturan Kunci:
        // 0. Super Admin selalu memiliki akses penuh ke seluruh modul
        const isSuperAdmin = role === "Super Admin";

        // 1. konseling.lihat_catatan hanya untuk Psikolog dan dikunci (disabled)
        const isCatatanSesi = code === "konseling.lihat_catatan";
        const isCatatanPsikolog = isCatatanSesi && role === "Psikolog";
        const isCatatanNonPsikolog = isCatatanSesi && role !== "Psikolog" && !isSuperAdmin;

        // 2. masterdata.kelola hanya untuk Super Admin dan dikunci
        const isMasterData = code === "masterdata.kelola";

        // 3. Admin Sistem wajib memiliki modul kelola user & hak akses
        const isAdminLocked =
          role === "Admin Sistem" &&
          (code === "pengguna.kelola" || code === "hakakses.kelola" || code === "page.kelola_user");

        const isDisabled = isSuperAdmin || isCatatanSesi || isMasterData || isAdminLocked;

        let tooltipText = "";
        if (isSuperAdmin) {
          tooltipText = "Super Admin selalu memiliki hak akses penuh ke seluruh halaman & fitur.";
        } else if (isMasterData) {
          tooltipText = "Master data hanya dapat diakses secara eksklusif oleh Super Admin.";
        } else if (isCatatanPsikolog) {
          tooltipText = "Catatan sesi konseling bersifat rahasia dan dikunci khusus untuk Psikolog.";
        } else if (isCatatanNonPsikolog) {
          tooltipText = "Catatan sesi konseling hanya dapat diakses oleh Psikolog.";
        } else if (isAdminLocked) {
          tooltipText = "Admin Sistem wajib memiliki hak akses ini agar modul administrasi tidak terkunci.";
        } else {
          tooltipText = isAllowed
            ? `Klik untuk mencabut hak akses '${perm.name}' dari ${role}`
            : `Klik untuk memberikan hak akses '${perm.name}' ke ${role}`;
        }

        return (
          <Tooltip title={tooltipText} placement="top">
            <button
              type="button"
              role="checkbox"
              aria-checked={isAllowed}
              aria-label={`${perm.name} untuk ${role}`}
              disabled={isDisabled}
              onClick={() => handleToggle(role, code)}
              style={{
                background: "transparent",
                border: "none",
                cursor: isDisabled ? "not-allowed" : "pointer",
                padding: "6px 12px",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
                opacity: isDisabled && !isAllowed ? 0.45 : 1,
              }}
            >
              {isAllowed ? (
                isCatatanPsikolog ? (
                  // Centang abu khusus untuk catatan sesi Psikolog yang terkunci
                  <CheckCircleFilled
                    style={{
                      color: "#9ca3af",
                      fontSize: 20,
                      cursor: "not-allowed",
                    }}
                  />
                ) : (
                  // Centang biru/hitam bulat untuk izin yang aktif
                  <CheckCircleFilled
                    style={{
                      color: perm.isPage ? "#2563eb" : "#1e293b",
                      fontSize: 20,
                    }}
                  />
                )
              ) : (
                // Strip tanda '–' abu untuk izin yang tidak aktif
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  –
                </span>
              )}
            </button>
          </Tooltip>
        );
      },
    })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Bar Pencarian & Filter Cepat */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: token.borderRadiusLG,
          border: "1px solid #e2e8f0",
          padding: "14px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Space wrap size="middle">
          {/* Input Pencarian */}
          <Input
            placeholder="Cari halaman atau hak akses..."
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 260 }}
          />

          {/* Filter Kategori */}
          <Select
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            style={{ width: 220 }}
            options={[
              { value: "ALL", label: "Semua Modul & Kategori" },
              { value: "DASHBOARD", label: "Dashboard" },
              { value: "KESELAMATAN", label: "Keselamatan" },
              { value: "KESEHATAN", label: "Kesehatan" },
              { value: "MEDIA & INFORMASI", label: "Media & Informasi" },
              { value: "ADMINISTRASI", label: "Administrasi & Kelola User" },
            ]}
          />

          {/* Filter Tipe: Semua / Halaman / Aksi */}
          <Radio.Group
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="ALL">Semua ({PERMISSION_DEFINITIONS.length})</Radio.Button>
            <Radio.Button value="PAGE">
              Akses Halaman ({PERMISSION_DEFINITIONS.filter((p) => p.isPage).length})
            </Radio.Button>
            <Radio.Button value="ACTION">
              Aksi & Fitur ({PERMISSION_DEFINITIONS.filter((p) => !p.isPage).length})
            </Radio.Button>
          </Radio.Group>
        </Space>

        <div style={{ fontSize: 13, color: "#64748b" }}>
          Menampilkan <strong>{totalDisplayCount}</strong> dari {PERMISSION_DEFINITIONS.length} hak akses
        </div>
      </div>

      {/* Tabel Matriks Hak Akses */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: token.borderRadiusLG,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          rowKey="key"
          scroll={{ x: 1240 }}
          bordered
          size="middle"
          rowClassName={(record) =>
            record.isCategoryHeader ? "matrix-category-row" : "matrix-data-row"
          }
        />
      </div>

      {/* Kotak Catatan Sesi Rahasia (Latar Abu) */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LockOutlined style={{ color: "#475569", fontSize: 16 }} />
        </div>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.4 }}>
          <strong>Catatan sesi konseling</strong> bersifat rahasia dan dikunci
          khusus untuk Psikolog. Peran lain tidak dapat melihatnya, termasuk Admin
          Sistem. Hak akses per page memungkinkan pengaturan visibilitas menu dan
          izin membuka setiap halaman secara dinamis untuk setiap peran.
        </div>
      </div>

      {/* Baris Bawah: Legenda (Kiri) dan Tombol Aksi (Kanan) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "4px 2px",
        }}
      >
        {/* Legenda */}
        <Space direction="horizontal" size="large" style={{ fontSize: 13, color: "#64748b" }}>
          <Space size={6}>
            <CheckCircleFilled style={{ color: "#2563eb", fontSize: 17 }} />
            <span style={{ fontWeight: 500, color: "#334155" }}>Halaman Diizinkan</span>
          </Space>
          <Space size={6}>
            <CheckCircleFilled style={{ color: "#1e293b", fontSize: 17 }} />
            <span style={{ fontWeight: 500, color: "#334155" }}>Fitur Diizinkan</span>
          </Space>
          <Space size={6}>
            <span style={{ color: "#9ca3af", fontSize: 18, fontWeight: 700 }}>–</span>
            <span style={{ fontWeight: 500, color: "#334155" }}>Tidak diizinkan</span>
          </Space>
          {hasChanges && (
            <Tag color="warning" style={{ borderRadius: 6, fontWeight: 500 }}>
              <InfoCircleOutlined style={{ marginRight: 4 }} />
              Ada perubahan yang belum disimpan
            </Tag>
          )}
        </Space>

        {/* Tombol Aksi Kanan */}
        <Space size="middle">
          <Popconfirm
            title="Kembalikan ke Bawaan"
            description="Apakah Anda yakin ingin mengembalikan seluruh hak akses peran ke pengaturan bawaan?"
            onConfirm={handleReset}
            okText="Ya, Kembalikan"
            cancelText="Batal"
          >
            <Button icon={<UndoOutlined />}>
              Kembalikan ke Bawaan
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!hasChanges}
            onClick={handleSave}
            style={{
              background: hasChanges ? "#1e293b" : undefined,
              borderColor: hasChanges ? "#1e293b" : undefined,
              fontWeight: 600,
            }}
          >
            Simpan Hak Akses
          </Button>
        </Space>
      </div>
    </div>
  );
};
