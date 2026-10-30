import React from "react";
import { Typography, Space } from "antd";

const { Title, Text, Paragraph } = Typography;

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: action ? "row" : "column",
        justifyContent: "space-between",
        alignItems: action ? "flex-end" : align === "center" ? "center" : "flex-start",
        textAlign: align,
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 32,
        ...style,
      }}
    >
      <div style={{ maxWidth: action ? 800 : align === "center" ? 720 : "100%" }}>
        {eyebrow && (
          <div style={{ marginBottom: 8 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "#0f766e",
                background: "#f0fdfa",
                padding: "3px 10px",
                borderRadius: 999,
                border: "1px solid #ccfbf1",
              }}
            >
              {eyebrow}
            </span>
          </div>
        )}
        <Title
          level={2}
          style={{
            margin: 0,
            fontSize: "clamp(22px, 3.2vw, 32px)",
            fontWeight: 700,
            color: "#1e293b",
            lineHeight: 1.25,
          }}
        >
          {title}
        </Title>
        {subtitle && (
          <Paragraph
            style={{
              marginTop: 10,
              marginBottom: 0,
              fontSize: 15,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Paragraph>
        )}
      </div>

      {action && (
        <div style={{ flexShrink: 0, marginBottom: 4 }}>
          {action}
        </div>
      )}
    </div>
  );
};
