import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Upload,
  Typography,
  Space,
  Row,
  Col,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const HazardReportCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createReport, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: any) => {
    const formattedValues = {
      date: values.date ? values.date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      location: values.location,
      unit: values.unit,
      category: values.category,
      description: values.description,
      potentialImpact: values.potentialImpact,
      reporterId: user?.id || 1,
      reporterName: user?.name || "Pegawai ANRI",
      photos: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
      ],
      status: "reported",
      statusHistory: [
        {
          status: "Dilaporkan",
          changedBy: user?.name || "Pegawai ANRI",
          changedAt: dayjs().format("YYYY-MM-DD HH:mm"),
          notes: "Laporan baru diajukan melalui portal",
        },
      ],
    };

    createReport(
      {
        resource: "hazard-reports",
        values: formattedValues,
        successNotification: {
          message: "Laporan Berhasil Disimpan",
          description: "Laporan potensi bahaya telah terdaftar dan akan diverifikasi oleh Tim K3.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/bahaya-resiko");
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/bahaya-resiko")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Form Pelaporan Bahaya & Resiko Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Laporkan temuan potensi bahaya di lingkungan kerja Klinik Pratama ANRI
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
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            date: dayjs(),
            category: "unsafe_condition",
            unit: user?.unit || "Subbagian Rumah Tangga dan Sarpras",
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tanggal Kejadian / Ditemukan"
                name="date"
                rules={[{ required: true, message: "Tanggal wajib diisi!" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Kategori Bahaya"
                name="category"
                rules={[{ required: true, message: "Kategori bahaya wajib dipilih!" }]}
              >
                <Select size="large">
                  <Select.Option value="near_miss">Near Miss (Hampir Celaka)</Select.Option>
                  <Select.Option value="unsafe_action">Unsafe Action (Tindakan Tidak Aman)</Select.Option>
                  <Select.Option value="unsafe_condition">Unsafe Condition (Kondisi Tidak Aman)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Unit Kerja Terkait"
                name="unit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Preservasi Arsip" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Lokasi Spesifik Kejadian"
                name="location"
                rules={[{ required: true, message: "Lokasi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Gedung B Lantai 2, Koridor Barat" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Deskripsi Temuan Bahaya"
                name="description"
                rules={[{ required: true, message: "Deskripsi temuan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Jelaskan secara rinci kondisi atau tindakan tidak aman yang ditemukan..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Potensi Dampak / Konsekuensi"
                name="potentialImpact"
                rules={[{ required: true, message: "Potensi dampak wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Contoh: Potensi terpeleset, tersengat listrik, kebakaran, atau tertimpa boks arsip..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Foto Bukti Temuan (Upload Dokumen / Gambar)">
                <Upload maxCount={3} listType="picture" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Pilih File Foto Bukti</Button>
                </Upload>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                  Format JPG/PNG, ukuran maksimal 5MB.
                </Text>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/keselamatan/bahaya-resiko")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Kirim Laporan
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
