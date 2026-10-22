import React, { useEffect } from "react";
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
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { IArticle } from "../../../types/article";
import { initialArticleCategories } from "../../../mocks/articles";

const { Title, Text } = Typography;

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

  const onFinish = (values: any) => {
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

  if (isLoading || !record) return <Card loading={true} />;

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
            Ubah Artikel Edukasi K3
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {record.title}
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
              <Form.Item label="Judul Artikel" name="title" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Kategori" name="categoryId" rules={[{ required: true }]}>
                <Select size="large">
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
              <Form.Item label="Ringkasan Singkat (Summary)" name="summary" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Isi Lengkap Artikel" name="content" rules={[{ required: true }]}>
                <Input.TextArea rows={10} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/media/edukasi")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Simpan Perubahan
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
