import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Modal,
  Form,
  Typography,
  Tabs,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  TagsOutlined,
  EditOutlined,
  FolderOpenOutlined,
  BookOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useCreate, useUpdate, useDelete, useGetIdentity } from "@refinedev/core";
import {
  IHazardReport,
  IHazardCategoryItem,
  HazardCategory,
  HazardStatus,
} from "../../../types/hazard";
import { IUser } from "../../../types/user";
import { StatusStepper } from "../../../components/common/StatusStepper";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

// Opsi pilihan warna badge kategori
const COLOR_OPTIONS = [
  { label: "Orange (Near Miss / Peringatan Awal)", value: "orange", color: "#f97316" },
  { label: "Volcano (Unsafe Action / Tindakan Bahaya)", value: "volcano", color: "#ea580c" },
  { label: "Red (Unsafe Condition / Kondisi Kritis)", value: "red", color: "#ef4444" },
  { label: "Magenta (Fire Hazard / Bahaya Kebakaran)", value: "magenta", color: "#d946ef" },
  { label: "Purple (Biological / Ergonomic Risk)", value: "purple", color: "#a855f7" },
  { label: "Blue (Fisik / Ergonomi Kerja)", value: "blue", color: "#3b82f6" },
  { label: "Cyan (Bahaya Kimia / Zat Beracun)", value: "cyan", color: "#06b6d4" },
  { label: "Green (Lingkungan / Higiene Industri)", value: "green", color: "#10b981" },
  { label: "Gold (Kelistrikan / Mekanikal)", value: "gold", color: "#eab308" },
];

export const HazardReportList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();

  // Main Tab: "reports" (Laporan) atau "categories" (Kategori)
  const [activeMainTab, setActiveMainTab] = useState<string>("reports");

  // State untuk Laporan Bahaya
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<IHazardReport | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // State untuk Kategori
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IHazardCategoryItem | null>(null);

  const [statusForm] = Form.useForm();
  const [categoryForm] = Form.useForm();

  // Refine mutations
  const { mutate: updateReport } = useUpdate();
  const { mutate: deleteReport } = useDelete();
  const { mutate: createCategory, mutation: createCategoryMutation } = useCreate();
  const { mutate: updateCategory, mutation: updateCategoryMutation } = useUpdate();
  const { mutate: deleteCategory } = useDelete();

  // Refine Table hook untuk Laporan Bahaya
  const { tableProps, setFilters } = useTable<IHazardReport>({
    resource: "hazard-reports",
    pagination: { pageSize: 10 },
  });

  // Refine Table hook untuk Master Kategori Bahaya
  const {
    tableProps: categoryTableProps,
    setFilters: setCategoryFilters,
  } = useTable<IHazardCategoryItem>({
    resource: "hazard-categories",
    pagination: { pageSize: 10 },
  });

  const canManageStatus = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const allReports = (tableProps.dataSource || []) as IHazardReport[];
  const allCategories = (categoryTableProps.dataSource || []) as IHazardCategoryItem[];

  const inProgressCount = allReports.filter(
    (r) => r.status === "in_progress" || r.status === "reported" || r.status === "verified"
  ).length;
  const resolvedCount = allReports.filter((r) => r.status === "resolved").length;

  // Category Tag badge resolver
  const renderCategoryTag = (cat: HazardCategory) => {
    const matched = allCategories.find((c) => c.code === cat);
    const color = matched?.color || (
      cat === "near_miss" ? "orange" :
      cat === "unsafe_action" ? "volcano" :
      cat === "unsafe_condition" ? "red" : "default"
    );
    const label = matched?.name || (
      cat === "near_miss" ? "Near Miss" :
      cat === "unsafe_action" ? "Unsafe Action" :
      cat === "unsafe_condition" ? "Unsafe Condition" : cat
    );

    return (
      <Tag
        color={color}
        style={{
          borderRadius: 6,
          fontWeight: 600,
          whiteSpace: "normal",
          wordBreak: "break-word",
          display: "inline-block",
          lineHeight: 1.35,
          padding: "3px 8px",
          margin: 0,
          maxWidth: "100%",
        }}
      >
        {label}
      </Tag>
    );
  };

  // Status Tag
  const renderStatusTag = (st: HazardStatus | string) => {
    switch (st) {
      case "reported":
      case "dilaporkan":
        return <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>● Dilaporkan</Tag>;
      case "verified":
      case "diverifikasi":
        return <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>● Diverifikasi</Tag>;
      case "in_progress":
      case "dalam penanganan":
        return <Tag color="gold" style={{ borderRadius: 6, fontWeight: 600 }}>⏳ Penanganan</Tag>;
      case "selesai":
      case "resolved":
        return <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>✔ Selesai</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{st}</Tag>;
    }
  };

  // Handler Status Modal Laporan
  const handleOpenStatusModal = (record: IHazardReport) => {
    setActiveReport(record);
    statusForm.setFieldsValue({
      status: record.status,
      notes: "",
    });
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = (values: { status: HazardStatus; notes?: string }) => {
    if (!activeReport) return;

    const newHistory = [
      ...(activeReport.statusHistory || []),
      {
        status: values.status,
        changedBy: currentUser?.name || "Admin",
        changedAt: new Date().toLocaleString("id-ID"),
        notes: values.notes,
      },
    ];

    updateReport({
      resource: "hazard-reports",
      id: activeReport.id,
      values: {
        status: values.status,
        statusHistory: newHistory,
      },
      successNotification: {
        message: "Status Berhasil Diperbarui",
        description: `Laporan ${activeReport.reportNumber} status kini menjadi ${values.status}`,
        type: "success",
      },
    });

    setStatusModalOpen(false);
  };

  // Handler Create/Edit Kategori Modal
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    categoryForm.resetFields();
    categoryForm.setFieldsValue({
      color: "orange",
    });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (record: IHazardCategoryItem) => {
    setEditingCategory(record);
    categoryForm.setFieldsValue({
      code: record.code,
      name: record.name,
      description: record.description,
      color: record.color || "orange",
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (values: {
    code: string;
    name: string;
    description: string;
    color: string;
  }) => {
    const normalizedCode = values.code.trim().toLowerCase().replace(/\s+/g, "_");
    const payload = {
      ...values,
      code: normalizedCode,
    };

    if (editingCategory) {
      updateCategory({
        resource: "hazard-categories",
        id: editingCategory.id,
        values: payload,
        successNotification: {
          message: "Kategori Berhasil Diperbarui",
          description: `Kategori "${payload.name}" berhasil diubah.`,
          type: "success",
        },
      });
    } else {
      createCategory({
        resource: "hazard-categories",
        values: payload,
        successNotification: {
          message: "Kategori Berhasil Ditambahkan",
          description: `Kategori "${payload.name}" telah ditambahkan ke sistem.`,
          type: "success",
        },
      });
    }

    setCategoryModalOpen(false);
  };

  // Columns untuk Tabel Laporan Bahaya
  const reportColumns = [
    {
      title: "No. Laporan",
      dataIndex: "reportNumber",
      key: "reportNumber",
      width: 140,
      render: (val: string, record: IHazardReport) => (
        <a
          onClick={() => {
            setActiveReport(record);
            setDetailModalOpen(true);
          }}
          style={{ fontWeight: 700, color: "#0d9488" }}
        >
          {val}
        </a>
      ),
    },
    {
      title: "Tanggal Pelaporan",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (val: string) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }}>{val}</span>
      ),
    },
    {
      title: "Kategori Bahaya",
      dataIndex: "category",
      key: "category",
      width: 190,
      render: (val: HazardCategory) => renderCategoryTag(val),
    },
    {
      title: "Lokasi & Unit Kerja",
      key: "location",
      width: 220,
      render: (_: unknown, record: IHazardReport) => (
        <div style={{ wordBreak: "break-word" }}>
          <div style={{ fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>{record.location}</div>
          <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4, display: "block", marginTop: 2 }}>
            {record.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Deskripsi Temuan",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (val: string) => (
        <span style={{ fontSize: 13, color: "#334155" }}>{val}</span>
      ),
    },
    {
      title: "Pelapor",
      dataIndex: "reporterName",
      key: "reporterName",
      width: 140,
      render: (val: string) => (
        <span style={{ fontWeight: 600, color: "#475569" }}>{val}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (val: string) => renderStatusTag(val),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 190,
      render: (_: unknown, record: IHazardReport) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: 6 }}
            onClick={() => {
              setActiveReport(record);
              setDetailModalOpen(true);
            }}
          >
            Detail
          </Button>

          {canManageStatus && (
            <Button
              size="small"
              type="primary"
              className="btn-safety-primary"
              style={{ fontSize: 11, height: 26, padding: "0 8px" }}
              onClick={() => handleOpenStatusModal(record)}
            >
              Ubah Status
            </Button>
          )}

          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Laporan Bahaya?"
              description="Data laporan ini akan dihapus secara permanen."
              okText="Ya, Hapus"
              cancelText="Batal"
              okButtonProps={{ danger: true }}
              onConfirm={() =>
                deleteReport({
                  resource: "hazard-reports",
                  id: record.id,
                })
              }
            >
              <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Columns untuk Tabel Master Kategori
  const categoryColumns = [
    {
      title: "No.",
      width: 60,
      align: "center" as const,
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{ fontWeight: 600, color: "#64748b" }}>{index + 1}</span>
      ),
    },
    {
      title: "Kode Kategori",
      dataIndex: "code",
      key: "code",
      width: 160,
      render: (val: string) => (
        <Tag
          style={{
            fontFamily: "monospace",
            borderRadius: 6,
            fontWeight: 700,
            color: "#0f172a",
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            padding: "2px 8px",
          }}
        >
          {val}
        </Tag>
      ),
    },
    {
      title: "Nama Kategori",
      dataIndex: "name",
      key: "name",
      width: 220,
      render: (val: string, record: IHazardCategoryItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                COLOR_OPTIONS.find((c) => c.value === record.color)?.color || "#d97706",
              boxShadow: "0 0 6px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13.5 }}>{val}</span>
        </div>
      ),
    },
    {
      title: "Tampilan Badge",
      key: "badgePreview",
      width: 180,
      render: (_: unknown, record: IHazardCategoryItem) => (
        <Tag color={record.color} style={{ borderRadius: 6, fontWeight: 600, padding: "2px 10px" }}>
          {record.name}
        </Tag>
      ),
    },
    {
      title: "Deskripsi",
      dataIndex: "description",
      key: "description",
      render: (val: string) => (
        <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{val}</span>
      ),
    },
    {
      title: "Laporan Terkait",
      key: "reportsCount",
      width: 140,
      align: "center" as const,
      render: (_: unknown, record: IHazardCategoryItem) => {
        const count = allReports.filter((r) => r.category === record.code).length;
        return (
          <Tag
            color={count > 0 ? "orange" : "default"}
            style={{ borderRadius: 12, fontWeight: 700, padding: "2px 10px" }}
          >
            {count} Laporan
          </Tag>
        );
      },
    },
    {
      title: "Aksi",
      key: "actions",
      width: 150,
      align: "center" as const,
      render: (_: unknown, record: IHazardCategoryItem) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            style={{ borderRadius: 6, fontWeight: 600 }}
            onClick={() => handleOpenEditCategory(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus Kategori Bahaya?"
            description="Laporan yang sudah menggunakan kategori ini tidak akan terhapus. Lanjutkan?"
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
            onConfirm={() =>
              deleteCategory({
                resource: "hazard-categories",
                id: record.id,
                successNotification: {
                  message: "Kategori Dihapus",
                  description: `Kategori "${record.name}" berhasil dihapus.`,
                  type: "success",
                },
              })
            }
          >
            <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter sub-tabs kategori di tab Laporan
  const filterTabItems = [
    { key: "all", label: "Semua Kategori" },
    ...allCategories.map((c) => ({
      key: c.code,
      label: c.name,
    })),
  ];

  const handleSubTabChange = (key: string) => {
    setSelectedCategory(key);
    if (key === "all") {
      setFilters([], "replace");
    } else {
      setFilters([{ field: "category", operator: "eq", value: key }], "replace");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="safety-hero-banner safety-banner-hazard">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={17}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <WarningOutlined /> PREVENTIVE SAFETY ACTION
              </Tag>
              <span style={{ fontSize: 13, color: "#fef3c7" }}>Pelaporan Potensi Bahaya & Resiko Kerja</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Pencatatan Potensi Bahaya & Resiko (Near Miss)
            </Title>
            <Paragraph style={{ color: "#fef3c7", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Deteksi dini kondisi dan tindakan tidak aman di lingkungan kerja ANRI untuk mencegah insiden sebelum terjadi kerugian fisik maupun arsip negara.
            </Paragraph>
          </Col>

          <Col xs={24} md={7} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(6px)",
                padding: "12px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#fef3c7", fontWeight: 600 }}>TOTAL TEMUAN BAHAYA</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {allReports.length} <span style={{ fontSize: 13, fontWeight: 400 }}>Laporan</span>
              </div>
              <Tag color="orange" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● {inProgressCount} Dalam Tindak Lanjut
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fef3c7", color: "#d97706" }}>
              <WarningOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Laporan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allReports.length} Kasus</div>
              <Text style={{ fontSize: 11.5, color: "#d97706", fontWeight: 600 }}>Terdata di Sistem</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fff7ed", color: "#ea580c" }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Dalam Penanganan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{inProgressCount} Laporan</div>
              <Text style={{ fontSize: 11.5, color: "#ea580c", fontWeight: 600 }}>Tindak Lanjut Aktif</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Selesai / Tuntas</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{resolvedCount} Bahaya</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Mitigasi Berhasil</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <TagsOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Kategori Terdaftar</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allCategories.length} Kategori</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Standar K3 ANRI</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Main Tabs Navigation: Laporan Bahaya & Resiko vs Kategori */}
      <Tabs
        activeKey={activeMainTab}
        onChange={(k) => setActiveMainTab(k)}
        className="safety-main-tabs"
        type="card"
        items={[
          {
            key: "reports",
            label: (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined />
                <span>Laporan Bahaya & Resiko</span>
                <Tag
                  style={{
                    marginLeft: 4,
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    background: activeMainTab === "reports" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.06)",
                    color: activeMainTab === "reports" ? "#ffffff" : "#475569",
                    border: "none",
                  }}
                >
                  {allReports.length}
                </Tag>
              </span>
            ),
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Control Filter Bar & Tombol Lapor Kontras */}
                <div
                  className="safety-card-animate safety-delay-2"
                  style={{
                    background: "#ffffff",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <Input
                      placeholder="Cari lokasi, deskripsi atau pelapor..."
                      prefix={<SearchOutlined style={{ color: "#d97706" }} />}
                      style={{ width: 280, borderRadius: 8 }}
                      allowClear
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilters(
                          val ? [{ field: "description", operator: "contains", value: val }] : [],
                          "merge"
                        );
                      }}
                    />

                    <Select
                      placeholder="Filter Status Tindak Lanjut"
                      style={{ width: 200 }}
                      allowClear
                      onChange={(val) => {
                        setFilters(
                          val ? [{ field: "status", operator: "eq", value: val }] : [],
                          "merge"
                        );
                      }}
                    >
                      <Select.Option value="reported">Dilaporkan</Select.Option>
                      <Select.Option value="verified">Diverifikasi (Tim K3)</Select.Option>
                      <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
                      <Select.Option value="resolved">Selesai</Select.Option>
                    </Select>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    className="btn-safety-hazard"
                    style={{ height: 40, padding: "0 20px" }}
                    onClick={() => navigate("/keselamatan/bahaya-resiko/create")}
                  >
                    Lapor Bahaya Baru
                  </Button>
                </div>

                {/* Content Card & Tabel Laporan */}
                <Card
                  className="safety-content-card safety-card-animate safety-delay-3"
                  bordered={false}
                >
                  <Tabs
                    activeKey={selectedCategory}
                    onChange={handleSubTabChange}
                    items={filterTabItems}
                    style={{ marginBottom: 12 }}
                  />

                  <Table
                    {...tableProps}
                    columns={reportColumns}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{
                      ...tableProps.pagination,
                      showSizeChanger: true,
                      pageSizeOptions: ["10", "20", "50"],
                    }}
                  />
                </Card>

                {/* Rekomendasi Mitigasi K3 */}
                <div className="safety-card-animate safety-delay-4">
                  <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
                    🛡️ Prinsip Tanggap Cepat Bahaya & Resiko di Tempat Kerja
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <div className="safety-tip-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "#fef3c7",
                              color: "#d97706",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                            }}
                          >
                            <AlertOutlined />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Laporkan Segera</div>
                        </div>
                        <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          Jangan abaikan kabel terkelupas, lantai licin tanpa tanda peringatan, atau tumpukan beban melebihi kapasitas di ruang simpan arsip.
                        </Paragraph>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="safety-tip-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "#fff7ed",
                              color: "#ea580c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                            }}
                          >
                            <ToolOutlined />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Pasang Barikade</div>
                        </div>
                        <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          Sebelum perbaikan teknis selesai dilakukan, pasang safety line atau kerucut pengaman (cone) agar rekan kerja terhindar dari potensi cedera.
                        </Paragraph>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div className="safety-tip-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "#ecfdf5",
                              color: "#059669",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                            }}
                          >
                            <ThunderboltOutlined />
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Verifikasi & Tindak Lanjut</div>
                        </div>
                        <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          Tim K3 wajib memverifikasi setiap laporan bahaya maksimal 1x24 jam dan berkoordinasi dengan pengelola gedung dan sarana prasarana.
                        </Paragraph>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            ),
          },
          {
            key: "categories",
            label: (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <TagsOutlined />
                <span>Kategori</span>
                <Tag
                  style={{
                    marginLeft: 4,
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    background: activeMainTab === "categories" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.06)",
                    color: activeMainTab === "categories" ? "#ffffff" : "#475569",
                    border: "none",
                  }}
                >
                  {allCategories.length}
                </Tag>
              </span>
            ),
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Control Action Bar Kategori */}
                <div
                  className="safety-card-animate safety-delay-2"
                  style={{
                    background: "#ffffff",
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <Input
                      placeholder="Cari nama, kode atau deskripsi kategori..."
                      prefix={<SearchOutlined style={{ color: "#d97706" }} />}
                      style={{ width: 320, borderRadius: 8 }}
                      allowClear
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategoryFilters(
                          val ? [{ field: "name", operator: "contains", value: val }] : [],
                          "replace"
                        );
                      }}
                    />
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                      Menampilkan <strong style={{ color: "#0f172a" }}>{allCategories.length}</strong> jenis klasifikasi bahaya kerja
                    </div>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    className="btn-safety-hazard"
                    style={{ height: 40, padding: "0 20px" }}
                    onClick={handleOpenCreateCategory}
                  >
                    Tambah Kategori
                  </Button>
                </div>

                {/* Tabel Master Kategori */}
                <Card
                  className="safety-content-card safety-card-animate safety-delay-3"
                  bordered={false}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                      Tabel Klasifikasi Kategori Bahaya & Resiko Kerja
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12.5 }}>
                      Kelola daftar kategori bahaya yang digunakan pada modul pelaporan insiden dan inspeksi K3 di lingkungan ANRI.
                    </Text>
                  </div>

                  <Table
                    {...categoryTableProps}
                    columns={categoryColumns}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    pagination={{
                      ...categoryTableProps.pagination,
                      showSizeChanger: true,
                      pageSizeOptions: ["10", "20", "50"],
                    }}
                  />
                </Card>

                {/* Card Panduan & Standar Klasifikasi Bahaya */}
                <div className="safety-card-animate safety-delay-4">
                  <Card
                    style={{
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f8fafc 0%, #f0fdfa 100%)",
                      border: "1px solid #ccfbf1",
                    }}
                  >
                    <Row gutter={[20, 20]} align="middle">
                      <Col xs={24} md={16}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <SafetyCertificateOutlined style={{ fontSize: 22, color: "#0d9488" }} />
                          <Title level={4} style={{ margin: 0, color: "#0f766e", fontWeight: 700 }}>
                            Standar Klasifikasi Bahaya Berdasarkan OSHA & Permenaker
                          </Title>
                        </div>
                        <Paragraph style={{ color: "#334155", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                          Kategori bahaya K3 membantu menentukan prioritas tindakan korektif dan mitigasi risiko. Setiap laporan bahaya wajib dikelompokkan secara tepat agar tim investigasi dan penanggung jawab fasilitas dapat melakukan penanganan terarah.
                        </Paragraph>
                      </Col>
                      <Col xs={24} md={8} style={{ textAlign: "right" }}>
                        <Space direction="vertical" style={{ width: "100%", alignItems: "flex-end" }}>
                          <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600 }}>Near Miss: Resiko Nyaris Celaka</Tag>
                          <Tag color="volcano" style={{ borderRadius: 6, fontWeight: 600 }}>Unsafe Action: Tindakan Tidak Aman</Tag>
                          <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>Unsafe Condition: Kerusakan Fasilitas Fisik</Tag>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            ),
          },
        ]}
      />

      {/* Modal Detail Laporan */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)} style={{ borderRadius: 8 }}>
            Tutup
          </Button>,
          <Button
            key="full-page"
            type="primary"
            className="btn-safety-primary"
            onClick={() => {
              setDetailModalOpen(false);
              navigate(`/keselamatan/bahaya-resiko/show/${activeReport?.id}`);
            }}
          >
            Buka Halaman Lengkap
          </Button>,
        ]}
        title={`Detail Laporan: ${activeReport?.reportNumber}`}
        width={700}
      >
        {activeReport && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <StatusStepper status={activeReport.status} history={activeReport.statusHistory} />
            </div>

            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0" }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <Text type="secondary">Kategori:</Text>
                  <div>{renderCategoryTag(activeReport.category)}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Tanggal Pelaporan:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.date}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Lokasi Kejadian:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.location}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Unit Kerja Terkait:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.unit}</div>
                </Col>
                <Col span={24}>
                  <Text type="secondary">Deskripsi Potensi Bahaya:</Text>
                  <div style={{ marginTop: 4, fontWeight: 500 }}>{activeReport.description}</div>
                </Col>
                <Col span={24}>
                  <Text type="secondary">Potensi Dampak:</Text>
                  <div style={{ marginTop: 4, color: "#cf1322" }}>{activeReport.potentialImpact}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Pelapor:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.reporterName}</div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Ubah Status Laporan */}
      <Modal
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        onOk={() => statusForm.submit()}
        title={`Ubah Status Laporan ${activeReport?.reportNumber}`}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item
            name="status"
            label="Pilih Status Baru"
            rules={[{ required: true, message: "Silakan pilih status!" }]}
          >
            <Select size="large">
              <Select.Option value="reported">Dilaporkan</Select.Option>
              <Select.Option value="verified">Diverifikasi (Tim K3)</Select.Option>
              <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
              <Select.Option value="resolved">Selesai</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Catatan Penanganan / Tindak Lanjut">
            <Input.TextArea
              rows={3}
              placeholder="Contoh: Telah dipasang barikade pengaman dan kabel dirapikan oleh teknisi Sarpras."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Create / Update Kategori */}
      <Modal
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        onOk={() => categoryForm.submit()}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TagsOutlined style={{ color: "#d97706" }} />
            <span>{editingCategory ? "Ubah Kategori Bahaya" : "Tambah Kategori Bahaya Baru"}</span>
          </div>
        }
        okText={editingCategory ? "Perbarui Kategori" : "Simpan Kategori"}
        cancelText="Batal"
        okButtonProps={{
          className: "btn-safety-hazard",
          loading: createCategoryMutation.isPending || updateCategoryMutation.isPending,
        }}
        width={560}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleSaveCategory}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="name"
            label={<span style={{ fontWeight: 600 }}>Nama Kategori</span>}
            rules={[{ required: true, message: "Nama kategori wajib diisi!" }]}
          >
            <Input
              placeholder="Contoh: Fire Hazard (Bahaya Kebakaran)"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={<span style={{ fontWeight: 600 }}>Kode / Slug Kategori</span>}
                rules={[
                  { required: true, message: "Kode kategori wajib diisi!" },
                  {
                    pattern: /^[a-zA-Z0-9_-]+$/,
                    message: "Hanya huruf, angka, strip, dan underscore!",
                  },
                ]}
                extra="Digunakan sebagai identifier internal (snake_case)."
              >
                <Input
                  placeholder="contoh: fire_hazard"
                  size="large"
                  style={{ borderRadius: 8, fontFamily: "monospace" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="color"
                label={<span style={{ fontWeight: 600 }}>Warna Badge / Tag</span>}
                rules={[{ required: true, message: "Warna tag wajib dipilih!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  {COLOR_OPTIONS.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: opt.color,
                          }}
                        />
                        <span>{opt.label}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={<span style={{ fontWeight: 600 }}>Deskripsi Kategori</span>}
            rules={[{ required: true, message: "Deskripsi kategori wajib diisi!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Jelaskan karakteristik, definisi, dan contoh temuan bahaya untuk kategori ini..."
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
