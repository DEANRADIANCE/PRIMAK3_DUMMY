import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Row,
  Col,
  Progress,
  Alert,
  Tooltip,
} from "antd";
import {
  MedicineBoxOutlined,
  UploadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  InfoCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { initialDiseases, initialDiseaseTrends } from "../../../mocks/diseases";
import "../kesehatan.css";

const { Title, Text, Paragraph } = Typography;

export const DiseasePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const topDiseases = [...initialDiseases].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...topDiseases.map((d) => d.count), 1);
  const totalCases = topDiseases.reduce((acc, curr) => acc + curr.count, 0);

  const filteredDiseases = topDiseases.filter((d) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "ispa") return d.name.toLowerCase().includes("ispa") || d.name.toLowerCase().includes("radang");
    if (activeCategory === "ergonomi") return d.name.toLowerCase().includes("muskuloskeletal") || d.name.toLowerCase().includes("pain");
    if (activeCategory === "menular") return d.name.toLowerCase().includes("dbd") || d.name.toLowerCase().includes("diare");
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="health-hero-banner health-banner-disease">
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
                <MedicineBoxOutlined /> SURVEILANS KESEHATAN KERJA
              </Tag>
              <span style={{ fontSize: 13, color: "#ccfbf1" }}>Klinik Pratama ANRI</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Surveilans Morbiditas & Kesehatan Pegawai
            </Title>
            <Paragraph style={{ color: "#ccfbf1", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Pemantauan berkala morbiditas penyakit umum dan Penyakit Akibat Kerja (PAK) pegawai ANRI untuk mendukung mitigasi risiko kesehatan dan lingkungan kerja yang ergonomis.
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
              <div style={{ fontSize: 11, color: "#ccfbf1", fontWeight: 600 }}>TOTAL KASUS MARET 2026</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {totalCases} <span style={{ fontSize: 13, fontWeight: 400 }}>Pegawai</span>
              </div>
              <Tag color="cyan" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Status Terpantau Stabil
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
              style={{ background: "#ecfdf5", color: "#059669" }}
            >
              <MedicineBoxOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Total Morbiditas
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{totalCases} Kasus</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>
                Bulan Maret 2026
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-2">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#fff1f2", color: "#e11d48" }}
            >
              <AlertOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Diagnosis Tertinggi
              </Text>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Flu & ISPA</div>
              <Text style={{ fontSize: 11.5, color: "#e11d48", fontWeight: 600 }}>
                48 Kasus (29.4%)
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-3">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#f0fdf4", color: "#16a34a" }}
            >
              <SafetyCertificateOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Indikasi Ergonomi (PAK)
              </Text>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Low Back Pain</div>
              <Text style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>
                21 Kasus Pegawai
              </Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="health-stat-card health-card-animate health-delay-4">
            <div
              className="health-stat-icon-wrapper"
              style={{ background: "#f0f9ff", color: "#0284c7" }}
            >
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>
                Kesiapan Obat Klinik
              </Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>98.5%</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>
                Stok Medis Memadai
              </Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Filter Bar */}
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginRight: 4 }}>
            Filter Kategori:
          </span>
          {[
            { key: "all", label: "Semua Diagnosis" },
            { key: "ispa", label: "Pernapasan & ISPA" },
            { key: "ergonomi", label: "Ergonomi & Sendi (PAK)" },
            { key: "menular", label: "Infeksi & Pencernaan" },
          ].map((cat) => (
            <Button
              key={cat.key}
              size="middle"
              onClick={() => setActiveCategory(cat.key)}
              className={`health-filter-btn ${activeCategory === cat.key ? "active" : ""}`}
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

        <Tooltip title="Fitur sinkronisasi CSV rekam medis otomatis aktif saat integrasi SIMRS Klinik Pratama ANRI rampung.">
          <Button
            icon={<UploadOutlined />}
            className="btn-health-secondary"
            style={{ borderRadius: 8, height: 38 }}
          >
            Impor Rekam Medis (Klinik SIMRS)
          </Button>
        </Tooltip>
      </div>

      {/* 4. Alert Notifikasi Integrasi */}
      <Alert
        className="health-card-animate health-delay-3"
        message="Informasi Kerahasiaan & Integrasi Rekam Medis"
        description="Data rincian rekam medis pasien individu dijaga kerahasiaannya sesuai standar medis. Statistik di bawah ini merupakan data agregat epidemiologi untuk pencegahan risiko kesehatan kerja di lingkungan ANRI."
        type="info"
        showIcon
        icon={<InfoCircleOutlined style={{ color: "#0d9488" }} />}
        style={{
          borderRadius: 12,
          background: "#f0fdfa",
          border: "1px solid #99f6e4",
        }}
      />

      {/* 5. Grafik Visualisasi Modern */}
      <Row gutter={[20, 20]}>
        {/* Grafik 1: Kasus Penyakit Terbanyak */}
        <Col xs={24} lg={12}>
          <Card
            className="health-content-card health-card-animate health-delay-3"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarChartOutlined style={{ color: "#0d9488", fontSize: 18 }} />
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  Diagnosis Penyakit Terbanyak (Maret 2026)
                </span>
              </div>
            }
            extra={
              <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
                Klinik Pratama ANRI
              </Tag>
            }
            bordered={false}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredDiseases.map((d, index) => {
                const percent = Math.round((d.count / maxCount) * 100);
                const colors = [
                  { from: "#ef4444", to: "#f87171" },
                  { from: "#f59e0b", to: "#fbbf24" },
                  { from: "#0284c7", to: "#38bdf8" },
                  { from: "#0d9488", to: "#2dd4bf" },
                  { from: "#8b5cf6", to: "#a78bfa" },
                  { from: "#64748b", to: "#94a3b8" },
                  { from: "#10b981", to: "#34d399" },
                ];
                const activeColor = colors[index % colors.length];

                return (
                  <div key={d.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: activeColor.from,
                            color: "#fff",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </span>
                        <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                          {d.name}
                        </Text>
                      </div>
                      <Text style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        {d.count} Kasus{" "}
                        <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 400 }}>
                          ({percent}%)
                        </span>
                      </Text>
                    </div>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeColor={{
                        "0%": activeColor.from,
                        "100%": activeColor.to,
                      }}
                      trailColor="#f1f5f9"
                      size={["100%", 10]}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Grafik 2: Tren Fluktuasi Kasus Bulanan */}
        <Col xs={24} lg={12}>
          <Card
            className="health-content-card health-card-animate health-delay-4"
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LineChartOutlined style={{ color: "#0284c7", fontSize: 18 }} />
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  Tren Kasus Triwulan I (Jan - Mar 2026)
                </span>
              </div>
            }
            extra={
              <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>
                Analisis Epidemiologi
              </Tag>
            }
            bordered={false}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12.5 }}>
                Komparasi fluktuasi 4 kelompok diagnosis utama per bulan di lingkungan ANRI:
              </Text>
            </div>

            <div
              style={{
                height: 220,
                display: "flex",
                alignItems: "flex-end",
                gap: 20,
                paddingTop: 10,
                paddingBottom: 8,
                borderBottom: "1px dashed #e2e8f0",
              }}
            >
              {[
                { name: "Flu / ISPA", color: "#ef4444" },
                { name: "Diare", color: "#f59e0b" },
                { name: "DBD", color: "#0284c7" },
                { name: "Radang", color: "#8b5cf6" },
              ].map((item, idx) => {
                const records = initialDiseaseTrends.filter((t) => t.disease === item.name);
                const lastCount = records[records.length - 1]?.count || 0;

                return (
                  <div key={idx} className="health-chart-bar-col" style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: 150,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      {records.map((r, rIdx) => {
                        const heightPct = Math.min(Math.round((r.count / 50) * 100), 100);
                        const opacity = rIdx === 0 ? 0.35 : rIdx === 1 ? 0.68 : 1;
                        return (
                          <div
                            key={rIdx}
                            className="bar-fill"
                            style={{
                              width: 14,
                              height: `${heightPct}%`,
                              backgroundColor: item.color,
                              opacity,
                              borderRadius: "4px 4px 0 0",
                              transition: "all 0.3s ease",
                              boxShadow: rIdx === 2 ? `0 2px 8px ${item.color}55` : "none",
                            }}
                            title={`${r.month}: ${r.count} kasus`}
                          />
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 10, fontWeight: 700, fontSize: 12.5, color: "#1e293b" }}>
                      {item.name}
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, fontWeight: 500 }}>
                      {lastCount} kasus (Mar)
                    </Text>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                marginTop: 14,
                fontSize: 12,
                color: "#64748b",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "#94a3b8", opacity: 0.35 }} />
                <span>Januari</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "#94a3b8", opacity: 0.68 }} />
                <span>Februari</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: "#0d9488" }} />
                <span style={{ fontWeight: 600, color: "#0d9488" }}>Maret (Terkini)</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 6. Edukasi & Rekomendasi Pencegahan Penyakit di Tempat Kerja */}
      <div className="health-card-animate health-delay-5">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          💡 Rekomendasi Pencegahan & Promosi Kesehatan Kerja ANRI
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  <ThunderboltOutlined />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Ergonomi & Pencegahan LBP
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Lakukan peregangan mikro setiap 60 menit duduk di meja arsip. Atur ketinggian kursi agar sudut siku dan lutut berada di 90 derajat.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#f0f9ff",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  <HeartOutlined />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Sirkulasi & Imunitas Ruang AC
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Gunakan masker jika mengalami gejala flu/batuk di ruang kantor tertutup. Penuhi konsumsi air putih minimal 2 liter per hari selama bekerja.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="health-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#fdf2f8",
                    color: "#db2777",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  <UsergroupAddOutlined />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Kunjungan Klinik Pratama
                </div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Klinik Pratama ANRI melayani konsultasi dokter umum dan pemeriksaan tekanan darah setiap hari kerja pukul 08.00 - 15.00 WIB.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
