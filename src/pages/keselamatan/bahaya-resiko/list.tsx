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
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useUpdate, useDelete, useGetIdentity } from "@refinedev/core";
import { IHazardReport, HazardCategory, HazardStatus } from "../../../types/hazard";
import { IUser } from "../../../types/user";
import { StatusStepper } from "../../../components/common/StatusStepper";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const HazardReportList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<IHazardReport | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [statusForm] = Form.useForm();
  const { mutate: updateReport } = useUpdate();
  const { mutate: deleteReport } = useDelete();

  // Refine Table hook
  const { tableProps, setFilters } = useTable<IHazardReport>({
    resource: "hazard-reports",
    pagination: { pageSize: 10 },
  });

  const canManageStatus = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const allReports = (tableProps.dataSource || []) as IHazardReport[];

  const inProgressCount = allReports.filter(
    (r) => r.status === "in_progress" || r.status === "reported" || r.status === "verified"
  ).length;
  const resolvedCount = allReports.filter(
    (r) => r.status === "resolved"
  ).length;

  // Category Tag badge
  const renderCategoryTag = (cat: HazardCategory) => {
    switch (cat) {
      case "near_miss":
        return <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600 }}>Near Miss</Tag>;
      case "unsafe_action":
        return <Tag color="volcano" style={{ borderRadius: 6, fontWeight: 600 }}>Unsafe Action</Tag>;
      case "unsafe_condition":
        return <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>Unsafe Condition</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{cat}</Tag>;
    }
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
      case "resolved":
      case "selesai":
        return <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>✔ Selesai</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{st}</Tag>;
    }
  };

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

  const columns = [
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
      width: 150,
      render: (val: HazardCategory) => renderCategoryTag(val),
    },
    {
      title: "Lokasi & Unit Kerja",
      key: "location",
      width: 180,
      render: (_: unknown, record: IHazardReport) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{record.location}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
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

  // Filter tab kategori
  const tabItems = [
    { key: "all", label: "Semua Kategori" },
    { key: "near_miss", label: "Near Miss (Hampir Celaka)" },
    { key: "unsafe_action", label: "Unsafe Action" },
    { key: "unsafe_condition", label: "Unsafe Condition" },
  ];

  const handleTabChange = (key: string) => {
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
              <SafetyCertificateOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Target Zero Accident</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>100%</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Komitmen K3 ANRI</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Filter Bar & Tombol Lapor Kontras */}
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

      {/* 4. Content Card & Tabel */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-3"
        bordered={false}
      >
        <Tabs activeKey={selectedCategory} onChange={handleTabChange} items={tabItems} style={{ marginBottom: 12 }} />

        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Rekomendasi Mitigasi K3 */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🛡️ Prinsip Tanggap Cepat Bahaya & Resiko di Tempat Kerja
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
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
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff7ed", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
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
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
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

      {/* Modal Detail */}
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

      {/* Modal Ubah Status */}
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
    </div>
  );
};
