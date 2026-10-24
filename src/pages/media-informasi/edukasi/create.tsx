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
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined, ReadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { initialArticleCategories } from "../../../mocks/articles";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  categoryId: number;
  summary: string;
  content: string;
}

export const ArticleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createArticle, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: FormValues) => {
    const selectedCat = initialArticleCategories.find((c) => c.id === values.categoryId) || initialArticleCategories[1];

    const payload = {
      title: values.title,
      categoryId: values.categoryId,
      category: selectedCat,
      summary: values.summary,
      content: values.content,
      image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
      author: user?.name || "Tim K3 ANRI",
      isPublished: true,
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    createArticle(
      {
        resource: "articles",
        values: payload,
        successNotification: {
          message: "Artikel Edukasi Berhasil Diterbitkan",
          description: `Artikel "${values.title}" kini telah dapat dibaca oleh seluruh pegawai.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/media/edukasi");
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
                <ReadOutlined /> PUSTAKA & ARTIKEL EDUKASI K3
              </Tag>
              <span style={{ fontSize: 13, color: "#ccfbf1" }}>Formulir Publikasi Artikel Baru</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Tulis Artikel Edukasi & Sosialisasi K3 Baru
            </Title>
            <Paragraph style={{ color: "#ccfbf1", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Bagikan wawasan keselamatan kerja, tips ergonomi perkantoran, dan panduan kesehatan kerja bagi seluruh pegawai ANRI.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/media/edukasi")}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Kembali ke Edukasi
            </Button>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Judul & Kategori Artikel</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Judul Artikel</span>}
                name="title"
                rules={[{ required: true, message: "Judul artikel wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Mengenal Bahaya Ergonomi Duduk Lama di Kantor" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kategori Artikel</span>}
                name="categoryId"
                rules={[{ required: true, message: "Kategori wajib dipilih!" }]}
              >
                <Select size="large" placeholder="Pilih Kategori" style={{ borderRadius: 8 }}>
                  {initialArticleCategories
                    .filter((c) => c.slug !== "all")
                    .map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Keterangan Singkat (Summary Pengantar)</span>}
                name="summary"
                rules={[{ required: true, message: "Ringkasan artikel wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang menarik pembaca..."
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title" style={{ marginTop: 12 }}>
            <span className="badge-num">2</span>
            <span>Uraian Lengkap & Foto Sampul</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Isi Lengkap Artikel (Tips & Pembahasan)</span>}
                name="content"
                rules={[{ required: true, message: "Isi artikel wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={10}
                  style={{ borderRadius: 8 }}
                  placeholder="Tuliskan uraian lengkap artikel, tips praktis, panduan SOP, dll..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Foto Cover Sampul Artikel</span>}>
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} style={{ borderRadius: 8, height: 38 }}>
                    Unggah Gambar Sampul
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/media/edukasi")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Simpan & Terbitkan Artikel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
