import React from "react";
import { Result, Button, Card } from "antd";
import { SafetyCertificateOutlined, DashboardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

export interface ForbiddenPageProps {
  title?: string;
  subTitle?: string;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  title = "403 - Akses Ditolak",
  subTitle = "Peran Anda saat ini tidak memiliki hak akses yang diperlukan untuk membuka halaman ini. Hubungi Admin Sistem jika Anda memerlukan izin tambahan.",
}) => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        maxWidth: 600,
        margin: "40px auto",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Result
        status="403"
        icon={<SafetyCertificateOutlined style={{ color: "#ef4444", fontSize: 64 }} />}
        title={title}
        subTitle={subTitle}
        extra={
          <Button
            type="primary"
            style={{ background: "#1f2937", borderColor: "#1f2937" }}
            icon={<DashboardOutlined />}
            onClick={() => navigate("/dashboard")}
          >
            Kembali ke Dashboard
          </Button>
        }
      />
    </Card>
  );
};
