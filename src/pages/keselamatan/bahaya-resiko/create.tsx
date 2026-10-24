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
  Row,
  Col,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { IUser } from "../../../types/user";
import { HazardCategory } from "../../../types/hazard";
import "../../../components/common/form-theme.css";

const { Title, Paragraph, Text } = Typography;

interface FormValues {
  date: Dayjs;
  category: HazardCategory;
  unit: string;
  location: string;
  description: string;
  potentialImpact: string;
}

export const HazardReportCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createReport, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: FormValues) => {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-hazard form-card-animate form-delay-1">
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
                <WarningOutlined /> FORMULIR TEMUAN BAHAYA K3
              </Tag>
              <span style={{ fontSize: 13, color: "#fef3c7" }}>Near Miss, Unsafe Action & Condition</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Lapor Potensi Bahaya & Resiko Kerja Baru
            </Title>
            <Paragraph style={{ color: "#fef3c7", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Laporkan setiap kondisi atau tindakan yang berpotensi menimbulkan kecelakaan kerja di lingkungan perkantoran dan depo arsip ANRI.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/keselamatan/bahaya-resiko")}
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
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Waktu Kejadian & Kategori Bahaya</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Kejadian / Ditemukan</span>}
                name="date"
                rules={[{ required: true, message: "Tanggal wajib diisi!" }]}
              >
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kategori Bahaya</span>}
                name="category"
                rules={[{ required: true, message: "Kategori bahaya wajib dipilih!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="near_miss">Near Miss (Hampir Celaka)</Select.Option>
                  <Select.Option value="unsafe_action">Unsafe Action (Tindakan Tidak Aman)</Select.Option>
                  <Select.Option value="unsafe_condition">Unsafe Condition (Kondisi Tidak Aman)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja Terkait</span>}
                name="unit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Preservasi Arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik Kejadian</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Gedung B Lantai 2, Koridor Barat" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title" style={{ marginTop: 12 }}>
            <span className="badge-num">2</span>
            <span>Uraian Temuan & Potensi Dampak</span>
          </div>

          <Row gutter={24}>
            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Deskripsi Temuan Bahaya</span>}
                name="description"
                rules={[{ required: true, message: "Deskripsi temuan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={4}
                  style={{ borderRadius: 8 }}
                  placeholder="Jelaskan secara rinci kondisi atau tindakan tidak aman yang ditemukan..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Potensi Dampak / Konsekuensi Cedera</span>}
                name="potentialImpact"
                rules={[{ required: true, message: "Potensi dampak wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Contoh: Potensi terpeleset, tersengat listrik, kebakaran, atau tertimpa boks arsip..."
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Foto Bukti Temuan (Upload Dokumen / Gambar)</span>}>
                <Upload maxCount={3} listType="picture" beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} style={{ borderRadius: 8, height: 38 }}>
                    Pilih File Foto Bukti
                  </Button>
                </Upload>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                  Format JPG/PNG, ukuran maksimal 5MB.
                </Text>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/keselamatan/bahaya-resiko")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Kirim Laporan Bahaya
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
