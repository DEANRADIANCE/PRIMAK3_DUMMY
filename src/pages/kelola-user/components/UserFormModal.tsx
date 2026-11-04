import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  App as AntdApp,
  Divider,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  MailOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useCreate, useUpdate } from "@refinedev/core";
import { IManagedUser, SystemRole, UserStatus } from "../../../types/userManagement";
import { SYSTEM_ROLES } from "../../../mocks/rolePermissions";
import { mockDb } from "../../../mocks";
import { RoleTag } from "./RoleTag";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  action: "create" | "edit";
  editingRecord?: IManagedUser | null;
  currentUserEmail?: string;
  currentUserId?: number;
  onSuccess?: () => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  action,
  editingRecord,
  currentUserEmail,
  currentUserId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { message, notification } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);

  const { mutate: createUser } = useCreate<IManagedUser>();
  const { mutate: updateUser } = useUpdate<IManagedUser>();

  // Cek apakah akun yang sedang diubah adalah akun milik admin yang sedang login
  const isSelf =
    action === "edit" &&
    editingRecord != null &&
    (editingRecord.email?.toLowerCase() === currentUserEmail?.toLowerCase() ||
      editingRecord.id === currentUserId ||
      ((editingRecord.role === "Admin Sistem" || editingRecord.role === "Super Admin") &&
        (currentUserEmail?.includes("admin") || currentUserId === 1 || currentUserId === 6)));

  useEffect(() => {
    if (open) {
      if (action === "edit" && editingRecord) {
        form.setFieldsValue({
          name: editingRecord.name,
          email: editingRecord.email,
          unit: editingRecord.unit,
          role: editingRecord.role,
          status: editingRecord.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, action, editingRecord, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Validasi perlindungan diri admin
      if (isSelf) {
        if (values.role !== "Admin Sistem" && values.role !== "Super Admin") {
          message.error("Anda tidak diperbolehkan menurunkan peran akun Anda sendiri.");
          setLoading(false);
          return;
        }
        if (values.status === "Nonaktif") {
          message.error("Anda tidak diperbolehkan menonaktifkan akun Anda sendiri.");
          setLoading(false);
          return;
        }
      }

      if (action === "create") {
        createUser(
          {
            resource: "users",
            values: {
              ...values,
              status: "Undangan terkirim" as UserStatus,
              lastLogin: null,
            },
          },
          {
            onSuccess: () => {
              setLoading(false);
              notification.success({
                message: "Undangan Pengguna Berhasil Dikirim",
                description: `Undangan terkirim ke ${values.email}`,
                placement: "topRight",
              });
              onSuccess?.();
              onClose();
            },
            onError: (err: any) => {
              setLoading(false);
              message.error(err?.message || "Gagal menambahkan pengguna baru");
            },
          }
        );
      } else if (action === "edit" && editingRecord) {
        updateUser(
          {
            resource: "users",
            id: editingRecord.id,
            values: {
              ...values,
            },
          },
          {
            onSuccess: () => {
              setLoading(false);
              message.success("Data pengguna berhasil diperbarui.");
              onSuccess?.();
              onClose();
            },
            onError: (err: any) => {
              setLoading(false);
              message.error(err?.message || "Gagal memperbarui pengguna");
            },
          }
        );
      }
    } catch {
      setLoading(false);
    }
  };

  const handleToggleStatus = () => {
    if (!editingRecord) return;
    if (isSelf) {
      message.error("Admin tidak boleh menonaktifkan akunnya sendiri.");
      return;
    }

    const nextStatus: UserStatus =
      editingRecord.status === "Nonaktif" ? "Aktif" : "Nonaktif";

    setLoading(true);
    updateUser(
      {
        resource: "users",
        id: editingRecord.id,
        values: {
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          setLoading(false);
          message.success(`Status akun berhasil diubah menjadi ${nextStatus}.`);
          onSuccess?.();
          onClose();
        },
        onError: (err: any) => {
          setLoading(false);
          message.error(err?.message || "Gagal mengubah status akun");
        },
      }
    );
  };

  // Validator untuk email unik
  const validateUniqueEmail = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const cleanEmail = value.trim().toLowerCase();
    const allUsers = (mockDb["users"] || []) as IManagedUser[];
    const exists = allUsers.some(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        (action === "create" || u.id !== editingRecord?.id)
    );
    if (exists) {
      return Promise.reject(new Error("Email sudah digunakan oleh pengguna lain"));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16 }}>
          {action === "create" ? (
            <>
              <UserAddOutlined style={{ color: "#0d9488" }} />
              <span>Tambah Pengguna Baru</span>
            </>
          ) : (
            <>
              <EditOutlined style={{ color: "#0d9488" }} />
              <span>Ubah Data Pengguna</span>
            </>
          )}
        </div>
      }
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Batal
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ background: "#1f2937", borderColor: "#1f2937" }}
          loading={loading}
          onClick={handleSubmit}
        >
          {action === "create" ? "Kirim Undangan" : "Simpan Perubahan"}
        </Button>,
      ]}
      destroyOnClose
      width={520}
    >
      <Divider style={{ margin: "12px 0 16px" }} />

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          role: "Pegawai",
          status: "Aktif",
        }}
      >
        <Form.Item
          label="Nama Lengkap"
          name="name"
          rules={[
            { required: true, message: "Nama lengkap wajib diisi" },
            { min: 3, message: "Nama minimal 3 karakter" },
          ]}
        >
          <Input placeholder="Contoh: Budi Santoso" />
        </Form.Item>

        <Form.Item
          label="Email Pegawai"
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
            { validator: validateUniqueEmail },
          ]}
          extra={
            action === "create" && (
              <span style={{ fontSize: 12, color: "#64748b" }}>
                <MailOutlined style={{ marginRight: 4 }} />
                Undangan akses akun akan dikirimkan otomatis ke email ini.
              </span>
            )
          }
        >
          <Input placeholder="Contoh: nama.pegawai@contoh.go.id" />
        </Form.Item>

        <Form.Item
          label="Unit Kerja"
          name="unit"
          rules={[{ required: true, message: "Unit kerja wajib diisi" }]}
        >
          <Input placeholder="Contoh: Unit Arsip, Biro KU, Tim K3" />
        </Form.Item>

        <Form.Item
          label={
            <Space size={4}>
              <span>Peran (Role)</span>
              {isSelf && (
                <Tooltip title="Admin tidak dapat menurunkan peran akunnya sendiri.">
                  <InfoCircleOutlined style={{ color: "#f59e0b" }} />
                </Tooltip>
              )}
            </Space>
          }
          name="role"
          rules={[{ required: true, message: "Peran wajib dipilih" }]}
        >
          <Select
            placeholder="Pilih peran pengguna"
            disabled={isSelf}
            options={SYSTEM_ROLES.map((r) => ({
              label: (
                <Space>
                  <RoleTag role={r} />
                </Space>
              ),
              value: r,
            }))}
          />
        </Form.Item>

        {action === "edit" && (
          <Form.Item
            label={
              <Space size={4}>
                <span>Status Akun</span>
                {isSelf && (
                  <Tooltip title="Admin tidak dapat menonaktifkan akunnya sendiri.">
                    <InfoCircleOutlined style={{ color: "#f59e0b" }} />
                  </Tooltip>
                )}
              </Space>
            }
            name="status"
            rules={[{ required: true, message: "Status akun wajib dipilih" }]}
          >
            <Select
              disabled={isSelf}
              options={[
                { label: "Aktif", value: "Aktif" },
                {
                  label: "Nonaktif",
                  value: "Nonaktif",
                  disabled: isSelf,
                },
              ]}
            />
          </Form.Item>
        )}

        {action === "edit" && editingRecord && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: "#f9fafb",
              borderRadius: 8,
              border: "1px dashed #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>
                Aksi Cepat Status Akun
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {editingRecord.status === "Nonaktif"
                  ? "Akun saat ini nonaktif. Anda dapat mengaktifkannya kembali."
                  : "Nonaktifkan akun untuk mencabut akses ke aplikasi PRIMA K3."}
              </div>
            </div>

            {isSelf ? (
              <Tooltip title="Admin tidak dapat menonaktifkan akun sendiri.">
                <Button danger disabled icon={<StopOutlined />}>
                  Nonaktifkan Akun
                </Button>
              </Tooltip>
            ) : editingRecord.status === "Nonaktif" ? (
              <Popconfirm
                title="Aktifkan Akun Pengguna"
                description={`Apakah Anda yakin ingin mengaktifkan kembali akun ${editingRecord.name}?`}
                onConfirm={handleToggleStatus}
                okText="Ya, Aktifkan"
                cancelText="Batal"
              >
                <Button
                  style={{ color: "#16a34a", borderColor: "#86efac" }}
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                >
                  Aktifkan Akun
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Nonaktifkan Akun Pengguna"
                description={`Apakah Anda yakin ingin menonaktifkan akun ${editingRecord.name}?`}
                onConfirm={handleToggleStatus}
                okText="Ya, Nonaktifkan"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<StopOutlined />} loading={loading}>
                  Nonaktifkan Akun
                </Button>
              </Popconfirm>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );
};
