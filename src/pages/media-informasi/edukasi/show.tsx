import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Image,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import { IArticle } from "../../../types/article";

const { Title, Text, Paragraph } = Typography;

export const ArticleShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { query } = useOne<IArticle>({
    resource: "articles",
    id: id || "1",
  });

  const article = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !article) return <Card loading={true} />;

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/edukasi")}>
          Kembali ke Daftar Edukasi
        </Button>

        {canEdit && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate(`/media/edukasi/edit/${article.id}`)}
          >
            Ubah Artikel
          </Button>
        )}
      </div>

      <Card
        bordered={false}
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Tag color="cyan" style={{ fontSize: 13, marginBottom: 12 }}>
          {article.category?.name || "Kategori K3"}
        </Tag>

        <Title level={2} style={{ margin: "0 0 12px", lineHeight: 1.3 }}>
          {article.title}
        </Title>

        <div style={{ display: "flex", gap: 16, color: "#8c8c8c", fontSize: 13, marginBottom: 24 }}>
          <span>
            <UserOutlined /> Penulis: <strong>{article.author}</strong>
          </span>
          <span>
            <CalendarOutlined /> {article.createdAt?.substring(0, 10)}
          </span>
        </div>

        {article.image && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <Image
              src={article.image}
              alt={article.title}
              style={{ maxHeight: 380, width: "100%", objectFit: "cover", borderRadius: 8 }}
            />
          </div>
        )}

        <div
          style={{
            fontStyle: "italic",
            fontSize: 16,
            lineHeight: 1.7,
            color: "#595959",
            background: "#fafafa",
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            borderLeft: "4px solid #595959",
          }}
        >
          {article.summary}
        </div>

        <div style={{ whiteSpace: "pre-line", lineHeight: 1.9, fontSize: 15, color: "#262626" }}>
          {article.content}
        </div>
      </Card>
    </div>
  );
};
