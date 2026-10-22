import React, { useState } from "react";
import {
  Tabs,
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
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  FireOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IInspection, InspectionType } from "../../../types/inspection";
import { IUser } from "../../../types/user";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const InspectionList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [activeTab, setActiveTab] = useState<InspectionType>("environment");

  const { tableProps, setFilters } = useTable<IInspection>({
    resource: "inspections",
    filters: { initial: [{ field: "type", operator: "eq", value: "environment" }] },
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteInspection } = useDelete();

  const handleTabChange = (key: string) => {
    const typeKey = key as InspectionType;
    setActiveTab(typeKey);
    setFilters([{ field: "type", operator: "eq", value: typeKey }], "replace");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#059669";
    if (score >= 70) return "#d97706";
    return "#dc2626";
  };

  const allInspections = (tableProps.dataSource || []) as IInspection[];
  const avgScore = allInspections.length > 0
    ? Math.round(allInspections.reduce((acc, curr) => acc + (curr.complianceScore || 0), 0) / allInspections.length)
    : 88;

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
        <a onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)} style={{ fontWeight: 700, color: "#0d9488" }}>
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
          <Button
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)}
          />
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Data Inspeksi?"
              onConfirm={() =>
                deleteInspection({
                  resource: "inspections",
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

  const tabItems = [
    { key: "environment", label: "Pemantauan Lingkungan" },
    { key: "emergency", label: "Sarpras Tanggap Darurat" },
    { key: "behavior", label: "Perilaku Kerja" },
    { key: "5r", label: "5R (Ringkas, Rapi, Resik, Rawat, Rajin)" },
    { key: "apd", label: "Alat Pelindung Diri (APD)" },
    { key: "tools", label: "Alat Kerja & Mesin" },
  ];

  const tabDescriptions: Record<InspectionType, string> = {
    environment: "Pengukuran intensitas pencahayaan (Lux), kebisingan (dBA), suhu/kelembapan depo arsip, dan sirkulasi udara vs Nilai Ambang Batas (NAB).",
    emergency: "Pemeriksaan kesiapan tabung APAR (tekanan & pin), jaringan fire hydrant, emergency exit lamp, kotak P3K, dan titik kumpul (assembly point).",
    behavior: "Pengamatan langsung kedisiplinan pemakaian APD, kepatuhan postur ergonomi angkat-angkut arsip, dan ketaatan instruksi kerja (IK/SOP).",
    "5r": "Evaluasi penerapan budaya 5R (Ringkas, Rapi, Resik, Rawat, dan Rajin) di seluruh ruang arsip, lorong evakuasi, dan kantor.",
    apd: "Pemeriksaan kelayakan, kebersihan, dan ketersediaan stok masker respirator, helm pelindung, sarung tangan nitril, dan safety shoes.",
    tools: "Pemeriksaan mekanisme safety interlock/emergency switch mesin pencacah arsip (shredder), lift barang, dan tangga dorong gudang.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="safety-hero-banner safety-banner-inspeksi">
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
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Audit Terlaksana</Text>
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
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Kesiapan APAR & Hydrant</Text>
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

      {/* 3. Control Filter Bar & Tombol Tambah */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
            Kategori Audit:
          </span>
          <Tag color="cyan" style={{ fontSize: 13, padding: "3px 12px", borderRadius: 6, fontWeight: 600 }}>
            {tabItems.find((t) => t.key === activeTab)?.label}
          </Tag>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="btn-safety-primary"
          style={{ height: 40, padding: "0 20px" }}
          onClick={() => navigate(`/keselamatan/inspeksi/create?type=${activeTab}`)}
        >
          Inspeksi Baru ({tabItems.find((t) => t.key === activeTab)?.label})
        </Button>
      </div>

      {/* 4. Content Card & Tabel */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-3"
        bordered={false}
      >
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} style={{ marginBottom: 12 }} />

        <div
          style={{
            background: "#f8fafc",
            padding: "12px 18px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AimOutlined style={{ color: "#0d9488", fontSize: 16 }} />
          <Text style={{ fontSize: 13, color: "#475569" }}>
            <strong style={{ color: "#0f172a" }}>Fokus Parameter Pemeriksaan:</strong> {tabDescriptions[activeTab]}
          </Text>
        </div>

        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1050 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>
    </div>
  );
};
