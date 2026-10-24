import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Tag,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { IArticle } from "../../../types/article";
import { initialArticleCategories } from "../../../mocks/articles";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  categoryId: number;
  summary: string;
  content: string;
}

export const ArticleEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { query } = useOne<IArticle>({
    resource: "articles",
    id: id || "1",
  });

  const { mutate: updateArticle, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        title: record.title,
        categoryId: record.categoryId,
        summary: record.summary,
        content: record.content,
      });
    }
  }, [record, form]);

  const onFinish = (values: FormValues) => {
    if (!record) return;

    const selectedCat = initialArticleCategories.find((c) => c.id === values.categoryId) || record.category;

    updateArticle(
      {
        resource: "articles",
        id: record.id,
        values: {
          ...values,
          category: selectedCat,
        },
        successNotification: {
          message: "Artikel Berhasil Diperbarui",
          description: `Perubahan artikel "${values.title}" berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/media/edukasi/show/${record.id}`);
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
                <EditOutlined /> PERBARUI ARTIKEL EDUKASI
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>ID: #{record.id}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit Artikel: {record.title}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui judul, kategori pembahasan, ringkasan, atau isi materi edukasi K3.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/media/edukasi/show/${record.id}`)}
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
            <span>Ubah Judul & Kategori Artikel</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Judul Artikel</span>}
                name="title"
                rules={[{ required: true, message: "Judul artikel wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
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
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Keterangan Singkat (Summary)</span>}
                name="summary"
                rules={[{ required: true, message: "Ringkasan artikel wajib diisi!" }]}
              >
                <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Isi Lengkap Artikel</span>}
                name="content"
                rules={[{ required: true, message: "Isi artikel wajib diisi!" }]}
              >
                <Input.TextArea rows={10} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/media/edukasi/show/${record.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan Artikel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
