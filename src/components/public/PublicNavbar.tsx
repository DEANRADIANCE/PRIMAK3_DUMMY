import React, { useState } from "react";
import { Button, Drawer, Space, Typography, Grid } from "antd";
import {
  MenuOutlined,
  LoginOutlined,
  DashboardOutlined,
  HomeOutlined,
  BulbOutlined,
  ReadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, Link } from "react-router";
import { useIsAuthenticated } from "@refinedev/core";

const { Text } = Typography;
const { useBreakpoint } = Grid;

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Cek apakah user sedang login
  const { data: authData } = useIsAuthenticated();
  const isAuthenticated = Boolean(authData?.authenticated);

  const pathname = location.pathname;
  const hash = location.hash;

  // Handler navigasi Home
  const handleHomeClick = () => {
    if (pathname === "/" && !hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Handler navigasi Tujuan Aplikasi
  const handleTujuanClick = () => {
    if (pathname === "/") {
      const el = document.getElementById("tujuan-aplikasi");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/#tujuan-aplikasi");
      }
    } else {
      navigate("/#tujuan-aplikasi");
    }
    setMobileMenuOpen(false);
  };

  // Active status
  const isHomeActive = pathname === "/" && hash !== "#tujuan-aplikasi";
  const isTujuanActive = pathname === "/" && hash === "#tujuan-aplikasi";
  const isBeritaActive = pathname.startsWith("/berita");
  const isPosterActive = pathname.startsWith("/poster");

  const navItemStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 8,
    fontWeight: isActive ? 600 : 500,
    fontSize: 14,
    color: isActive ? "#0f766e" : "#475569",
    backgroundColor: isActive ? "#f0fdfa" : "transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 20px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Kiri: Logo PRIMA K3 + Subteks ARSIP NASIONAL REPUBLIK INDONESIA */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <img
            src="/Logo-PrimaK3.png"
            alt="Logo PRIMA K3"
            style={{ width: 34, height: 34, objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#1e293b",
                letterSpacing: "0.5px",
              }}
            >
              PRIMA K3
            </span>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 600,
                color: "#64748b",
                letterSpacing: "0.6px",
                textTransform: "uppercase",
              }}
            >
              ARSIP NASIONAL REPUBLIK INDONESIA
            </span>
          </div>
        </div>

        {/* Kanan Desktop Menu */}
        {!isMobile ? (
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={navItemStyle(isHomeActive)}
              onClick={handleHomeClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleHomeClick()}
            >
              Home
            </span>
            <span
              style={navItemStyle(isTujuanActive)}
              onClick={handleTujuanClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleTujuanClick()}
            >
              Tujuan Aplikasi
            </span>
            <Link
              to="/berita"
              style={navItemStyle(isBeritaActive)}
            >
              Berita
            </Link>
            <Link
              to="/poster"
              style={navItemStyle(isPosterActive)}
            >
              Poster
            </Link>

            <div style={{ marginLeft: 10 }}>
              {isAuthenticated ? (
                <Button
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => navigate("/dashboard")}
                  style={{
                    backgroundColor: "#0f766e",
                    borderColor: "#0f766e",
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 38,
                    paddingInline: 18,
                    boxShadow: "0 2px 6px rgba(15, 118, 110, 0.2)",
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                  style={{
                    backgroundColor: "#0f766e",
                    borderColor: "#0f766e",
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 38,
                    paddingInline: 20,
                    boxShadow: "0 2px 6px rgba(15, 118, 110, 0.2)",
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </nav>
        ) : (
          /* Mobile Hamburger Button */
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka menu navigasi"
            style={{ width: 44, height: 44 }}
          />
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/Logo-PrimaK3.png"
              alt="Logo PRIMA K3"
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>PRIMA K3</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>ANRI</div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={navItemStyle(isHomeActive)}
            onClick={handleHomeClick}
          >
            <HomeOutlined /> Home
          </div>
          <div
            style={navItemStyle(isTujuanActive)}
            onClick={handleTujuanClick}
          >
            <BulbOutlined /> Tujuan Aplikasi
          </div>
          <Link
            to="/berita"
            style={navItemStyle(isBeritaActive)}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ReadOutlined /> Berita
          </Link>
          <Link
            to="/poster"
            style={navItemStyle(isPosterActive)}
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileImageOutlined /> Poster
          </Link>

          <div style={{ marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
            {isAuthenticated ? (
              <Button
                type="primary"
                block
                icon={<DashboardOutlined />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/dashboard");
                }}
                style={{
                  backgroundColor: "#0f766e",
                  borderColor: "#0f766e",
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 40,
                }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                type="primary"
                block
                icon={<LoginOutlined />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                style={{
                  backgroundColor: "#0f766e",
                  borderColor: "#0f766e",
                  borderRadius: 8,
                  fontWeight: 600,
                  height: 40,
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </header>
  );
};
