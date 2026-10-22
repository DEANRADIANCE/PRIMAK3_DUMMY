import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col, Tooltip } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useLogin } from "@refinedev/core";
import { initialUsers } from "../../mocks/users";
import { DoctorBriefcaseIntro } from "./DoctorBriefcaseIntro";
import { DoctorHeroIllustration } from "./DoctorHeroIllustration";
import "./login.css";

const { Title, Text, Paragraph } = Typography;

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending: isLoading } = useLogin();
  const [form] = Form.useForm();

  // Selalu putar animasi dokter saat pertama kali membuka halaman login
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleFormSubmit = (values: { email?: string; password?: string }) => {
    login({ email: values.email || "", password: values.password || "" });
  };

  const handleQuickLogin = (email: string) => {
    form.setFieldsValue({
      email,
      password: "password123",
    });
    login({ email, password: "password123" });
  };

  // Role metadata for colorful demo buttons
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "admin":
        return {
          class: "role-admin",
          label: "Admin / Dokter",
          tagColor: "#059669",
          tagBg: "#d1fae5",
          icon: <MedicineBoxOutlined style={{ color: "#059669" }} />,
        };
      case "tim_k3":
        return {
          class: "role-tim_k3",
          label: "HSE / Tim K3",
          tagColor: "#0284c7",
          tagBg: "#e0f2fe",
          icon: <SafetyCertificateOutlined style={{ color: "#0284c7" }} />,
        };
      case "kepala_unit":
        return {
          class: "role-kepala_unit",
          label: "Kepala Unit",
          tagColor: "#7c3aed",
          tagBg: "#ede9fe",
          icon: <SafetyOutlined style={{ color: "#7c3aed" }} />,
        };
      case "pegawai":
      default:
        return {
          class: "role-pegawai",
          label: "Pegawai ANRI",
          tagColor: "#d97706",
          tagBg: "#fef3c7",
          icon: <UserOutlined style={{ color: "#d97706" }} />,
        };
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Doctor Opening Briefcase Splash Animation Overlay */}
      {showIntro && <DoctorBriefcaseIntro onComplete={handleIntroComplete} />}

      {/* Dynamic Glowing Ambient Orbs */}
      <div className="login-glow-orb login-glow-orb-1" />
      <div className="login-glow-orb login-glow-orb-2" />
      <div className="login-glow-orb login-glow-orb-3" />

      {/* Main Glassmorphic Split Login Container */}
      <div className="login-card-container">
        {/* LEFT PANEL: HERO & BRANDING WITH DOCTOR ILLUSTRATION */}
        <div className="login-hero-panel">
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="hero-tag-badge">
                <MedicineBoxOutlined style={{ color: "#34d399", fontSize: 14 }} />
                <span>KLINIK PRATAMA & K3 ANRI</span>
              </div>
              <Tooltip title="Tonton kembali animasi dokter membuka koper">
                <Button
                  size="small"
                  type="text"
                  onClick={handleReplayIntro}
                  style={{
                    color: "#ffffff",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 20,
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 10px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <PlayCircleOutlined /> Putar Animasi
                </Button>
              </Tooltip>
            </div>

            <Title
              level={2}
              style={{
                color: "#ffffff",
                margin: "0 0 8px 0",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              PRIMA K3 <span style={{ color: "#34d399", fontWeight: 700 }}>V2.0</span>
            </Title>
            <Paragraph
              style={{
                color: "#d1fae5",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                opacity: 0.95,
              }}
            >
              Portal Terpadu Keselamatan, Kesehatan Kerja & Pelayanan Medis Arsip Nasional Republik Indonesia.
            </Paragraph>
          </div>

          {/* Interactive Doctor with Briefcase Illustration */}
          <div className="doctor-hero-visual">
            <DoctorHeroIllustration />
          </div>

          {/* Feature Highlights with Modern Frosted Badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="hero-pill-feature">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#34d399",
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: 16 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>Zero Accident & Budaya K3</div>
                <div style={{ fontSize: 11, color: "#a7f3d0" }}>Mitigasi risiko bahaya & investigasi komprehensif</div>
              </div>
            </div>

            <div className="hero-pill-feature">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "rgba(14, 165, 233, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#38bdf8",
                }}
              >
                <HeartOutlined style={{ fontSize: 16 }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>Klinik Pratama & Psikolog Kerja</div>
                <div style={{ fontSize: 11, color: "#a7f3d0" }}>Konsultasi kesehatan terpadu & surveillance penyakit</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: MODERN ELEGANT LOGIN FORM */}
        <div className="login-form-panel">
          {/* Header Brand */}
          <div className="login-brand-header">
            <div className="brand-icon-box">
              <span style={{ letterSpacing: "-1px" }}>K3</span>
              <div
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  border: "2.5px solid #ffffff",
                }}
              />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>
                Selamat Datang Kembali
              </Title>
              <Text type="secondary" style={{ fontSize: 13, color: "#64748b" }}>
                Masuk ke akun PRIMA K3 ANRI Anda
              </Text>
            </div>
          </div>

          {/* Form Credentials */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={{ email: "admin@anri.go.id", password: "password123" }}
            requiredMark={false}
          >
            <Form.Item
              label={
                <span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>
                  Alamat Email / NIP
                </span>
              }
              name="email"
              rules={[{ required: true, message: "Silakan masukkan alamat email atau NIP!" }]}
              className="login-input-custom"
            >
              <Input
                prefix={<UserOutlined style={{ color: "#0d9488", marginRight: 6 }} />}
                placeholder="contoh: admin@anri.go.id"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>Kata Sandi</span>
                  <a
                    href="#lupa-sandi"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickLogin("admin@anri.go.id");
                    }}
                    style={{ fontSize: 12, color: "#0d9488", fontWeight: 500 }}
                  >
                    Bantuan Akun?
                  </a>
                </div>
              }
              name="password"
              rules={[{ required: true, message: "Silakan masukkan kata sandi Anda!" }]}
              className="login-input-custom"
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#0d9488", marginRight: 6 }} />}
                placeholder="••••••••"
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoading}
              icon={<LoginOutlined />}
              className="login-btn-submit"
            >
              Masuk ke Sistem PRIMA K3
            </Button>
          </Form>

          {/* DEMO ACCOUNTS SELECTOR */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: "0.6px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ThunderboltOutlined style={{ color: "#f59e0b" }} /> AKUN DEMO PERAN (KLIK CEPAT)
              </span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>1-Klik Langsung Masuk</span>
            </div>

            <Row gutter={[10, 10]}>
              {initialUsers.map((u) => {
                const meta = getRoleBadgeStyle(u.role);
                return (
                  <Col span={12} key={u.id}>
                    <Tooltip title={`Masuk sebagai ${u.name} (${u.unit})`}>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin(u.email)}
                        className={`role-badge-btn ${meta.class}`}
                        style={{
                          width: "100%",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: `2px solid ${meta.tagColor}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              // Fallback to role icon if image fails
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div style={{ overflow: "hidden", textAlign: "left", flex: 1 }}>
                          <div
                            style={{
                              display: "inline-block",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              color: meta.tagColor,
                              backgroundColor: meta.tagBg,
                              marginBottom: 2,
                            }}
                          >
                            {meta.label}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#1e293b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {u.name.split(",")[0]}
                          </div>
                        </div>
                      </button>
                    </Tooltip>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Footer Info */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            <span>© 2026 PRIMA K3 ANRI</span>
            <button
              type="button"
              onClick={handleReplayIntro}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#0d9488",
                fontWeight: 600,
                fontSize: 11,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <PlayCircleOutlined /> Tonton Animasi Dokter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
