import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Upload,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  eventDate: string;
  location: string;
  description: string;
  content: string;
}

export const AnnouncementCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createAnnouncement, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: FormValues) => {
    const formatted = {
      ...values,
      date: dayjs().format("YYYY-MM-DD"),
      attachments: ["Brosur_Kegiatan_K3.pdf"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
      isActive: true,
      createdBy: user?.name || "Tim K3 ANRI",
    };

    createAnnouncement(
      {
        resource: "announcements",
        values: formatted,
        successNotification: {
          message: "Pemberitahuan Berhasil Dipublikasikan",
          description: `Agenda kegiatan "${values.title}" telah ditambahkan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/media/pemberitahuan");
        },
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-create form-card-animate form-delay-1">
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
                <BellOutlined /> AGENDA & PEMBERITAHUAN K3
              </Tag>
              <span style={{ fontSize: 13, color: "#ccfbf1" }}>Formulir Publikasi Baru</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Buat Pemberitahuan / Kegiatan K3 Baru
            </Title>
            <Paragraph style={{ color: "#ccfbf1", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Publikasikan agenda simulasi tanggap darurat, pelatihan keselamatan, pemeriksaan kesehatan berkala, atau surat edaran K3 kepada seluruh pegawai ANRI.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/media/pemberitahuan")}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Kembali ke Daftar
            </Button>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Informasi Pokok Kegiatan & Agenda</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Judul Pemberitahuan / Agenda Kegiatan</span>}
                name="title"
                rules={[{ required: true, message: "Judul kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Sosialisasi Pencegahan Kebakaran Gedung Arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jadwal Pelaksanaan Kegiatan</span>}
                name="eventDate"
                rules={[{ required: true, message: "Jadwal kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: 28 Maret 2026, Pukul 09.00 WIB" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Pelaksanaan</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Auditorium Noerhadi Magetsari Gedung A Lantai 2" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Ringkasan Singkat (Tampil di Beranda/Banner)</span>}
                name="description"
                rules={[{ required: true, message: "Ringkasan wajib diisi!" }]}
              >
                <Input.TextArea rows={2} placeholder="Keterangan singkat yang tampil pada kartu pengumuman..." style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title" style={{ marginTop: 12 }}>
            <span className="badge-num">2</span>
            <span>Isi Pengumuman & Lampiran Dokumen</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Isi Pengumuman Lengkap / Surat Edaran</span>}
                name="content"
                rules={[{ required: true, message: "Isi pengumuman wajib diisi!" }]}
              >
                <Input.TextArea rows={6} placeholder="Tuliskan isi surat edaran atau instruksi lengkap kegiatan..." style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lampiran Dokumen (Surat / Brosur / Denah)</span>}>
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} style={{ borderRadius: 8, height: 38 }}>
                    Unggah Berkas PDF / Gambar
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/media/pemberitahuan")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Publikasikan Pengumuman
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
