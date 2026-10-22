import React from "react";
import { Card, Typography, Space } from "antd";

const { Text, Title } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  color?: string;
  tagColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  suffix,
  icon,
  subtitle,
  color = "#262626",
}) => {
  return (
    <Card
      className="stat-card"
      bordered={false}
      style={{
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
            {title}
          </Text>
          <div style={{ marginTop: 8, display: "flex", alignItems: "baseline" }}>
            <Title level={2} style={{ margin: 0, color, fontWeight: 700 }}>
              {value}
            </Title>
            {suffix && (
              <Text style={{ marginLeft: 6, fontSize: 14, color: "#8c8c8c" }}>
                {suffix}
              </Text>
            )}
          </div>
          {subtitle && (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              {subtitle}
            </Text>
          )}
        </div>
        {icon && (
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
