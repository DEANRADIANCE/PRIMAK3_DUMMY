import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Tooltip,
  App as AntdApp,
  Space,
  Tag,
  theme,
} from "antd";
import {
  CheckCircleFilled,
  LockOutlined,
  UndoOutlined,
  SaveOutlined,
  InfoCircleOutlined,
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
  permission?: IPermissionItem;
}

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

  // Sinkronisasi data pengguna saat ada update di localStorage
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
      // 1. Aturan khusus: konseling.lihat_catatan tidak bisa diubah siapa pun
      if (code === "konseling.lihat_catatan") {
        return;
      }

      // 2. Aturan khusus: Admin Sistem tidak boleh kehilangan pengguna.kelola dan hakakses.kelola
      if (
        role === "Admin Sistem" &&
        (code === "pengguna.kelola" || code === "hakakses.kelola")
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

  // Siapkan baris data tabel dengan pengelompokan grup kategori
  const tableData = useMemo(() => {
    const categories: PermissionCategory[] = [
      "INVESTIGASI",
      "KONSELING",
      "PENGUMUMAN & DASHBOARD",
      "ADMINISTRASI",
    ];

    const rows: MatrixRowItem[] = [];

    categories.forEach((cat) => {
      // Baris Header Kategori
      rows.push({
        key: `header-${cat}`,
        isCategoryHeader: true,
        category: cat,
      });

      // Baris Izin dalam Kategori
      const items = PERMISSION_DEFINITIONS.filter((p) => p.category === cat);
      items.forEach((p) => {
        rows.push({
          key: p.code,
          isCategoryHeader: false,
          permission: p,
        });
      });
    });

    return rows;
  }, []);

  // Definisi kolom tabel
  const columns: any[] = [
    {
      title: (
        <span style={{ fontWeight: 700, color: "#1f2937", fontSize: 13 }}>
          Hak Akses
        </span>
      ),
      dataIndex: "permission",
      key: "permission",
      fixed: "left" as const,
      width: 270,
      render: (_: any, record: MatrixRowItem) => {
        if (record.isCategoryHeader) {
          return {
            children: (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#475569",
                  padding: "4px 0",
                }}
              >
                {record.category}
              </div>
            ),
            props: {
              colSpan: 7,
              style: {
                background: "#f8fafc",
                padding: "8px 16px",
                borderBottom: "1px solid #e2e8f0",
              },
            },
          };
        }

        const perm = record.permission!;
        const isLocked = perm.code === "konseling.lihat_catatan";

        return {
          children: (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 500, fontSize: 13, color: "#1f2937" }}>
                {perm.name}
              </span>
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
        // 1. konseling.lihat_catatan hanya untuk Psikolog dan dikunci (disabled)
        const isCatatanSesi = code === "konseling.lihat_catatan";
        const isCatatanPsikolog = isCatatanSesi && role === "Psikolog";
        const isCatatanNonPsikolog = isCatatanSesi && role !== "Psikolog";

        // 2. Admin Sistem wajib memiliki pengguna.kelola dan hakakses.kelola
        const isAdminLocked =
          role === "Admin Sistem" &&
          (code === "pengguna.kelola" || code === "hakakses.kelola");

        const isDisabled = isCatatanSesi || isAdminLocked;

        let tooltipText = "";
        if (isCatatanPsikolog) {
          tooltipText = "Catatan sesi konseling bersifat rahasia dan dikunci khusus untuk Psikolog.";
        } else if (isCatatanNonPsikolog) {
          tooltipText = "Catatan sesi konseling hanya dapat diakses oleh Psikolog.";
        } else if (isAdminLocked) {
          tooltipText = "Admin Sistem wajib memiliki hak akses ini agar sistem tidak terkunci.";
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
                  // Centang hitam bulat untuk izin yang aktif
                  <CheckCircleFilled
                    style={{
                      color: "#1e293b",
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
          scroll={{ x: 1100 }}
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
          Sistem.
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
            <CheckCircleFilled style={{ color: "#1e293b", fontSize: 17 }} />
            <span style={{ fontWeight: 500, color: "#334155" }}>Diizinkan</span>
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
