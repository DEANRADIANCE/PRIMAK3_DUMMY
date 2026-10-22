import React, { useState } from "react";
import {
  Button,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Popconfirm,
  Input,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  SearchOutlined,
  NotificationOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IAnnouncement } from "../../../types/announcement";
import { IUser } from "../../../types/user";
import "../media.css";

const { Title, Paragraph } = Typography;

export const AnnouncementList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { tableProps } = useTable<IAnnouncement>({
    resource: "announcements",
    pagination: { pageSize: 12 },
  });

  const { mutate: deleteAnnouncement } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const rawAnnouncements = (tableProps.dataSource || []) as IAnnouncement[];

  // Filter pencarian dan kategori
  const filteredAnnouncements = rawAnnouncements.filter((item) => {
    const matchSearch =
      searchTerm.trim() === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (activeCategory === "all") return true;
    if (activeCategory === "mcu" && item.title.toLowerCase().includes("mcu")) return true;
    if (activeCategory === "darurat" && (item.title.toLowerCase().includes("simulasi") || item.title.toLowerCase().includes("darurat"))) return true;
    if (activeCategory === "kesehatan" && (item.title.toLowerCase().includes("vaksin") || item.title.toLowerCase().includes("konseling") || item.title.toLowerCase().includes("psikolog"))) return true;

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient (Khusus Informasi & Warta) */}
      <div className="media-hero-banner media-banner-pemberitahuan">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                color="cyan"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <NotificationOutlined /> AGENDA & WARTA RESMI
              </Tag>
              <span style={{ fontSize: 13, color: "#d1fae5" }}>Klinik Pratama & Unit K3 ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Pemberitahuan & Informasi Kegiatan K3
            </Title>
            <Paragraph style={{ color: "#ecfdf5", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Jadwal pelaksanaan medical check-up, gladi simulasi tanggap darurat, vaksinasi berkala, dan edaran resmi keselamatan kerja.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(6px)",
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#a7f3d0", fontWeight: 600 }}>TOTAL WARTA AKTIF</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {rawAnnouncements.length} <span style={{ fontSize: 12, fontWeight: 400 }}>Kegiatan</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Control Bar Terpisah: Filter Kategori, Search & Tombol Create Kontras */}
      <div
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
        {/* Sisi Kiri: Filter Pills & Search */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Semua Pemberitahuan" },
              { key: "mcu", label: "MCU Berkala" },
              { key: "darurat", label: "Tanggap Darurat" },
              { key: "kesehatan", label: "Vaksin & Konseling" },
            ].map((cat) => (
              <Button
                key={cat.key}
                size="middle"
                onClick={() => setActiveCategory(cat.key)}
                className={`media-filter-btn ${activeCategory === cat.key ? "active" : ""}`}
                style={{
                  borderRadius: 8,
                  backgroundColor: activeCategory === cat.key ? undefined : "#f8fafc",
                  color: activeCategory === cat.key ? undefined : "#475569",
                  borderColor: activeCategory === cat.key ? undefined : "#e2e8f0",
                }}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <Input
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            placeholder="Cari pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200, borderRadius: 8 }}
            allowClear
          />
        </div>

        {/* Sisi Kanan: Tombol Create Kontras di Luar Gradasi Banner */}
        {canManage && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/media/pemberitahuan/create")}
            style={{
              borderRadius: 8,
              height: 40,
              padding: "0 20px",
              fontWeight: 700,
              fontSize: 13,
              background: "#0d9488",
              borderColor: "#0d9488",
              boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Tambah Agenda Baru
          </Button>
        )}
      </div>

      {/* 3. Grid Kartu Pengumuman dengan Scroll Reveal Animation */}
      <Row gutter={[20, 20]}>
        {filteredAnnouncements.map((item, index) => {
          const delayClass = `media-delay-${(index % 6) + 1}`;
          return (
            <Col xs={24} md={12} lg={8} key={item.id}>
              <Card
                hoverable
                bordered={false}
                className={`media-content-card media-card-animate ${delayClass}`}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                cover={
                  item.image ? (
                    <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                      <img
                        alt={item.title}
                        src={item.image}
                        className="media-card-img"
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "rgba(15, 23, 42, 0.75)",
                          backdropFilter: "blur(4px)",
                          color: "#ffffff",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 20,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <CalendarOutlined /> {item.date}
                      </div>
                    </div>
                  ) : null
                }
                actions={[
                  <Button
                    key="detail"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/media/pemberitahuan/show/${item.id}`)}
                    style={{ color: "#0d9488", fontWeight: 600 }}
                  >
                    Detail Kegiatan
                  </Button>,
                  ...(canManage
                    ? [
                        <Button
                          key="edit"
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => navigate(`/media/pemberitahuan/edit/${item.id}`)}
                        >
                          Ubah
                        </Button>,
                        <Popconfirm
                          key="del"
                          title="Hapus pemberitahuan ini?"
                          onConfirm={() =>
                            deleteAnnouncement({
                              resource: "announcements",
                              id: item.id,
                            })
                          }
                        >
                          <Button type="link" danger icon={<DeleteOutlined />}>
                            Hapus
                          </Button>
                        </Popconfirm>,
                      ]
                    : []),
                ]}
              >
                <div>
                  {item.eventDate && (
                    <Tag color="cyan" style={{ marginBottom: 8, borderRadius: 6, fontWeight: 600 }}>
                      <CheckCircleOutlined /> Jadwal: {item.eventDate}
                    </Tag>
                  )}

                  <Title level={5} style={{ margin: "4px 0 8px", lineHeight: 1.4, color: "#0f172a" }}>
                    {item.title}
                  </Title>

                  {item.location && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#0284c7",
                        fontSize: 12,
                        marginBottom: 10,
                        fontWeight: 500,
                      }}
                    >
                      <EnvironmentOutlined />
                      <span>{item.location}</span>
                    </div>
                  )}

                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13, margin: "0 0 12px" }}>
                    {item.description}
                  </Paragraph>
                </div>

                {item.attachments && item.attachments.length > 0 && (
                  <div style={{ marginTop: "auto", paddingTop: 8 }}>
                    <Tag icon={<PaperClipOutlined />} color="success" style={{ borderRadius: 6, fontSize: 11 }}>
                      {item.attachments.length} Dokumen Lampiran
                    </Tag>
                  </div>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
