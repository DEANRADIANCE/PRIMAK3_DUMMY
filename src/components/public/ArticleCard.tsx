import React from "react";
import { Card, Tag, Typography } from "antd";
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router";
import dayjs from "dayjs";
import { Article } from "../../types/public";

const { Title, Paragraph, Text } = Typography;

interface ArticleCardProps {
  article: Article;
  style?: React.CSSProperties;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, style }) => {
  const navigate = useNavigate();

  // Helper warna badge kategori
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "ergonomi":
        return { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" };
      case "kesehatan mental":
        return { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe" };
      case "tanggap darurat":
        return { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" };
      default:
        return { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" };
    }
  };

  const badgeTheme = getCategoryColor(article.category);
  const formattedDate = dayjs(article.published_at).format("D MMMM YYYY");

  const handleCardClick = () => {
    navigate(`/berita/${article.slug}`);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  return (
    <Card
      hoverable
      className="pub-hover-card"
      onClick={handleCardClick}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        cursor: "pointer",
        ...style,
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "20px 20px 18px 20px",
      }}
      cover={
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9 ratio
            overflow: "hidden",
            backgroundColor: "#f1f5f9",
          }}
        >
          <img
            className="pub-zoom-image"
            src={article.thumbnail_url || "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80"}
            alt={article.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>
      }
    >
      {/* Category Tag */}
      <div style={{ marginBottom: 10 }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            fontWeight: 600,
            padding: "2px 10px",
            borderRadius: 6,
            backgroundColor: badgeTheme.bg,
            color: badgeTheme.text,
            border: `1px solid ${badgeTheme.border}`,
          }}
        >
          {article.category}
        </span>
      </div>

      {/* Article Title */}
      <Title
        level={4}
        style={{
          margin: 0,
          marginBottom: 8,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.4,
          color: "#1e293b",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        <Link
          to={`/berita/${article.slug}`}
          onClick={(e) => e.stopPropagation()}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {article.title}
        </Link>
      </Title>

      {/* Excerpt - 2 lines ellipsis */}
      <Paragraph
        style={{
          marginBottom: 16,
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          flex: 1,
        }}
      >
        {article.excerpt}
      </Paragraph>

      {/* Footer: Date & Read Link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 12,
          borderTop: "1px solid #f1f5f9",
          marginTop: "auto",
        }}
      >
        <Text style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
          <CalendarOutlined style={{ fontSize: 13 }} />
          {formattedDate}
        </Text>

        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#0f766e",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Baca <ArrowRightOutlined style={{ fontSize: 12 }} />
        </span>
      </div>
    </Card>
  );
};
