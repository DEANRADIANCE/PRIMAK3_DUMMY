import React from "react";
import { Tag } from "antd";
import { UserStatus } from "../../../types/userManagement";

interface StatusTagProps {
  status: UserStatus | string;
  style?: React.CSSProperties;
}

export const STATUS_CONFIG: Record<
  UserStatus,
  { color: string; label: string }
> = {
  Aktif: {
    color: "success",
    label: "Aktif",
  },
  "Undangan terkirim": {
    color: "warning",
    label: "Undangan terkirim",
  },
  Nonaktif: {
    color: "default",
    label: "Nonaktif",
  },
};

export const StatusTag: React.FC<StatusTagProps> = ({ status, style }) => {
  const config = STATUS_CONFIG[status as UserStatus] || {
    color: "default",
    label: status,
  };

  return (
    <Tag
      color={config.color}
      style={{
        borderRadius: 6,
        fontWeight: 500,
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
