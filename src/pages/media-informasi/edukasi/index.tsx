import React, { useMemo } from "react";
import { Typography, Segmented, Row, Col, Tag } from "antd";
import { useSearchParams } from "react-router";
import { BookOutlined, FileImageOutlined, ReadOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { IArticle } from "../../../types/article";
import { IPoster } from "../../../types/poster";
import { EdukasiTab } from "./tabs/EdukasiTab";
import { PosterTab } from "./tabs/PosterTab";
import "../media.css";

const { Title, Paragraph } = Typography;

export const EdukasiPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from query param; default to 'edukasi'
  const rawTab = searchParams.get("tab");
  const activeTab = rawTab === "poster" ? "poster" : "edukasi";

  // Counts for the hero counter badge
  const { result: articlesResult } = useList<IArticle>({
    resource: "articles",
    pagination: { mode: "off" },
  });
  const { result: postersResult } = useList<IPoster>({
    resource: "posters",
    pagination: { mode: "off" },
  });

  const totalArticles = articlesResult?.total || articlesResult?.data?.length || 0;
  const totalPosters = postersResult?.total || postersResult?.data?.length || 0;

  // Tab switch handler: cleans query string of previous tab to avoid mixing
  const handleTabChange = (newTab: string) => {
    setSearchParams(
      { tab: newTab },
      { replace: false }
    );
  };

  // Dynamic header based on tab
  const headerContent = useMemo(() => {
    if (activeTab === "poster") {
      return {
        tagLabel: "MEDIA KAMPANYE & VISUAL K3",
        tagSub: "Materi Publikasi Mading, Lift & Depo Arsip ANRI",
        tagIcon: <FileImageOutlined />,
        bannerClass: "media-banner-poster",
        title: "Kelola Poster",
        subtitle:
          "Tulis, jadwalkan, dan terbitkan poster yang tampil di halaman depan.",
        countLabel: "TOTAL MATERI POSTER",
        count: totalPosters,
        unit: "Poster",
      };
    }
    return {
      tagLabel: "PUSTAKA & ARTIKEL EDUKASI K3",
      tagSub: "Portal Sosialisasi & Wawasan Keselamatan Kerja ANRI",
      tagIcon: <ReadOutlined />,
      bannerClass: "media-banner-edukasi",
      title: "Kelola Edukasi",
      subtitle:
        "Tulis, jadwalkan, dan terbitkan edukasi yang tampil di halaman depan.",
      countLabel: "TOTAL ARTIKEL TERDAFTAR",
      count: totalArticles,
      unit: "Artikel",
    };
  }, [activeTab, totalArticles, totalPosters]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient (Sesuai tema Media & Informasi PRIMA K3) */}
      <div className={`media-hero-banner ${headerContent.bannerClass} media-card-animate media-delay-1`}>
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <Tag
                color="cyan"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                {headerContent.tagIcon} {headerContent.tagLabel}
              </Tag>
              <span style={{ fontSize: 13, color: "#d1fae5" }}>{headerContent.tagSub}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              {headerContent.title}
            </Title>
            <Paragraph style={{ color: "#ecfdf5", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              {headerContent.subtitle}
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(6px)",
                padding: "10px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textAlign: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ fontSize: 11, color: "#a7f3d0", fontWeight: 700, letterSpacing: 0.5 }}>
                {headerContent.countLabel}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {headerContent.count} <span style={{ fontSize: 12, fontWeight: 400 }}>{headerContent.unit}</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Tab Navigation (Segmented styling with theme colors) */}
      <div
        className="media-card-animate media-delay-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "#ffffff",
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Segmented
          value={activeTab}
          onChange={(val) => handleTabChange(val as string)}
          size="large"
          options={[
            {
              label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px" }}>
                  <BookOutlined style={{ color: activeTab === "edukasi" ? "#0d9488" : undefined }} />
                  <span style={{ fontWeight: activeTab === "edukasi" ? 700 : 500 }}>Kelola Edukasi</span>
                </div>
              ),
              value: "edukasi",
            },
            {
              label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 16px" }}>
                  <FileImageOutlined style={{ color: activeTab === "poster" ? "#0284c7" : undefined }} />
                  <span style={{ fontWeight: activeTab === "poster" ? 700 : 500 }}>Kelola Poster</span>
                </div>
              ),
              value: "poster",
            },
          ]}
          style={{
            backgroundColor: "#f1f5f9",
            padding: 4,
            borderRadius: 10,
          }}
        />

        <div style={{ fontSize: 13, color: "#64748b", paddingRight: 8 }}>
          {activeTab === "edukasi" ? "Mode: Artikel & Pustaka Digital" : "Mode: Media Visual & Desain Grafis"}
        </div>
      </div>

      {/* 3. Lazy Tab Content Rendering (only renders the active tab) */}
      <div className="media-card-animate media-delay-3">
        {activeTab === "edukasi" && <EdukasiTab />}
        {activeTab === "poster" && <PosterTab />}
      </div>
    </div>
  );
};

export default EdukasiPage;
