import React from "react";
import { Card, Tag, Typography, Dropdown, MenuProps, Popconfirm } from "antd";
import {
  MoreOutlined,
  EditOutlined,
  SendOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { IArticle } from "../../../../types/article";

const { Paragraph, Title } = Typography;

interface EdukasiCardProps {
  article: IArticle;
  onEdit: (article: IArticle) => void;
  onDelete: (id: number) => void;
  onStatusChange: (article: IArticle, newStatus: string) => void;
  onSchedule?: (article: IArticle) => void;
  animationDelayIndex?: number;
}

export const EdukasiCard: React.FC<EdukasiCardProps> = ({
  article,
  onEdit,
  onDelete,
  onStatusChange,
  onSchedule,
  animationDelayIndex = 1,
}) => {
  const status = article.status || (article.isPublished ? "Terbit" : "Draf");

  const renderStatusTag = () => {
    switch (status) {
      case "Terbit":
        return (
          <Tag
            color="success"
            style={{
              fontWeight: 700,
              borderRadius: 20,
              padding: "2px 10px",
              boxShadow: "0 2px 6px rgba(16, 185, 129, 0.35)",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CheckCircleOutlined /> Terbit
          </Tag>
        );
      case "Dijadwalkan":
        return (
          <Tag
            color="processing"
            style={{
              fontWeight: 700,
              borderRadius: 20,
              padding: "2px 10px",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.35)",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ClockCircleOutlined /> Dijadwalkan
          </Tag>
        );
      case "Draf":
      default:
        return (
          <Tag
            style={{
              fontWeight: 700,
              borderRadius: 20,
              padding: "2px 10px",
              background: "rgba(15, 23, 42, 0.75)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FileTextOutlined /> Draf
          </Tag>
        );
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined style={{ color: "#0d9488" }} />,
      label: <span style={{ fontWeight: 600 }}>Ubah Konten</span>,
      onClick: (info) => {
        info.domEvent.stopPropagation();
        onEdit(article);
      },
    },
    status === "Terbit"
      ? {
          key: "unpublish",
          icon: <EyeInvisibleOutlined style={{ color: "#ea580c" }} />,
          label: "Tarik dari tayang",
          onClick: (info) => {
            info.domEvent.stopPropagation();
            onStatusChange(article, "Draf");
          },
        }
      : {
          key: "publish",
          icon: <SendOutlined style={{ color: "#10b981" }} />,
          label: "Terbitkan Sekarang",
          onClick: (info) => {
            info.domEvent.stopPropagation();
            onStatusChange(article, "Terbit");
          },
        },
    ...(status !== "Dijadwalkan"
      ? [
          {
            key: "schedule",
            icon: <ClockCircleOutlined style={{ color: "#0284c7" }} />,
            label: "Jadwalkan Publikasi",
            onClick: (info: any) => {
              info.domEvent.stopPropagation();
              if (onSchedule) {
                onSchedule(article);
              } else {
                onStatusChange(article, "Dijadwalkan");
              }
            },
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: "delete",
      danger: true,
      label: (
        <Popconfirm
          title="Hapus artikel edukasi?"
          description="Apakah Anda yakin ingin menghapus artikel ini?"
          okText="Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true }}
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete(article.id);
          }}
          onCancel={(e) => e?.stopPropagation()}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff4d4f" }}
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteOutlined />
            <span>Hapus</span>
          </div>
        </Popconfirm>
      ),
    },
  ];

  const coverUrl =
    article.image ||
    "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80";

  return (
    <Card
      hoverable
      onClick={() => onEdit(article)}
      className={`media-content-card media-card-animate media-delay-${animationDelayIndex}`}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      bodyStyle={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
        gap: 12,
      }}
      cover={
        <div style={{ position: "relative", width: "100%", height: 165, overflow: "hidden", backgroundColor: "#f1f5f9" }}>
          <img
            alt={article.title}
            src={coverUrl}
            className="media-card-img"
          />
          {/* Subtle gradient vignette */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 52,
              background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.6), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Status Tag top-left */}
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
            {renderStatusTag()}
          </div>

          {/* Three dots menu top-right */}
          <div
            style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <button
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  color: "#334155",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.color = "#0d9488";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <MoreOutlined style={{ fontSize: 16, fontWeight: 700 }} />
              </button>
            </Dropdown>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <Title
          level={5}
          ellipsis={{ rows: 2 }}
          style={{
            margin: 0,
            fontSize: 14.5,
            fontWeight: 700,
            lineHeight: 1.35,
            color: "#0f172a",
          }}
          title={article.title}
        >
          {article.title}
        </Title>

        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{
            margin: 0,
            fontSize: 12.5,
            color: "#64748b",
            lineHeight: 1.5,
          }}
        >
          {article.summary || article.content?.slice(0, 120)}
        </Paragraph>
      </div>

      {/* Card Footer: Category tag & Author */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          borderTop: "1px solid #f1f5f9",
          marginTop: "auto",
        }}
      >
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: "#0d9488",
            backgroundColor: "#f0fdfa",
            border: "1px solid #ccfbf1",
            padding: "2px 8px",
            borderRadius: 6,
          }}
        >
          {typeof article.category === "object" ? article.category.name : article.category || "Umum K3"}
        </span>

        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          {article.author || "Tim K3 ANRI"}
        </span>
      </div>
    </Card>
  );
};
