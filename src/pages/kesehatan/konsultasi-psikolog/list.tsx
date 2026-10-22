import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Tooltip,
  Row,
  Col,
  Input,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  LockOutlined,
  CalendarOutlined,
  HeartOutlined,
  SmileOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import { IPsychologistBooking } from "../../../types/psychologist";
import { IUser } from "../../../types/user";
import "../kesehatan.css";

const { Title, Text, Paragraph } = Typography;

export const PsychologistList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { tableProps } = useTable<IPsychologistBooking>({
    resource: "psychologist-bookings",
    pagination: { pageSize: 10 },
  });

  const isPrivileged = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const allBookings = (tableProps.dataSource || []) as IPsychologistBooking[];

  const completedCount = allBookings.filter((b) => b.status === "completed").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;

  const filteredBookings = allBookings.filter((b) => {
    const matchSearch =
      !searchTerm.trim() ||
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sessionDate.includes(searchTerm);

    if (!matchSearch) return false;
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  const renderStatus = (st: string) => {
    switch (st) {
      case "confirmed":
        return (
          <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
            ● Jadwal Dikonfirmasi
          </Tag>
        );
      case "completed":
        return (
          <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>
            ✔ Selesai Konseling
          </Tag>
        );
      case "cancelled":
        return (
          <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>
            ✕ Dibatalkan
          </Tag>
        );
      default:
        return (
          <Tag color="gold" style={{ borderRadius: 6, fontWeight: 600 }}>
            ⏳ Menunggu Konfirmasi
          </Tag>
        );
    }
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
      title: "Nama Pasien / Pegawai",
      dataIndex: "patientName",
      key: "patientName",
      width: 220,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "");
        const displayName = !isPrivileged && !isSelf ? `Pegawai ANRI (${val.substring(0, 3)}***)` : val;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              style={{
                backgroundColor: isSelf ? "#0d9488" : "#e2e8f0",
                color: isSelf ? "#ffffff" : "#475569",
                fontWeight: 700,
                fontSize: 13,
              }}
              icon={!isPrivileged && !isSelf ? <UserOutlined /> : undefined}
            >
              {isPrivileged || isSelf ? val.charAt(0).toUpperCase() : ""}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13.5 }}>
                {displayName}
              </div>
              {isSelf && (
                <Tag color="teal" style={{ fontSize: 10, borderRadius: 4, margin: "2px 0 0" }}>
                  Sesi Saya
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Jadwal Sesi Konseling",
      key: "datetime",
      width: 210,
      render: (_: unknown, record: IPsychologistBooking) => (
        <div>
          <Space>
            <CalendarOutlined style={{ color: "#0d9488" }} />
            <span style={{ fontWeight: 700, color: "#1e293b" }}>{record.sessionDate}</span>
          </Space>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <ClockCircleOutlined style={{ fontSize: 11 }} /> Pukul {record.sessionTime} WIB (50 Menit)
          </div>
        </div>
      ),
    },
    {
      title: "No. Kontak",
      dataIndex: "contactNumber",
      key: "contactNumber",
      width: 150,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "");
        if (!isPrivileged && !isSelf) {
          return <span style={{ color: "#94a3b8" }}>0812-****-****</span>;
        }
        return <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{val}</span>;
      },
    },
    {
      title: "Alasan Konsultasi (Rahasia Medis)",
      dataIndex: "reason",
      key: "reason",
      width: 280,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "");
        if (isPrivileged || isSelf) {
          return (
            <Tooltip title={val}>
              <Text ellipsis style={{ maxWidth: 260, fontSize: 12.5, color: "#334155" }}>
                {val}
              </Text>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="Data keluhan medis dan psikologis bersifat strictly confidential (rahasia medis kode etik klinis).">
            <Tag icon={<LockOutlined />} color="default" style={{ borderRadius: 6, fontWeight: 500 }}>
              Rahasia Medis Klinis
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Status Sesi",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (val: string) => renderStatus(val),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="health-hero-banner health-banner-psychology">
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
                <HeartOutlined /> KESEHATAN MENTAL & KONSELING PEGAWAI
              </Tag>
              <span style={{ fontSize: 13, color: "#e0e7ff" }}>Klinik Pratama ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Layanan Konsultasi Psikolog Klinis ANRI
            </Title>
            <Paragraph style={{ color: "#e0e7ff", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Konseling tatap muka empatik, penanganan stres kerja/burnout, serta pendampingan kesehatan mental profesional dengan jaminan kerahasiaan penuh kode etik klinis bagi seluruh pegawai ANRI.
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
              <div style={{ fontSize: 11, color: "#e0e7ff", fontWeight: 600 }}>JAMINAN KERAHASIAAN</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                100% <span style={{ fontSize: 13, fontWeight: 400 }}>Confidential</span>
              </div>
              <Tag color="purple" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Psikolog Berizin SIP
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-1">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#eef2ff", color: "#4f46e5" }}
            >
              <CalendarOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Total Sesi Terdaftar
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                {allBookings.length} Sesi
              </div>
              <Text style={{ fontSize: 11.5, color: "#4f46e5", fontWeight: 600 }}>
                Tahun Berjalan 2026
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-2">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#ecfdf5", color: "#059669" }}
            >
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Selesai Konseling
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                {completedCount} Sesi
              </div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>
                Tindak Lanjut Tuntas
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-3">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#f0fdfa", color: "#0d9488" }}
            >
              <ClockCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Jadwal Mendatang
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                {confirmedCount} Sesi
              </div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>
                Telah Terkonfirmasi
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-4">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#fdf2f8", color: "#db2777" }}
            >
              <SmileOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Biaya Layanan
              </Text>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Gratis (0,-)</div>
              <Text style={{ fontSize: 11.5, color: "#db2777", fontWeight: 600 }}>
                Fasilitas Pegawai ANRI
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Bar: Filter, Pencarian & Tombol Booking Kontras */}
      <div
        className="health-card-animate health-delay-2"
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
        {/* Sisi Kiri: Filter Status & Search */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Semua Jadwal" },
              { key: "confirmed", label: "Dikonfirmasi" },
              { key: "completed", label: "Selesai" },
            ].map((st) => (
              <Button
                key={st.key}
                size="middle"
                onClick={() => setStatusFilter(st.key)}
                className={`health-filter-btn ${statusFilter === st.key ? "active" : ""}`}
                style={{
                  borderRadius: 8,
                  backgroundColor: statusFilter === st.key ? undefined : "#f8fafc",
                  color: statusFilter === st.key ? undefined : "#475569",
                  borderColor: statusFilter === st.key ? undefined : "#e2e8f0",
                }}
              >
                {st.label}
              </Button>
            ))}
          </div>

          <Input
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            placeholder="Cari pasien / tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, borderRadius: 8 }}
            allowClear
          />
        </div>

        {/* Sisi Kanan: Tombol Booking Baru Bergradasi Kontras */}
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/kesehatan/konsultasi/create")}
          className="btn-health-primary"
          style={{ height: 40, padding: "0 20px" }}
        >
          Booking Jadwal Konsultasi
        </Button>
      </div>

      {/* 4. Tabel Daftar Sesi Konsultasi */}
      <Card
        className="health-content-card health-card-animate health-delay-3"
        bordered={false}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined style={{ color: "#0d9488", fontSize: 18 }} />
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              Agenda Sesi Konsultasi Psikolog Klinis
            </span>
          </div>
        }
        extra={
          <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
            Ruang Konseling Lantai 1 (Gedung A)
          </Tag>
        }
      >
        <Table
          {...tableProps}
          dataSource={filteredBookings}
          columns={columns}
          rowKey="id"
          scroll={{ x: 920 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Alur Layanan Konseling Psikologis ANRI */}
      <div className="health-card-animate health-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🌿 Panduan & Alur Konsultasi Psikolog Klinis ANRI
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#0d9488",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Pilih Jadwal Sesi
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Pilih tanggal dan slot waktu luang (Sesi Pagi 08:00 WIB atau Sesi Siang 13:00 WIB) sesuai kenyamanan Anda.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#0284c7",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Kerahasiaan Dijamin
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Keluhan Anda dienkripsi dan hanya dibaca oleh Psikolog Klinis. Atasan kerja maupun pihak luar tidak berhak mengaksesnya.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#6366f1",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Konseling Tatap Muka
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Hadir 10 menit sebelum sesi di Ruang Konseling Klinik Pratama Lantai 1 untuk sesi private selama 50-60 menit.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
