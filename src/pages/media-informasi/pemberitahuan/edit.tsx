import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { IAnnouncement } from "../../../types/announcement";

const { Title, Text } = Typography;

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

  const onFinish = (values: any) => {
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/pemberitahuan")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Ubah Pemberitahuan Kegiatan
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
            <Col xs={24}>
              <Form.Item label="Judul Kegiatan" name="title" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Jadwal Pelaksanaan" name="eventDate" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Lokasi Kegiatan" name="location" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Ringkasan Singkat" name="description" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Isi Lengkap" name="content" rules={[{ required: true }]}>
                <Input.TextArea rows={6} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/media/pemberitahuan")}>Batal</Button>
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
