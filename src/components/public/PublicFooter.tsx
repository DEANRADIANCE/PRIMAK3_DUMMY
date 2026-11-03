import React from "react";
import { Row, Col, Typography, Divider, Space } from "antd";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router";

const { Title, Text, Paragraph } = Typography;

export const PublicFooter: React.FC = () => {
  const navigate = useNavigate();

  const handleTujuanClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById("tujuan-aplikasi")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#tujuan-aplikasi");
    }
  };

  const footerLinkStyle: React.CSSProperties = {
    color: "#64748b",
    fontSize: 14,
    textDecoration: "none",
    transition: "color 0.2s ease",
    display: "inline-block",
  };

  return (
    <footer
      className="pub-reveal"
      style={{
        backgroundColor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        paddingTop: 56,
        paddingBottom: 28,
        color: "#475569",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={[40, 32]}>
          {/* Kolom 1: PRIMA K3 */}
          <Col xs={24} sm={24} md={10} lg={9}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img
                src="/Logo-PrimaK3.png"
                alt="Logo PRIMA K3"
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
              <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b", letterSpacing: 0.5 }}>
                PRIMA K3
              </span>
            </div>
            <Paragraph style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, maxWidth: 360 }}>
              Aplikasi keselamatan dan kesehatan kerja Arsip Nasional Republik Indonesia, dikelola oleh Biro Kepegawaian dan Umum.
            </Paragraph>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <SafetyCertificateOutlined style={{ color: "#0f766e", fontSize: 18 }} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: "#0f766e" }}>
                Komitmen Keselamatan Kerja ASN ANRI
              </Text>
            </div>
          </Col>

          {/* Kolom 2: Aplikasi */}
          <Col xs={12} sm={8} md={4} lg={4}>
            <Title level={5} style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 18 }}>
              Aplikasi
            </Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <Link to="/login" style={footerLinkStyle}>
                  Masuk
                </Link>
              </li>
              <li>
                <Link to="/login" style={footerLinkStyle}>
                  Lapor Insiden
                </Link>
              </li>
              <li>
                <Link to="/login" style={footerLinkStyle}>
                  Konseling Psikologi
                </Link>
              </li>
            </ul>
          </Col>

          {/* Kolom 3: Informasi */}
          <Col xs={12} sm={8} md={4} lg={4}>
            <Title level={5} style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 18 }}>
              Informasi
            </Title>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <a href="/#tujuan-aplikasi" onClick={handleTujuanClick} style={footerLinkStyle}>
                  Tujuan Aplikasi
                </a>
              </li>
              <li>
                <Link to="/berita" style={footerLinkStyle}>
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/poster" style={footerLinkStyle}>
                  Poster
                </Link>
              </li>
            </ul>
          </Col>

          {/* Kolom 4: Kontak */}
          <Col xs={24} sm={8} md={6} lg={7}>
            <Title level={5} style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", marginBottom: 18 }}>
              Kontak
            </Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "#64748b" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <EnvironmentOutlined style={{ color: "#0f766e", marginTop: 3, flexShrink: 0 }} />
                <span>Jl. Ampera Raya No. 7, Cilandak, Jakarta Selatan 12560</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <MailOutlined style={{ color: "#0f766e", flexShrink: 0 }} />
                <a href="mailto:k3@anri.go.id" style={footerLinkStyle}>
                  k3@anri.go.id
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PhoneOutlined style={{ color: "#0f766e", flexShrink: 0 }} />
                <span>(021) 7805851</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Garis Pemisah */}
        <Divider style={{ borderColor: "#e2e8f0", margin: "40px 0 20px 0" }} />

        {/* Baris Bawah */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          <div>
            © 2026 Arsip Nasional Republik Indonesia. Hak cipta dilindungi.
          </div>
          <div style={{ fontWeight: 500, color: "#64748b" }}>
            Biro Kepegawaian dan Umum
          </div>
        </div>
      </div>
    </footer>
  );
};
