import { Refine, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider, ErrorComponent } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { App as AntdApp, ConfigProvider, Spin } from "antd";
import idID from "antd/locale/id_ID";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
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
} from "@ant-design/icons";

// Providers
import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { dataProvider } from "./providers/dataProvider";

// Layout
import { CustomLayout } from "./components/layout/CustomLayout";

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
import { ArticleList } from "./pages/media-informasi/edukasi/list";
import { ArticleCreate } from "./pages/media-informasi/edukasi/create";
import { ArticleShow } from "./pages/media-informasi/edukasi/show";
import { ArticleEdit } from "./pages/media-informasi/edukasi/edit";
import { PosterList } from "./pages/media-informasi/flayer-poster/list";
import { PosterCreate } from "./pages/media-informasi/flayer-poster/create";
import { PosterShow } from "./pages/media-informasi/flayer-poster/show";
import { ProfilePage } from "./pages/profile";

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
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <DashboardOutlined />,
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
                  create: "/media/edukasi/create",
                  edit: "/media/edukasi/edit/:id",
                  show: "/media/edukasi/show/:id",
                  meta: {
                    label: "Edukasi K3",
                    parent: "media-informasi",
                    icon: <ReadOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "posters",
                  list: "/media/flayer-poster",
                  create: "/media/flayer-poster/create",
                  show: "/media/flayer-poster/show/:id",
                  meta: {
                    label: "Flayer & Poster",
                    parent: "media-informasi",
                    icon: <FileImageOutlined />,
                    canDelete: true,
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
                  <Route index element={<DashboardPage />} />

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
                    <Route index element={<ArticleList />} />
                    <Route path="create" element={<ArticleCreate />} />
                    <Route path="show/:id" element={<ArticleShow />} />
                    <Route path="edit/:id" element={<ArticleEdit />} />
                  </Route>
                  <Route path="/media/flayer-poster">
                    <Route index element={<PosterList />} />
                    <Route path="create" element={<PosterCreate />} />
                    <Route path="show/:id" element={<PosterShow />} />
                  </Route>

                  {/* Profil Pengguna */}
                  <Route path="/profil" element={<ProfilePage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  <Route path="*" element={<ErrorComponent />} />
                </Route>

                {/* Public routes */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
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
