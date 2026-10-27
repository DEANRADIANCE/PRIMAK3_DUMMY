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
  Badge,
} from "antd";
import {
  PlusOutlined,
  LockOutlined,
  CalendarOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  CheckSquareOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useGetIdentity, useUpdate } from "@refinedev/core";
import { IPsychologistBooking } from "../../../types/psychologist";
import { IUser } from "../../../types/user";
import { mockDb } from "../../../mocks";
import { PsychologistFollowUpModal } from "./PsychologistFollowUpModal";
import "../kesehatan.css";

const { Title, Text, Paragraph } = Typography;

export const PsychologistList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<IPsychologistBooking | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const { mutate: updateBooking } = useUpdate();

  const { tableProps, tableQuery } = useTable<IPsychologistBooking>({
    resource: "psychologist-bookings",
    pagination: { pageSize: 10 },
  });

  const isPrivileged = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const allBookings = (tableProps.dataSource || []) as IPsychologistBooking[];

  const completedCount = allBookings.filter((b) => b.status === "completed").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;
  const followUpCount = allBookings.filter((b) => b.needsFollowUp === true).length;
  const totalActiveTasks = allBookings.reduce((sum, b) => {
    return sum + (b.tasks || []).filter((t) => t.status !== "completed").length;
  }, 0);

  const filteredBookings = allBookings.filter((b) => {
    const matchSearch =
      !searchTerm.trim() ||
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sessionDate.includes(searchTerm);

    if (!matchSearch) return false;
    if (statusFilter === "all") return true;
    if (statusFilter === "needs_follow_up") return b.needsFollowUp === true;
    return b.status === statusFilter;
  });

  const handleSaveBooking = (updated: IPsychologistBooking) => {
    // Sinkronkan ke mockDb memori lokal
    if (mockDb["psychologist-bookings"]) {
      const idx = mockDb["psychologist-bookings"].findIndex((b) => b.id === updated.id);
      if (idx !== -1) {
        mockDb["psychologist-bookings"][idx] = { ...updated };
      }
    }

    updateBooking(
      {
        resource: "psychologist-bookings",
        id: updated.id,
        values: updated,
      },
      {
        onSuccess: () => {
          tableQuery?.refetch();
        },
      }
    );
  };

  const handleOpenFollowUp = (booking: IPsychologistBooking) => {
    setSelectedBooking(booking);
    setIsFollowUpModalOpen(true);
  };

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
      width: 210,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "") || record.patientId === currentUser?.id;
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
      width: 200,
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
      title: "Alasan Konsultasi (Keluhan)",
      dataIndex: "reason",
      key: "reason",
      width: 240,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "") || record.patientId === currentUser?.id;
        if (isPrivileged || isSelf) {
          return (
            <Tooltip title={val}>
              <Text ellipsis style={{ maxWidth: 220, fontSize: 12.5, color: "#334155" }}>
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
      width: 170,
      render: (val: string) => renderStatus(val),
    },
    {
      title: "Tindak Lanjut & Penugasan",
      key: "followUp",
      width: 210,
      render: (_: unknown, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "") || record.patientId === currentUser?.id;
        const canView = isPrivileged || isSelf;

        if (!canView) {
          return (
            <Tag color="default" style={{ borderRadius: 6 }}>
              Rahasia Medis
            </Tag>
          );
        }

        if (record.needsFollowUp === true) {
          const tasks = record.tasks || [];
          const completedTasks = tasks.filter((t) => t.status === "completed").length;
          return (
            <Space direction="vertical" size={2}>
              <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700, margin: 0 }}>
                ● Perlu Tindak Lanjut
              </Tag>
              {tasks.length > 0 ? (
                <div style={{ fontSize: 12, color: "#0d9488", fontWeight: 600 }}>
                  <CheckSquareOutlined style={{ marginRight: 4 }} />
                  {completedTasks}/{tasks.length} Penugasan Selesai
                </div>
              ) : (
                <div style={{ fontSize: 11, color: "#d97706" }}>
                  ⏳ Belum ada penugasan task
                </div>
              )}
            </Space>
          );
        }

        if (record.needsFollowUp === false) {
          return (
            <Tag color="green" style={{ borderRadius: 6, fontWeight: 600 }}>
              ✔ Tidak Perlu (Mandiri)
            </Tag>
          );
        }

        return (
          <Tag color="default" style={{ borderRadius: 6, color: "#64748b" }}>
            Menunggu Evaluasi Sesi
          </Tag>
        );
      },
    },
    {
      title: "Aksi & Feedback",
      key: "action",
      width: 190,
      render: (_: unknown, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "") || record.patientId === currentUser?.id;
        const canInteract = isPrivileged || isSelf;
        const taskCount = record.tasks?.length || 0;
        const commentCount = (record.tasks || []).reduce(
          (acc, t) => acc + (t.comments?.length || 0),
          0
        );

        if (!canInteract) {
          return (
            <Tooltip title="Data rekam medis rahasia, hanya dapat diakses oleh Dokter Psikolog dan Pasien bersangkutan.">
              <Button size="small" disabled style={{ borderRadius: 6, fontSize: 12 }}>
                Privasi Medis
              </Button>
            </Tooltip>
          );
        }

        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={isPrivileged ? <MedicineBoxOutlined /> : <CommentOutlined />}
              onClick={() => handleOpenFollowUp(record)}
              style={{
                borderRadius: 6,
                background: "#0d9488",
                borderColor: "#0d9488",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              {isPrivileged ? "Tindak Lanjut & Task" : "Tugas & Diskusi"}
              {taskCount > 0 && ` (${taskCount})`}
            </Button>

            {commentCount > 0 && (
              <Tooltip title={`${commentCount} pesan feedback/diskusi pada sesi ini`}>
                <Badge count={commentCount} overflowCount={99} style={{ backgroundColor: "#0284c7" }} />
              </Tooltip>
            )}
          </Space>
        );
      },
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
              Konseling tatap muka empatik, evaluasi tindak lanjut, penugasan terapi mandiri (self-care tasks), serta fitur feedback & komunikasi berkala antara psikolog dan pegawai untuk pemulihan kesehatan mental yang terukur.
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

      {/* 2. Stat Metric Cards dengan Animasi */}
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
              style={{ background: "#f5f3ff", color: "#7c3aed" }}
            >
              <CheckSquareOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Perlu Tindak Lanjut
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                {followUpCount} Kasus
              </div>
              <Text style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 600 }}>
                {totalActiveTasks} Tugas Terapi Aktif
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-3">
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
                Evaluasi Klinis Tuntas
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-4">
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
      </Row>

      {/* 3. Control Bar: Filter, Pencarian & Tombol Booking */}
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
              { key: "needs_follow_up", label: "Perlu Tindak Lanjut" },
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
            style={{ width: 220, borderRadius: 8 }}
            allowClear
          />
        </div>

        {/* Sisi Kanan: Tombol Booking Baru */}
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
              Agenda Sesi Konsultasi Psikolog & Penugasan Terapi
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
          scroll={{ x: 1060 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Alur Layanan Konseling & Tindak Lanjut Psikologis ANRI */}
      <div className="health-card-animate health-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🌿 Panduan & Alur Tindak Lanjut Konsultasi Psikolog Klinis ANRI
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
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
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                  Sesi Konseling Private
                </div>
              </div>
              <Paragraph style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Konsultasi tatap muka 50 menit di Klinik ANRI dengan jaminan kerahasiaan medis kode etik klinis.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={6}>
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
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                  Evaluasi Tindak Lanjut
                </div>
              </div>
              <Paragraph style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Psikolog menentukan apakah kasus tuntas mandiri atau memerlukan tindak lanjut & pemantauan berkala.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={6}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                  Penugasan Terapi Mandiri
                </div>
              </div>
              <Paragraph style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Jika ditindaklanjuti, dokter meresepkan task latihan (teknik napas, relaksasi, journaling, dsb) untuk dijalankan pasien.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={6}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#059669",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  4
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>
                  Feedback & Komunikasi
                </div>
              </div>
              <Paragraph style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Pasien melaporkan progres/kendala, dan psikolog memberikan feedback langsung pada setiap penugasan.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modal Tindak Lanjut, Penugasan & Feedback Interaktif */}
      <PsychologistFollowUpModal
        open={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        booking={selectedBooking}
        currentUser={currentUser}
        onSaveBooking={handleSaveBooking}
      />
    </div>
  );
};
