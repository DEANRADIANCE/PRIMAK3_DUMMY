import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Modal,
  Image,
  Popconfirm,
  Input,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FileImageOutlined,
  SearchOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IPoster } from "../../../types/poster";
import { IUser } from "../../../types/user";
import "../media.css";

const { Title, Paragraph } = Typography;

export const PosterList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [previewPoster, setPreviewPoster] = useState<IPoster | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { tableProps } = useTable<IPoster>({
    resource: "posters",
    pagination: { pageSize: 12 },
  });

  const { mutate: deletePoster } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const rawPosters = (tableProps.dataSource || []) as IPoster[];

  const filteredPosters = rawPosters.filter((p) => {
    const matchSearch =
      !searchTerm.trim() ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (activeCategory === "all") return true;
    if (activeCategory === "darurat" && (p.category.toLowerCase().includes("darurat") || p.title.toLowerCase().includes("evakuasi"))) return true;
    if (activeCategory === "ergonomi" && (p.category.toLowerCase().includes("ergonomi") || p.title.toLowerCase().includes("duduk"))) return true;
    if (activeCategory === "kesehatan" && (p.category.toLowerCase().includes("sehat") || p.category.toLowerCase().includes("kesehatan"))) return true;

    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient (Khusus Galeri Poster) */}
      <div className="media-hero-banner media-banner-poster">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                color="purple"
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
                <FileImageOutlined /> GALERI VISUAL & FLAYER K3
              </Tag>
              <span style={{ fontSize: 13, color: "#e0e7ff" }}>Media Sosialisasi & Promosi K3 ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Flayer & Poster Keselamatan Kerja
            </Title>
            <Paragraph style={{ color: "#e0e7ff", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Materi visual kampanye K3 beresolusi tinggi, siap cetak ukuran A3/A4 dan dipublikasikan pada mading serta layar informasi seluruh unit kerja ANRI.
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
              <div style={{ fontSize: 11, color: "#e0e7ff", fontWeight: 600 }}>SIAP CETAK</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {rawPosters.length} <span style={{ fontSize: 12, fontWeight: 400 }}>Flayer HD</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Control Bar Terpisah: Filter Category, Search & Tombol Unggah Kontras */}
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
              { key: "all", label: "Semua Media Visual" },
              { key: "darurat", label: "Tanggap Darurat" },
              { key: "ergonomi", label: "Ergonomi Kerja" },
              { key: "kesehatan", label: "Kesehatan & P3K" },
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
            placeholder="Cari materi poster..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 190, borderRadius: 8 }}
            allowClear
          />
        </div>

        {/* Sisi Kanan: Tombol Unggah Poster Kontras di Luar Gradasi */}
        {canManage && (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/media/flayer-poster/create")}
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
            Unggah Poster Baru
          </Button>
        )}
      </div>

      {/* 3. Grid Kartu Poster dengan Animasi Scroll Reveal */}
      <Row gutter={[20, 20]} className="poster-grid">
        {filteredPosters.map((poster, index) => {
          const delayClass = `media-delay-${(index % 6) + 1}`;
          return (
            <Col xs={24} sm={12} lg={8} key={poster.id}>
              <Card
                hoverable
                bordered={false}
                className={`media-content-card media-card-animate ${delayClass}`}
                bodyStyle={{
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  justifyContent: "space-between",
                }}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 14,
                }}
                cover={
                  <div
                    style={{ position: "relative", height: 260, overflow: "hidden", cursor: "pointer" }}
                    onClick={() => setPreviewPoster(poster)}
                  >
                    <img
                      alt={poster.title}
                      src={poster.image}
                      className="media-card-img"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "rgba(13, 148, 136, 0.85)",
                        backdropFilter: "blur(4px)",
                        color: "#fff",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {poster.category}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(4px)",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <EyeOutlined /> Klik Pratinjau
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    key="preview"
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => setPreviewPoster(poster)}
                    style={{ color: "#0d9488", fontWeight: 600 }}
                  >
                    Lihat Penuh
                  </Button>,
                  <Button
                    key="download"
                    type="link"
                    icon={<DownloadOutlined />}
                    href={poster.fileUrl || poster.image}
                    target="_blank"
                    style={{ color: "#0284c7", fontWeight: 600 }}
                  >
                  </Button>,
                  ...(canManage
                    ? [
                        <Popconfirm
                          key="del"
                          title="Hapus poster ini?"
                          onConfirm={() =>
                            deletePoster({
                              resource: "posters",
                              id: poster.id,
                            })
                          }
                        >
                          <Button key="del-btn" type="link" danger icon={<DeleteOutlined />} />
                        </Popconfirm>,
                      ]
                    : []),
                ]}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
                      {poster.category}
                    </Tag>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      <PrinterOutlined /> Format A3/A4
                    </span>
                  </div>

                  <Title level={5} style={{ margin: "4px 0 8px 0", lineHeight: 1.4, color: "#0f172a" }}>
                    {poster.title}
                  </Title>

                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12.5, margin: "0 0 10px", color: "#64748b" }}>
                    {poster.description}
                  </Paragraph>

                  <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right" }}>
                    Oleh: {poster.createdBy || "Tim K3 ANRI"}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal Pratinjau Poster Penuh */}
      {previewPoster && (
        <Modal
          open={true}
          title={previewPoster.title}
          onCancel={() => setPreviewPoster(null)}
          footer={[
            <Button key="close" onClick={() => setPreviewPoster(null)} style={{ borderRadius: 8 }}>
              Tutup
            </Button>,
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              className="btn-media-primary"
              href={previewPoster.fileUrl || previewPoster.image}
              target="_blank"
            >
              Unduh Poster HD
            </Button>,
          ]}
          width={650}
          centered
        >
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <Image
              src={previewPoster.image}
              alt={previewPoster.title}
              style={{ maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }}
            />
            <Paragraph style={{ marginTop: 14, color: "#475569", fontSize: 13, textAlign: "left" }}>
              {previewPoster.description}
            </Paragraph>
          </div>
        </Modal>
      )}
    </div>
  );
};
