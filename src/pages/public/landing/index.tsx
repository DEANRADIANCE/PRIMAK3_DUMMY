import React, { useEffect } from "react";
import { Row, Col, Typography, Button, Space, Card, Skeleton } from "antd";
import {
  WarningOutlined,
  MessageOutlined,
  DashboardOutlined,
  ReadOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router";
import { useList, useIsAuthenticated } from "@refinedev/core";
import { Article, Poster } from "../../../types/public";
import { SectionHeader, ArticleCard, PosterCard } from "../../../components/public";
import { useScrollReveal } from "../useScrollReveal";

const { Title, Paragraph, Text } = Typography;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: authData } = useIsAuthenticated();
  const isAuthenticated = Boolean(authData?.authenticated);

  // Set document title untuk SEO dasar
  useEffect(() => {
    document.title = "PRIMA K3 - Portal Keselamatan & Kesehatan Kerja ANRI";
  }, []);

  // Handle auto-scroll ke #tujuan-aplikasi jika ada hash di URL
  useEffect(() => {
    if (location.hash === "#tujuan-aplikasi") {
      const el = document.getElementById("tujuan-aplikasi");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [location.hash]);

  const scrollToTujuan = () => {
    const el = document.getElementById("tujuan-aplikasi");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch 3 artikel edukasi terbaru
  const { result: articlesResult, query: articlesQuery } = useList<Article>({
    resource: "edukasi",
    pagination: {
      pageSize: 3,
      currentPage: 1,
    },
    sorters: [
      {
        field: "published_at",
        order: "desc",
      },
    ],
  });

  // Fetch 4 poster K3
  const { result: postersResult, query: postersQuery } = useList<Poster>({
    resource: "poster",
    pagination: {
      pageSize: 4,
      currentPage: 1,
    },
  });

  const latestArticles: Article[] = (articlesResult?.data as Article[]) || [];
  const latestPosters: Poster[] = (postersResult?.data as Poster[]) || [];
  const articlesLoading = articlesQuery.isLoading;
  const postersLoading = postersQuery.isLoading;

  // Aktifkan animasi scroll untuk seluruh section dan asynchronous content
  useScrollReveal([latestArticles, latestPosters, articlesLoading, postersLoading]);

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* 1. HERO SECTION (Latar Abu, 2 Kolom) */}
      <section
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "60px 20px 80px 20px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Row gutter={[48, 48]} align="middle">
            {/* Kolom Kiri: Teks & Aksi */}
            <Col xs={24} lg={13}>
              <div className="pub-reveal-left" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Badge Kecil */}
                <div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#0f766e",
                      backgroundColor: "#f0fdfa",
                      border: "1px solid #99f6e4",
                      padding: "5px 14px",
                      borderRadius: 999,
                      boxShadow: "0 1px 2px rgba(15, 118, 110, 0.08)",
                    }}
                  >
                    <SafetyCertificateOutlined style={{ fontSize: 14 }} />
                    Aplikasi Keselamatan & Kesehatan Kerja
                  </span>
                </div>

                {/* Judul Utama */}
                <Title
                  level={1}
                  style={{
                    fontSize: "clamp(28px, 4.2vw, 46px)",
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Bekerja aman, sehat, dan terlindungi di ANRI
                </Title>

                {/* Deskripsi */}
                <Paragraph
                  style={{
                    fontSize: "clamp(15px, 1.8vw, 17px)",
                    color: "#475569",
                    lineHeight: 1.7,
                    maxWidth: 580,
                    margin: "4px 0 12px 0",
                  }}
                >
                  PRIMA K3 membantu pegawai melaporkan insiden, mengajukan konseling psikologi, dan mengikuti informasi K3 terbaru dalam satu aplikasi.
                </Paragraph>

                {/* Tombol Aksi */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, paddingTop: 4 }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={isAuthenticated ? <DashboardOutlined /> : <LoginOutlined />}
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
                    style={{
                      backgroundColor: "#0f766e",
                      borderColor: "#0f766e",
                      borderRadius: 8,
                      fontWeight: 600,
                      height: 48,
                      paddingInline: 24,
                      fontSize: 15,
                      boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
                    }}
                  >
                    {isAuthenticated ? "Buka Dashboard" : "Masuk ke Aplikasi"}
                  </Button>

                  <Button
                    size="large"
                    onClick={scrollToTujuan}
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      height: 48,
                      paddingInline: 22,
                      fontSize: 15,
                      color: "#334155",
                      borderColor: "#cbd5e1",
                    }}
                  >
                    Pelajari Tujuan Aplikasi
                  </Button>
                </div>

                {/* Info Tambahan */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 14 }} /> Terintegrasi RBAC
                  </span>
                  <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 14 }} /> Respon Cepat Insiden
                  </span>
                  <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircleFilled style={{ color: "#10b981", fontSize: 14 }} /> Konseling Rahasia
                  </span>
                </div>
              </div>
            </Col>

            {/* Kolom Kanan: Placeholder Ilustrasi Pegawai ANRI Bekerja dengan Aman (Rasio Tetap) */}
            <Col xs={24} lg={11}>
              <div
                className="pub-reveal-right"
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "65%", // 16:10 rasio tetap
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.12)",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#e2e8f0",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                  alt="Pegawai ANRI bekerja dengan aman dan sehat"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  loading="lazy"
                />
                {/* Floating Glassmorphic Badge */}
                <div
                  className="pub-float"
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(255,255,255,0.7)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "#f0fdfa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0f766e",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    <SafetyCertificateOutlined />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                      K3 Arsip Nasional RI
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Budaya K3 terdepan untuk perlindungan arsip negara & pegawai
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. TUJUAN APLIKASI (id="tujuan-aplikasi", Latar Putih) */}
      <section
        id="tujuan-aplikasi"
        style={{
          backgroundColor: "#ffffff",
          padding: "80px 20px",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Eyebrow, Judul, Subjudul */}
          <div className="pub-reveal" style={{ maxWidth: 760, marginBottom: 48 }}>
            <div style={{ marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: "#0f766e",
                  background: "#f0fdfa",
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: "1px solid #ccfbf1",
                }}
              >
                TUJUAN APLIKASI
              </span>
            </div>
            <Title
              level={2}
              style={{
                fontSize: "clamp(24px, 3.4vw, 34px)",
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.3,
                marginBottom: 12,
              }}
            >
              Satu aplikasi untuk menjaga keselamatan dan kesehatan pegawai
            </Title>
            <Paragraph
              style={{
                fontSize: 16,
                color: "#64748b",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              PRIMA K3 dibangun agar urusan K3 lebih mudah dijangkau pegawai dan lebih tertib dikelola oleh pimpinan dan pengelola K3.
            </Paragraph>
          </div>

          {/* 4 Kartu Fitur (Row/Col: 4 kolom di desktop, 2 tablet, 1 mobile) */}
          <Row gutter={[24, 24]}>
            {/* Kartu a: Pelaporan kecelakaan kerja */}
            <Col xs={24} sm={12} lg={6} className="pub-reveal pub-delay-1">
              <Card
                hoverable
                className="pub-hover-card"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
                bodyStyle={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div
                  className="pub-icon-wrapper"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    backgroundColor: "#fef2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <WarningOutlined style={{ fontSize: 26, color: "#ef4444" }} />
                </div>
                <Title level={4} style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                  Pelaporan kecelakaan kerja
                </Title>
                <Paragraph style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  Pegawai dapat melaporkan insiden dengan formulir terpandu, dan tim K3 menelusurinya sampai tindakan perbaikan selesai.
                </Paragraph>
              </Card>
            </Col>

            {/* Kartu b: Konseling psikologi */}
            <Col xs={24} sm={12} lg={6} className="pub-reveal pub-delay-2">
              <Card
                hoverable
                className="pub-hover-card"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
                bodyStyle={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div
                  className="pub-icon-wrapper"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    backgroundColor: "#f5f3ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <MessageOutlined style={{ fontSize: 26, color: "#7c3aed" }} />
                </div>
                <Title level={4} style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                  Konseling psikologi
                </Title>
                <Paragraph style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  Pendaftaran layanan konseling, wajib maupun sukarela, dengan jadwal yang jelas dan sisi yang dirahasiakan.
                </Paragraph>
              </Card>
            </Col>

            {/* Kartu c: Dashboard kesehatan pegawai */}
            <Col xs={24} sm={12} lg={6} className="pub-reveal pub-delay-3">
              <Card
                hoverable
                className="pub-hover-card"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
                bodyStyle={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div
                  className="pub-icon-wrapper"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    backgroundColor: "#f0fdfa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <DashboardOutlined style={{ fontSize: 26, color: "#0f766e" }} />
                </div>
                <Title level={4} style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                  Dashboard kesehatan pegawai
                </Title>
                <Paragraph style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  Ringkasan kondisi kesehatan kerja, termasuk persentase fit to work, diperbarui setiap periode bulan kalender.
                </Paragraph>
              </Card>
            </Col>

            {/* Kartu d: Edukasi dan informasi K3 */}
            <Col xs={24} sm={12} lg={6} className="pub-reveal pub-delay-4">
              <Card
                hoverable
                className="pub-hover-card"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
                bodyStyle={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}
              >
                <div
                  className="pub-icon-wrapper"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    backgroundColor: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <ReadOutlined style={{ fontSize: 26, color: "#2563eb" }} />
                </div>
                <Title level={4} style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                  Edukasi dan informasi K3
                </Title>
                <Paragraph style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6, margin: 0, flex: 1 }}>
                  Berita, poster, dan panduan singkat agar setiap pegawai tahu cara bekerja aman dan apa yang harus dilakukan saat darurat.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 3. EDUKASI K3 TERBARU (Latar Abu) */}
      <section
        style={{
          backgroundColor: "#f8fafc",
          padding: "80px 20px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Eyebrow, Judul, Link Kanan */}
          <SectionHeader
            eyebrow="EDUKASI K3"
            title="Edukasi K3 Terbaru"
            subtitle="Tingkatkan wawasan keselamatan kerja sehari-hari melalui artikel dan tips praktis dari tim K3 ANRI."
            action={
              <Link
                to="/berita"
                style={{
                  color: "#0f766e",
                  fontWeight: 600,
                  fontSize: 15,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                }}
              >
                Lihat semua berita <ArrowRightOutlined style={{ fontSize: 13 }} />
              </Link>
            }
          />

          {/* 3 Kartu Artikel */}
          <Row gutter={[24, 24]}>
            {articlesLoading ? (
              [1, 2, 3].map((n, idx) => (
                <Col xs={24} md={12} lg={8} key={n} className={`pub-reveal pub-delay-${idx + 1}`}>
                  <Card style={{ borderRadius: 12, height: 360 }}>
                    <Skeleton active />
                  </Card>
                </Col>
              ))
            ) : (
              latestArticles.map((article, idx) => (
                <Col xs={24} md={12} lg={8} key={article.id} className={`pub-reveal pub-delay-${idx + 1}`}>
                  <ArticleCard article={article} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </section>

      {/* 4. POSTER K3 (Latar Putih) */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "80px 20px",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Eyebrow, Judul, Link Kanan */}
          <SectionHeader
            eyebrow="POSTER"
            title="POSTER K3"
            subtitle="Unduh dan pasang poster keselamatan kerja di unit Anda untuk menjaga kesadaran bersama."
            action={
              <Link
                to="/poster"
                style={{
                  color: "#0f766e",
                  fontWeight: 600,
                  fontSize: 15,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                }}
              >
                Lihat semua poster <ArrowRightOutlined style={{ fontSize: 13 }} />
              </Link>
            }
          />

          {/* 4 Kartu Poster */}
          <Row gutter={[24, 24]}>
            {postersLoading ? (
              [1, 2, 3, 4].map((n, idx) => (
                <Col xs={24} sm={12} lg={6} key={n} className={`pub-reveal pub-delay-${idx + 1}`}>
                  <Card style={{ borderRadius: 12, height: 380 }}>
                    <Skeleton active />
                  </Card>
                </Col>
              ))
            ) : (
              latestPosters.map((poster, idx) => (
                <Col xs={24} sm={12} lg={6} key={poster.id} className={`pub-reveal pub-delay-${idx + 1}`}>
                  <PosterCard poster={poster} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </section>
    </div>
  );
};
