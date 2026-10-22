import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Upload,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { initialArticleCategories } from "../../../mocks/articles";

const { Title, Text } = Typography;

export const ArticleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createArticle, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: any) => {
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/edukasi")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Tambah Artikel Edukasi K3 Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Tuliskan artikel informatif untuk meningkatkan kesadaran keselamatan dan kesehatan kerja
          </Text>
        </div>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item
                label="Judul Artikel"
                name="title"
                rules={[{ required: true, message: "Judul artikel wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Mengenal Bahaya Ergonomi Duduk Lama di Kantor" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Kategori"
                name="categoryId"
                rules={[{ required: true, message: "Kategori wajib dipilih!" }]}
              >
                <Select size="large" placeholder="Pilih Kategori">
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
                label="Keterangan Singkat (Summary)"
                name="summary"
                rules={[{ required: true, message: "Ringkasan artikel wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang menarik pembaca..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Isi Lengkap Artikel (Format Teks / Markdown)"
                name="content"
                rules={[{ required: true, message: "Isi artikel wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={10}
                  placeholder="Tuliskan uraian lengkap artikel, tips praktis, panduan SOP, dll..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Foto Cover Banner Artikel">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Unggah Gambar Sampul</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/media/edukasi")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Simpan & Terbitkan Artikel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
