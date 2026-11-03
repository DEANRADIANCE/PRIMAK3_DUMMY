import React, { useState } from "react";
import { Card, Button, Typography, Modal, Tooltip } from "antd";
import {
  DownloadOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  FireOutlined,
  FileProtectOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Poster } from "../../types/public";

const { Title, Paragraph, Text } = Typography;

interface PosterCardProps {
  poster: Poster;
  style?: React.CSSProperties;
}

export const PosterCard: React.FC<PosterCardProps> = ({ poster, style }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Helper ikon berdasarkan kategori
  const getPosterIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "keselamatan":
        return <SafetyCertificateOutlined style={{ fontSize: 28, color: "#0284c7" }} />;
      case "kesehatan":
        return <HeartOutlined style={{ fontSize: 28, color: "#7c3aed" }} />;
      case "tanggap darurat":
        return <FireOutlined style={{ fontSize: 28, color: "#ea580c" }} />;
      default:
        return <FileProtectOutlined style={{ fontSize: 28, color: "#059669" }} />;
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = poster.file_url;
    link.download = `${poster.title.replace(/\s+/g, "_")}.png`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card
        hoverable
        className="pub-hover-card"
        onClick={() => setPreviewOpen(true)}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          cursor: "pointer",
          ...style,
        }}
        bodyStyle={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: 16,
        }}
        cover={
          // Area poster berwarna pastel dengan rasio poster portrait 3:4 atau 4:5
          <div
            style={{
              backgroundColor: poster.color || "#e0f2fe",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 250,
              position: "relative",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Lingkaran Ikon */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginBottom: 16,
              }}
            >
              {getPosterIcon(poster.category)}
            </div>

            {/* Poster internal content */}
            <div style={{ textAlign: "center", width: "100%", margin: "auto 0" }}>
              <Title
                level={4}
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 8,
                  lineHeight: 1.35,
                }}
              >
                {poster.title}
              </Title>
              <Paragraph
                style={{
                  fontSize: 12,
                  color: "#475569",
                  lineHeight: 1.5,
                  marginBottom: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {poster.description}
              </Paragraph>
            </div>

            {/* Label PRIMA K3 · ANRI */}
            <div
              style={{
                marginTop: 16,
                padding: "4px 12px",
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(4px)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#334155",
                textTransform: "uppercase",
              }}
            >
              PRIMA K3 · ANRI
            </div>
          </div>
        }
      >
        {/* Di bawah kartu: judul poster dan tombol ikon unduh */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: "auto",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={5}
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "#1e293b",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={poster.title}
            >
              {poster.title}
            </Title>
            <Text style={{ fontSize: 11, color: "#94a3b8" }}>
              {poster.category}
            </Text>
          </div>

          <Tooltip title="Unduh poster">
            <Button
              type="default"
              shape="circle"
              icon={<DownloadOutlined style={{ fontSize: 15, color: "#0f766e" }} />}
              onClick={handleDownload}
              aria-label={`Unduh poster ${poster.title}`}
              style={{
                borderColor: "#cbd5e1",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                flexShrink: 0,
              }}
            />
          </Tooltip>
        </div>
      </Card>

      {/* Modal Preview Ukuran Penuh */}
      <Modal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>
            Tutup
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ backgroundColor: "#0f766e", borderColor: "#0f766e" }}
          >
            Unduh File Poster
          </Button>,
        ]}
        width={680}
        centered
        title={poster.title}
      >
        <div
          style={{
            backgroundColor: poster.color || "#e0f2fe",
            borderRadius: 12,
            padding: "40px 32px",
            textAlign: "center",
            marginTop: 16,
            marginBottom: 16,
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
              marginBottom: 24,
            }}
          >
            {getPosterIcon(poster.category)}
          </div>
          <Title level={3} style={{ color: "#1e293b", marginBottom: 12 }}>
            {poster.title}
          </Title>
          <Paragraph style={{ fontSize: 15, color: "#475569", maxWidth: 480, lineHeight: 1.6 }}>
            {poster.description}
          </Paragraph>
          <div
            style={{
              marginTop: 20,
              padding: "6px 16px",
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#334155",
            }}
          >
            ARSIP NASIONAL REPUBLIK INDONESIA · PRIMA K3
          </div>
        </div>
      </Modal>
    </>
  );
};
