import React, { useState } from "react";
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
  Alert,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { calculateRiskLevel, RiskLevel } from "../../../types/hiradc";
import { IUser } from "../../../types/user";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import "../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;

interface FormValues {
  activity: string;
  unit: string;
  hazard: string;
  risk: string;
  location: string;
  category: string;
  existingControl: string;
  additionalControl: string;
  responsiblePerson: string;
  targetDate: Dayjs;
}

export const HiradcCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createHiradc, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [likelihood, setLikelihood] = useState<number>(3);
  const [severity, setSeverity] = useState<number>(3);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const riskScore = likelihood * severity;
  const riskLevel: RiskLevel = calculateRiskLevel(riskScore);

  const handleLikelihoodChange = (val: number) => {
    setLikelihood(val);
  };

  const handleSeverityChange = (val: number) => {
    setSeverity(val);
  };

  const getAlertBanner = () => {
    if (riskLevel === "extreme") {
      return (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined style={{ fontSize: 24 }} />}
          message={`PERINGATAN: TINGKAT RISIKO EKSTREM (Nilai: ${riskScore})`}
          description="Aktivitas ini berpotensi fatal! Dilarang memulai aktivitas sebelum pengendalian teknik mutlak diterapkan dan Surat Izin Kerja Aman (SIKA) diterbitkan."
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      );
    }
    if (riskLevel === "high") {
      return (
        <Alert
          type="warning"
          showIcon
          message={`PERHATIAN: TINGKAT RISIKO TINGGI (Nilai: ${riskScore})`}
          description="Memerlukan tindakan perbaikan pengendalian tambahan segera dan pengawasan melekat oleh Tim K3."
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      );
    }
    if (riskLevel === "medium") {
      return (
        <Alert
          type="info"
          showIcon
          message={`TINGKAT RISIKO SEDANG (Nilai: ${riskScore})`}
          description="Perlu penerapan SOP, pemeliharaan rutin, dan APD standar yang memadai."
          style={{ marginBottom: 20, borderRadius: 10 }}
        />
      );
    }
    return (
      <Alert
        type="success"
        showIcon
        message={`TINGKAT RISIKO RENDAH (Nilai: ${riskScore})`}
        description="Risiko dapat diterima dengan pemantauan berkala prosedur kerja normal."
        style={{ marginBottom: 20, borderRadius: 10 }}
      />
    );
  };

  const onFinish = (values: FormValues) => {
    const formatted = {
      ...values,
      likelihood,
      severity,
      riskScore,
      riskLevel,
      targetDate: values.targetDate ? values.targetDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      status: "in_progress",
      photos: [],
      statusHistory: [
        {
          status: "Draft",
          changedBy: user?.name || "Tim K3",
          changedAt: dayjs().format("YYYY-MM-DD HH:mm"),
          notes: "Penilaian risiko baru dibuat",
        },
      ],
    };

    createHiradc(
      {
        resource: "hiradc",
        values: formatted,
        successNotification: {
          message: "Penilaian HIRADC Berhasil Disimpan",
          description: `Aktivitas "${values.activity}" berhasil dinilai dengan level risiko ${riskLevel.toUpperCase()}.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/hiradc");
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
                <SafetyCertificateOutlined /> PENILAIAN RISIKO HIRADC
              </Tag>
              <span style={{ fontSize: 13, color: "#ccfbf1" }}>Standar K3 ANRI (ISO 45001)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Formulir Penilaian Risiko HIRADC Baru
            </Title>
            <Paragraph style={{ color: "#ccfbf1", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Identifikasi bahaya aktivitas kerja, evaluasi nilai Peluang (L) dan Keparahan (S), serta tetapkan tindakan mitigasi pengendalian tambahan.
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
                onClick={() => navigate("/keselamatan/hiradc")}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Kembali
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        {getAlertBanner()}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            likelihood: 3,
            severity: 3,
            unit: user?.unit || "Direktorat Preservasi Arsip",
            targetDate: dayjs().add(1, "month"),
          }}
        >
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Identifikasi Aktivitas & Karakter Bahaya</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Aktivitas / Proses Kerja</span>}
                name="activity"
                rules={[{ required: true, message: "Aktivitas kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Fumigasi Arsip dengan Gas Beracun" size="large" style={{ borderRadius: 8 }} />
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
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Potensi Bahaya (Hazard)</span>}
                name="hazard"
                rules={[{ required: true, message: "Bahaya wajib diidentifikasi!" }]}
              >
                <Input placeholder="Contoh: Gas uap fumigan dan spora jamur aktif" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Risiko / Dampak Kejadian</span>}
                name="risk"
                rules={[{ required: true, message: "Risiko wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Gangguan pernapasan akut, keracunan fatal" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik</span>} name="location" rules={[{ required: true }]}>
                <Input placeholder="Contoh: Lab Preservasi Lantai 1 Gedung B" size="large" style={{ borderRadius: 8 }} />
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
                  Penilaian Matriks Risiko Awal (Risk Assessment):
                </div>

                <Row gutter={24} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Peluang Terjadi (Likelihood 1 - 5)</span>} name="likelihood">
                      <Select size="large" value={likelihood} onChange={handleLikelihoodChange} style={{ borderRadius: 8 }}>
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
                      <Select size="large" value={severity} onChange={handleSeverityChange} style={{ borderRadius: 8 }}>
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
                        NILAI RISIKO (L × S)
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
            <span>Hierarki Pengendalian & PIC Tindak Lanjut</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pengendalian yang Sudah Ada (Existing Control)</span>}
                name="existingControl"
                rules={[{ required: true, message: "Pengendalian existing wajib diisi!" }]}
              >
                <Input.TextArea rows={3} placeholder="Contoh: Masker kain biasa, himbauan lisan" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pengendalian Tambahan / Tindakan Perbaikan</span>}
                name="additionalControl"
                rules={[{ required: true, message: "Pengendalian tambahan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Contoh: Pengadaan respirator gas kimia P100, instalasi exhaust chamber, SOP tertulis"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penanggung Jawab (PIC)</span>}
                name="responsiblePerson"
                rules={[{ required: true, message: "Penanggung jawab wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Siti Rahmawati (Tim K3)" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Target Waktu Penyelesaian</span>} name="targetDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/keselamatan/hiradc")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Simpan Penilaian HIRADC
            </Button>
          </div>
        </Form>
      </Card>

      {/* Modal Matriks */}
      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={likelihood}
        selectedSeverity={severity}
      />
    </div>
  );
};
