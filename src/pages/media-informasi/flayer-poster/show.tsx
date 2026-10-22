import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Image,
  Divider,
} from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne } from "@refinedev/core";
import { IPoster } from "../../../types/poster";

const { Title, Text, Paragraph } = Typography;

export const PosterShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { query } = useOne<IPoster>({
    resource: "posters",
    id: id || "1",
  });

  const poster = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !poster) return <Card loading={true} />;

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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/flayer-poster")}>
          Kembali ke Galeri Poster
        </Button>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          style={{ background: "#595959", borderColor: "#595959" }}
          href={poster.fileUrl}
          target="_blank"
        >
          Unduh Resolusi Penuh
        </Button>
      </div>

      <Card
        bordered={false}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Tag color="volcano" style={{ fontSize: 13, marginBottom: 12 }}>
          {poster.category}
        </Tag>

        <Title level={3} style={{ margin: "0 0 16px" }}>
          {poster.title}
        </Title>

        <Image
          src={poster.fileUrl || poster.image}
          alt={poster.title}
          style={{ maxHeight: 550, width: "100%", objectFit: "contain", borderRadius: 8 }}
        />

        <Divider />

        <div style={{ textAlign: "left" }}>
          <Title level={5}>Pesan Edukasi Poster</Title>
          <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>{poster.description}</Paragraph>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Dipublikasikan oleh: {poster.createdBy} • Klinik Pratama ANRI
          </Text>
        </div>
      </Card>
    </div>
  );
};
