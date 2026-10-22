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
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
import { EmergencyModal } from "../common/EmergencyModal";
import { switchRole } from "../../providers/authProvider";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

interface CustomLayoutProps {
  children: React.ReactNode;
}

export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useGetIdentity<any>();
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
      {/* Sidebar Desktop & Tablet */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        collapsedWidth={80}
        className="prima-sider"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0,
          background: "#f5f5f5",
          borderRight: "1px solid #e8e8e8",
        }}
      >
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              padding: "20px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "#595959",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              K3
            </div>
            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#262626", lineHeight: 1.2 }}>
                  PRIMA K3
                </div>
                <div style={{ fontSize: 11, color: "#8c8c8c", whiteSpace: "nowrap" }}>
                  Klinik Pratama ANRI
                </div>
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
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
        {/* Global Header */}
        <Header
          className="prima-header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
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
          <Space direction="horizontal" size="middle" style={{ minWidth: 0 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, width: 40, height: 40 }}
            />

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#262626" }}>
                PRIMA K3
              </span>
              <span style={{ fontSize: 12, color: "#8c8c8c" }}>
                Klinik Pratama ANRI
              </span>
            </div>
          </Space>

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

        {/* Global Footer */}
        <Footer className="prima-footer">
          © 2026 Klinik Pratama ANRI – PRIMA K3. Hak Cipta Dilindungi Undang-Undang.
        </Footer>
      </Layout>

      {/* Emergency Modal */}
      <EmergencyModal
        open={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </Layout>
  );
};
