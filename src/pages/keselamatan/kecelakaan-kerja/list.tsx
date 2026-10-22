import React from "react";
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
  FilePdfOutlined,
  AlertOutlined,
  FileProtectOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IAccidentReport, TaspenStatus } from "../../../types/accident";
import { IUser } from "../../../types/user";
import { TaspenCountdown } from "../../../components/common/TaspenCountdown";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const AccidentReportList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();

  const { tableProps, setFilters } = useTable<IAccidentReport>({
    resource: "accident-reports",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteAccident } = useDelete();

  const allAccidents = (tableProps.dataSource || []) as IAccidentReport[];
  const pendingTaspen = allAccidents.filter((a) => a.taspenStatus === "belum").length;
  const processedTaspen = allAccidents.filter((a) => a.taspenStatus === "diajukan" || a.taspenStatus === "selesai").length;

  const renderSeverityTag = (sev: string) => {
    switch (sev) {
      case "ringan":
        return <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>● Ringan</Tag>;
      case "sedang":
        return <Tag color="gold" style={{ borderRadius: 6, fontWeight: 600 }}>▲ Sedang</Tag>;
      case "berat":
        return <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600 }}>⚠ Berat</Tag>;
      case "meninggal":
        return <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>✕ Fatal</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{sev}</Tag>;
    }
  };

  const renderTaspenStatus = (st: TaspenStatus) => {
    switch (st) {
      case "belum":
        return <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>Belum Diajukan</Tag>;
      case "diajukan":
        return <Tag color="processing" style={{ borderRadius: 6, fontWeight: 600 }}>Dalam Pengajuan</Tag>;
      case "selesai":
        return <Tag color="success" style={{ borderRadius: 6, fontWeight: 600 }}>✔ Selesai / Cair</Tag>;
      default:
        return <Tag style={{ borderRadius: 6 }}>{st}</Tag>;
    }
  };

  const columns = [
    {
      title: "No. Laporan",
      dataIndex: "reportNumber",
      key: "reportNumber",
      width: 130,
      render: (val: string, record: IAccidentReport) => (
        <a onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)} style={{ fontWeight: 700, color: "#dc2626" }}>
          {val}
        </a>
      ),
    },
    {
      title: "Tanggal & Jam",
      key: "datetime",
      width: 140,
      render: (_: unknown, record: IAccidentReport) => (
        <div>
          <div style={{ fontWeight: 600, color: "#1e293b" }}>{record.date}</div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            Pukul {record.time} WIB
          </Text>
        </div>
      ),
    },
    {
      title: "Korban & Unit Kerja",
      key: "victim",
      width: 220,
      render: (_: unknown, record: IAccidentReport) => (
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a" }}>{record.victim?.name || "-"}</div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            {record.victim?.employmentStatus || "ASN"} • {record.victim?.unit || "-"}
          </Text>
        </div>
      ),
    },
    {
      title: "Jenis Insiden",
      dataIndex: "accidentType",
      key: "accidentType",
      width: 180,
      render: (val: string) => <span style={{ fontWeight: 600, color: "#334155" }}>{val}</span>,
    },
    {
      title: "Tingkat Keparahan",
      dataIndex: "severityLevel",
      key: "severityLevel",
      width: 140,
      render: (val: string) => renderSeverityTag(val),
    },
    {
      title: "Batas Waktu TASPEN (2x24 Jam)",
      key: "taspenDeadline",
      width: 200,
      render: (_: unknown, record: IAccidentReport) => (
        <TaspenCountdown
          accidentDate={record.date}
          employmentStatus={record.victim?.employmentStatus || "ASN"}
          taspenStatus={record.taspenStatus}
        />
      ),
    },
    {
      title: "Status Klaim",
      dataIndex: "taspenStatus",
      key: "taspenStatus",
      width: 140,
      render: (val: TaspenStatus) => renderTaspenStatus(val),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 140,
      render: (_: unknown, record: IAccidentReport) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)}
          >
            Detail
          </Button>
          {(currentUser?.role === "admin" || currentUser?.role === "tim_k3") && (
            <Button
              size="small"
              icon={<EditOutlined />}
              style={{ borderRadius: 6 }}
              onClick={() => navigate(`/keselamatan/kecelakaan/edit/${record.id}`)}
            />
          )}
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Laporan Kecelakaan?"
              onConfirm={() =>
                deleteAccident({
                  resource: "accident-reports",
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
      <div className="safety-hero-banner safety-banner-accident">
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
                <AlertOutlined /> EMERGENCY INCIDENT & JKK
              </Tag>
              <span style={{ fontSize: 13, color: "#fee2e2" }}>Jaminan Kecelakaan Kerja TASPEN ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Pelaporan Kecelakaan Kerja & Pengajuan JKK
            </Title>
            <Paragraph style={{ color: "#fee2e2", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Pencatatan insiden cedera fisik dalam tugas dinas, pertolongan pertama, dan pemantauan batas pengajuan klaim Jaminan Kecelakaan Kerja (JKK) TASPEN maksimal 2x24 jam.
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
              <div style={{ fontSize: 11, color: "#fee2e2", fontWeight: 600 }}>BATAS WAKTU TASPEN</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                2x24 <span style={{ fontSize: 13, fontWeight: 400 }}>Jam</span>
              </div>
              <Tag color="red" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Wajib Segera Diajukan
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fee2e2", color: "#dc2626" }}>
              <AlertOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Kecelakaan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allAccidents.length} Kejadian</div>
              <Text style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 600 }}>Tahun Berjalan 2026</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fef2f2", color: "#ef4444" }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Belum Diajukan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{pendingTaspen} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#ef4444", fontWeight: 600 }}>Perlu Tindakan Cepat</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <FileProtectOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Klaim TASPEN Proses/Cair</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{processedTaspen} Kasus</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Tercakup Asuransi JKK</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <MedicineBoxOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Penanganan Medis</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>100%</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Klinik & RS Rujukan</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Filter Bar & Tombol Aksi Kontras */}
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
            placeholder="Cari nama korban, NIP, jenis insiden, atau lokasi..."
            prefix={<SearchOutlined style={{ color: "#dc2626" }} />}
            style={{ width: 340, borderRadius: 8 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "accidentType", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />

          <Select
            placeholder="Status TASPEN"
            style={{ width: 170 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "taspenStatus", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="belum">Belum Diajukan</Select.Option>
            <Select.Option value="diajukan">Dalam Proses</Select.Option>
            <Select.Option value="selesai">Selesai / Cair</Select.Option>
          </Select>

          <Select
            placeholder="Tingkat Keparahan"
            style={{ width: 160 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "severityLevel", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="ringan">Ringan</Select.Option>
            <Select.Option value="sedang">Sedang</Select.Option>
            <Select.Option value="berat">Berat</Select.Option>
          </Select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button
            icon={<FilePdfOutlined />}
            className="btn-safety-secondary"
            style={{ height: 40 }}
            onClick={() => window.print()}
          >
            Ekspor Laporan
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="btn-safety-danger"
            style={{ height: 40, padding: "0 20px" }}
            onClick={() => navigate("/keselamatan/kecelakaan/create")}
          >
            Lapor Kecelakaan Baru
          </Button>
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
          scroll={{ x: 1050 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Edukasi Prosedur Klaim TASPEN */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          📋 Ketentuan & Tata Cara Klaim Jaminan Kecelakaan Kerja (JKK)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dc2626", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Pertolongan Medis Segera</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Bawa korban ke faskes/RS terdekat. Mintakan Surat Keterangan Dokter (Formulir Pengobatan JKK) serta kwitansi rincian biaya.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#d97706", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Lapor Tim K3 & SDM</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Laporkan dalam 2x24 jam sejak kejadian untuk penerbitan Berita Acara Kecelakaan Kerja yang ditandatangani Atasan Langsung.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Pencairan Manfaat TASPEN</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Klaim mencakup penggantian biaya perawatan, santunan cacat/lumpuh, serta beasiswa anak sesuai regulasi PP JKK/JHT ASN.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
