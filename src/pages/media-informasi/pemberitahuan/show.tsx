import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import { IAnnouncement } from "../../../types/announcement";

const { Title, Text, Paragraph } = Typography;

export const AnnouncementShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { query } = useOne<IAnnouncement>({
    resource: "announcements",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} />;

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
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/pemberitahuan")} />
          <div>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              {record.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Diterbitkan pada {record.date} oleh {record.createdBy}
            </Text>
          </div>
        </Space>

        {canEdit && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate(`/media/pemberitahuan/edit/${record.id}`)}
          >
            Ubah Pengumuman
          </Button>
        )}
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {record.image && (
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <Image
              src={record.image}
              alt={record.title}
              style={{ maxHeight: 380, width: "100%", objectFit: "cover", borderRadius: 8 }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
          <Tag color="blue" style={{ fontSize: 13, padding: "4px 10px" }}>
            <CalendarOutlined /> Waktu: {record.eventDate}
          </Tag>
          <Tag color="cyan" style={{ fontSize: 13, padding: "4px 10px" }}>
            <EnvironmentOutlined /> Lokasi: {record.location}
          </Tag>
        </div>

        <Title level={5}>Deskripsi Ringkas</Title>
        <Paragraph style={{ fontSize: 15, lineHeight: 1.8 }}>{record.description}</Paragraph>

        <Divider />

        <Title level={5}>Uraian Lengkap Kegiatan & Ketentuan</Title>
        <div style={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: 14, color: "#262626" }}>
          {record.content}
        </div>

        {record.attachments && record.attachments.length > 0 && (
          <div style={{ marginTop: 24, background: "#fafafa", padding: 16, borderRadius: 8 }}>
            <Text strong>Lampiran Berkas Kegiatan:</Text>
            <div style={{ marginTop: 8 }}>
              {record.attachments.map((file: string, idx: number) => (
                <Tag key={idx} icon={<PaperClipOutlined />} color="processing" style={{ padding: "4px 8px" }}>
                  {file}
                </Tag>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
