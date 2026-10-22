import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
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
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SlidersOutlined,
  CheckCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IHiradc } from "../../../types/hiradc";
import { IUser } from "../../../types/user";
import { RiskBadge } from "../../../components/common/RiskBadge";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const HiradcList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { tableProps, setFilters } = useTable<IHiradc>({
    resource: "hiradc",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteHiradc } = useDelete();
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

  const allHiradc = (tableProps.dataSource || []) as IHiradc[];
  const highRiskCount = allHiradc.filter((h) => h.riskLevel === "high" || h.riskLevel === "extreme").length;
  const lowRiskCount = allHiradc.filter((h) => h.riskLevel === "low" || h.riskLevel === "medium").length;

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{ fontWeight: 600, color: "#64748b" }}>{index + 1}</span>
      ),
    },
    {
      title: "Aktivitas / Kegiatan Kerja",
      dataIndex: "activity",
      key: "activity",
      width: 220,
      render: (val: string, record: IHiradc) => (
        <a onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)} style={{ fontWeight: 700, color: "#0284c7" }}>
          {val}
        </a>
      ),
    },
    {
      title: "Identifikasi Bahaya & Dampak Risiko",
      key: "hazard_risk",
      width: 260,
      render: (_: unknown, record: IHiradc) => (
        <div>
          <div>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>Bahaya: </span>
            <span style={{ color: "#334155" }}>{record.hazard}</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 12.5, marginTop: 3 }}>
            <span style={{ fontWeight: 600, color: "#475569" }}>Risiko: </span>
            {record.risk}
          </div>
        </div>
      ),
    },
    {
      title: "L × S",
      key: "score_calc",
      width: 90,
      align: "center" as const,
      render: (_: unknown, record: IHiradc) => (
        <Tag color="geekblue" style={{ fontWeight: 700, borderRadius: 6 }}>
          {record.likelihood} × {record.severity}
        </Tag>
      ),
    },
    {
      title: "Tingkat Risiko",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 140,
      render: (level: string, record: IHiradc) => (
        <RiskBadge level={level} score={record.riskScore} />
      ),
    },
    {
      title: "Pengendalian Tambahan",
      dataIndex: "additionalControl",
      key: "additionalControl",
      width: 200,
      ellipsis: true,
      render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val}</span>,
    },
    {
      title: "PIC & Target",
      key: "pic_target",
      width: 160,
      render: (_: unknown, record: IHiradc) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{record.responsiblePerson}</div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            Target: {record.targetDate}
          </Text>
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 130,
      render: (_: unknown, record: IHiradc) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
          />
          {canEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              style={{ borderRadius: 6 }}
              onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}`)}
            />
          )}
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Penilaian HIRADC ini?"
              onConfirm={() =>
                deleteHiradc({
                  resource: "hiradc",
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
      <div className="safety-hero-banner safety-banner-hiradc">
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
                <SafetyCertificateOutlined /> RISK MANAGEMENT MATRIX
              </Tag>
              <span style={{ fontSize: 13, color: "#e0f2fe" }}>Standar K3 ANRI (ISO 45001 / SMK3 PP 50/2012)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              HIRADC (Hazard Identification, Risk Assessment & Determining Control)
            </Title>
            <Paragraph style={{ color: "#e0f2fe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Identifikasi menyeluruh terhadap bahaya potensial pada seluruh aktivitas kerja kearsipan, penilaian peluang (Likelihood) dan keparahan (Severity), serta penetapan hierarki pengendalian risiko.
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
              <div style={{ fontSize: 11, color: "#e0f2fe", fontWeight: 600 }}>AKTIVITAS TERPETAKAN</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {allHiradc.length} <span style={{ fontSize: 13, fontWeight: 400 }}>Proses Kerja</span>
              </div>
              <Tag color="cyan" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Matriks 5×5 Standar SNI
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              <AimOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Aktivitas Dinilai</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allHiradc.length} Item</div>
              <Text style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>Kategori Unit Kerja</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fff1f2", color: "#e11d48" }}>
              <ThunderboltOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Risiko Tinggi & Ekstrem</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{highRiskCount} Bahaya</div>
              <Text style={{ fontSize: 11.5, color: "#e11d48", fontWeight: 600 }}>Pengawasan Ketat</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Risiko Rendah / Sedang</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{lowRiskCount} Aktivitas</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Mitigasi Memadai</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <SlidersOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Hierarki Kontrol</Text>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>5 Tingkat</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Eliminasi s/d APD</Text>
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
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Input
            placeholder="Cari aktivitas, bahaya, atau PIC..."
            prefix={<SearchOutlined style={{ color: "#0284c7" }} />}
            style={{ width: 320, borderRadius: 8 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "activity", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />

          <Select
            placeholder="Tingkat Risiko"
            style={{ width: 170 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "riskLevel", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="low">Rendah (1-4)</Select.Option>
            <Select.Option value="medium">Sedang (5-9)</Select.Option>
            <Select.Option value="high">Tinggi (10-16)</Select.Option>
            <Select.Option value="extreme">Ekstrem (17-25)</Select.Option>
          </Select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button
            icon={<InfoCircleOutlined />}
            className="btn-safety-secondary"
            style={{ height: 40 }}
            onClick={() => setMatrixModalOpen(true)}
          >
            Panduan Matriks Risiko 5×5
          </Button>

          {canEdit && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="btn-safety-primary"
              style={{ height: 40, padding: "0 20px" }}
              onClick={() => navigate("/keselamatan/hiradc/create")}
            >
              Penilaian Risiko Baru
            </Button>
          )}
        </div>
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
          scroll={{ x: 1100 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Hierarki Pengendalian Risiko K3 */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🎯 5 Tingkat Hierarki Pengendalian Risiko K3 (Hierarchy of Controls)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Eliminasi & Substitusi</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Menghilangkan sumber bahaya secara total atau mengganti zat/peralatan berbahaya dengan alternatif yang lebih aman bagi pegawai arsip.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Rekayasa Teknik & Administrasi</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Pemasangan ventilasi exhaust di depo fumigasi arsip, pembatasan akses ruang genset, penyusunan SOP aman, dan rotasi kerja terjadwal.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#d97706", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Alat Pelindung Diri (APD)</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Lapisan pertahanan terakhir: wajib menggunakan masker respirator N95 di ruang restorasi kertas tua, sarung tangan nitril, dan safety shoes.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modal Matriks Risiko 5x5 */}
      <RiskMatrixModal open={matrixModalOpen} onClose={() => setMatrixModalOpen(false)} />
    </div>
  );
};
