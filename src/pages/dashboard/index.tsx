import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Select,
  Progress,
  Space,
  Tag,
  Divider,
  Button,
  Tabs,
  Badge,
} from "antd";
import {
  FileProtectOutlined,
  TeamOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  NotificationOutlined,
  FallOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCustom, useGetIdentity } from "@refinedev/core";
import { IDashboardSummary } from "../../types/dashboard";
import { IUser } from "../../types/user";
import { initialDashboardSummary } from "../../mocks/dashboard";
import { DashboardNewsTab } from "./DashboardNewsTab";
import "./dashboard.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface IPointData {
  x: number;
  y: number;
  month: string;
  count: number;
}

interface IDonutSegment {
  type: string;
  count: number;
  startAngle: number;
  angle: number;
  color: string;
  percent: number;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [activeTabKey, setActiveTabKey] = useState<string>("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; month: string; count: number } | null>(null);

  // Scroll & Entrance Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const elements = document.querySelectorAll(".dash-scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [activeTabKey]);

  // Ambil data dashboard via refine useCustom hook
  const { result } = useCustom<IDashboardSummary>({
    url: "/dashboard/summary",
    method: "get",
  });

  // Pastikan data SELALU aman dengan default initialDashboardSummary
  const customData =
    result?.data && typeof result.data === "object" && Object.keys(result.data).length > 0
      ? (result.data as IDashboardSummary)
      : null;

  const baseSummary: IDashboardSummary = customData || initialDashboardSummary;

  // Responsif terhadap filter bulan demo
  const isPreviousMonth = selectedMonth !== "03";
  const summary: IDashboardSummary = {
    ...initialDashboardSummary,
    ...baseSummary,
    totalAccidents: isPreviousMonth ? 1 : (baseSummary.totalAccidents ?? 2),
    totalHazardReports: isPreviousMonth ? 10 : (baseSummary.totalHazardReports ?? 14),
  };

  // Safe data extraction dengan fallback array lengkap
  const visitsData =
    summary.monthlyVisits && summary.monthlyVisits.length > 0
      ? summary.monthlyVisits
      : initialDashboardSummary.monthlyVisits;

  const diseaseTrends =
    summary.diseaseTrends && summary.diseaseTrends.length > 0
      ? summary.diseaseTrends
      : initialDashboardSummary.diseaseTrends;

  const accidentTypes =
    summary.accidentTypes && summary.accidentTypes.length > 0
      ? summary.accidentTypes
      : initialDashboardSummary.accidentTypes;

  const monthlyAccidents =
    summary.monthlyAccidents && summary.monthlyAccidents.length > 0
      ? summary.monthlyAccidents
      : initialDashboardSummary.monthlyAccidents;

  const healthStats =
    summary.healthStats && summary.healthStats.length > 0
      ? summary.healthStats
      : initialDashboardSummary.healthStats;

  const employeeStats = summary.employeeStats || initialDashboardSummary.employeeStats;

  const psychologistVisits =
    summary.psychologistVisits && summary.psychologistVisits.length > 0
      ? summary.psychologistVisits
      : initialDashboardSummary.psychologistVisits;

  const healthCheckup =
    summary.healthCheckup && summary.healthCheckup.length > 0
      ? summary.healthCheckup
      : initialDashboardSummary.healthCheckup;

  const latestAnnouncements =
    summary.latestAnnouncements && summary.latestAnnouncements.length > 0
      ? summary.latestAnnouncements
      : initialDashboardSummary.latestAnnouncements;

  const maxVisitCount = Math.max(...visitsData.map((v: { count: number }) => v.count), 80);
  const totalAccidentsCount =
    accidentTypes.reduce((acc: number, curr: { count: number }) => acc + (curr.count || 0), 0) || 1;

  // Modern vibrant & elegant Donut Chart Color Palette
  const accidentColors = ["#f43f5e", "#f59e0b", "#0ea5e9", "#8b5cf6"];

  // Helper koordinat SVG untuk grafik garis mulus (Smooth Spline)
  const svgWidth = 560;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points: IPointData[] = visitsData.map((d: { month: string; count: number }, i: number) => {
    const x = paddingX + (i / (visitsData.length - 1 || 1)) * chartW;
    const y = svgHeight - paddingY - (d.count / maxVisitCount) * chartH;
    return { x, y, month: d.month, count: d.count };
  });

  // Membuat SVG path bezier kurva halus
  const makeSmoothPath = (pts: IPointData[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = makeSmoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
      : "";

  // Helper Donut Chart SVG Segments
  let cumulativeAngle = 0;
  const donutSegments: IDonutSegment[] = accidentTypes.map((item: { type: string; count: number }, idx: number) => {
    const count = item.count || 0;
    const angle = (count / totalAccidentsCount) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      type: item.type,
      count,
      startAngle,
      angle,
      color: accidentColors[idx % accidentColors.length],
      percent: Math.round((count / totalAccidentsCount) * 100),
    };
  });

  // Warna gradien dinamis untuk bar penyakit terbanyak
  const diseaseBarColors = [
    { start: "#0284c7", end: "#38bdf8" }, // ISPA - Blue
    { start: "#059669", end: "#34d399" }, // Hipertensi - Emerald
    { start: "#d97706", end: "#fcd34d" }, // Myalgia - Amber
    { start: "#e11d48", end: "#fb7185" }, // Gastritis - Rose
    { start: "#7c3aed", end: "#a78bfa" }, // Cephalgia - Violet
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ======================================================== */}
      {/* HERO WELCOME GREETING BANNER                             */}
      {/* ======================================================== */}
      <div className="dashboard-hero-banner dash-animate-hero">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                color="success"
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
                <CheckCircleOutlined /> KONDUSIF & SIAGA 24/7
              </Tag>
              <span style={{ fontSize: 13, color: "#d1fae5" }}>
                Klinik Pratama & Unit K3 ANRI
              </span>
            </div>

            <Title
              level={3}
              style={{
                color: "#ffffff",
                margin: "0 0 6px 0",
                fontWeight: 800,
                letterSpacing: "-0.3px",
              }}
            >
              Selamat Datang Kembali, {currentUser?.name || "Pegawai ANRI"} 👋
            </Title>
            <Paragraph
              style={{
                color: "#ecfdf5",
                fontSize: 13.5,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 640,
                opacity: 0.92,
              }}
            >
              Portal PRIMA K3 V2.0 aktif memantau keselamatan kerja, mitigasi risiko bahaya, serta pelayanan kesehatan preventif dan kuratif secara terpadu.
            </Paragraph>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <div
              className="dash-float-badge"
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-end",
                background: "rgba(255, 255, 255, 0.12)",
                padding: "14px 20px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div style={{ fontSize: 11, color: "#a7f3d0", fontWeight: 600, textTransform: "uppercase" }}>
                Target Keselamatan Kerja
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2, marginTop: 2 }}>
                428 <span style={{ fontSize: 13, fontWeight: 500 }}>Hari Kerja</span>
              </div>
              <div style={{ fontSize: 11, color: "#ffffff", opacity: 0.85, marginTop: 4 }}>
                🏆 Zero Accident Streak Terjaga
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ======================================================== */}
      {/* TAB NAVIGATION: DASHBOARD & BERITA TERKINI               */}
      {/* ======================================================== */}
      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => setActiveTabKey(key)}
        className="dashboard-tabs dash-animate-tabs"
        type="card"
        items={[
          {
            key: "dashboard",
            label: (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <DashboardOutlined /> Dashboard Manajemen K3
              </span>
            ),
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 8 }}>
                {/* 1. Header Filter Bar */}
                <div
                  className="dash-card-animate dash-delay-1"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 16,
                    background: "#ffffff",
                    padding: "14px 20px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                      Indikator & Parameter Kinerja K3
                    </span>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Pemantauan tren morbiditas dan statistik insiden kerja
                    </div>
                  </div>

                  <Space wrap>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarOutlined style={{ color: "#0d9488" }} />
                      <Text style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Periode:</Text>
                      <Select
                        value={selectedMonth}
                        onChange={(v) => setSelectedMonth(v)}
                        style={{ width: 130 }}
                      >
                        <Option value="01">Januari</Option>
                        <Option value="02">Februari</Option>
                        <Option value="03">Maret</Option>
                        <Option value="04">April</Option>
                        <Option value="05">Mei</Option>
                        <Option value="06">Juni</Option>
                      </Select>
                      <Select
                        value={selectedYear}
                        onChange={(v) => setSelectedYear(v)}
                        style={{ width: 95 }}
                      >
                        <Option value="2025">2025</Option>
                        <Option value="2026">2026</Option>
                      </Select>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedMonth("03");
                        setSelectedYear("2026");
                      }}
                      style={{ borderRadius: 8 }}
                    >
                      Reset
                    </Button>
                  </Space>
                </div>

                {/* 2. Baris 4 Kartu Ringkasan (StatCard Lebih Berwarna & Elegan) */}
                <Row gutter={[16, 16]}>
                  {/* Kartu 1: Laporan Kecelakaan Kerja */}
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      bordered={false}
                      className="prima-stat-card card-accident dash-card-animate dash-delay-2"
                      style={{ height: "100%" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                            Laporan Kecelakaan Kerja
                          </Text>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Bulan Ini</div>
                          <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                            <span style={{ fontSize: 34, fontWeight: 800, color: "#e11d48", lineHeight: 1 }}>
                              {summary.totalAccidents}
                            </span>
                            <Text style={{ fontSize: 13, color: "#64748b" }}>kasus</Text>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(244, 63, 94, 0.2)",
                          }}
                        >
                          <FileProtectOutlined style={{ fontSize: 24, color: "#e11d48" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <Tag color="error" style={{ margin: 0, fontSize: 11, fontWeight: 600, borderRadius: 6 }}>
                          <FallOutlined /> -33% vs bulan lalu
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          1 Kasus ASN, 1 PPPK
                        </Text>
                      </div>
                    </Card>
                  </Col>

                  {/* Kartu 2: Jumlah Pegawai */}
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      bordered={false}
                      className="prima-stat-card card-clinic dash-card-animate dash-delay-3"
                      style={{ height: "100%" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                            Total Pegawai ANRI
                          </Text>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Terdaftar di Klinik Pratama</div>
                          <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                            <span style={{ fontSize: 34, fontWeight: 800, color: "#0284c7", lineHeight: 1 }}>
                              {summary.totalEmployees}
                            </span>
                            <Text style={{ fontSize: 13, color: "#64748b" }}>orang</Text>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(2, 132, 199, 0.2)",
                          }}
                        >
                          <TeamOutlined style={{ fontSize: 24, color: "#0284c7" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <Tag color="cyan" style={{ margin: 0, fontSize: 11, borderRadius: 6, fontWeight: 600 }}>
                          462 ASN
                        </Tag>
                        <Tag color="blue" style={{ margin: 0, fontSize: 11, borderRadius: 6, fontWeight: 600 }}>
                          23 PPPK
                        </Tag>
                        <Text style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>
                          100% Aktif
                        </Text>
                      </div>
                    </Card>
                  </Col>

                  {/* Kartu 3: Jumlah Laporan Potensi Bahaya */}
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      bordered={false}
                      className="prima-stat-card card-hazard dash-card-animate dash-delay-4"
                      style={{ height: "100%" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                            Laporan Potensi Bahaya
                          </Text>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Near Miss & Unsafe Act</div>
                          <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                            <span style={{ fontSize: 34, fontWeight: 800, color: "#d97706", lineHeight: 1 }}>
                              {summary.totalHazardReports}
                            </span>
                            <Text style={{ fontSize: 13, color: "#64748b" }}>laporan</Text>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
                          }}
                        >
                          <WarningOutlined style={{ fontSize: 24, color: "#d97706" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
                        <Tag color="warning" style={{ margin: 0, fontSize: 11, fontWeight: 600, borderRadius: 6 }}>
                          10 Tuntas Diperbaiki
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          4 proses perbaikan
                        </Text>
                      </div>
                    </Card>
                  </Col>

                  {/* Kartu 4: Skor Kepatuhan K3 */}
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      bordered={false}
                      className="prima-stat-card card-compliance dash-card-animate dash-delay-5"
                      style={{ height: "100%" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
                            Skor Kepatuhan K3 (SMK3)
                          </Text>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Indeks Audit Terpadu</div>
                          <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 4 }}>
                            <span style={{ fontSize: 34, fontWeight: 800, color: "#059669", lineHeight: 1 }}>
                              {summary.complianceScore}
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>%</span>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                          }}
                        >
                          <SafetyCertificateOutlined style={{ fontSize: 24, color: "#059669" }} />
                        </div>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Progress
                          percent={summary.complianceScore}
                          showInfo={false}
                          strokeColor={{ "0%": "#10b981", "100%": "#0284c7" }}
                          size={["100%", 8]}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          <Text style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>
                            Tingkat Lanjutan (Emas)
                          </Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Standar: &ge; 85%
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* 3. Baris Grafik Garis Kunjungan / Laporan per Bulan & Bar Horizontal Tren Penyakit */}
                <Row gutter={[16, 16]} className="dash-scroll-reveal">
                  {/* Grafik Garis Kunjungan / Laporan per Bulan Berwarna */}
                  <Col xs={24} lg={15}>
                    <Card
                      title={
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                            Tren Kunjungan & Laporan per Bulan
                          </span>
                          <div style={{ fontSize: 12, color: "#64748b", fontWeight: "normal" }}>
                            Monitoring morbiditas pasien klinik & laporan potensi bahaya 6 bulan terakhir
                          </div>
                        </div>
                      }
                      extra={
                        <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>
                          Rata-rata: 54 kunjungan/bln
                        </Tag>
                      }
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      {/* Visualisasi Grafik Garis SVG Spline Mulus Berwarna */}
                      <div style={{ position: "relative", width: "100%", height: 210 }}>
                        <svg
                          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                          style={{ width: "100%", height: "100%", overflow: "visible" }}
                        >
                          <defs>
                            {/* Gradien Area Berwarna Modern */}
                            <linearGradient id="areaGradientVibrant" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.38" />
                              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.12" />
                              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="lineGradVibrant" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#0d9488" />
                              <stop offset="50%" stopColor="#0284c7" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>

                          {/* Garis Grid Horizontal Tipis */}
                          {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                            const y = svgHeight - paddingY - ratio * chartH;
                            const labelVal = Math.round(ratio * maxVisitCount);
                            return (
                              <g key={idx}>
                                <line
                                  x1={paddingX}
                                  y1={y}
                                  x2={svgWidth - paddingX}
                                  y2={y}
                                  stroke="#f1f5f9"
                                  strokeDasharray="4 4"
                                />
                                <text
                                  x={paddingX - 10}
                                  y={y + 4}
                                  fontSize="10"
                                  fill="#94a3b8"
                                  textAnchor="end"
                                >
                                  {labelVal}
                                </text>
                              </g>
                            );
                          })}

                          {/* Area Fill */}
                          <path d={areaPath} fill="url(#areaGradientVibrant)" />

                          {/* Stroke Garis Utama */}
                          <path
                            d={linePath}
                            fill="none"
                            stroke="url(#lineGradVibrant)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />

                          {/* Titik-titik Data (Dots) Interaktif */}
                          {points.map((pt: IPointData, idx: number) => {
                            const isHovered = hoveredPoint?.index === idx;
                            const isLast = idx === points.length - 1;
                            return (
                              <g key={idx}>
                                {/* Lingkaran Titik */}
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isHovered ? 8 : 5}
                                  fill={isLast ? "#0d9488" : "#ffffff"}
                                  stroke="#0284c7"
                                  strokeWidth="3"
                                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                                  onMouseEnter={() =>
                                    setHoveredPoint({ index: idx, month: pt.month, count: pt.count })
                                  }
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />

                                {/* Angka Nilai di atas Titik */}
                                <text
                                  x={pt.x}
                                  y={pt.y - 12}
                                  fontSize="11"
                                  fontWeight="700"
                                  fill={isLast ? "#0d9488" : "#475569"}
                                  textAnchor="middle"
                                >
                                  {pt.count}
                                </text>

                                {/* Label Sumbu Bulan di Bawah */}
                                <text
                                  x={pt.x}
                                  y={svgHeight - 8}
                                  fontSize="11"
                                  fontWeight="500"
                                  fill="#64748b"
                                  textAnchor="middle"
                                >
                                  {pt.month}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>
                    </Card>
                  </Col>

                  {/* Bar Horizontal Tren Penyakit Berwarna */}
                  <Col xs={24} lg={9}>
                    <Card
                      title={
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                            Tren Penyakit Terbanyak
                          </span>
                          <div style={{ fontSize: 12, color: "#64748b", fontWeight: "normal" }}>
                            Distribusi morbiditas (Bulan {selectedMonth === "03" ? "Maret" : "Februari"} 2026)
                          </div>
                        </div>
                      }
                      extra={
                        <Button
                          type="link"
                          size="small"
                          onClick={() => navigate("/kesehatan/penyakit")}
                          style={{ fontWeight: 600, color: "#0d9488" }}
                        >
                          Detail &rarr;
                        </Button>
                      }
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {diseaseTrends.map((d: { disease: string; count: number }, index: number) => {
                          const percent = Math.round((d.count / 55) * 100);
                          const color = diseaseBarColors[index % diseaseBarColors.length];
                          return (
                            <div key={index}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: 4,
                                }}
                              >
                                <Space size="small">
                                  <span
                                    style={{
                                      width: 20,
                                      height: 20,
                                      borderRadius: "50%",
                                      backgroundColor: `${color.start}20`,
                                      color: color.start,
                                      fontSize: 11,
                                      fontWeight: 800,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {index + 1}
                                  </span>
                                  <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                                    {d.disease}
                                  </Text>
                                </Space>
                                <Space size="small">
                                  <Text strong style={{ fontSize: 13, color: color.start }}>
                                    {d.count}
                                  </Text>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    kasus
                                  </Text>
                                </Space>
                              </div>
                              <Progress
                                percent={percent}
                                showInfo={false}
                                strokeColor={{ "0%": color.start, "100%": color.end }}
                                size={["100%", 8]}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <Divider style={{ margin: "14px 0 10px" }} />
                      <Text type="secondary" style={{ fontSize: 11, display: "block", color: "#94a3b8" }}>
                        * Data diagnosa resmi dari poli umum Klinik Pratama ANRI.
                      </Text>
                    </Card>
                  </Col>
                </Row>

                {/* 4. Baris Donut Jenis Kecelakaan + Bar Statistik Kecelakaan Kerja per Bulan */}
                <Row gutter={[16, 16]} className="dash-scroll-reveal">
                  {/* Donut Jenis Kecelakaan Berwarna */}
                  <Col xs={24} lg={10}>
                    <Card
                      title={
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                            Klasifikasi Jenis Insiden
                          </span>
                          <div style={{ fontSize: 12, color: "#64748b", fontWeight: "normal" }}>
                            Faktor pemicu kejadian kecelakaan kerja
                          </div>
                        </div>
                      }
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <Row gutter={16} align="middle">
                        {/* SVG Donut Visual */}
                        <Col xs={24} sm={11} style={{ textAlign: "center" }}>
                          <div style={{ position: "relative", display: "inline-block", width: 145, height: 145 }}>
                            <svg
                              viewBox="0 0 100 100"
                              style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}
                            >
                              {donutSegments.map((seg: IDonutSegment, idx: number) => {
                                const strokeDash = `${(seg.angle / 360) * 251.2} 251.2`;
                                const strokeOffset = -((seg.startAngle / 360) * 251.2);
                                return (
                                  <circle
                                    key={idx}
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth="15"
                                    strokeDasharray={strokeDash}
                                    strokeDashoffset={strokeOffset}
                                  />
                                );
                              })}
                            </svg>
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                                {totalAccidentsCount}
                              </div>
                              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, fontWeight: 600 }}>
                                Total Insiden
                              </div>
                            </div>
                          </div>
                        </Col>

                        {/* Legenda Detail */}
                        <Col xs={24} sm={13}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {donutSegments.map((seg: IDonutSegment, idx: number) => (
                              <div
                                key={idx}
                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              >
                                <Space size="small">
                                  <div
                                    style={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: 4,
                                      backgroundColor: seg.color,
                                    }}
                                  />
                                  <Text style={{ fontSize: 12, color: "#334155" }}>{seg.type}</Text>
                                </Space>
                                <Text strong style={{ fontSize: 12, color: seg.color }}>
                                  {seg.count} ({seg.percent}%)
                                </Text>
                              </div>
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>

                  {/* Bar Statistik Kecelakaan Kerja per Bulan Berwarna */}
                  <Col xs={24} lg={14}>
                    <Card
                      title={
                        <div>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                            Statistik Kejadian Insiden per Bulan
                          </span>
                          <div style={{ fontSize: 12, color: "#64748b", fontWeight: "normal" }}>
                            Jumlah rekam kejadian kecelakaan kerja bulanan
                          </div>
                        </div>
                      }
                      extra={
                        <Tag color="success" style={{ borderRadius: 6, fontWeight: 600 }}>
                          Target: Zero Accident
                        </Tag>
                      }
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div
                        style={{
                          height: 160,
                          display: "flex",
                          alignItems: "flex-end",
                          gap: 16,
                          paddingTop: 10,
                          paddingBottom: 6,
                        }}
                      >
                        {monthlyAccidents.map((item: { month: string; count: number }, idx: number) => {
                          const heightPercent = Math.max(((item.count || 0) / 3) * 100, 10);
                          const isCurrent = idx === monthlyAccidents.length - 1;
                          return (
                            <div
                              key={idx}
                              style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Text
                                strong
                                style={{
                                  fontSize: 12,
                                  marginBottom: 6,
                                  color: item.count > 0 ? (isCurrent ? "#f43f5e" : "#0284c7") : "#94a3b8",
                                }}
                              >
                                {item.count}
                              </Text>
                              <div
                                style={{
                                  width: "100%",
                                  maxWidth: 40,
                                  height: `${heightPercent}%`,
                                  background: isCurrent
                                    ? "linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)"
                                    : item.count > 1
                                    ? "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)"
                                    : "#e2e8f0",
                                  borderRadius: "8px 8px 0 0",
                                  transition: "height 0.3s ease",
                                  boxShadow: isCurrent ? "0 4px 10px rgba(244, 63, 94, 0.3)" : "none",
                                }}
                              />
                              <Text type="secondary" style={{ fontSize: 11, marginTop: 8, fontWeight: 500 }}>
                                {item.month}
                              </Text>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* 5. Baris 4 Metrik: Statistik Kesehatan, Gauge Pegawai, Kunjungan Psikolog, MCU */}
                <Row gutter={[16, 16]} className="dash-scroll-reveal">
                  {/* Progress Bar Statistik Kesehatan */}
                  <Col xs={24} md={12} lg={6}>
                    <Card
                      title={<span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Status Morbiditas</span>}
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {healthStats.map((hs: { label: string; value: number; total: number }, i: number) => {
                          const pct = Math.round(((hs.value || 0) / (hs.total || 485)) * 100);
                          return (
                            <div key={i}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text strong style={{ fontSize: 12, color: "#334155" }}>
                                  {hs.label}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#64748b" }}>
                                  {hs.value} pegawai ({pct}%)
                                </Text>
                              </div>
                              <Progress
                                percent={pct}
                                showInfo={false}
                                strokeColor={i === 0 ? "#10b981" : i === 1 ? "#0ea5e9" : "#f59e0b"}
                                size={["100%", 7]}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <Divider style={{ margin: "14px 0 10px" }} />
                      <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                        Surveillance rutin Klinik Pratama ANRI
                      </Text>
                    </Card>
                  </Col>

                  {/* Ringkasan Demografi Pegawai */}
                  <Col xs={24} md={12} lg={6}>
                    <Card
                      title={<span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Demografi & Kebugaran</span>}
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#475569" }}>Pegawai Terdaftar Klinik</span>
                          <span style={{ fontWeight: 700, color: "#0284c7" }}>{employeeStats.registered} orang</span>
                        </div>
                        <Progress percent={Math.round((employeeStats.registered / (employeeStats.total || 1)) * 100)} strokeColor="#0284c7" size={["100%", 6]} showInfo={false} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#475569" }}>Total Seluruh Pegawai</span>
                          <span style={{ fontWeight: 700, color: "#10b981" }}>{employeeStats.total} orang</span>
                        </div>
                        <Progress percent={100} strokeColor="#10b981" size={["100%", 6]} showInfo={false} />
                      </div>
                      <Divider style={{ margin: "14px 0 10px" }} />
                      <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                        Status kebugaran kerja terverifikasi
                      </Text>
                    </Card>
                  </Col>

                  {/* Kunjungan Psikolog */}
                  <Col xs={24} md={12} lg={6}>
                    <Card
                      title={<span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Kesehatan Mental Kerja</span>}
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {psychologistVisits.map((item: { month: string; count: number }, i: number) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#475569" }}>Bulan {item.month}</span>
                            <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600 }}>
                              {item.count} sesi
                            </Tag>
                          </div>
                        ))}
                      </div>
                      <Divider style={{ margin: "14px 0 10px" }} />
                      <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                        Konseling psikologis terjamin rahasia
                      </Text>
                    </Card>
                  </Col>

                  {/* Statistik Pemeriksaan MCU */}
                  <Col xs={24} md={12} lg={6}>
                    <Card
                      title={<span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Realisasi MCU Berkala</span>}
                      bordered={false}
                      style={{ borderRadius: 14, border: "1px solid #e2e8f0", height: "100%" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {healthCheckup.map((mcu: { gender: string; completed: number; total: number }, i: number) => {
                          const pct = Math.round(((mcu.completed || 0) / (mcu.total || 1)) * 100);
                          return (
                            <div key={i}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text strong style={{ fontSize: 12, color: "#334155" }}>
                                  {mcu.gender}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#0d9488", fontWeight: 600 }}>
                                  {mcu.completed}/{mcu.total} ({pct}%)
                                </Text>
                              </div>
                              <Progress
                                percent={pct}
                                showInfo={false}
                                strokeColor={i === 0 ? "#0d9488" : "#0284c7"}
                                size={["100%", 7]}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <Divider style={{ margin: "14px 0 10px" }} />
                      <Text type="secondary" style={{ fontSize: 11, color: "#94a3b8" }}>
                        Pemeriksaan MCU Berkala Tahun 2026
                      </Text>
                    </Card>
                  </Col>
                </Row>

                {/* 6. Quick Preview Widget Berita Terkini dengan tombol pindah tab */}
                <div className="dash-card-animate" style={{ animationDelay: "0.2s" }}>
                  <Card
                    title={
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <NotificationOutlined style={{ fontSize: 18, color: "#0d9488" }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                          Warta & Pengumuman K3 Terbaru
                        </span>
                      </div>
                    }
                    extra={
                      <Button
                        type="link"
                        onClick={() => setActiveTabKey("news")}
                        style={{ fontWeight: 700, color: "#0d9488", padding: 0 }}
                      >
                        Buka Tab Berita Lengkap &rarr;
                      </Button>
                    }
                    bordered={false}
                    style={{ borderRadius: 14, border: "1px solid #e2e8f0" }}
                  >
                    <Row gutter={[16, 16]}>
                      {latestAnnouncements.slice(0, 3).map((ann: { id: number; title: string; date: string; image?: string; description: string }) => (
                        <Col xs={24} md={8} key={ann.id}>
                          <Card
                            hoverable
                            size="small"
                            onClick={() => setActiveTabKey("news")}
                            style={{
                              borderRadius: 10,
                              border: "1px solid #f1f5f9",
                              height: "100%",
                            }}
                            cover={
                              <img
                                alt={ann.title}
                                src={ann.image}
                                style={{ height: 130, objectFit: "cover" }}
                              />
                            }
                          >
                            <Tag color="cyan" style={{ fontSize: 10, marginBottom: 4 }}>
                              <CalendarOutlined /> {ann.date}
                            </Tag>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: "#0f172a",
                                lineHeight: 1.35,
                                marginBottom: 6,
                                height: 36,
                                overflow: "hidden",
                              }}
                            >
                              {ann.title}
                            </div>
                            <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12, margin: 0 }}>
                              {ann.description}
                            </Paragraph>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </div>
              </div>
            ),
          },
          {
            key: "news",
            label: (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <NotificationOutlined /> Berita & Informasi Terkini
                <Badge count="6" style={{ backgroundColor: "#0d9488" }} />
              </span>
            ),
            children: <DashboardNewsTab />,
          },
        ]}
      />
    </div>
  );
};
