import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Tag,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { IAnnouncement } from "../../../types/announcement";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  eventDate: string;
  location: string;
  description: string;
  content: string;
}

export const AnnouncementEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { query } = useOne<IAnnouncement>({
    resource: "announcements",
    id: id || "1",
  });

  const { mutate: updateAnnouncement, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        title: record.title,
        eventDate: record.eventDate,
        location: record.location,
        description: record.description,
        content: record.content,
      });
    }
  }, [record, form]);

  const onFinish = (values: FormValues) => {
    if (!record) return;

    updateAnnouncement(
      {
        resource: "announcements",
        id: record.id,
        values: {
          ...values,
        },
        successNotification: {
          message: "Pemberitahuan Berhasil Diperbarui",
          description: `Perubahan agenda "${values.title}" berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/media/pemberitahuan/show/${record.id}`);
        },
      }
    );
  };

  if (isLoading || !record) return <Card loading={true} style={{ borderRadius: 14 }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-edit form-card-animate form-delay-1">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <EditOutlined /> PERBARUI AGENDA & PEMBERITAHUAN
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>ID: #{record.id}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit Pemberitahuan: {record.title}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui jadwal pelaksanaan, lokasi, atau deskripsi agenda kegiatan K3 di lingkungan ANRI.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/media/pemberitahuan/show/${record.id}`)}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Batal & Kembali
            </Button>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Perubahan Data Agenda Kegiatan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Judul Pemberitahuan / Agenda Kegiatan</span>}
                name="title"
                rules={[{ required: true, message: "Judul kegiatan wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jadwal Pelaksanaan Kegiatan</span>}
                name="eventDate"
                rules={[{ required: true, message: "Jadwal kegiatan wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Pelaksanaan</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi kegiatan wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Ringkasan Singkat</span>}
                name="description"
                rules={[{ required: true, message: "Ringkasan wajib diisi!" }]}
              >
                <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Isi Pengumuman Lengkap / Surat Edaran</span>}
                name="content"
                rules={[{ required: true, message: "Isi pengumuman wajib diisi!" }]}
              >
                <Input.TextArea rows={6} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/media/pemberitahuan/show/${record.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan Agenda
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
