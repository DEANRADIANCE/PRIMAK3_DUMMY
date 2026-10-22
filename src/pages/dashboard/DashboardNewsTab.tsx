import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Tag,
  Button,
  Modal,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  SearchOutlined,
  FilePdfOutlined,
  ArrowRightOutlined,
  NotificationOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useList, useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router";
import { IAnnouncement } from "../../types/announcement";
import { IUser } from "../../types/user";
import { initialAnnouncements } from "../../mocks/announcements";

const { Title, Text, Paragraph } = Typography;

export const DashboardNewsTab: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<IAnnouncement | null>(null);

  // Ambil data dari resource announcements
  const { result } = useList<IAnnouncement>({
    resource: "announcements",
  });

  const newsList: IAnnouncement[] = (result?.data && result.data.length > 0)
    ? (result.data as IAnnouncement[])
    : initialAnnouncements;

  // Filter pencarian dan kategori
  const filteredNews = newsList.filter((item) => {
    const matchSearch =
      searchTerm.trim() === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (selectedCategory === "all") return true;
    if (selectedCategory === "mcu" && item.title.toLowerCase().includes("mcu")) return true;
    if (selectedCategory === "darurat" && (item.title.toLowerCase().includes("simulasi") || item.title.toLowerCase().includes("darurat"))) return true;
    if (selectedCategory === "kesehatan" && (item.title.toLowerCase().includes("vaksin") || item.title.toLowerCase().includes("konseling") || item.title.toLowerCase().includes("psikolog"))) return true;
    if (selectedCategory === "ergonomi" && (item.title.toLowerCase().includes("ergonomi") || item.title.toLowerCase().includes("inspeksi"))) return true;

    return true;
  });

  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const regularNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header & Search Control Bar */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px 24px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="live-pulse-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Pusat Informasi & Warta K3 ANRI
            </span>
          </div>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
            Warta & Pemberitahuan Kegiatan Terkini
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Informasi pelaksanaan agenda keselamatan, surveillance kesehatan kerja, dan pengumuman resmi Klinik Pratama ANRI
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            placeholder="Cari judul agenda atau kegiatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280, borderRadius: 10 }}
            allowClear
          />

          {canManage && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/media/pemberitahuan/create")}
              style={{
                borderRadius: 10,
                background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
                border: "none",
                fontWeight: 600,
              }}
            >
              Buat Pemberitahuan
            </Button>
          )}
        </div>
      </div>

      {/* 2. Quick Category Filter Pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Semua Informasi", count: newsList.length },
          { key: "mcu", label: "Medical Check-Up (MCU)", count: 1 },
          { key: "darurat", label: "Tanggap Darurat & Kebakaran", count: 1 },
          { key: "kesehatan", label: "Vaksin & Konseling Medis", count: 2 },
          { key: "ergonomi", label: "Ergonomi & Sanitasi Lingkungan", count: 2 },
        ].map((cat) => (
          <Button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className="news-filter-pill"
            style={{
              backgroundColor: selectedCategory === cat.key ? "#0d9488" : "#ffffff",
              color: selectedCategory === cat.key ? "#ffffff" : "#475569",
              borderColor: selectedCategory === cat.key ? "#0d9488" : "#cbd5e1",
              fontWeight: selectedCategory === cat.key ? 600 : 500,
            }}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* 3. Featured Hero News (Headline) */}
      {featuredNews && (
        <Card
          className="news-hero-card"
          bodyStyle={{ padding: 0 }}
          onClick={() => setActiveModalItem(featuredNews)}
          style={{ cursor: "pointer" }}
        >
          <Row>
            <Col xs={24} md={10} style={{ position: "relative", minHeight: 240, overflow: "hidden" }}>
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 240,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  background: "rgba(13, 148, 136, 0.9)",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: 20,
                  backdropFilter: "blur(4px)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <NotificationOutlined /> BERITA UTAMA
              </div>
            </Col>

            <Col xs={24} md={14} style={{ padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                  <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
                    <CalendarOutlined /> Terbit: {featuredNews.date}
                  </Tag>
                  {featuredNews.eventDate && (
                    <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600 }}>
                      Agenda: {featuredNews.eventDate}
                    </Tag>
                  )}
                  {featuredNews.location && (
                    <span style={{ fontSize: 12, color: "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <EnvironmentOutlined style={{ color: "#0ea5e9" }} /> {featuredNews.location}
                    </span>
                  )}
                </div>

                <Title level={4} style={{ margin: "4px 0 10px", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>
                  {featuredNews.title}
                </Title>

                <Paragraph style={{ color: "#475569", fontSize: 13, lineHeight: 1.6, margin: 0 }} ellipsis={{ rows: 3 }}>
                  {featuredNews.description}
                </Paragraph>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: "#e0f2fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0284c7",
                      fontSize: 12,
                    }}
                  >
                    <UserOutlined />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>
                    {featuredNews.createdBy || "Klinik Pratama ANRI"}
                  </span>
                </div>

                <Button
                  type="primary"
                  style={{
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
                    border: "none",
                    fontWeight: 600,
                  }}
                >
                  Baca Selengkapnya &rarr;
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 4. Grid of Regular News Cards */}
      <Row gutter={[18, 18]}>
        {regularNews.map((news) => (
          <Col xs={24} sm={12} lg={8} key={news.id}>
            <Card
              className="news-grid-card"
              hoverable
              bodyStyle={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}
              onClick={() => setActiveModalItem(news)}
            >
              <div>
                <div style={{ height: 160, margin: "-18px -20px 14px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={news.image}
                    alt={news.title}
                    className="news-card-img-zoom"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 10,
                      background: "rgba(15, 23, 42, 0.8)",
                      color: "#ffffff",
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 6,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <CalendarOutlined /> {news.date}
                  </div>
                </div>

                {news.location && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#0284c7",
                      fontWeight: 600,
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <EnvironmentOutlined /> {news.location}
                  </div>
                )}

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#0f172a",
                    lineHeight: 1.4,
                    marginBottom: 8,
                    height: 40,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {news.title}
                </div>

                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ fontSize: 12, margin: "0 0 12px", color: "#64748b", lineHeight: 1.5 }}
                >
                  {news.description}
                </Paragraph>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 10,
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <span style={{ fontSize: 11, color: "#94a3b8" }}>
                  Oleh: <strong style={{ color: "#475569" }}>{news.createdBy || "Tim K3"}</strong>
                </span>
                <span style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Baca Detail <ArrowRightOutlined style={{ fontSize: 11 }} />
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 5. Detail News Modal */}
      {activeModalItem && (
        <Modal
          open={true}
          onCancel={() => setActiveModalItem(null)}
          footer={[
            <Button key="close" onClick={() => setActiveModalItem(null)} style={{ borderRadius: 8 }}>
              Tutup
            </Button>,
            <Button
              key="view-source"
              type="primary"
              style={{
                borderRadius: 8,
                background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
                border: "none",
              }}
              onClick={() => {
                navigate(`/media/pemberitahuan/show/${activeModalItem.id}`);
              }}
            >
              Buka Halaman Pemberitahuan Penuh
            </Button>,
          ]}
          width={720}
          style={{ top: 30 }}
        >
          <div>
            <div style={{ height: 260, borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <Tag color="cyan">
                <CalendarOutlined /> Terbit: {activeModalItem.date}
              </Tag>
              {activeModalItem.eventDate && (
                <Tag color="orange">
                  Jadwal: {activeModalItem.eventDate}
                </Tag>
              )}
              {activeModalItem.location && (
                <Tag color="blue">
                  <EnvironmentOutlined /> {activeModalItem.location}
                </Tag>
              )}
            </div>

            <Title level={4} style={{ color: "#0f172a", fontWeight: 700, margin: "0 0 14px" }}>
              {activeModalItem.title}
            </Title>

            <div
              style={{
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: 8,
                borderLeft: "4px solid #0d9488",
                marginBottom: 16,
                fontSize: 13,
                color: "#334155",
                lineHeight: 1.6,
              }}
            >
              {activeModalItem.description}
            </div>

            <div style={{ whiteSpace: "pre-line", color: "#334155", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
              {activeModalItem.content || activeModalItem.description}
            </div>

            {activeModalItem.attachments && activeModalItem.attachments.length > 0 && (
              <div style={{ marginTop: 16, padding: "12px 14px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
                  Lampiran Dokumen Resmi:
                </div>
                {activeModalItem.attachments.map((att, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#15803d" }}>
                    <FilePdfOutlined style={{ color: "#dc2626" }} />
                    <span style={{ fontWeight: 500 }}>{att}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
