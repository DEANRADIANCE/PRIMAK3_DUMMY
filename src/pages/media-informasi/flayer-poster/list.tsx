import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Tag,
  Modal,
  Image,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IPoster } from "../../../types/poster";

const { Title, Text, Paragraph } = Typography;

export const PosterList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [previewPoster, setPreviewPoster] = useState<IPoster | null>(null);

  const { tableProps } = useTable<IPoster>({
    resource: "posters",
    pagination: { pageSize: 6 },
  });

  const { mutate: deletePoster } = useDelete();

  const canManage = currentUser?.role === "admin" || currentUser?.role === "tim_k3";
  const posters = (tableProps.dataSource || []) as IPoster[];

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
            Flayer & Poster Keselamatan Kerja
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Media kampanye visual K3 siap unduh dan cetak untuk papan pengumuman unit ANRI
          </Text>
        </div>

        {canManage && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate("/media/flayer-poster/create")}
          >
            Unggah Poster Baru
          </Button>
        )}
      </div>

      {/* Grid 2 Kolom Kartu Gambar */}
      <Row gutter={[24, 24]} className="poster-grid">
        {posters.map((poster) => (
          <Col xs={24} md={12} key={poster.id}>
            <Card
              hoverable
              bordered={false}
              style={{
                borderRadius: 12,
                border: "1px solid #e8e8e8",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
              cover={
                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setPreviewPoster(poster)}>
                  <img
                    alt={poster.title}
                    src={poster.image}
                    style={{ width: "100%", height: 260, objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    <EyeOutlined /> Klik untuk Preview
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  href={poster.fileUrl}
                  target="_blank"
                >
                  Unduh Resolusi Tinggi
                </Button>,
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewPoster(poster)}
                >
                  Pratinjau
                </Button>,
                ...(canManage
                  ? [
                      <Popconfirm
                        title="Hapus poster ini?"
                        onConfirm={() =>
                          deletePoster({
                            resource: "posters",
                            id: poster.id,
                          })
                        }
                      >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]
                  : []),
              ]}
            >
              <Tag color="volcano" style={{ marginBottom: 6 }}>
                {poster.category}
              </Tag>

              <Title level={5} style={{ margin: "4px 0 8px" }}>
                {poster.title}
              </Title>

              <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13, margin: 0 }}>
                {poster.description}
              </Paragraph>

              <div style={{ marginTop: 10, fontSize: 11, color: "#8c8c8c" }}>
                Diposting oleh: {poster.createdBy}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal Preview Besar & Unduh */}
      <Modal
        open={!!previewPoster}
        onCancel={() => setPreviewPoster(null)}
        footer={[
          <Button key="close" onClick={() => setPreviewPoster(null)}>
            Tutup
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            href={previewPoster?.fileUrl}
            target="_blank"
          >
            Unduh Gambar Asli
          </Button>,
        ]}
        width={750}
        title={previewPoster?.title}
      >
        {previewPoster && (
          <div style={{ textAlign: "center" }}>
            <Image
              src={previewPoster.fileUrl || previewPoster.image}
              alt={previewPoster.title}
              style={{ maxHeight: 500, width: "100%", objectFit: "contain", borderRadius: 8 }}
            />
            <div style={{ textAlign: "left", marginTop: 16 }}>
              <Tag color="volcano" style={{ marginBottom: 6 }}>
                {previewPoster.category}
              </Tag>
              <Paragraph style={{ fontSize: 14 }}>{previewPoster.description}</Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
