import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Tag,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { IHazardReport, HazardCategory, HazardStatus } from "../../../types/hazard";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  date: Dayjs;
  category: HazardCategory;
  unit: string;
  location: string;
  description: string;
  potentialImpact: string;
  status: HazardStatus;
  notes?: string;
}

export const HazardReportEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();

  const { query } = useOne<IHazardReport>({
    resource: "hazard-reports",
    id: id || "1",
  });

  const { mutate: updateReport, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const report = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (report) {
      form.setFieldsValue({
        date: dayjs(report.date),
        category: report.category,
        unit: report.unit,
        location: report.location,
        description: report.description,
        potentialImpact: report.potentialImpact,
        status: report.status,
      });
    }
  }, [report, form]);

  const onFinish = (values: FormValues) => {
    if (!report) return;

    const newHistory = [...(report.statusHistory || [])];
    if (values.status !== report.status || values.notes) {
      newHistory.push({
        status: values.status,
        changedBy: user?.name || "Admin K3",
        changedAt: dayjs().format("YYYY-MM-DD HH:mm"),
        notes: values.notes || "Pembaruan data laporan",
      });
    }

    updateReport(
      {
        resource: "hazard-reports",
        id: report.id,
        values: {
          ...values,
          date: values.date.format("YYYY-MM-DD"),
          statusHistory: newHistory,
        },
        successNotification: {
          message: "Laporan Berhasil Diperbarui",
          description: `Perubahan data laporan ${report.reportNumber} berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/bahaya-resiko/show/${report.id}`);
        },
      }
    );
  };

  if (isLoading || !report) return <Card loading={true} style={{ borderRadius: 14 }} />;

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
                <EditOutlined /> PERBARUI TEMUAN BAHAYA
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>No. Laporan: {report.reportNumber}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit Laporan Bahaya: {report.reportNumber}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui rincian lokasi kejadian, uraian deskripsi bahaya, status penanganan, atau catatan tindak lanjut.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/keselamatan/bahaya-resiko/show/${report.id}`)}
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
            <span>Ubah Rincian Data Bahaya</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Kejadian</span>}
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
                rules={[{ required: true, message: "Kategori wajib dipilih!" }]}
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
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja</span>}
                name="unit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Kejadian</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Deskripsi Temuan Bahaya</span>}
                name="description"
                rules={[{ required: true, message: "Deskripsi wajib diisi!" }]}
              >
                <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Potensi Dampak</span>}
                name="potentialImpact"
                rules={[{ required: true, message: "Potensi dampak wajib diisi!" }]}
              >
                <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-section-title" style={{ marginTop: 12 }}>
            <span className="badge-num">2</span>
            <span>Status Penanganan & Catatan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Penanganan</span>}
                name="status"
                rules={[{ required: true, message: "Status wajib dipilih!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="reported">Dilaporkan</Select.Option>
                  <Select.Option value="verified">Diverifikasi (Tim K3)</Select.Option>
                  <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
                  <Select.Option value="resolved">Selesai</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Catatan Perubahan Status</span>} name="notes">
                <Input placeholder="Tuliskan catatan tindak lanjut penanganan..." size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/keselamatan/bahaya-resiko/show/${report.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan Laporan
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
