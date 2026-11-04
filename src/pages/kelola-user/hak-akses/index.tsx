import React from "react";
import { Typography } from "antd";
import { PermissionMatrix } from "../components/PermissionMatrix";

const { Title, Paragraph } = Typography;

export const RolePermissionsPage: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Halaman */}
      <div>
        <Title level={3} style={{ margin: "0 0 4px 0", color: "#111827", fontWeight: 700 }}>
          Hak Akses Peran
        </Title>
        <Paragraph type="secondary" style={{ margin: 0, fontSize: 14 }}>
          Atur hak akses per halaman (Keselamatan, Bahaya & Resiko, HIRADC, dll.) serta fitur operasional untuk setiap peran pengguna.
        </Paragraph>
      </div>

      {/* Tabel Matriks Hak Akses & Kontrol Simpan/Reset */}
      <PermissionMatrix />
    </div>
  );
};
