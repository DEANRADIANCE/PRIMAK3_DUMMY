import React from "react";
import { Tag } from "antd";
import { SystemRole } from "../../../types/userManagement";

interface RoleTagProps {
  role: SystemRole | string;
  style?: React.CSSProperties;
}

export const ROLE_CONFIG: Record<
  SystemRole,
  { color: string; label: string; bg?: string; text?: string; border?: string }
> = {
  "Super Admin": {
    color: "red",
    label: "Super Admin",
    bg: "#fef2f2",
    text: "#b91c1c",
    border: "#fca5a5",
  },
  Pegawai: {
    color: "default",
    label: "Pegawai",
    bg: "#f3f4f6",
    text: "#4b5563",
    border: "#d1d5db",
  },
  "Pimpinan Unit Kerja": {
    color: "blue",
    label: "Pimpinan Unit Kerja",
    bg: "#eff6ff",
    text: "#1d4ed8",
    border: "#93c5fd",
  },
  "Kepala Biro KU": {
    color: "purple",
    label: "Kepala Biro KU",
    bg: "#f5f3ff",
    text: "#6d28d9",
    border: "#c4b5fd",
  },
  "Pengelola K3": {
    color: "green",
    label: "Pengelola K3",
    bg: "#f0fdf4",
    text: "#15803d",
    border: "#86efac",
  },
  Psikolog: {
    color: "gold",
    label: "Psikolog",
    bg: "#fefce8",
    text: "#a16207",
    border: "#fde047",
  },
  "Admin Sistem": {
    color: "orange",
    label: "Admin Sistem",
    bg: "#fff7ed",
    text: "#c2410c",
    border: "#fdba74",
  },
};

export const RoleTag: React.FC<RoleTagProps> = ({ role, style }) => {
  const config = ROLE_CONFIG[role as SystemRole] || {
    color: "default",
    label: role,
    bg: "#f3f4f6",
    text: "#4b5563",
    border: "#d1d5db",
  };

  return (
    <Tag
      color={config.color}
      style={{
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 12,
        padding: "2px 8px",
        margin: 0,
        ...style,
      }}
    >
      {config.label}
    </Tag>
  );
};
