import React, { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Breadcrumb,
  Drawer,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  FileProtectOutlined,
  FireOutlined,
  HeartOutlined,
  NotificationOutlined,
  BellOutlined,
  ReadOutlined,
  FileImageOutlined,
  UserOutlined,
  LogoutOutlined,
  AlertOutlined,
  SwapOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { IUser } from "../../types/user";
import { EmergencyModal } from "../common/EmergencyModal";
import { switchRole } from "../../providers/authProvider";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

interface CustomLayoutProps {
  children: React.ReactNode;
}

export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();

  // Mapping breadcrumbs
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [{ title: <Link to="/">Dashboard</Link> }];

    if (path.includes("/keselamatan")) {
      items.push({ title: <span>Keselamatan</span> });
      if (path.includes("/bahaya-resiko")) {
        items.push({ title: <Link to="/keselamatan/bahaya-resiko">Bahaya dan Resiko</Link> });
        if (path.includes("/create")) items.push({ title: <span>Tambah Laporan</span> });
        if (path.includes("/show")) items.push({ title: <span>Detail Laporan</span> });
        if (path.includes("/edit")) items.push({ title: <span>Ubah Laporan</span> });
      } else if (path.includes("/hiradc")) {
        items.push({ title: <Link to="/keselamatan/hiradc">HIRADC</Link> });
        if (path.includes("/create")) items.push({ title: <span>Penilaian Baru</span> });
        if (path.includes("/show")) items.push({ title: <span>Detail HIRADC</span> });
        if (path.includes("/edit")) items.push({ title: <span>Ubah HIRADC</span> });
      } else if (path.includes("/investigasi")) {
        items.push({ title: <Link to="/keselamatan/investigasi">Investigasi</Link> });
        if (path.includes("/create")) items.push({ title: <span>Investigasi Baru</span> });
        if (path.includes("/show")) items.push({ title: <span>Form Investigasi Insiden</span> });
      } else if (path.includes("/kecelakaan")) {
        items.push({ title: <Link to="/keselamatan/kecelakaan">Pelaporan Kecelakaan Kerja</Link> });
        if (path.includes("/create")) items.push({ title: <span>Lapor Kecelakaan</span> });
        if (path.includes("/show")) items.push({ title: <span>Detail Kecelakaan</span> });
        if (path.includes("/edit")) items.push({ title: <span>Ubah Laporan</span> });
      } else if (path.includes("/inspeksi")) {
        items.push({ title: <Link to="/keselamatan/inspeksi">Inspeksi K3</Link> });
        if (path.includes("/create")) items.push({ title: <span>Audit Inspeksi Baru</span> });
        if (path.includes("/show")) items.push({ title: <span>Detail Hasil Inspeksi</span> });
      }
    } else if (path.includes("/kesehatan")) {
      items.push({ title: <span>Kesehatan</span> });
      if (path.includes("/penyakit")) {
        items.push({ title: <span>Penyakit</span> });
      } else if (path.includes("/konsultasi")) {
        items.push({ title: <Link to="/kesehatan/konsultasi">Konsultasi Psikolog</Link> });
        if (path.includes("/create")) items.push({ title: <span>Booking Jadwal Konsultasi</span> });
      }
    } else if (path.includes("/media")) {
      items.push({ title: <span>Media dan Informasi</span> });
      if (path.includes("/pemberitahuan")) {
        items.push({ title: <Link to="/media/pemberitahuan">Pemberitahuan</Link> });
        if (path.includes("/create")) items.push({ title: <span>Buat Pemberitahuan</span> });
        if (path.includes("/show")) items.push({ title: <span>Detail Pemberitahuan</span> });
      } else if (path.includes("/edukasi")) {
        items.push({ title: <Link to="/media/edukasi">Edukasi K3</Link> });
        if (path.includes("/create")) items.push({ title: <span>Tambah Artikel Edukasi</span> });
        if (path.includes("/show")) items.push({ title: <span>Baca Artikel</span> });
      } else if (path.includes("/flayer-poster")) {
        items.push({ title: <Link to="/media/flayer-poster">Flayer & Poster</Link> });
        if (path.includes("/create")) items.push({ title: <span>Unggah Poster</span> });
      }
    }

    return items;
  };

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined style={{ fontSize: 16 }} />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "keselamatan",
      icon: <MedicineBoxOutlined style={{ fontSize: 16 }} />,
      label: "Keselamatan",
      children: [
        {
          key: "/keselamatan/bahaya-resiko",
          icon: <WarningOutlined />,
          label: "Bahaya dan Resiko",
          onClick: () => navigate("/keselamatan/bahaya-resiko"),
        },
        {
          key: "/keselamatan/hiradc",
          icon: <SafetyCertificateOutlined />,
          label: "HIRADC",
          onClick: () => navigate("/keselamatan/hiradc"),
        },
        {
          key: "/keselamatan/investigasi",
          icon: <SearchOutlined />,
          label: "Investigasi",
          onClick: () => navigate("/keselamatan/investigasi"),
        },
        {
          key: "/keselamatan/kecelakaan",
          icon: <FileProtectOutlined />,
          label: "Pelaporan Kecelakaan Kerja",
          onClick: () => navigate("/keselamatan/kecelakaan"),
        },
        {
          key: "/keselamatan/inspeksi",
          icon: <FireOutlined />,
          label: "Inspeksi K3",
          onClick: () => navigate("/keselamatan/inspeksi"),
        },
      ],
    },
    {
      key: "kesehatan",
      icon: <HeartOutlined style={{ fontSize: 16 }} />,
      label: "Kesehatan",
      children: [
        {
          key: "/kesehatan/penyakit",
          icon: <MedicineBoxOutlined />,
          label: "Penyakit",
          onClick: () => navigate("/kesehatan/penyakit"),
        },
        {
          key: "/kesehatan/konsultasi",
          icon: <AuditOutlined />,
          label: "Konsultasi Psikolog",
          onClick: () => navigate("/kesehatan/konsultasi"),
        },
      ],
    },
    {
      key: "media-informasi",
      icon: <NotificationOutlined style={{ fontSize: 16 }} />,
      label: "Media dan Informasi",
      children: [
        {
          key: "/media/pemberitahuan",
          icon: <BellOutlined />,
          label: "Pemberitahuan",
          onClick: () => navigate("/media/pemberitahuan"),
        },
        {
          key: "/media/edukasi",
          icon: <ReadOutlined />,
          label: "Edukasi K3",
          onClick: () => navigate("/media/edukasi"),
        },
        {
          key: "/media/flayer-poster",
          icon: <FileImageOutlined />,
          label: "Flayer & Poster",
          onClick: () => navigate("/media/flayer-poster"),
        },
      ],
    },
  ];

  // Helper active menu keys
  const getSelectedKeys = () => {
    const p = location.pathname;
    if (p === "/") return ["/"];
    if (p.startsWith("/keselamatan/bahaya-resiko")) return ["/keselamatan/bahaya-resiko"];
    if (p.startsWith("/keselamatan/hiradc")) return ["/keselamatan/hiradc"];
    if (p.startsWith("/keselamatan/investigasi")) return ["/keselamatan/investigasi"];
    if (p.startsWith("/keselamatan/kecelakaan")) return ["/keselamatan/kecelakaan"];
    if (p.startsWith("/keselamatan/inspeksi")) return ["/keselamatan/inspeksi"];
    if (p.startsWith("/kesehatan/penyakit")) return ["/kesehatan/penyakit"];
    if (p.startsWith("/kesehatan/konsultasi")) return ["/kesehatan/konsultasi"];
    if (p.startsWith("/media/pemberitahuan")) return ["/media/pemberitahuan"];
    if (p.startsWith("/media/edukasi")) return ["/media/edukasi"];
    if (p.startsWith("/media/flayer-poster")) return ["/media/flayer-poster"];
    return [p];
  };

  const getOpenKeys = () => {
    const p = location.pathname;
    if (p.startsWith("/keselamatan")) return ["keselamatan"];
    if (p.startsWith("/kesehatan")) return ["kesehatan"];
    if (p.startsWith("/media")) return ["media-informasi"];
    return ["keselamatan", "kesehatan", "media-informasi"];
  };

  const roleLabels: Record<string, string> = {
    admin: "Admin Prima K3 / Admin",
    tim_k3: "Tim K3 / Tim Keselamatan",
    kepala_unit: "Kepala Unit Kerja",
    pegawai: "Pegawai ANRI",
  };

  const userDropdownItems = [
    {
      key: "user-info",
      disabled: true,
      label: (
        <div>
          <Text strong>{user?.name || "Dr. Budi Santoso, M.K.K."}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {user?.unit || "Klinik Pratama ANRI"}
          </Text>
        </div>
      ),
    },
    { type: "divider" as const },
    {
      key: "switch-role-header",
      disabled: true,
      label: <Text type="secondary" style={{ fontSize: 11 }}>PILIH PERAN DEMO (RBAC):</Text>,
    },
    {
      key: "role-admin",
      icon: <SwapOutlined />,
      label: <span style={{ fontWeight: user?.role === "admin" ? 600 : "normal" }}>Admin (Akses Penuh)</span>,
      onClick: () => switchRole("admin"),
    },
    {
      key: "role-tim_k3",
      icon: <SwapOutlined />,
      label: <span style={{ fontWeight: user?.role === "tim_k3" ? 600 : "normal" }}>Tim K3 (Inspeksi & Tindakan)</span>,
      onClick: () => switchRole("tim_k3"),
    },
    {
      key: "role-kepala_unit",
      icon: <SwapOutlined />,
      label: <span style={{ fontWeight: user?.role === "kepala_unit" ? 600 : "normal" }}>Kepala Unit (Investigasi)</span>,
      onClick: () => switchRole("kepala_unit"),
    },
    {
      key: "role-pegawai",
      icon: <SwapOutlined />,
      label: <span style={{ fontWeight: user?.role === "pegawai" ? 600 : "normal" }}>Pegawai (Pelapor & Booking)</span>,
      onClick: () => switchRole("pegawai"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Keluar (Logout)",
      onClick: () => logout(),
    },
  ];

  return (
    <Layout hasSider style={{ minHeight: "100vh" }}>
      {/* Sidebar Desktop & Tablet - Ikut scroll bersama halaman & kotak memanjang sampai bawah */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        className="prima-sider"
        style={{
          background: "#f5f5f5",
          borderRight: "1px solid #e8e8e8",
          minHeight: "100%",
        }}
      >
        <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: collapsed ? "16px 8px" : "16px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
              gap: 8,
              borderBottom: "1px solid #e8e8e8",
              minHeight: 64,
            }}
          >
            {collapsed ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
                <img
                  src="/Logo-PrimaK3.png"
                  alt="Logo PRIMA K3"
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setCollapsed(false)}
                  title="Buka Sidebar"
                  style={{ fontSize: 16, width: 36, height: 36 }}
                />
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <img
                    src="/Logo-PrimaK3.png"
                    alt="Logo PRIMA K3"
                    style={{
                      width: 36,
                      height: 36,
                      objectFit: "contain",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden", minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      PRIMA K3
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      Klinik Pratama ANRI
                    </div>
                  </div>
                </div>

                <Button
                  type="text"
                  icon={<MenuFoldOutlined />}
                  onClick={() => setCollapsed(true)}
                  title="Tutup Sidebar"
                  style={{
                    fontSize: 16,
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    marginLeft: "auto",
                  }}
                />
              </>
            )}
          </div>

          <div style={{ flex: 1, padding: "12px 0", overflowY: "auto", overflowX: "hidden" }}>
            <Menu
              mode="inline"
              selectedKeys={getSelectedKeys()}
              defaultOpenKeys={getOpenKeys()}
              items={menuItems}
              style={{ background: "transparent", borderRight: "none" }}
            />
          </div>
        </div>
      </Sider>

      {/* Main Container */}
      <Layout
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Global Header - Ikut scroll bersama halaman */}
        <Header
          className="prima-header"
          style={{
            position: "relative",
            width: "100%",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            background: "#f5f5f5",
            borderBottom: "1px solid #e8e8e8",
            height: 64,
            boxSizing: "border-box",
          }}
        >
          {/* Header Left: Burger simpel & identitas untuk layout hp / zoom */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              className="mobile-burger-btn"
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setMobileDrawerOpen(true)}
              title="Menu Navigasi"
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            />

            <div className="mobile-header-brand" style={{ alignItems: "center", gap: 8 }}>
              <img
                src="/Logo-PrimaK3.png"
                alt="Logo PRIMA K3"
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937" }}>PRIMA K3</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>Klinik Pratama ANRI</div>
              </div>
            </div>
          </div>

          {/* Header Right Actions */}
          <Space direction="horizontal" size="large" style={{ flexShrink: 0 }}>
            {/* Emergency Button (Pil Putih) */}
            <Button
              className="emergency-btn"
              icon={<AlertOutlined />}
              onClick={() => setEmergencyModalOpen(true)}
            >
              EMERGENCY
            </Button>

            {/* User Profile & Role Switcher */}
            <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 8,
                  userSelect: "none",
                }}
              >
                <Avatar
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#8c8c8c", flexShrink: 0 }}
                />
                <div className="user-profile-info">
                  <Text strong style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                    {user?.name || "Dr. Budi Santoso, M.K.K."}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                    {roleLabels[user?.role || "admin"]}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* Breadcrumb & Main Content Area */}
        <Content
          style={{
            padding: "16px 24px 24px",
            minWidth: 0,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            flex: 1,
          }}
        >
          <Breadcrumb
            items={getBreadcrumbItems()}
            style={{
              marginBottom: 16,
              fontSize: 13,
              padding: "8px 16px",
              background: "#ffffff",
              borderRadius: 8,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          />

          <div style={{ minWidth: 0, width: "100%", maxWidth: "100%" }}>
            {children}
          </div>
        </Content>

        {/* Global Footer Kotak - Simpel & Elegan */}
        <Footer style={{ background: "transparent", padding: "0 24px 20px 24px" }}>
          <div
            className="prima-footer-box"
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/Logo-PrimaK3.png"
                alt="Logo PRIMA K3"
                style={{ width: 22, height: 22, objectFit: "contain" }}
              />
              <Text style={{ fontSize: 12, color: "#64748b" }}>
                © 2026 <strong style={{ color: "#334155", fontWeight: 600 }}>PRIMA K3</strong> • Klinik Pratama ANRI
              </Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#94a3b8" }}>
              <span>Arsip Nasional Republik Indonesia</span>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <span style={{ color: "#0d9488", fontWeight: 500 }}>V2.0</span>
            </div>
          </div>
        </Footer>
      </Layout>

      {/* Mobile Drawer Menu untuk layar HP / saat zoom */}
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{
          body: { padding: 0, background: "#f5f5f5" },
          header: { background: "#f5f5f5", borderBottom: "1px solid #e8e8e8" },
        }}
        width={280}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/Logo-PrimaK3.png"
              alt="Logo PRIMA K3"
              style={{ width: 34, height: 34, objectFit: "contain" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1f2937", lineHeight: 1.2 }}>
                PRIMA K3
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>
                Klinik Pratama ANRI
              </div>
            </div>
          </div>
        }
      >
        <div style={{ padding: "12px 0", height: "100%", overflowY: "auto" }}>
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            items={menuItems}
            onClick={() => setMobileDrawerOpen(false)}
            style={{ background: "transparent", borderRight: "none" }}
          />
        </div>
      </Drawer>

      {/* Emergency Modal */}
      <EmergencyModal
        open={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </Layout>
  );
};
