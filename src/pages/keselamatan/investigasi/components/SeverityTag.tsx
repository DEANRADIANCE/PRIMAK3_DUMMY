import React from "react";
import { Tag } from "antd";
import { IncidentSeverity } from "../../../../types/investigation";

interface SeverityTagProps {
  severity: IncidentSeverity | string;
  style?: React.CSSProperties;
}

export const SeverityTag: React.FC<SeverityTagProps> = ({ severity, style }) => {
  switch (severity) {
    case "Fatal":
      return (
        <Tag color="magenta" style={{ borderRadius: 6, fontWeight: 700, ...style }}>
          Fatal
        </Tag>
      );
    case "Berat":
      return (
        <Tag color="volcano" style={{ borderRadius: 6, fontWeight: 600, ...style }}>
          Berat
        </Tag>
      );
    case "Sedang":
      return (
        <Tag color="orange" style={{ borderRadius: 6, fontWeight: 600, ...style }}>
          Sedang
        </Tag>
      );
    case "Ringan":
    default:
      return (
        <Tag color="blue" style={{ borderRadius: 6, fontWeight: 500, ...style }}>
          Ringan
        </Tag>
      );
  }
};
