import React from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Card,
  Typography,
  Popconfirm,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined as InspectIcon,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AuditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IInvestigation } from "../../../types/investigation";
import { IUser } from "../../../types/user";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const InvestigationList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();

  const { tableProps, setFilters } = useTable<IInvestigation>({
    resource: "investigations",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteInvestigation } = useDelete();
  const canCreate = currentUser?.role === "admin" || currentUser?.role === "tim_k3" || currentUser?.role === "kepala_unit";

  const allInvestigations = (tableProps.dataSource || []) as IInvestigation[];
  const completedCount = allInvestigations.filter((i) => i.status === "completed").length;
  const inProgressCount = allInvestigations.filter((i) => i.status === "in_progress" || i.status === "draft").length;

  const renderStatus = (st: string) => {
    switch (st) {
      case "completed":
        return <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>✔ Selesai Ditandatangani</Tag>;
      case "in_progress":
        return <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>⏳ Sedang Investigasi</Tag>;
      case "draft":
        return <Tag color="default" style={{ borderRadius: 6, fontWeight: 600 }}>Draft Awal</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{st}</Tag>;
    }
  };

  const columns = [
    {
      title: "No. Investigasi",
      key: "id",
      width: 150,
      render: (_: unknown, record: IInvestigation) => (
        <a onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)} style={{ fontWeight: 700, color: "#4f46e5" }}>
          INV-2026-{String(record.id).padStart(3, "0")}
        </a>
      ),
    },
    {
      title: "Tautan Laporan Insiden",
      dataIndex: "relatedReportNumber",
      key: "relatedReportNumber",
      width: 170,
      render: (val: string) => <Tag color="volcano" style={{ borderRadius: 6, fontWeight: 600 }}>{val}</Tag>,
    },
    {
      title: "Tanggal & Lokasi Insiden",
      key: "incident",
      width: 220,
      render: (_: unknown, record: IInvestigation) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a" }}>{record.incidentLocation}</div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            {record.incidentDate} • Pukul {record.incidentTime} WIB
          </Text>
        </div>
      ),
    },
    {
      title: "Akar Masalah (Root Causes)",
      key: "rootCauses",
      width: 240,
      ellipsis: true,
      render: (_: unknown, record: IInvestigation) => (
        <span style={{ fontSize: 12.5, color: "#334155" }}>{record.rootCauses?.[0] || "-"}</span>
      ),
    },
    {
      title: "Ketua Tim Investigator",
      dataIndex: "investigatorName",
      key: "investigatorName",
      width: 180,
      render: (val: string) => <span style={{ fontWeight: 600, color: "#475569" }}>{val}</span>,
    },
    {
      title: "Status Berkas",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (val: string) => renderStatus(val),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 120,
      render: (_: unknown, record: IInvestigation) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)}
          >
            Form
          </Button>
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Berkas Investigasi?"
              onConfirm={() =>
                deleteInvestigation({
                  resource: "investigations",
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="safety-hero-banner safety-banner-investigasi">
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
                <AuditOutlined /> ROOT CAUSE ANALYSIS (RCA)
              </Tag>
              <span style={{ fontSize: 13, color: "#e0e7ff" }}>Pencegahan Insiden Berulang (CAPA)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Investigasi Insiden & Analisis Akar Masalah
            </Title>
            <Paragraph style={{ color: "#e0e7ff", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Metodologi sistematis (5-Why Analysis & Fishbone Diagram) untuk menyingkap faktor penyebab langsung dan akar kegagalan sistem agar kecelakaan serupa tidak terulang kembali.
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
              <div style={{ fontSize: 11, color: "#e0e7ff", fontWeight: 600 }}>BERKAS SELESAI</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {completedCount} <span style={{ fontSize: 13, fontWeight: 400 }}>Kasus Tuntas</span>
              </div>
              <Tag color="purple" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Rekomendasi Disahkan
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#eef2ff", color: "#4f46e5" }}>
              <FileTextOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Berkas</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allInvestigations.length} Investigasi</div>
              <Text style={{ fontSize: 11.5, color: "#4f46e5", fontWeight: 600 }}>Tahun Berjalan 2026</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Selesai / Sah</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{completedCount} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Ditandatangani Pimpinan</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Proses Analisis</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{inProgressCount} Insiden</div>
              <Text style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>Wawancara & TKP</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <InspectIcon />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Tindakan Korektif</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>100%</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Terkawal Tindak Lanjut</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Filter Bar & Tombol Baru */}
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
        <Input
          placeholder="Cari nomor laporan, lokasi kejadian, atau investigator..."
          prefix={<SearchOutlined style={{ color: "#4f46e5" }} />}
          style={{ width: 340, borderRadius: 8 }}
          allowClear
          onChange={(e) => {
            const val = e.target.value;
            setFilters(
              val ? [{ field: "incidentLocation", operator: "contains", value: val }] : [],
              "merge"
            );
          }}
        />

        {canCreate && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="btn-safety-primary"
            style={{ height: 40, padding: "0 20px" }}
            onClick={() => navigate("/keselamatan/investigasi/create")}
          >
            Investigasi Baru
          </Button>
        )}
      </div>

      {/* 4. Content Card & Tabel */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-3"
        bordered={false}
      >
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

      {/* 5. Alur Analisis Investigasi */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🔍 Siklus Investigasi & Corrective Action (CAPA)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Olah TKP & Fakta</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Amankan tempat kejadian, kumpulkan rekaman CCTV, periksa kondisi alat kerja, dan wawancara saksi mata secara objektif.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Analisis 5-Why</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Gali lapisan penyebab hingga menemukan akar kelemahan manajerial, bukan sekadar menyalahkan kesalahan individu (no-blame culture).
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Rekomendasi & Pengawasan</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Tetapkan PIC perbaikan, target batas waktu penyelesaian, dan tinjau efektivitas tindakan setelah 30 hari implementasi.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
