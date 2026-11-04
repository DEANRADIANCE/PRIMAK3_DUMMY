import React from "react";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { InvestigationStatus } from "../../../../types/investigation";

interface StatusTagProps {
  status: InvestigationStatus | string;
  style?: React.CSSProperties;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status, style }) => {
  switch (status) {
    case "Disahkan":
      return (
        <Tag
          color="success"
          icon={<CheckCircleOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, ...style }}
        >
          Disahkan
        </Tag>
      );
    case "Menunggu Pengesahan":
      return (
        <Tag
          color="gold"
          icon={<ClockCircleOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, ...style }}
        >
          Menunggu Pengesahan
        </Tag>
      );
    case "Dikembalikan":
      return (
        <Tag
          color="error"
          icon={<CloseCircleOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, ...style }}
        >
          Dikembalikan
        </Tag>
      );
    case "Draf":
    default:
      return (
        <Tag
          color="default"
          icon={<FileTextOutlined />}
          style={{ borderRadius: 6, fontWeight: 600, ...style }}
        >
          Draf
        </Tag>
      );
  }
};
