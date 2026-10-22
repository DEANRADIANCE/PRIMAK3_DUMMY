import React from "react";
import { Tag } from "antd";
import { RiskLevel } from "../../types/hiradc";

interface RiskBadgeProps {
  level: RiskLevel | string;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const normalizedLevel = String(level).toLowerCase();

  let color = "default";
  let label = "Tidak Diketahui";

  switch (normalizedLevel) {
    case "low":
    case "rendah":
      color = "success";
      label = "Rendah";
      break;
    case "medium":
    case "sedang":
      color = "warning";
      label = "Sedang";
      break;
    case "high":
    case "tinggi":
      color = "orange";
      label = "Tinggi";
      break;
    case "extreme":
    case "ekstrem":
      color = "error";
      label = "Ekstrem";
      break;
  }

  return (
    <Tag color={color} style={{ fontWeight: 600, padding: "2px 8px" }}>
      {label} {score !== undefined ? `(${score})` : ""}
    </Tag>
  );
};
