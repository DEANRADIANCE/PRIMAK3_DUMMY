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

const { Title, Text } = Typography;

export const PosterCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createPoster, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: any) => {
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/flayer-poster")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Unggah Poster & Flayer K3 Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Tambahkan media visual kampanye keselamatan kerja Klinik Pratama ANRI
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
                label="Judul Poster / Flayer"
                name="title"
                rules={[{ required: true, message: "Judul poster wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Poster Kewajiban Pemakaian Masker di Lab Preservasi" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Kategori Tema"
                name="category"
                rules={[{ required: true, message: "Kategori wajib dipilih!" }]}
              >
                <Select size="large" placeholder="Pilih Kategori">
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
                label="Keterangan / Pesan Utama Poster"
                name="description"
                rules={[{ required: true, message: "Keterangan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Uraikan pesan himbauan keselamatan yang terkandung pada materi poster visual..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="File Gambar Poster (Resolusi Tinggi)">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Pilih File Gambar Poster (JPG/PNG/PDF)</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/media/flayer-poster")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Simpan & Publikasikan Poster
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
