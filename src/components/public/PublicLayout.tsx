import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { notification } from "antd";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import { useScrollReveal } from "../../pages/public/useScrollReveal";
import "../../pages/public/public.css";

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  // Aktifkan animasi scroll observer untuk seluruh halaman publik
  useScrollReveal([location.pathname, location.search]);

  // Seret ke paling atas saat berpindah rute publik (kecuali jika ada hash target seperti #tujuan-aplikasi)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [location.pathname]);

  useEffect(() => {
    const isLogoutSuccess = sessionStorage.getItem("prima_logout_success");
    if (isLogoutSuccess) {
      sessionStorage.removeItem("prima_logout_success");
      notification.success({
        message: "Logout Berhasil",
        description: "Anda telah keluar dari sistem PRIMA K3.",
        placement: "topRight",
        duration: 3.5,
      });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <PublicNavbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
