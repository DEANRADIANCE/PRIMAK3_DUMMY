import React from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IAnnouncement } from "../../../types/announcement";

const { Title, Text, Paragraph } = Typography;

export const AnnouncementList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { tableProps } = useTable<IAnnouncement>({
    resource: "announcements",
    pagination: { pageSize: 6 },
  });

  const { mutate: deleteAnnouncement } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const announcements = (tableProps.dataSource || []) as IAnnouncement[];

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
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Pemberitahuan & Informasi Kegiatan K3
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Agenda kegiatan keselamatan kerja, medical check-up, dan simulasi tanggap darurat ANRI
          </Text>
        </div>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate("/media/pemberitahuan/create")}
          >
            Buat Pemberitahuan Baru
          </Button>
        )}
      </div>

      {/* Grid Kartu Pengumuman */}
      <Row gutter={[20, 20]}>
        {announcements.map((item) => (
          <Col xs={24} md={12} key={item.id}>
            <Card
              hoverable
              bordered={false}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 12,
                border: "1px solid #e8e8e8",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
              cover={
                item.image ? (
                  <img
                    alt={item.title}
                    src={item.image}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                ) : null
              }
              actions={[
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/media/pemberitahuan/show/${item.id}`)}
                >
                  Detail Kegiatan
                </Button>,
                ...(canManage
                  ? [
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/media/pemberitahuan/edit/${item.id}`)}
                      >
                        Ubah
                      </Button>,
                      <Popconfirm
                        title="Hapus pemberitahuan ini?"
                        onConfirm={() =>
                          deleteAnnouncement({
                            resource: "announcements",
                            id: item.id,
                          })
                        }
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          Hapus
                        </Button>
                      </Popconfirm>,
                    ]
                  : []),
              ]}
            >
              <Tag color="blue" style={{ marginBottom: 8 }}>
                <CalendarOutlined /> {item.eventDate}
              </Tag>

              <Title level={5} style={{ margin: "4px 0 8px", lineHeight: 1.4 }}>
                {item.title}
              </Title>

              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8c8c8c", fontSize: 12, marginBottom: 8 }}>
                <EnvironmentOutlined />
                <span>{item.location}</span>
              </div>

              <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13 }}>
                {item.description}
              </Paragraph>

              {item.attachments && item.attachments.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Tag icon={<PaperClipOutlined />} color="default">
                    {item.attachments.length} Dokumen Lampiran
                  </Tag>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
