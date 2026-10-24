import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Upload,
  Tag,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined, FileImageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  category: string;
  description: string;
}

export const PosterCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createPoster, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: FormValues) => {
    const payload = {
      ...values,
      image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80",
      fileUrl: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1600&q=80",
      createdBy: user?.name || "Tim K3 ANRI",
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    createPoster(
      {
        resource: "posters",
        values: payload,
        successNotification: {
          message: "Poster Berhasil Diunggah",
          description: `Poster "${values.title}" telah ditambahkan ke galeri K3.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/media/flayer-poster");
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
                <FileImageOutlined /> GALERI VISUAL & FLAYER K3
              </Tag>
              <span style={{ fontSize: 13, color: "#ccfbf1" }}>Unggah Materi Kampanye Visual</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Unggah Poster & Flayer Keselamatan Kerja Baru
            </Title>
            <Paragraph style={{ color: "#ccfbf1", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Publikasikan media kampanye visual beresolusi tinggi untuk dipasang pada mading, lift, dan ruang depo arsip seluruh unit kerja ANRI.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/media/flayer-poster")}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Kembali ke Galeri
            </Button>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Metadata & Kategori Poster</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Judul Poster / Flayer</span>}
                name="title"
                rules={[{ required: true, message: "Judul poster wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Poster Kewajiban Pemakaian Masker di Lab Preservasi" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kategori Tema</span>}
                name="category"
                rules={[{ required: true, message: "Kategori wajib dipilih!" }]}
              >
                <Select size="large" placeholder="Pilih Kategori" style={{ borderRadius: 8 }}>
                  <Select.Option value="Budaya K3">Budaya K3 (5R)</Select.Option>
                  <Select.Option value="Tanggap Darurat">Tanggap Darurat & Kebakaran</Select.Option>
                  <Select.Option value="Alat Pelindung Diri">Alat Pelindung Diri (APD)</Select.Option>
                  <Select.Option value="Kesehatan Kerja">Kesehatan Kerja & Ergonomi</Select.Option>
                  <Select.Option value="Kelistrikan">Keselamatan Listrik</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pesan Utama / Deskripsi Himbauan</span>}
                name="description"
                rules={[{ required: true, message: "Keterangan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  style={{ borderRadius: 8 }}
                  placeholder="Uraikan pesan himbauan keselamatan yang terkandung pada materi poster visual..."
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title" style={{ marginTop: 12 }}>
            <span className="badge-num">2</span>
            <span>File Gambar Resolusi Tinggi (HD)</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Berkas Visual (JPG / PNG / PDF A3/A4)</span>}>
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} style={{ borderRadius: 8, height: 38 }}>
                    Pilih File Gambar Poster Resolusi Tinggi
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/media/flayer-poster")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Simpan & Publikasikan Poster
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
