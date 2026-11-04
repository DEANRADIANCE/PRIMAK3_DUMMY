import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Card,
  Typography,
  Popconfirm,
  Row,
  Col,
  Input,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  DashboardOutlined,
  AimOutlined,
  SearchOutlined,
  ExperimentOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  ToolOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IInspection, InspectionType } from "../../../types/inspection";
import { initialInspections } from "../../../mocks/inspections";
import { IUser } from "../../../types/user";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

interface CategoryConfig {
  key: InspectionType;
  label: string;
  shortLabel: string;
  subLabel: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  activeBorder: string;
  activeBg: string;
}

export const InspectionList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [activeTab, setActiveTab] = useState<InspectionType>("environment");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { tableProps, setFilters } = useTable<IInspection>({
    resource: "inspections",
    filters: { initial: [{ field: "type", operator: "eq", value: "environment" }] },
    pagination: { pageSize: 10 },
    syncWithLocation: true,
  });

  const { mutate: deleteInspection } = useDelete();

  const handleTabChange = (typeKey: InspectionType) => {
    setActiveTab(typeKey);
    setFilters(
      [
        { field: "type", operator: "eq" as const, value: typeKey },
        ...(searchTerm ? [{ field: "q", operator: "contains" as const, value: searchTerm }] : []),
      ],
      "replace"
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(
        [
          { field: "type", operator: "eq" as const, value: activeTab },
          ...(searchTerm ? [{ field: "q", operator: "contains" as const, value: searchTerm }] : []),
        ],
        "replace"
      );
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm, activeTab, setFilters]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#059669";
    if (score >= 70) return "#d97706";
    return "#dc2626";
  };

  const allInspections = (tableProps.dataSource || []) as IInspection[];
  const avgScore =
    allInspections.length > 0
      ? Math.round(
          allInspections.reduce((acc, curr) => acc + (curr.complianceScore || 0), 0) /
            allInspections.length
        )
      : 88;

  // Daftar Kategori Parameter Lengkap
  const categories: CategoryConfig[] = [
    {
      key: "environment",
      label: "Pemantauan Lingkungan",
      shortLabel: "Lingkungan",
      subLabel: "Lux, dBA, Suhu & RH",
      icon: <ExperimentOutlined />,
      color: "#0d9488",
      bgColor: "#f0fdfa",
      activeBorder: "#0d9488",
      activeBg: "#f0fdfa",
    },
    {
      key: "emergency",
      label: "Tanggap Darurat",
      shortLabel: "Tanggap Darurat",
      subLabel: "APAR, Hydrant, P3K",
      icon: <FireOutlined />,
      color: "#ea580c",
      bgColor: "#fff7ed",
      activeBorder: "#ea580c",
      activeBg: "#fff7ed",
    },
    {
      key: "behavior",
      label: "Perilaku Kerja",
      shortLabel: "Perilaku Kerja",
      subLabel: "Ergonomi & Budaya K3",
      icon: <TeamOutlined />,
      color: "#0284c7",
      bgColor: "#f0f9ff",
      activeBorder: "#0284c7",
      activeBg: "#f0f9ff",
    },
    {
      key: "5r",
      label: "Budaya 5R",
      shortLabel: "5R",
      subLabel: "Ringkas, Rapi, Resik, Rawat, Rajin",
      icon: <CheckSquareOutlined />,
      color: "#6366f1",
      bgColor: "#eef2ff",
      activeBorder: "#6366f1",
      activeBg: "#eef2ff",
    },
    {
      key: "apd",
      label: "Alat Pelindung Diri (APD)",
      shortLabel: "APD",
      subLabel: "Kelayakan & Stok APD",
      icon: <SafetyCertificateOutlined />,
      color: "#d97706",
      bgColor: "#fffbeb",
      activeBorder: "#d97706",
      activeBg: "#fffbeb",
    },
    {
      key: "tools",
      label: "Alat Kerja & Mesin",
      shortLabel: "Alat & Mesin",
      subLabel: "Safety Guard & Interlock",
      icon: <ToolOutlined />,
      color: "#0f766e",
      bgColor: "#f0fdf4",
      activeBorder: "#0f766e",
      activeBg: "#f0fdf4",
    },
  ];

  const tabDescriptions: Record<InspectionType, string> = {
    environment:
      "Pengukuran intensitas pencahayaan (Lux), kebisingan (dBA), suhu/kelembapan depo arsip, dan sirkulasi udara vs Nilai Ambang Batas (NAB).",
    emergency:
      "Pemeriksaan kesiapan tabung APAR (tekanan & pin), jaringan fire hydrant, emergency exit lamp, kotak P3K, dan titik kumpul (assembly point).",
    behavior:
      "Pengamatan langsung kedisiplinan pemakaian APD, kepatuhan postur ergonomi angkat-angkut arsip, dan ketaatan instruksi kerja (IK/SOP).",
    "5r":
      "Evaluasi penerapan budaya 5R (Ringkas, Rapi, Resik, Rawat, dan Rajin) di seluruh ruang arsip, lorong evakuasi, dan perkantoran ANRI.",
    apd:
      "Pemeriksaan kelayakan, kebersihan, dan ketersediaan stok masker respirator, helm pelindung, sarung tangan nitril, dan safety shoes.",
    tools:
      "Pemeriksaan mekanisme safety interlock/emergency switch mesin pencacah arsip (shredder), lift barang, dan tangga dorong gudang.",
  };

  const activeCategoryInfo =
    categories.find((c) => c.key === activeTab) || categories[0];

  const getCategoryCount = (type: InspectionType) => {
    return initialInspections.filter((item) => item.type === type).length;
  };

  const columns = [
    {
      title: "No.",
      width: 60,
      render: (_: unknown, __: unknown, i: number) => (
        <span style={{ fontWeight: 600, color: "#64748b" }}>{i + 1}</span>
      ),
    },
    {
      title: "Tanggal Inspeksi",
      dataIndex: "date",
      key: "date",
      width: 140,
      render: (val: string, record: IInspection) => (
        <a
          onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)}
          style={{ fontWeight: 700, color: "#0d9488" }}
        >
          {val}
        </a>
      ),
    },
    {
      title: "Lokasi & Unit Kerja",
      key: "location",
      width: 220,
      render: (_: unknown, record: IInspection) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{record.location}</div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            {record.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Auditor / Inspektur",
      dataIndex: "inspector",
      key: "inspector",
      width: 180,
      render: (val: string) => <span style={{ fontWeight: 600, color: "#475569" }}>{val}</span>,
    },
    {
      title: "Skor Kepatuhan",
      dataIndex: "complianceScore",
      key: "complianceScore",
      width: 180,
      render: (score: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={getScoreColor(score)}
            style={{ width: 90 }}
            showInfo={false}
          />
          <span style={{ fontWeight: 800, color: getScoreColor(score), fontSize: 13 }}>
            {score}%
          </span>
        </div>
      ),
    },
    {
      title: "Catatan Temuan Utama",
      dataIndex: "findings",
      key: "findings",
      width: 240,
      ellipsis: true,
      render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val || "-"}</span>,
    },
    {
      title: "PIC Tindak Lanjut",
      dataIndex: "responsiblePerson",
      key: "responsiblePerson",
      width: 160,
      render: (val: string) => <span style={{ fontWeight: 600, color: "#475569" }}>{val || "-"}</span>,
    },
    {
      title: "Aksi",
      key: "actions",
      width: 110,
      render: (_: unknown, record: IInspection) => (
        <Space size="small">
          <Tooltip title="Lihat detail audit inspeksi">
            <Button
              size="small"
              icon={<EyeOutlined />}
              style={{ borderRadius: 6 }}
              onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)}
            />
          </Tooltip>
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Data Inspeksi?"
              description="Data audit ini akan dihapus permanen dari sistem."
              onConfirm={() =>
                deleteInspection({
                  resource: "inspections",
                  id: record.id,
                  successNotification: {
                    message: "Data Berhasil Dihapus",
                    description: "Berkas inspeksi telah dihapus.",
                    type: "success",
                  },
                })
              }
            >
              <Tooltip title="Hapus">
                <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="safety-hero-banner safety-banner-inspeksi safety-card-animate safety-delay-1">
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
                <FireOutlined /> AUDIT KEPATUHAN & INSPEKSI K3
              </Tag>
              <span style={{ fontSize: 13, color: "#fed7aa" }}>Sistem Manajemen Keselamatan Kerja Terpadu</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Audit & Inspeksi Lapangan Terpadu K3 ANRI
            </Title>
            <Paragraph style={{ color: "#fed7aa", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Pemeriksaan berkala multi-parameter: kesiapan alat proteksi kebakaran (APAR), lingkungan kerja fisik, kepatuhan 5R, dan mekanisme safety mesin secara transparan dan terukur.
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
              <div style={{ fontSize: 11, color: "#fed7aa", fontWeight: 600 }}>RATA-RATA KEPATUHAN</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {avgScore}% <span style={{ fontSize: 13, fontWeight: 400 }}>Skor</span>
              </div>
              <Tag color="green" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Memenuhi Standar K3
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ffedd5", color: "#c2410c" }}>
              <FireOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Sesi Audit</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allInspections.length} Sesi</div>
              <Text style={{ fontSize: 11.5, color: "#c2410c", fontWeight: 600 }}>6 Parameter Kunci</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Indeks Kepatuhan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{avgScore}%</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Kategori Sangat Baik</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <SafetyCertificateOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Kesiapan Tanggap Darurat</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>99.2%</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Siap Digunakan 24/7</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              <DashboardOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Target Audit Bulanan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>100%</div>
              <Text style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>Terpenuhi Sesuai Jadwal</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. DIV KHUSUS TAB KATEGORI INSPEKSI (Tersendiri, Rapi, & Lebih Jelas Kelihatan) */}
      <div
        className="safety-card-animate safety-delay-2"
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
          padding: "20px 22px",
        }}
      >
        {/* Header Seksi Tab Kategori */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1.5px solid #f1f5f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#f0fdfa",
                color: "#0d9488",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              <AppstoreOutlined />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>
                Pilih Parameter Audit & Inspeksi K3
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Klik salah satu kategori di bawah untuk menyaring data inspeksi dan checklist keselamatan
              </div>
            </div>
          </div>

          <Tag color="cyan" style={{ borderRadius: 20, padding: "3px 12px", fontWeight: 600 }}>
            ● Kategori Aktif: {activeCategoryInfo.label}
          </Tag>
        </div>

        {/* Grid Kartu Tab Kategori Tersendiri */}
        <Row gutter={[12, 12]}>
          {categories.map((cat) => {
            const isActive = activeTab === cat.key;
            const count = getCategoryCount(cat.key);

            return (
              <Col xs={24} sm={12} md={8} lg={4} key={cat.key}>
                <div
                  onClick={() => handleTabChange(cat.key)}
                  style={{
                    background: isActive ? cat.activeBg : "#ffffff",
                    border: isActive
                      ? `2px solid ${cat.activeBorder}`
                      : "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    padding: "14px 14px 12px",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isActive
                      ? `0 8px 20px ${cat.color}25`
                      : "0 1px 3px rgba(0,0,0,0.02)",
                    transform: isActive ? "translateY(-3px)" : "none",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = cat.color;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                    }
                  }}
                >
                  {/* Badge Centang Aktif */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: cat.color,
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                    >
                      <CheckCircleFilled />
                    </div>
                  )}

                  <div>
                    {/* Ikon Kategori */}
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: cat.bgColor,
                        color: cat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        marginBottom: 10,
                      }}
                    >
                      {cat.icon}
                    </div>

                    {/* Judul & Subtitle */}
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: isActive ? "#0f172a" : "#334155",
                        lineHeight: 1.3,
                        marginBottom: 4,
                      }}
                    >
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
                      {cat.subLabel}
                    </div>
                  </div>

                  {/* Footer Tag Jumlah Data */}
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Tag
                      style={{
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        margin: 0,
                        background: isActive ? cat.color : "#f1f5f9",
                        color: isActive ? "#ffffff" : "#475569",
                        border: "none",
                        padding: "1px 8px",
                      }}
                    >
                      {count} Sesi
                    </Tag>
                    {isActive && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>
                        Terpilih
                      </span>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Banner Detail Fokus Parameter Kategori Terpilih */}
        <div
          style={{
            marginTop: 16,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 280 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: activeCategoryInfo.bgColor,
                color: activeCategoryInfo.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <AimOutlined />
            </div>
            <div>
              <div
                style={{
                  fontSize: 11.5,
                  color: "#64748b",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                Fokus Parameter Pemeriksaan ({activeCategoryInfo.label}):
              </div>
              <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500, marginTop: 2, lineHeight: 1.5 }}>
                {tabDescriptions[activeTab]}
              </div>
            </div>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="btn-safety-primary"
            style={{ height: 38, padding: "0 18px" }}
            onClick={() => navigate(`/keselamatan/inspeksi/create?type=${activeTab}`)}
          >
          Inspeksi Baru ({activeCategoryInfo.shortLabel})
          </Button>
        </div>
      </div>

      {/* 4. Toolbar Pencarian & Kontrol Tabel */}
      <div
        className="safety-card-animate safety-delay-3"
        style={{
          background: "#ffffff",
          padding: "14px 18px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280, maxWidth: 500 }}>
          <Input
            placeholder={`Cari data inspeksi ${activeCategoryInfo.shortLabel} (tanggal, lokasi, auditor)...`}
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: 8, height: 38 }}
          />
        </div>

        <Space size="middle">
          <Tag color="default" style={{ borderRadius: 8, padding: "4px 12px", fontSize: 12.5, fontWeight: 500 }}>
            Menampilkan kategori: <strong style={{ color: "#0f172a" }}>{activeCategoryInfo.label}</strong>
          </Tag>
        </Space>
      </div>

      {/* 5. Content Card & Tabel Data */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-4"
        bordered={false}
      >
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1050 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `Menampilkan ${range[0]}-${range[1]} dari ${total} sesi inspeksi ${activeCategoryInfo.shortLabel}`,
          }}
        />
      </Card>
    </div>
  );
};
export default InspectionList;
