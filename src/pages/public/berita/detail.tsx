import React, { useEffect } from "react";
import { Typography, Button, Skeleton, Alert, Tag, Divider, Row, Col, Space } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  ShareAltOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router";
import { useList } from "@refinedev/core";
import dayjs from "dayjs";
import { Article } from "../../../types/public";
import { ArticleCard } from "../../../components/public";
import { useScrollReveal } from "../useScrollReveal";

const { Title, Paragraph, Text } = Typography;

export const BeritaDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Cari artikel berdasarkan slug
  const { result, query } = useList<Article>({
    resource: "edukasi",
    filters: [
      {
        field: "slug",
        operator: "eq",
        value: slug,
      },
    ],
    pagination: {
      mode: "off",
    },
  });

  // Rekomendasi artikel lainnya
  const { result: relatedResult } = useList<Article>({
    resource: "edukasi",
    pagination: {
      pageSize: 3,
      currentPage: 1,
    },
  });

  const article: Article | undefined = (result?.data as Article[])?.[0];
  const relatedArticles: Article[] = ((relatedResult?.data as Article[]) || [])
    .filter((a: Article) => a.slug !== slug)
    .slice(0, 3);
  const isLoading = query.isLoading;
  const isError = query.isError;

  // Selalu seret/scroll ke paling atas setiap kali slug artikel berubah (pindah berita)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Pastikan scroll tetap di paling atas setelah transisi render DOM baru
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => cancelAnimationFrame(rafId);
  }, [slug]);

  // Update SEO title dan pastikan posisi tetap di atas setelah data artikel selesai dimuat
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - Edukasi PRIMA K3 ANRI`;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    } else {
      document.title = "Detail Artikel - PRIMA K3 ANRI";
    }
  }, [article]);

  // Aktifkan animasi scroll untuk detail artikel dan artikel terkait
  useScrollReveal([article, relatedArticles, isLoading]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 840, margin: "40px auto", padding: "0 20px" }}>
        <Skeleton.Button active style={{ width: 140, marginBottom: 24 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div style={{ maxWidth: 840, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <Alert
          type="warning"
          showIcon
          message="Artikel Tidak Ditemukan"
          description="Artikel edukasi yang Anda cari mungkin telah dipindahkan atau belum diterbitkan."
          style={{ marginBottom: 24, textAlign: "left" }}
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/berita")}
          style={{ backgroundColor: "#0f766e" }}
        >
          Kembali ke Seluruh Berita
        </Button>
      </div>
    );
  }

  const formattedDate = dayjs(article.published_at).format("D MMMM YYYY");

  return (
    <div style={{ width: "100%", paddingBottom: 80, backgroundColor: "#ffffff" }}>
      {/* Top Navigation Bar */}
      <div
        className="pub-reveal"
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 20px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/berita")}
            style={{ color: "#0f766e", fontWeight: 600, padding: 0 }}
          >
            Kembali ke Seluruh Berita
          </Button>
        </div>
      </div>

      {/* Main Article Container */}
      <article style={{ maxWidth: 880, margin: "0 auto", padding: "40px 20px 0 20px" }}>
        {/* Category & Date Header */}
        <div className="pub-reveal pub-delay-1" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 6,
              backgroundColor: "#f0fdfa",
              color: "#0f766e",
              border: "1px solid #ccfbf1",
              textTransform: "uppercase",
            }}
          >
            {article.category}
          </span>
          <Text style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
            <CalendarOutlined /> {formattedDate}
          </Text>
          <Text style={{ fontSize: 13, color: "#94a3b8" }}>•</Text>
          <Text style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
            <UserOutlined /> Tim K3 ANRI
          </Text>
        </div>

        {/* Title */}
        <Title
          level={1}
          className="pub-reveal pub-delay-1"
          style={{
            fontSize: "clamp(24px, 3.6vw, 36px)",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          {article.title}
        </Title>

        {/* Excerpt Lead */}
        <Paragraph
          className="pub-reveal pub-delay-2"
          style={{
            fontSize: 17,
            color: "#475569",
            lineHeight: 1.7,
            borderLeft: "4px solid #0f766e",
            paddingLeft: 16,
            marginBottom: 28,
            fontStyle: "italic",
          }}
        >
          {article.excerpt}
        </Paragraph>

        {/* Hero Image */}
        <div
          className="pub-reveal-scale pub-delay-2"
          style={{
            position: "relative",
            width: "100%",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 36,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <img
            src={article.thumbnail_url}
            alt={article.title}
            style={{ width: "100%", height: "auto", maxHeight: 480, objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Article Body Content */}
        <div
          className="pub-reveal"
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            color: "#334155",
            whiteSpace: "pre-line",
          }}
        >
          {article.content}
        </div>

        {/* Article Footer Info */}
        <div
          className="pub-reveal"
          style={{
            marginTop: 48,
            padding: "20px 24px",
            backgroundColor: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SafetyCertificateOutlined style={{ fontSize: 24, color: "#0f766e" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                PRIMA K3 · Arsip Nasional Republik Indonesia
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Disusun oleh Biro Kepegawaian dan Umum
              </div>
            </div>
          </div>

          <Button
            type="default"
            icon={<ShareAltOutlined />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Tautan artikel berhasil disalin!");
              }
            }}
          >
            Bagikan Artikel
          </Button>
        </div>

        {/* Artikel Terkait */}
        {relatedArticles.length > 0 && (
          <div className="pub-reveal" style={{ marginTop: 64 }}>
            <Divider />
            <Title level={3} style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>
              Artikel Edukasi Lainnya
            </Title>
            <Row gutter={[20, 20]}>
              {relatedArticles.map((rel, idx) => (
                <Col xs={24} sm={12} md={8} key={rel.id} className={`pub-reveal pub-delay-${idx + 1}`}>
                  <ArticleCard article={rel} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </article>
    </div>
  );
};
