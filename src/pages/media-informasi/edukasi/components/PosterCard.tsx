import React from "react";
import { Card, Tag, Typography, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  UndoOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { IPoster } from "../../../../types/poster";

const { Text, Title } = Typography;

interface PosterCardProps {
  poster: IPoster;
  onEdit: (poster: IPoster) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (poster: IPoster) => void;
  animationDelayIndex?: number;
}

export const PosterCard: React.FC<PosterCardProps> = ({
  poster,
  onEdit,
  onDelete,
  onToggleStatus,
  animationDelayIndex = 1,
}) => {
  const status = poster.status || "Tayang";
  const formattedDate = poster.createdAt
    ? dayjs(poster.createdAt).format("DD/MM/YYYY")
    : dayjs().format("DD/MM/YYYY");

  const renderStatusTag = () => {
    switch (status) {
      case "Tayang":
        return (
          <Tag
            color="success"
            style={{
              borderRadius: 20,
              fontWeight: 700,
              padding: "2px 10px",
              border: "none",
              boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CheckCircleOutlined /> Tayang
          </Tag>
        );
      case "Diarsipkan":
        return (
          <Tag
            color="warning"
            style={{
              borderRadius: 20,
              fontWeight: 700,
              padding: "2px 10px",
              border: "none",
              boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Diarsipkan
          </Tag>
        );
      case "Draf":
      default:
        return (
          <Tag
            style={{
              borderRadius: 20,
              fontWeight: 700,
              padding: "2px 10px",
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Draf
          </Tag>
        );
    }
  };

  const renderActionButton = () => {
    if (status === "Diarsipkan") {
      return (
        <Button
          size="small"
          icon={<UndoOutlined />}
          onClick={() => onToggleStatus(poster)}
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            borderColor: "#0284c7",
            color: "#0284c7",
            borderRadius: 6,
          }}
        >
          Pulihkan
        </Button>
      );
    }
    if (status === "Tayang") {
      return (
        <Button
          size="small"
          icon={<PauseCircleOutlined />}
          onClick={() => onToggleStatus(poster)}
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            color: "#d97706",
            borderColor: "#fde68a",
            backgroundColor: "#fffbeb",
            borderRadius: 6,
          }}
        >
          Jeda
        </Button>
      );
    }
    // Draf / dijeda -> Tayangkan
    return (
      <Button
        size="small"
        icon={<PlayCircleOutlined />}
        type="primary"
        onClick={() => onToggleStatus(poster)}
        style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 600,
          background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
          border: "none",
          boxShadow: "0 2px 6px rgba(13, 148, 136, 0.3)",
          borderRadius: 6,
        }}
      >
        Tayangkan
      </Button>
    );
  };

  const imageUrl =
    poster.image ||
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80";

  return (
    <Card
      className={`media-content-card media-card-animate media-delay-${animationDelayIndex}`}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      bodyStyle={{
        padding: 14,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
        gap: 12,
      }}
      cover={
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            maxHeight: 220,
            overflow: "hidden",
            backgroundColor: "#f8fafc",
          }}
        >
          <img
            alt={poster.title}
            src={imageUrl}
            className="media-card-img"
          />
          {poster.category && (
            <div style={{ position: "absolute", bottom: 8, left: 8, zIndex: 2 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "rgba(15, 23, 42, 0.75)",
                  backdropFilter: "blur(4px)",
                  padding: "2px 8px",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {poster.category}
              </span>
            </div>
          )}
        </div>
      }
    >
      {/* Title + Date on left, Status Tag on right */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <Title
            level={5}
            ellipsis={{ rows: 2 }}
            style={{
              margin: 0,
              fontSize: 13.5,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.35,
              flex: 1,
            }}
            title={poster.title}
          >
            {poster.title}
          </Title>
          <div style={{ flexShrink: 0 }}>{renderStatusTag()}</div>
        </div>

        <Text type="secondary" style={{ fontSize: 11.5 }}>
          {formattedDate}
        </Text>
      </div>

      {/* Action Buttons: Edit, Jeda/Tayangkan/Pulihkan, Delete icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingTop: 8,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(poster)}
          style={{
            flex: 1,
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 6,
            borderColor: "#cbd5e1",
          }}
        >
          Edit
        </Button>

        {renderActionButton()}

        <Popconfirm
          title="Hapus poster ini?"
          description="Apakah Anda yakin ingin menghapus materi poster ini?"
          okText="Hapus"
          cancelText="Batal"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(poster.id)}
        >
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            style={{ minWidth: 32, padding: "0 6px", borderRadius: 6 }}
          />
        </Popconfirm>
      </div>
    </Card>
  );
};
