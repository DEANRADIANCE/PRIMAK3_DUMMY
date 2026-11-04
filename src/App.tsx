import { Refine, Authenticated, CanAccess } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider, ErrorComponent } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { App as AntdApp, ConfigProvider, Spin } from "antd";
import idID from "antd/locale/id_ID";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router";
import routerProvider, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";

import {
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
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

// Providers
import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { dataProvider } from "./providers/dataProvider";

// Layout
import { CustomLayout } from "./components/layout/CustomLayout";
import { PublicLayout } from "./components/public";

// Public Pages
import { LandingPage } from "./pages/public/landing";
import { BeritaListPage } from "./pages/public/berita";
import { BeritaDetailPage } from "./pages/public/berita/detail";
import { PosterListPage } from "./pages/public/poster";

// Pages
import { LoginPage } from "./pages/login";
import { DashboardPage } from "./pages/dashboard";
// Keselamatan
import { HazardReportList } from "./pages/keselamatan/bahaya-resiko/list";
import { HazardReportCreate } from "./pages/keselamatan/bahaya-resiko/create";
import { HazardReportShow } from "./pages/keselamatan/bahaya-resiko/show";
import { HazardReportEdit } from "./pages/keselamatan/bahaya-resiko/edit";
import { HiradcList } from "./pages/keselamatan/hiradc/list";
import { HiradcCreate } from "./pages/keselamatan/hiradc/create";
import { HiradcShow } from "./pages/keselamatan/hiradc/show";
import { HiradcEdit } from "./pages/keselamatan/hiradc/edit";
import { InvestigationList } from "./pages/keselamatan/investigasi/list";
import { InvestigationCreate } from "./pages/keselamatan/investigasi/create";
import { InvestigationEdit } from "./pages/keselamatan/investigasi/edit";
import { InvestigationShow } from "./pages/keselamatan/investigasi/show";
import { AccidentReportList } from "./pages/keselamatan/kecelakaan-kerja/list";
import { AccidentReportCreate } from "./pages/keselamatan/kecelakaan-kerja/create";
import { AccidentReportShow } from "./pages/keselamatan/kecelakaan-kerja/show";
import { AccidentReportEdit } from "./pages/keselamatan/kecelakaan-kerja/edit";
import { InspectionList } from "./pages/keselamatan/inspeksi/list";
import { InspectionCreate } from "./pages/keselamatan/inspeksi/create";
import { InspectionShow } from "./pages/keselamatan/inspeksi/show";
// Kesehatan
import { DiseasePage } from "./pages/kesehatan/penyakit";
import { PsychologistList } from "./pages/kesehatan/konsultasi-psikolog/list";
import { PsychologistCreate } from "./pages/kesehatan/konsultasi-psikolog/create";
// Media & Informasi
import { AnnouncementList } from "./pages/media-informasi/pemberitahuan/list";
import { AnnouncementCreate } from "./pages/media-informasi/pemberitahuan/create";
import { AnnouncementShow } from "./pages/media-informasi/pemberitahuan/show";
import { AnnouncementEdit } from "./pages/media-informasi/pemberitahuan/edit";
import { EdukasiPage } from "./pages/media/edukasi";
import { ProfilePage } from "./pages/profile";
// Kelola User
import {
  UserListPage,
  RolePermissionsPage,
  ForbiddenPage,
} from "./pages/kelola-user";

// Ant Design theme
const theme = {
  token: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorPrimary: "#595959",
    colorBgLayout: "#f0f2f5",
    colorBgContainer: "#ffffff",
    borderRadius: 8,
    borderRadiusLG: 12,
    colorText: "#333333",
    colorTextSecondary: "#666666",
    fontSize: 14,
  },
  components: {
    Menu: {
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 2,
    },
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 6,
    },
    Table: {
      borderRadius: 8,
    },
  },
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={theme} locale={idID}>
          <AntdApp>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  meta: {
                    label: "Dashboard",
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: "edukasi",
                  list: "/berita",
                  show: "/berita/:slug",
                  meta: {
                    label: "Edukasi K3",
                    hide: true,
                  },
                },
                {
                  name: "poster",
                  list: "/poster",
                  meta: {
                    label: "Poster K3",
                    hide: true,
                  },
                },
                {
                  name: "keselamatan",
                  meta: {
                    label: "Keselamatan",
                    icon: <MedicineBoxOutlined />,
                  },
                },
                {
                  name: "hazard-reports",
                  list: "/keselamatan/bahaya-resiko",
                  create: "/keselamatan/bahaya-resiko/create",
                  edit: "/keselamatan/bahaya-resiko/edit/:id",
                  show: "/keselamatan/bahaya-resiko/show/:id",
                  meta: {
                    label: "Bahaya dan Resiko",
                    parent: "keselamatan",
                    icon: <WarningOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "hazard-categories",
                  meta: {
                    label: "Kategori Bahaya",
                    parent: "keselamatan",
                    hide: true,
                    canDelete: true,
                  },
                },
                {
                  name: "hiradc",
                  list: "/keselamatan/hiradc",
                  create: "/keselamatan/hiradc/create",
                  edit: "/keselamatan/hiradc/edit/:id",
                  show: "/keselamatan/hiradc/show/:id",
                  meta: {
                    label: "HIRADC",
                    parent: "keselamatan",
                    icon: <SafetyCertificateOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "investigations",
                  list: "/keselamatan/investigasi",
                  create: "/keselamatan/investigasi/create",
                  edit: "/keselamatan/investigasi/edit/:id",
                  show: "/keselamatan/investigasi/show/:id",
                  meta: {
                    label: "Investigasi",
                    parent: "keselamatan",
                    icon: <SearchOutlined />,
                  },
                },
                {
                  name: "accident-reports",
                  list: "/keselamatan/kecelakaan",
                  create: "/keselamatan/kecelakaan/create",
                  edit: "/keselamatan/kecelakaan/edit/:id",
                  show: "/keselamatan/kecelakaan/show/:id",
                  meta: {
                    label: "Pelaporan Kecelakaan Kerja",
                    parent: "keselamatan",
                    icon: <FileProtectOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "inspections",
                  list: "/keselamatan/inspeksi",
                  create: "/keselamatan/inspeksi/create",
                  show: "/keselamatan/inspeksi/show/:id",
                  meta: {
                    label: "Inspeksi K3",
                    parent: "keselamatan",
                    icon: <FireOutlined />,
                  },
                },
                {
                  name: "kesehatan",
                  meta: {
                    label: "Kesehatan",
                    icon: <HeartOutlined />,
                  },
                },
                {
                  name: "diseases",
                  list: "/kesehatan/penyakit",
                  meta: {
                    label: "Penyakit",
                    parent: "kesehatan",
                    icon: <MedicineBoxOutlined />,
                  },
                },
                {
                  name: "psychologist-bookings",
                  list: "/kesehatan/konsultasi",
                  create: "/kesehatan/konsultasi/create",
                  meta: {
                    label: "Konsultasi Psikolog",
                    parent: "kesehatan",
                    icon: <HeartOutlined />,
                  },
                },
                {
                  name: "media-informasi",
                  meta: {
                    label: "Media dan Informasi",
                    icon: <NotificationOutlined />,
                  },
                },
                {
                  name: "announcements",
                  list: "/media/pemberitahuan",
                  create: "/media/pemberitahuan/create",
                  edit: "/media/pemberitahuan/edit/:id",
                  show: "/media/pemberitahuan/show/:id",
                  meta: {
                    label: "Pemberitahuan",
                    parent: "media-informasi",
                    icon: <BellOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "articles",
                  list: "/media/edukasi",
                  meta: {
                    label: "Edukasi",
                    parent: "media-informasi",
                    icon: <ReadOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "posters",
                  meta: {
                    label: "Poster",
                    parent: "media-informasi",
                    icon: <FileImageOutlined />,
                    canDelete: true,
                    hide: true,
                  },
                },
                {
                  name: "kelola-user",
                  meta: {
                    label: "Kelola User",
                    icon: <TeamOutlined />,
                  },
                },
                {
                  name: "kelola-user-pengguna",
                  list: "/kelola-user/pengguna",
                  meta: {
                    label: "Manajemen Pengguna",
                    parent: "kelola-user",
                    icon: <UserAddOutlined />,
                  },
                },
                {
                  name: "kelola-user-hak-akses",
                  list: "/kelola-user/hak-akses",
                  meta: {
                    label: "Hak Akses User",
                    parent: "kelola-user",
                    icon: <SafetyCertificateOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "4BnHEe-xfFofG-OV2Om5",
                title: {
                  text: "PRIMA K3",
                  icon: (
                    <img
                      src="/Logo-PrimaK3.png"
                      alt="Logo PRIMA K3"
                      style={{ width: 26, height: 26, objectFit: "contain", verticalAlign: "middle" }}
                    />
                  ),
                },
              }}
            >
              <Routes>
                {/* Authenticated routes */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                      loading={
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5" }}>
                          <Spin size="large" tip="Memuat PRIMA K3..." />
                        </div>
                      }
                    >
                      <CustomLayout>
                        <Outlet />
                      </CustomLayout>
                    </Authenticated>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Keselamatan */}
                  <Route path="/keselamatan/bahaya-resiko">
                    <Route index element={<HazardReportList />} />
                    <Route path="create" element={<HazardReportCreate />} />
                    <Route path="show/:id" element={<HazardReportShow />} />
                    <Route path="edit/:id" element={<HazardReportEdit />} />
                  </Route>
                  <Route path="/keselamatan/hiradc">
                    <Route index element={<HiradcList />} />
                    <Route path="create" element={<HiradcCreate />} />
                    <Route path="show/:id" element={<HiradcShow />} />
                    <Route path="edit/:id" element={<HiradcEdit />} />
                  </Route>
                  <Route path="/keselamatan/investigasi">
                    <Route index element={<InvestigationList />} />
                    <Route path="create" element={<InvestigationCreate />} />
                    <Route path="edit/:id" element={<InvestigationEdit />} />
                    <Route path="show/:id" element={<InvestigationShow />} />
                  </Route>
                  <Route path="/keselamatan/kecelakaan">
                    <Route index element={<AccidentReportList />} />
                    <Route path="create" element={<AccidentReportCreate />} />
                    <Route path="show/:id" element={<AccidentReportShow />} />
                    <Route path="edit/:id" element={<AccidentReportEdit />} />
                  </Route>
                  <Route path="/keselamatan/inspeksi">
                    <Route index element={<InspectionList />} />
                    <Route path="create" element={<InspectionCreate />} />
                    <Route path="show/:id" element={<InspectionShow />} />
                  </Route>

                  {/* Kesehatan */}
                  <Route path="/kesehatan/penyakit" element={<DiseasePage />} />
                  <Route path="/kesehatan/konsultasi">
                    <Route index element={<PsychologistList />} />
                    <Route path="create" element={<PsychologistCreate />} />
                  </Route>

                  {/* Media & Informasi */}
                  <Route path="/media/pemberitahuan">
                    <Route index element={<AnnouncementList />} />
                    <Route path="create" element={<AnnouncementCreate />} />
                    <Route path="show/:id" element={<AnnouncementShow />} />
                    <Route path="edit/:id" element={<AnnouncementEdit />} />
                  </Route>
                  <Route path="/media/edukasi">
                    <Route index element={<EdukasiPage />} />
                    <Route path="create" element={<Navigate to="/media/edukasi?tab=edukasi" replace />} />
                    <Route path="show/:id" element={<Navigate to="/media/edukasi?tab=edukasi" replace />} />
                    <Route path="edit/:id" element={<Navigate to="/media/edukasi?tab=edukasi" replace />} />
                  </Route>
                  <Route path="/media/flayer-poster" element={<Navigate to="/media/edukasi?tab=poster" replace />} />
                  <Route path="/media/flayer-poster/*" element={<Navigate to="/media/edukasi?tab=poster" replace />} />

                  {/* Profil Pengguna */}
                  <Route path="/profil" element={<ProfilePage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Kelola User */}
                  <Route
                    path="/kelola-user/pengguna"
                    element={
                      <CanAccess
                        resource="kelola-user-pengguna"
                        action="list"
                        fallback={<ForbiddenPage />}
                      >
                        <UserListPage />
                      </CanAccess>
                    }
                  />
                  <Route
                    path="/kelola-user/hak-akses"
                    element={
                      <CanAccess
                        resource="kelola-user-hak-akses"
                        action="list"
                        fallback={<ForbiddenPage />}
                      >
                        <RolePermissionsPage />
                      </CanAccess>
                    }
                  />

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                {/* Halaman Publik (TIDAK dibungkus Authenticated) */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/berita" element={<BeritaListPage />} />
                  <Route path="/berita/:slug" element={<BeritaDetailPage />} />
                  <Route path="/poster" element={<PosterListPage />} />
                </Route>

                {/* Login route */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<LoginPage />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
