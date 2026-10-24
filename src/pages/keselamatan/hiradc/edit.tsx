import React, { useState, useEffect } from "react";
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
import { ArrowLeftOutlined, SaveOutlined, InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { IHiradc, calculateRiskLevel, RiskLevel } from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import "../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;

interface FormValues {
  activity: string;
  unit: string;
  location: string;
  hazard: string;
  risk: string;
  category: string;
  existingControl: string;
  additionalControl: string;
  responsiblePerson: string;
  targetDate: Dayjs;
}

export const HiradcEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });

  const { mutate: updateHiradc, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  const [likelihood, setLikelihood] = useState<number>(3);
  const [severity, setSeverity] = useState<number>(3);

  const riskScore = likelihood * severity;
  const riskLevel: RiskLevel = calculateRiskLevel(riskScore);

  useEffect(() => {
    if (record) {
      setLikelihood(record.likelihood);
      setSeverity(record.severity);
      form.setFieldsValue({
        activity: record.activity,
        unit: record.unit,
        location: record.location,
        hazard: record.hazard,
        risk: record.risk,
        category: record.category,
        likelihood: record.likelihood,
        severity: record.severity,
        existingControl: record.existingControl,
        additionalControl: record.additionalControl,
        responsiblePerson: record.responsiblePerson,
        targetDate: dayjs(record.targetDate),
      });
    }
  }, [record, form]);

  const onFinish = (values: FormValues) => {
    if (!record) return;

    updateHiradc(
      {
        resource: "hiradc",
        id: record.id,
        values: {
          ...values,
          likelihood,
          severity,
          riskScore,
          riskLevel,
          targetDate: values.targetDate.format("YYYY-MM-DD"),
        },
        successNotification: {
          message: "Data HIRADC Diperbarui",
          description: `Perubahan data aktivitas "${values.activity}" berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/hiradc/show/${record.id}`);
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
                <EditOutlined /> PERBARUI PENILAIAN RISIKO
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>ID: #{record.id}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit HIRADC: {record.activity}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui analisis bahaya kerja, evaluasi ulang nilai kemungkinan dan dampak, serta tindakan mitigasi perbaikan.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => setMatrixModalOpen(true)}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Matriks 5×5
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Batal
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Ubah Data Aktivitas & Potensi Bahaya</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Aktivitas / Proses Kerja</span>}
                name="activity"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja</span>}
                name="unit"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Potensi Bahaya</span>}
                name="hazard"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Risiko / Dampak Kejadian</span>}
                name="risk"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik</span>} name="location" rules={[{ required: true }]}>
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kategori Bahaya</span>} name="category" rules={[{ required: true }]}>
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="Bahaya Kimia dan Biologi">Bahaya Kimia dan Biologi</Select.Option>
                  <Select.Option value="Bahaya Fisik / Mekanik">Bahaya Fisik / Mekanik</Select.Option>
                  <Select.Option value="Bahaya Ergonomi">Bahaya Ergonomi</Select.Option>
                  <Select.Option value="Bahaya Elektrikal">Bahaya Elektrikal</Select.Option>
                  <Select.Option value="Bahaya Psikososial">Bahaya Psikososial</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Skor Penilaian Risiko */}
            <Col xs={24}>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  marginBottom: 24,
                }}
              >
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
                  Evaluasi Ulang Matriks Risiko (L × S):
                </div>

                <Row gutter={24} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Peluang Terjadi (Likelihood 1 - 5)</span>} name="likelihood">
                      <Select size="large" value={likelihood} onChange={(val) => setLikelihood(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Sangat Jarang</Select.Option>
                        <Select.Option value={2}>2 - Jarang</Select.Option>
                        <Select.Option value={3}>3 - Sedang / Mungkin</Select.Option>
                        <Select.Option value={4}>4 - Sering Terjadi</Select.Option>
                        <Select.Option value={5}>5 - Sangat Sering (Pasti)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Tingkat Keparahan (Severity 1 - 5)</span>} name="severity">
                      <Select size="large" value={severity} onChange={(val) => setSeverity(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Tidak Signifikan (P3K)</Select.Option>
                        <Select.Option value={2}>2 - Ringan (&lt;3 hari istirahat)</Select.Option>
                        <Select.Option value={3}>3 - Sedang (Rawat Medis)</Select.Option>
                        <Select.Option value={4}>4 - Berat (Cacat Permanen)</Select.Option>
                        <Select.Option value={5}>5 - Katastropik (Kematian/Fatal)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center", padding: "6px 0" }}>
                      <Text type="secondary" style={{ fontSize: 11, fontWeight: 600 }}>
                        NILAI RISIKO TERBARU
                      </Text>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#0d9488", lineHeight: 1.2 }}>
                        {riskScore}
                      </div>
                      <Tag color="cyan" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginTop: 4 }}>
                        Level: {riskLevel}
                      </Tag>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className="form-section-title">
            <span className="badge-num">2</span>
            <span>Ubah Pengendalian & Target Waktu</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pengendalian yang Sudah Ada</span>}
                name="existingControl"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pengendalian Tambahan / Tindakan Perbaikan</span>}
                name="additionalControl"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penanggung Jawab (PIC)</span>}
                name="responsiblePerson"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Target Waktu Penyelesaian</span>} name="targetDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan Penilaian
            </Button>
          </div>
        </Form>
      </Card>

      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={likelihood}
        selectedSeverity={severity}
      />
    </div>
  );
};
