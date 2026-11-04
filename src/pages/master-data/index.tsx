import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  Popconfirm,
  Descriptions,
  App as AntdApp,
  Card,
  Segmented,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DatabaseOutlined,
  UserOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  CrownFilled,
} from "@ant-design/icons";
import {
  MasterDataType,
  IMasterUser,
  IMasterRole,
  IMasterCategory,
  IMasterUnit,
  IMasterLocation,
  IMasterDisease,
} from "../../types/masterData";
import {
  getMasterUsers,
  saveMasterUsers,
  getMasterRoles,
  saveMasterRoles,
  getMasterCategories,
  saveMasterCategories,
  getMasterUnits,
  saveMasterUnits,
  getMasterLocations,
  saveMasterLocations,
  getMasterDiseases,
  saveMasterDiseases,
} from "../../mocks/masterData";
import { SYSTEM_ROLES } from "../../mocks/rolePermissions";
import { RoleTag } from "../kelola-user/components/RoleTag";
import { StatusTag } from "../kelola-user/components/StatusTag";

const { Title, Paragraph } = Typography;

export const MasterDataPage: React.FC = () => {
  const { message } = AntdApp.useApp();

  // Active Tab
  const [activeTab, setActiveTab] = useState<MasterDataType>("users");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [users, setUsers] = useState<IMasterUser[]>(() => getMasterUsers());
  const [roles, setRoles] = useState<IMasterRole[]>(() => getMasterRoles());
  const [categories, setCategories] = useState<IMasterCategory[]>(() => getMasterCategories());
  const [units, setUnits] = useState<IMasterUnit[]>(() => getMasterUnits());
  const [locations, setLocations] = useState<IMasterLocation[]>(() => getMasterLocations());
  const [diseases, setDiseases] = useState<IMasterDisease[]>(() => getMasterDiseases());

  // Modal states
  const [modalMode, setModalMode] = useState<"create" | "edit" | "show" | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // Listen to storage events
  useEffect(() => {
    const handleMasterUpdate = () => {
      setUsers(getMasterUsers());
      setRoles(getMasterRoles());
      setCategories(getMasterCategories());
      setUnits(getMasterUnits());
      setLocations(getMasterLocations());
      setDiseases(getMasterDiseases());
    };
    window.addEventListener("prima_master_data_updated", handleMasterUpdate);
    window.addEventListener("prima_managed_users_updated", handleMasterUpdate);
    return () => {
      window.removeEventListener("prima_master_data_updated", handleMasterUpdate);
      window.removeEventListener("prima_managed_users_updated", handleMasterUpdate);
    };
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    form.resetFields();
    setSelectedRecord(null);
    setModalMode("create");
  };

  // Open Edit Modal
  const handleOpenEdit = (record: any) => {
    setSelectedRecord(record);
    form.setFieldsValue({ ...record });
    setModalMode("edit");
  };

  // Open Show Modal
  const handleOpenShow = (record: any) => {
    setSelectedRecord(record);
    setModalMode("show");
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedRecord(null);
    form.resetFields();
  };

  // Delete Action
  const handleDelete = (id: number) => {
    if (activeTab === "users") {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      saveMasterUsers(updated);
    } else if (activeTab === "roles") {
      const updated = roles.filter((r) => r.id !== id);
      setRoles(updated);
      saveMasterRoles(updated);
    } else if (activeTab === "categories") {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveMasterCategories(updated);
    } else if (activeTab === "units") {
      const updated = units.filter((u) => u.id !== id);
      setUnits(updated);
      saveMasterUnits(updated);
    } else if (activeTab === "locations") {
      const updated = locations.filter((l) => l.id !== id);
      setLocations(updated);
      saveMasterLocations(updated);
    } else if (activeTab === "diseases") {
      const updated = diseases.filter((d) => d.id !== id);
      setDiseases(updated);
      saveMasterDiseases(updated);
    }
    message.success("Data berhasil dihapus.");
  };

  // Form Submit (Create or Edit)
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (modalMode === "create") {
        const newId = Date.now();
        const now = new Date().toISOString();

        if (activeTab === "users") {
          const newItem: IMasterUser = {
            id: newId,
            ...values,
            createdAt: now,
          };
          const updated = [newItem, ...users];
          setUsers(updated);
          saveMasterUsers(updated);
        } else if (activeTab === "roles") {
          const newItem: IMasterRole = {
            id: newId,
            ...values,
            createdAt: now,
          };
          const updated = [newItem, ...roles];
          setRoles(updated);
          saveMasterRoles(updated);
        } else if (activeTab === "categories") {
          const newItem: IMasterCategory = {
            id: newId,
            ...values,
            createdAt: now,
          };
          const updated = [newItem, ...categories];
          setCategories(updated);
          saveMasterCategories(updated);
        } else if (activeTab === "units") {
          const newItem: IMasterUnit = {
            id: newId,
            ...values,
            employeeCount: Number(values.employeeCount) || 0,
            createdAt: now,
          };
          const updated = [newItem, ...units];
          setUnits(updated);
          saveMasterUnits(updated);
        } else if (activeTab === "locations") {
          const newItem: IMasterLocation = {
            id: newId,
            ...values,
            createdAt: now,
          };
          const updated = [newItem, ...locations];
          setLocations(updated);
          saveMasterLocations(updated);
        } else if (activeTab === "diseases") {
          const newItem: IMasterDisease = {
            id: newId,
            ...values,
            createdAt: now,
          };
          const updated = [newItem, ...diseases];
          setDiseases(updated);
          saveMasterDiseases(updated);
        }
        message.success("Data baru berhasil ditambahkan.");
      } else if (modalMode === "edit" && selectedRecord) {
        const now = new Date().toISOString();

        if (activeTab === "users") {
          const updated = users.map((u) =>
            u.id === selectedRecord.id ? { ...u, ...values, updatedAt: now } : u
          );
          setUsers(updated);
          saveMasterUsers(updated);
        } else if (activeTab === "roles") {
          const updated = roles.map((r) =>
            r.id === selectedRecord.id ? { ...r, ...values } : r
          );
          setRoles(updated);
          saveMasterRoles(updated);
        } else if (activeTab === "categories") {
          const updated = categories.map((c) =>
            c.id === selectedRecord.id ? { ...c, ...values } : c
          );
          setCategories(updated);
          saveMasterCategories(updated);
        } else if (activeTab === "units") {
          const updated = units.map((u) =>
            u.id === selectedRecord.id
              ? { ...u, ...values, employeeCount: Number(values.employeeCount) || 0 }
              : u
          );
          setUnits(updated);
          saveMasterUnits(updated);
        } else if (activeTab === "locations") {
          const updated = locations.map((l) =>
            l.id === selectedRecord.id ? { ...l, ...values } : l
          );
          setLocations(updated);
          saveMasterLocations(updated);
        } else if (activeTab === "diseases") {
          const updated = diseases.map((d) =>
            d.id === selectedRecord.id ? { ...d, ...values } : d
          );
          setDiseases(updated);
          saveMasterDiseases(updated);
        }
        message.success("Data berhasil diperbarui.");
      }

      handleCloseModal();
    } catch {
      // Form validation error
    }
  };

  // Filtered dataset based on search query
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let dataset: any[] = [];

    if (activeTab === "users") dataset = users;
    else if (activeTab === "roles") dataset = roles;
    else if (activeTab === "categories") dataset = categories;
    else if (activeTab === "units") dataset = units;
    else if (activeTab === "locations") dataset = locations;
    else if (activeTab === "diseases") dataset = diseases;

    if (!q) return dataset;

    return dataset.filter((item) => {
      return Object.values(item).some((val) => {
        if (typeof val === "string") return val.toLowerCase().includes(q);
        if (typeof val === "number") return String(val).includes(q);
        return false;
      });
    });
  }, [activeTab, searchQuery, users, roles, categories, units, locations, diseases]);

  // Tab configurations
  const tabOptions = [
    {
      value: "users",
      label: (
        <Space size={6}>
          <UserOutlined style={{ color: "#2563eb" }} />
          <span>Pengguna ({users.length})</span>
        </Space>
      ),
    },
    {
      value: "categories",
      label: (
        <Space size={6}>
          <TagOutlined style={{ color: "#ea580c" }} />
          <span>Kategori Bahaya ({categories.length})</span>
        </Space>
      ),
    },
    {
      value: "roles",
      label: (
        <Space size={6}>
          <SafetyCertificateOutlined style={{ color: "#7c3aed" }} />
          <span>Role Sistem ({roles.length})</span>
        </Space>
      ),
    },
    {
      value: "units",
      label: (
        <Space size={6}>
          <ApartmentOutlined style={{ color: "#0891b2" }} />
          <span>Unit Kerja ({units.length})</span>
        </Space>
      ),
    },
    {
      value: "locations",
      label: (
        <Space size={6}>
          <EnvironmentOutlined style={{ color: "#16a34a" }} />
          <span>Lokasi & Gedung ({locations.length})</span>
        </Space>
      ),
    },
    {
      value: "diseases",
      label: (
        <Space size={6}>
          <MedicineBoxOutlined style={{ color: "#db2777" }} />
          <span>Penyakit ({diseases.length})</span>
        </Space>
      ),
    },
  ];

  // Action column renderer
  const renderActionColumn = (_: any, record: any) => (
    <Space size="small">
      {/* Show (Detail) */}
      <Tooltip title="Lihat Detail Data">
        <Button
          size="small"
          type="text"
          icon={<EyeOutlined style={{ color: "#2563eb" }} />}
          onClick={() => handleOpenShow(record)}
        />
      </Tooltip>

      {/* Update (Edit) */}
      <Tooltip title="Ubah Data">
        <Button
          size="small"
          type="text"
          icon={<EditOutlined style={{ color: "#ea580c" }} />}
          onClick={() => handleOpenEdit(record)}
        />
      </Tooltip>

      {/* Delete (Hapus) */}
      <Tooltip title="Hapus Data">
        <Popconfirm
          title="Hapus Data Master"
          description="Apakah Anda yakin ingin menghapus data ini dari sistem?"
          onConfirm={() => handleDelete(record.id)}
          okText="Ya, Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true }}
        >
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </Tooltip>
    </Space>
  );

  // Dynamic Table Columns
  const columns: any[] = useMemo(() => {
    if (activeTab === "users") {
      return [
        {
          title: "Nama Pengguna",
          dataIndex: "name",
          key: "name",
          render: (name: string, r: IMasterUser) => (
            <div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>{name}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{r.email}</div>
            </div>
          ),
        },
        {
          title: "Unit Kerja",
          dataIndex: "unit",
          key: "unit",
        },
        {
          title: "Peran / Role",
          dataIndex: "role",
          key: "role",
          render: (role: any) => <RoleTag role={role} />,
        },
        {
          title: "Status Akun",
          dataIndex: "status",
          key: "status",
          render: (status: any) => <StatusTag status={status} />,
        },
        {
          title: "Aksi",
          key: "action",
          width: 120,
          align: "center" as const,
          render: renderActionColumn,
        },
      ];
    }

    if (activeTab === "categories") {
      return [
        {
          title: "Kode",
          dataIndex: "code",
          key: "code",
          width: 140,
          render: (code: string) => <Tag color="blue">{code}</Tag>,
        },
        {
          title: "Nama Kategori",
          dataIndex: "name",
          key: "name",
          render: (name: string, r: IMasterCategory) => (
            <div>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>{name}</span>
              {r.description && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {r.description}
                </div>
              )}
            </div>
          ),
        },
        {
          title: "Tingkat Bahaya Default",
          dataIndex: "severityDefault",
          key: "severityDefault",
          width: 170,
          render: (sev: string) => {
            const colors: Record<string, string> = {
              Rendah: "green",
              Sedang: "gold",
              Tinggi: "orange",
              Kritis: "red",
            };
            return <Tag color={colors[sev] || "default"}>{sev}</Tag>;
          },
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 110,
          render: (s: string) => (
            <Tag color={s === "Aktif" ? "success" : "default"}>{s}</Tag>
          ),
        },
        {
          title: "Aksi",
          key: "action",
          width: 120,
          align: "center" as const,
          render: renderActionColumn,
        },
      ];
    }

    if (activeTab === "roles") {
      return [
        {
          title: "Level",
          dataIndex: "level",
          key: "level",
          width: 80,
          align: "center" as const,
          render: (lvl: number) => (
            <Tag color="cyan" style={{ borderRadius: 10 }}>
              #{lvl}
            </Tag>
          ),
        },
        {
          title: "Nama Peran",
          dataIndex: "name",
          key: "name",
          render: (name: string, r: IMasterRole) => (
            <div>
              <span style={{ fontWeight: 600, color: r.color || "#1e293b" }}>
                {name}
              </span>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {r.description}
              </div>
            </div>
          ),
        },
        {
          title: "Kode Role",
          dataIndex: "code",
          key: "code",
          width: 170,
          render: (c: string) => <Tag>{c}</Tag>,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 110,
          render: (s: string) => (
            <Tag color={s === "Aktif" ? "success" : "default"}>{s}</Tag>
          ),
        },
        {
          title: "Aksi",
          key: "action",
          width: 120,
          align: "center" as const,
          render: renderActionColumn,
        },
      ];
    }

    if (activeTab === "units") {
      return [
        {
          title: "Kode Unit",
          dataIndex: "code",
          key: "code",
          width: 180,
          render: (c: string) => <Tag color="geekblue">{c}</Tag>,
        },
        {
          title: "Nama Unit Kerja",
          dataIndex: "name",
          key: "name",
          render: (name: string) => (
            <span style={{ fontWeight: 600, color: "#1e293b" }}>{name}</span>
          ),
        },
        {
          title: "Pimpinan Unit",
          dataIndex: "headOfUnit",
          key: "headOfUnit",
        },
        {
          title: "Lokasi",
          dataIndex: "location",
          key: "location",
        },
        {
          title: "Jumlah Pegawai",
          dataIndex: "employeeCount",
          key: "employeeCount",
          width: 130,
          align: "center" as const,
          render: (cnt: number) => <Tag>{cnt} Orang</Tag>,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 100,
          render: (s: string) => (
            <Tag color={s === "Aktif" ? "success" : "default"}>{s}</Tag>
          ),
        },
        {
          title: "Aksi",
          key: "action",
          width: 120,
          align: "center" as const,
          render: renderActionColumn,
        },
      ];
    }

    if (activeTab === "locations") {
      return [
        {
          title: "Kode",
          dataIndex: "code",
          key: "code",
          width: 150,
          render: (c: string) => <Tag color="green">{c}</Tag>,
        },
        {
          title: "Nama Lokasi / Ruangan",
          dataIndex: "name",
          key: "name",
          render: (name: string) => (
            <span style={{ fontWeight: 600, color: "#1e293b" }}>{name}</span>
          ),
        },
        {
          title: "Gedung",
          dataIndex: "building",
          key: "building",
          width: 140,
        },
        {
          title: "Lantai",
          dataIndex: "floor",
          key: "floor",
          width: 130,
        },
        {
          title: "Tingkat Risiko",
          dataIndex: "riskLevel",
          key: "riskLevel",
          width: 140,
          render: (risk: string) => {
            const colors: Record<string, string> = {
              Rendah: "green",
              Sedang: "orange",
              Tinggi: "red",
            };
            return <Tag color={colors[risk] || "default"}>{risk}</Tag>;
          },
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 100,
          render: (s: string) => (
            <Tag color={s === "Aktif" ? "success" : "default"}>{s}</Tag>
          ),
        },
        {
          title: "Aksi",
          key: "action",
          width: 120,
          align: "center" as const,
          render: renderActionColumn,
        },
      ];
    }

    // Default: diseases
    return [
      {
        title: "Kode",
        dataIndex: "code",
        key: "code",
        width: 120,
        render: (c: string) => <Tag color="magenta">{c}</Tag>,
      },
      {
        title: "Nama Penyakit",
        dataIndex: "name",
        key: "name",
        render: (name: string, r: IMasterDisease) => (
          <div>
            <span style={{ fontWeight: 600, color: "#1e293b" }}>{name}</span>
            {r.description && (
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                {r.description}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Kategori",
        dataIndex: "category",
        key: "category",
        width: 190,
        render: (cat: string) => <Tag color="purple">{cat}</Tag>,
      },
      {
        title: "Tingkat Risiko",
        dataIndex: "riskLevel",
        key: "riskLevel",
        width: 130,
        render: (risk: string) => {
          const colors: Record<string, string> = {
            Rendah: "green",
            Sedang: "orange",
            Tinggi: "red",
          };
          return <Tag color={colors[risk] || "default"}>{risk}</Tag>;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (s: string) => (
          <Tag color={s === "Aktif" ? "success" : "default"}>{s}</Tag>
        ),
      },
      {
        title: "Aksi",
        key: "action",
        width: 120,
        align: "center" as const,
        render: renderActionColumn,
      },
    ];
  }, [activeTab]);

  // Form Fields Renderer depending on active tab
  const renderFormFields = () => {
    if (activeTab === "users") {
      return (
        <>
          <Form.Item
            name="name"
            label="Nama Lengkap"
            rules={[{ required: true, message: "Nama wajib diisi" }]}
          >
            <Input placeholder="Contoh: Dr. Budi Santoso" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email ANRI / Resmi"
            rules={[
              { required: true, message: "Email wajib diisi" },
              { type: "email", message: "Format email tidak valid" },
            ]}
          >
            <Input placeholder="user@anri.go.id" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit Kerja"
            rules={[{ required: true, message: "Unit kerja wajib dipilih" }]}
          >
            <Select
              placeholder="Pilih unit kerja"
              options={units.map((u) => ({ value: u.name, label: u.name }))}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Peran / Role Sistem"
            rules={[{ required: true, message: "Peran wajib dipilih" }]}
          >
            <Select
              placeholder="Pilih peran pengguna"
              options={SYSTEM_ROLES.map((r) => ({ value: r, label: r }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Pengguna"
            initialValue="Aktif"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Aktif", label: "Aktif" },
                { value: "Undangan terkirim", label: "Undangan terkirim" },
                { value: "Nonaktif", label: "Nonaktif" },
              ]}
            />
          </Form.Item>
        </>
      );
    }

    if (activeTab === "categories") {
      return (
        <>
          <Form.Item
            name="code"
            label="Kode Kategori"
            rules={[{ required: true, message: "Kode wajib diisi" }]}
          >
            <Input placeholder="Contoh: unsafe_action" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Kategori"
            rules={[{ required: true, message: "Nama kategori wajib diisi" }]}
          >
            <Input placeholder="Contoh: Unsafe Action (Tindakan Tidak Aman)" />
          </Form.Item>
          <Form.Item
            name="severityDefault"
            label="Tingkat Bahaya Default"
            initialValue="Sedang"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Rendah", label: "Rendah" },
                { value: "Sedang", label: "Sedang" },
                { value: "Tinggi", label: "Tinggi" },
                { value: "Kritis", label: "Kritis" },
              ]}
            />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi Kategori">
            <Input.TextArea rows={3} placeholder="Penjelasan mengenai kategori ini..." />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Kategori"
            initialValue="Aktif"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Aktif", label: "Aktif" },
                { value: "Nonaktif", label: "Nonaktif" },
              ]}
            />
          </Form.Item>
        </>
      );
    }

    if (activeTab === "roles") {
      return (
        <>
          <Form.Item
            name="code"
            label="Kode Role"
            rules={[{ required: true, message: "Kode role wajib diisi" }]}
          >
            <Input placeholder="Contoh: staf_k3" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Peran"
            rules={[{ required: true, message: "Nama peran wajib diisi" }]}
          >
            <Input placeholder="Contoh: Pengawas K3 Lapangan" />
          </Form.Item>
          <Form.Item
            name="level"
            label="Level Akses Hierarki (1 = Tertinggi)"
            initialValue={5}
            rules={[{ required: true }]}
          >
            <Select
              options={[1, 2, 3, 4, 5, 6, 7].map((lvl) => ({
                value: lvl,
                label: `Level ${lvl}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Deskripsi Peran">
            <Input.TextArea rows={3} placeholder="Tanggung jawab dan kewenangan peran ini..." />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Role"
            initialValue="Aktif"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Aktif", label: "Aktif" },
                { value: "Nonaktif", label: "Nonaktif" },
              ]}
            />
          </Form.Item>
        </>
      );
    }

    if (activeTab === "units") {
      return (
        <>
          <Form.Item
            name="code"
            label="Kode Unit Kerja"
            rules={[{ required: true, message: "Kode unit wajib diisi" }]}
          >
            <Input placeholder="Contoh: UNIT-ARSIP-01" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Unit Kerja"
            rules={[{ required: true, message: "Nama unit wajib diisi" }]}
          >
            <Input placeholder="Contoh: Direktorat Preservasi Arsip" />
          </Form.Item>
          <Form.Item
            name="headOfUnit"
            label="Nama Pimpinan Unit"
            rules={[{ required: true, message: "Nama pimpinan wajib diisi" }]}
          >
            <Input placeholder="Contoh: Drs. H. Mulyadi, M.Hum" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Lokasi Gedung / Ruang"
            rules={[{ required: true, message: "Lokasi wajib diisi" }]}
          >
            <Input placeholder="Contoh: Gedung A Lantai 3" />
          </Form.Item>
          <Form.Item name="employeeCount" label="Estimasi Jumlah Pegawai" initialValue={10}>
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Unit"
            initialValue="Aktif"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Aktif", label: "Aktif" },
                { value: "Nonaktif", label: "Nonaktif" },
              ]}
            />
          </Form.Item>
        </>
      );
    }

    if (activeTab === "locations") {
      return (
        <>
          <Form.Item
            name="code"
            label="Kode Lokasi"
            rules={[{ required: true, message: "Kode lokasi wajib diisi" }]}
          >
            <Input placeholder="Contoh: LOK-GD-A-L1" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Nama Ruang / Area"
            rules={[{ required: true, message: "Nama lokasi wajib diisi" }]}
          >
            <Input placeholder="Contoh: Ruang Arsip Lantai 1" />
          </Form.Item>
          <Form.Item
            name="building"
            label="Gedung"
            rules={[{ required: true, message: "Gedung wajib diisi" }]}
          >
            <Input placeholder="Contoh: Gedung A" />
          </Form.Item>
          <Form.Item
            name="floor"
            label="Lantai"
            rules={[{ required: true, message: "Lantai wajib diisi" }]}
          >
            <Input placeholder="Contoh: Lantai 2" />
          </Form.Item>
          <Form.Item
            name="riskLevel"
            label="Tingkat Risiko Lokasi"
            initialValue="Sedang"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Rendah", label: "Rendah" },
                { value: "Sedang", label: "Sedang" },
                { value: "Tinggi", label: "Tinggi" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status Lokasi"
            initialValue="Aktif"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "Aktif", label: "Aktif" },
                { value: "Nonaktif", label: "Nonaktif" },
              ]}
            />
          </Form.Item>
        </>
      );
    }

    // Default: diseases
    return (
      <>
        <Form.Item
          name="code"
          label="Kode Penyakit"
          rules={[{ required: true, message: "Kode penyakit wajib diisi" }]}
        >
          <Input placeholder="Contoh: DIS-007" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Nama Penyakit"
          rules={[{ required: true, message: "Nama penyakit wajib diisi" }]}
        >
          <Input placeholder="Contoh: Carpal Tunnel Syndrome" />
        </Form.Item>
        <Form.Item
          name="category"
          label="Kategori Penyakit"
          initialValue="Penyakit Akibat Kerja"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "Penyakit Umum", label: "Penyakit Umum" },
              { value: "Penyakit Akibat Kerja", label: "Penyakit Akibat Kerja" },
              { value: "Kesehatan Mental", label: "Kesehatan Mental" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="riskLevel"
          label="Tingkat Risiko"
          initialValue="Sedang"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "Rendah", label: "Rendah" },
              { value: "Sedang", label: "Sedang" },
              { value: "Tinggi", label: "Tinggi" },
            ]}
          />
        </Form.Item>
        <Form.Item name="description" label="Deskripsi / Gejala">
          <Input.TextArea rows={3} placeholder="Gejala umum dan penanganan..." />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          initialValue="Aktif"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "Aktif", label: "Aktif" },
              { value: "Nonaktif", label: "Nonaktif" },
            ]}
          />
        </Form.Item>
      </>
    );
  };

  // Detail Modal Content (Show)
  const renderDetailContent = () => {
    if (!selectedRecord) return null;

    const items = Object.entries(selectedRecord).map(([k, v]) => {
      let formattedValue: React.ReactNode = String(v ?? "-");
      if (k === "role") formattedValue = <RoleTag role={v as any} />;
      else if (k === "status") formattedValue = <StatusTag status={v as any} />;
      else if (k === "level") formattedValue = <Tag color="cyan">Level {String(v)}</Tag>;
      else if (k === "color") {
        formattedValue = (
          <Space>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: String(v),
                display: "inline-block",
              }}
            />
            <span>{String(v)}</span>
          </Space>
        );
      }

      return {
        key: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
        children: formattedValue,
      };
    });

    return (
      <Descriptions
        bordered
        column={1}
        size="small"
        items={items}
        labelStyle={{ width: 160, fontWeight: 600, color: "#475569" }}
      />
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Halaman */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Title level={3} style={{ margin: 0, color: "#111827", fontWeight: 700 }}>
              Master Data Sistem K3
            </Title>
            <Tag
              color="gold"
              style={{
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 6,
                padding: "2px 8px",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                border: "1px solid #fde047",
              }}
            >
              <CrownFilled style={{ color: "#d97706" }} />
              Khusus Super Admin
            </Tag>
          </div>
          <Paragraph type="secondary" style={{ margin: "4px 0 0 0", fontSize: 14 }}>
            Kelola data induk sistem K3: Pengguna, Kategori Bahaya, Role, Unit Kerja, Lokasi, dan Penyakit.
          </Paragraph>
        </div>

        {/* Tombol Tambah Data */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          style={{
            background: "#1e293b",
            borderColor: "#1e293b",
            fontWeight: 600,
          }}
        >
          Tambah Data Master
        </Button>
      </div>

      {/* Selector Master Data (Segmented Navigation) */}
      <Card
        bodyStyle={{ padding: "12px 16px" }}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Segmented
          value={activeTab}
          onChange={(val) => {
            setActiveTab(val as MasterDataType);
            setSearchQuery("");
          }}
          options={tabOptions}
          block
          style={{
            padding: 4,
            background: "#f1f5f9",
            fontWeight: 600,
          }}
        />
      </Card>

      {/* Toolbar Pencarian & Jumlah Data */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Input
          placeholder="Cari data pada tabel..."
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 280 }}
        />

        <div style={{ fontSize: 13, color: "#64748b" }}>
          Total <strong>{filteredData.length}</strong> data terdaftar
        </div>
      </div>

      {/* Tabel Data Master */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        <Table<any>
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} item`,
          }}
          size="middle"
        />
      </div>

      {/* Modal Detail (Show) */}
      <Modal
        title={
          <Space>
            <DatabaseOutlined style={{ color: "#2563eb" }} />
            <span>Detail Data Master</span>
          </Space>
        }
        open={modalMode === "show"}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Tutup
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              const rec = selectedRecord;
              setModalMode("edit");
              form.setFieldsValue({ ...rec });
            }}
          >
            Ubah Data Ini
          </Button>,
        ]}
        width={580}
      >
        <div style={{ marginTop: 16 }}>{renderDetailContent()}</div>
      </Modal>

      {/* Modal Form (Create / Edit) */}
      <Modal
        title={
          <Space>
            {modalMode === "create" ? (
              <PlusOutlined style={{ color: "#16a34a" }} />
            ) : (
              <EditOutlined style={{ color: "#ea580c" }} />
            )}
            <span>
              {modalMode === "create" ? "Tambah Data Baru" : "Ubah Data Master"}
            </span>
          </Space>
        }
        open={modalMode === "create" || modalMode === "edit"}
        onCancel={handleCloseModal}
        onOk={handleFormSubmit}
        okText={modalMode === "create" ? "Simpan Data" : "Perbarui Data"}
        cancelText="Batal"
        width={540}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  );
};
