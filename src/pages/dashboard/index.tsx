import React, { useState } from "react";
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
} from "antd";
import {
  FileProtectOutlined,
  TeamOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  NotificationOutlined,
  FallOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCustom } from "@refinedev/core";
import { IDashboardSummary } from "../../types/dashboard";
import { initialDashboardSummary } from "../../mocks/dashboard";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; month: string; count: number } | null>(null);

  // Ambil data dashboard via refine useCustom hook
  const { result } = useCustom<IDashboardSummary>({
    url: "/dashboard/summary",
    method: "get",
  });

  // Pastikan data SELALU aman dengan default initialDashboardSummary
  const customData = result?.data && typeof result.data === "object" && Object.keys(result.data).length > 0
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
  const visitsData = (summary.monthlyVisits && summary.monthlyVisits.length > 0)
    ? summary.monthlyVisits
    : initialDashboardSummary.monthlyVisits;

  const diseaseTrends = (summary.diseaseTrends && summary.diseaseTrends.length > 0)
    ? summary.diseaseTrends
    : initialDashboardSummary.diseaseTrends;

  const accidentTypes = (summary.accidentTypes && summary.accidentTypes.length > 0)
    ? summary.accidentTypes
    : initialDashboardSummary.accidentTypes;

  const monthlyAccidents = (summary.monthlyAccidents && summary.monthlyAccidents.length > 0)
    ? summary.monthlyAccidents
    : initialDashboardSummary.monthlyAccidents;

  const healthStats = (summary.healthStats && summary.healthStats.length > 0)
    ? summary.healthStats
    : initialDashboardSummary.healthStats;

  const employeeStats = summary.employeeStats || initialDashboardSummary.employeeStats;

  const psychologistVisits = (summary.psychologistVisits && summary.psychologistVisits.length > 0)
    ? summary.psychologistVisits
    : initialDashboardSummary.psychologistVisits;

  const healthCheckup = (summary.healthCheckup && summary.healthCheckup.length > 0)
    ? summary.healthCheckup
    : initialDashboardSummary.healthCheckup;

  const latestAnnouncements = (summary.latestAnnouncements && summary.latestAnnouncements.length > 0)
    ? summary.latestAnnouncements
    : initialDashboardSummary.latestAnnouncements;

  const maxVisitCount = Math.max(...visitsData.map((v: any) => v.count), 80);
  const totalAccidentsCount = accidentTypes.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0) || 1;

  // Donut chart color palette
  const accidentColors = ["#595959", "#8c8c8c", "#bfbfbf", "#d9d9d9"];

  // Helper koordinat SVG untuk grafik garis mulus (Smooth Spline)
  const svgWidth = 560;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;

  const points = visitsData.map((d: any, i: number) => {
    const x = paddingX + (i / (visitsData.length - 1 || 1)) * chartW;
    const y = svgHeight - paddingY - (d.count / maxVisitCount) * chartH;
    return { x, y, ...d };
  });

  // Membuat SVG path bezier kurva halus
  const makeSmoothPath = (pts: typeof points) => {
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
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : "";

  // Helper Donut Chart SVG Segments
  let cumulativeAngle = 0;
  const donutSegments = accidentTypes.map((item: any, idx: number) => {
    const count = item.count || 0;
    const angle = (count / totalAccidentsCount) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...item,
      startAngle,
      angle,
      color: accidentColors[idx % accidentColors.length],
      percent: Math.round((count / totalAccidentsCount) * 100),
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 1. Header Filter Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          background: "#ffffff",
          padding: "16px 20px",
          borderRadius: 12,
          border: "1px solid #f0f0f0",
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 700, color: "#262626" }}>
            Dashboard Manajemen K3
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Sistem Pemantauan Terpadu Keselamatan dan Kesehatan Kerja • Klinik Pratama ANRI
          </Text>
        </div>

        <Space wrap>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined style={{ color: "#8c8c8c" }} />
            <Text style={{ fontSize: 13, color: "#595959" }}>Periode:</Text>
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
          >
            Reset Periode
          </Button>
        </Space>
      </div>

      {/* 2. Baris 4 Kartu Ringkasan (StatCard Sesuai Pola Wireframe) */}
      <Row gutter={[16, 16]}>
        {/* Kartu 1: Laporan Kecelakaan Kerja */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Laporan Kecelakaan Kerja
                </Text>
                <div style={{ fontSize: 11, color: "#8c8c8c", marginTop: 2 }}>Bulan Ini</div>
                <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#262626", lineHeight: 1 }}>
                    {summary.totalAccidents}
                  </span>
                  <Text style={{ fontSize: 13, color: "#8c8c8c" }}>kasus</Text>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileProtectOutlined style={{ fontSize: 22, color: "#595959" }} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Tag color="cyan" style={{ margin: 0, fontSize: 11, fontWeight: 600 }}>
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
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Jumlah Pegawai
                </Text>
                <div style={{ fontSize: 11, color: "#8c8c8c", marginTop: 2 }}>Terdaftar di Klinik ANRI</div>
                <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#262626", lineHeight: 1 }}>
                    {summary.totalEmployees}
                  </span>
                  <Text style={{ fontSize: 13, color: "#8c8c8c" }}>orang</Text>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TeamOutlined style={{ fontSize: 22, color: "#595959" }} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Tag color="default" style={{ margin: 0, fontSize: 11 }}>
                462 ASN
              </Tag>
              <Tag color="default" style={{ margin: 0, fontSize: 11 }}>
                23 PPPK
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                100% Aktif
              </Text>
            </div>
          </Card>
        </Col>

        {/* Kartu 3: Jumlah Laporan Potensi Bahaya */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Laporan Potensi Bahaya
                </Text>
                <div style={{ fontSize: 11, color: "#8c8c8c", marginTop: 2 }}>Near Miss & Unsafe Act</div>
                <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#262626", lineHeight: 1 }}>
                    {summary.totalHazardReports}
                  </span>
                  <Text style={{ fontSize: 13, color: "#8c8c8c" }}>laporan</Text>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WarningOutlined style={{ fontSize: 22, color: "#595959" }} />
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Tag color="success" style={{ margin: 0, fontSize: 11, fontWeight: 600 }}>
                10 Tuntas
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                4 dalam perbaikan fisik
              </Text>
            </div>
          </Card>
        </Col>

        {/* Kartu 4: Skor Kepatuhan K3 */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              height: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                  Skor Kepatuhan K3
                </Text>
                <div style={{ fontSize: 11, color: "#8c8c8c", marginTop: 2 }}>Indeks Audit Terpadu</div>
                <div style={{ display: "flex", alignItems: "baseline", marginTop: 10, gap: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: "#262626", lineHeight: 1 }}>
                    {summary.complianceScore}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 600, color: "#595959" }}>%</span>
                </div>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 22, color: "#52c41a" }} />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Progress percent={summary.complianceScore} showInfo={false} strokeColor="#595959" size={["100%", 6]} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <Text style={{ fontSize: 11, color: "#52c41a", fontWeight: 600 }}>Sangat Baik (SMK3)</Text>
                <Text type="secondary" style={{ fontSize: 11 }}>Target: &ge; 85%</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. Baris Grafik Garis Kunjungan / Laporan per Bulan & Bar Horizontal Tren Penyakit */}
      <Row gutter={[16, 16]}>
        {/* Grafik Garis Kunjungan / Laporan per Bulan */}
        <Col xs={24} lg={15}>
          <Card
            title={
              <div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Kunjungan & Laporan per Bulan</span>
                <div style={{ fontSize: 12, color: "#8c8c8c", fontWeight: "normal" }}>
                  Tren jumlah kunjungan medis klinik & laporan potensi bahaya 6 bulan terakhir
                </div>
              </div>
            }
            extra={
              <Tag color="default" style={{ background: "#f5f5f5", color: "#595959", border: "none" }}>
                Rata-rata: 54 kunjungan/bln
              </Tag>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            {/* Visualisasi Grafik Garis SVG Spline Mulus */}
            <div style={{ position: "relative", width: "100%", height: 210 }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  {/* Gradien Area Abu-abu Elegan */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#595959" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#595959" stopOpacity="0.0" />
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
                        stroke="#f0f0f0"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 4}
                        fontSize="10"
                        fill="#bfbfbf"
                        textAnchor="end"
                      >
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* Area Fill */}
                <path d={areaPath} fill="url(#areaGradient)" />

                {/* Stroke Garis Utama */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#595959"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Titik-titik Data (Dots) Interaktif */}
                {points.map((pt: any, idx: number) => {
                  const isHovered = hoveredPoint?.index === idx;
                  const isLast = idx === points.length - 1;
                  return (
                    <g key={idx}>
                      {/* Lingkaran Titik */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 7 : 5}
                        fill={isLast ? "#262626" : "#ffffff"}
                        stroke="#595959"
                        strokeWidth="2.5"
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={() => setHoveredPoint({ index: idx, month: pt.month, count: pt.count })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />

                      {/* Angka Nilai di atas Titik */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        fontSize="11"
                        fontWeight="600"
                        fill={isLast ? "#262626" : "#8c8c8c"}
                        textAnchor="middle"
                      >
                        {pt.count}
                      </text>

                      {/* Label Sumbu Bulan di Bawah */}
                      <text
                        x={pt.x}
                        y={svgHeight - 8}
                        fontSize="11"
                        fill="#8c8c8c"
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

        {/* Bar Horizontal Tren Penyakit */}
        <Col xs={24} lg={9}>
          <Card
            title={
              <div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Tren Penyakit Terbanyak</span>
                <div style={{ fontSize: 12, color: "#8c8c8c", fontWeight: "normal" }}>
                  Distribusi morbiditas keluhan klinik (Bulan {selectedMonth === "03" ? "Maret" : "Februari"} 2026)
                </div>
              </div>
            }
            extra={
              <Button type="link" size="small" onClick={() => navigate("/kesehatan/penyakit")}>
                Detail &rarr;
              </Button>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {diseaseTrends.map((d: any, index: number) => {
                const percent = Math.round((d.count / 55) * 100);
                return (
                  <div key={index}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <Space size="small">
                        <span style={{ width: 18, fontSize: 12, fontWeight: 700, color: "#8c8c8c" }}>
                          #{index + 1}
                        </span>
                        <Text strong style={{ fontSize: 13, color: "#262626" }}>
                          {d.disease}
                        </Text>
                      </Space>
                      <Space size="small">
                        <Text strong style={{ fontSize: 13 }}>
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
                      strokeColor={index === 0 ? "#595959" : index === 1 ? "#737373" : index === 2 ? "#8c8c8c" : "#bfbfbf"}
                      size={["100%", 8]}
                    />
                  </div>
                );
              })}
            </div>

            <Divider style={{ margin: "16px 0 12px" }} />
            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
              * Data diagnosa anonim dari poli umum Klinik Pratama ANRI.
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 4. Baris Donut Jenis Kecelakaan + Bar Statistik Kecelakaan Kerja per Bulan */}
      <Row gutter={[16, 16]}>
        {/* Donut Jenis Kecelakaan */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Jenis Kecelakaan Kerja</span>
                <div style={{ fontSize: 12, color: "#8c8c8c", fontWeight: "normal" }}>
                  Klasifikasi faktor penyebab insiden
                </div>
              </div>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <Row gutter={16} align="middle">
              {/* SVG Donut Visual */}
              <Col xs={24} sm={11} style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", width: 140, height: 140 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                    {donutSegments.map((seg: any, idx: number) => {
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
                          strokeWidth="16"
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
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#262626", lineHeight: 1 }}>
                      {totalAccidentsCount}
                    </div>
                    <div style={{ fontSize: 10, color: "#8c8c8c", marginTop: 2 }}>Total Kasus</div>
                  </div>
                </div>
              </Col>

              {/* Legenda Detail */}
              <Col xs={24} sm={13}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {donutSegments.map((seg: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space size="small">
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            backgroundColor: seg.color,
                          }}
                        />
                        <Text style={{ fontSize: 12 }}>{seg.type}</Text>
                      </Space>
                      <Text strong style={{ fontSize: 12 }}>
                        {seg.count} ({seg.percent}%)
                      </Text>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Bar Statistik Kecelakaan Kerja per Bulan */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <div>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Statistik Kecelakaan Kerja per Bulan</span>
                <div style={{ fontSize: 12, color: "#8c8c8c", fontWeight: "normal" }}>
                  Jumlah kejadian insiden per bulan kalender
                </div>
              </div>
            }
            extra={
              <Tag color="success" style={{ border: "none" }}>
                Target: Zero Accident
              </Tag>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <div style={{ height: 160, display: "flex", alignItems: "flex-end", gap: 16, paddingTop: 10, paddingBottom: 6 }}>
              {monthlyAccidents.map((item: any, idx: number) => {
                const heightPercent = Math.max(((item.count || 0) / 3) * 100, 8);
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
                    <Text strong style={{ fontSize: 12, marginBottom: 6, color: item.count > 0 ? "#262626" : "#bfbfbf" }}>
                      {item.count}
                    </Text>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 38,
                        height: `${heightPercent}%`,
                        backgroundColor: isCurrent ? "#595959" : item.count > 1 ? "#8c8c8c" : "#d9d9d9",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease",
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 11, marginTop: 8 }}>
                      {item.month}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 5. Baris 4 Metrik: Statistik Kesehatan, Gauge Pegawai, Kunjungan Psikolog, Pemeriksaan Berkala MCU */}
      <Row gutter={[16, 16]}>
        {/* Progress Bar Statistik Kesehatan */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: 14 }}>Statistik Kesehatan</span>}
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {healthStats.map((h: any, i: number) => {
                const pct = Math.round(((h.value || 0) / (h.total || 1)) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, color: "#595959" }}>{h.label}</Text>
                      <Text strong style={{ fontSize: 12 }}>
                        {pct}%
                      </Text>
                    </div>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={i === 0 ? "#52c41a" : i === 1 ? "#595959" : "#1890ff"}
                      size={["100%", 7]}
                    />
                  </div>
                );
              })}
            </div>
            <Divider style={{ margin: "14px 0 10px" }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Indikator surveilans medis Klinik ANRI.
            </Text>
          </Card>
        </Col>

        {/* Gauge / Circular Progress Statistik Pegawai Terdata */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: 14 }}>Statistik Pegawai Terdata</span>}
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%", textAlign: "center" }}
          >
            <div style={{ padding: "8px 0" }}>
              <Progress
                type="dashboard"
                percent={Math.round(((employeeStats?.registered || 462) / (employeeStats?.total || 485)) * 100)}
                strokeColor="#595959"
                size={110}
                format={(pct) => `${pct}%`}
              />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#262626" }}>
                  {employeeStats?.registered || 462} dari {employeeStats?.total || 485}
                </div>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Pegawai aktif terdata di sistem K3
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Grafik Statistik Kunjungan Psikolog */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: 14 }}>Statistik Kunjungan Psikolog</span>}
            extra={
              <Button type="link" size="small" onClick={() => navigate("/kesehatan/konsultasi")}>
                Booking
              </Button>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <div style={{ height: 110, display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 8, paddingBottom: 4 }}>
              {psychologistVisits.map((item: any, idx: number) => {
                const isCurrent = idx === psychologistVisits.length - 1;
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
                    <Text style={{ fontSize: 10, color: "#8c8c8c" }}>{item.count}</Text>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 24,
                        height: `${((item.count || 0) / 16) * 100}%`,
                        backgroundColor: isCurrent ? "#595959" : "#bfbfbf",
                        borderRadius: "3px 3px 0 0",
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 10, marginTop: 4 }}>
                      {item.month}
                    </Text>
                  </div>
                );
              })}
            </div>
            <Divider style={{ margin: "10px 0 8px" }} />
            <Text type="secondary" style={{ fontSize: 11, textAlign: "center", display: "block" }}>
              Total 60 sesi konseling terlaksana (Rahasia)
            </Text>
          </Card>
        </Col>

        {/* Progress Statistik Pemeriksaan Kesehatan Berkala (Laki-laki / Perempuan) */}
        <Col xs={24} md={12} lg={6}>
          <Card
            title={<span style={{ fontWeight: 600, fontSize: 14 }}>Statistik Pemeriksaan Berkala</span>}
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", height: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {healthCheckup.map((mcu: any, i: number) => {
                const pct = Math.round(((mcu.completed || 0) / (mcu.total || 1)) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Space size="small">
                        <UserOutlined style={{ color: "#8c8c8c" }} />
                        <Text strong style={{ fontSize: 13 }}>
                          {mcu.gender}
                        </Text>
                      </Space>
                      <Text style={{ fontSize: 12 }}>
                        {mcu.completed}/{mcu.total} ({pct}%)
                      </Text>
                    </div>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={i === 0 ? "#595959" : "#8c8c8c"}
                      size={["100%", 7]}
                    />
                  </div>
                );
              })}
            </div>
            <Divider style={{ margin: "14px 0 10px" }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              MCU Berkala Tahunan Batch 1 ANRI 2026.
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 6. Blok Informasi Terkini (Pola Wireframe: Kartu Besar + Kartu Kecil) */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <NotificationOutlined style={{ fontSize: 18, color: "#595959" }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>Informasi Terkini</span>
          </div>
        }
        extra={
          <Button
            type="link"
            onClick={() => navigate("/media/pemberitahuan")}
            style={{ padding: 0 }}
          >
            Lihat Semua Kegiatan <ArrowRightOutlined />
          </Button>
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e8e8e8" }}
      >
        <Row gutter={[20, 20]}>
          {/* Sisi Kiri: Kartu Besar (Featured) */}
          {latestAnnouncements.length > 0 && (
            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  height: "100%",
                }}
                cover={
                  <img
                    alt={latestAnnouncements[0].title}
                    src={latestAnnouncements[0].image}
                    style={{ height: 210, objectFit: "cover" }}
                  />
                }
                onClick={() => navigate(`/media/pemberitahuan/show/${latestAnnouncements[0].id}`)}
              >
                <Tag color="default" style={{ background: "#595959", color: "#fff", border: "none", marginBottom: 8 }}>
                  <CalendarOutlined /> {latestAnnouncements[0].date}
                </Tag>
                <Title level={5} style={{ margin: "4px 0 8px", fontSize: 16 }}>
                  {latestAnnouncements[0].title}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13, margin: 0 }}>
                  {latestAnnouncements[0].description}
                </Paragraph>
                <div style={{ marginTop: 14 }}>
                  <Button size="small" type="link" style={{ padding: 0, fontWeight: 600 }}>
                    Baca Selengkapnya &rarr;
                  </Button>
                </div>
              </Card>
            </Col>
          )}

          {/* Sisi Kanan: Kartu-Kartu Kecil */}
          <Col xs={24} md={12}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
              {latestAnnouncements.slice(1).map((ann: any) => (
                <Card
                  key={ann.id}
                  hoverable
                  size="small"
                  onClick={() => navigate(`/media/pemberitahuan/show/${ann.id}`)}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #f0f0f0",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Row gutter={12} align="middle" style={{ width: "100%" }}>
                    <Col span={8}>
                      <img
                        alt={ann.title}
                        src={ann.image}
                        style={{ width: "100%", height: 86, objectFit: "cover", borderRadius: 8 }}
                      />
                    </Col>
                    <Col span={16}>
                      <Tag color="default" style={{ fontSize: 11, marginBottom: 4, background: "#f5f5f5" }}>
                        <CalendarOutlined /> {ann.date}
                      </Tag>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, lineHeight: 1.3, color: "#262626" }}>
                        {ann.title}
                      </div>
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ margin: 0, fontSize: 12 }}>
                        {ann.description}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
