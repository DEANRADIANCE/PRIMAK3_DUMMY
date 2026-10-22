import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Alert,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { calculateRiskLevel, RiskLevel } from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";

const { Title, Text, Paragraph } = Typography;

export const HiradcCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
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
          description="Pekerjaan/aktivitas ini berpotensi menyebabkan kematian atau cedera fatal! Dilarang memulai aktivitas sebelum pengendalian teknik mutlak diterapkan dan Surat Izin Kerja Aman (SIKA) diterbitkan."
          style={{ marginBottom: 20 }}
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
          style={{ marginBottom: 20 }}
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
          style={{ marginBottom: 20 }}
        />
      );
    }
    return (
      <Alert
        type="success"
        showIcon
        message={`TINGKAT RISIKO RENDAH (Nilai: ${riskScore})`}
        description="Risiko dapat diterima dengan pemantauan berkala prosedur kerja normal."
        style={{ marginBottom: 20 }}
      />
    );
  };

  const onFinish = (values: any) => {
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/hiradc")} />
          <div>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              Form Penilaian Risiko HIRADC Baru
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Identifikasi bahaya, evaluasi peluang & dampak, serta tentukan langkah mitigasi
            </Text>
          </div>
        </Space>

        <Button icon={<InfoCircleOutlined />} onClick={() => setMatrixModalOpen(true)}>
          Panduan Matriks Risiko
        </Button>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {/* Dynamic Risk Alert Banner */}
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
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Aktivitas / Proses Kerja"
                name="activity"
                rules={[{ required: true, message: "Aktivitas kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Fumigasi Arsip dengan Gas Beracun" size="large" />
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
                label="Potensi Bahaya (Hazard)"
                name="hazard"
                rules={[{ required: true, message: "Bahaya wajib diidentifikasi!" }]}
              >
                <Input placeholder="Contoh: Gas uap fumigan dan spora jamur aktif" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Risiko / Dampak Kejadian"
                name="risk"
                rules={[{ required: true, message: "Risiko wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Gangguan pernapasan akut, keracunan fatal" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Lokasi Spesifik" name="location" rules={[{ required: true }]}>
                <Input placeholder="Contoh: Lab Preservasi Lantai 1 Gedung B" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Kategori Bahaya" name="category" rules={[{ required: true }]}>
                <Select size="large">
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
              <Card
                size="small"
                title="Penilaian Risiko Awal (Risk Assessment)"
                style={{ backgroundColor: "#fafafa", marginBottom: 24 }}
              >
                <Row gutter={24} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label="Peluang Terjadi (Likelihood 1 - 5)" name="likelihood">
                      <Select size="large" value={likelihood} onChange={handleLikelihoodChange}>
                        <Select.Option value={1}>1 - Sangat Jarang</Select.Option>
                        <Select.Option value={2}>2 - Jarang</Select.Option>
                        <Select.Option value={3}>3 - Sedang / Mungkin</Select.Option>
                        <Select.Option value={4}>4 - Sering Terjadi</Select.Option>
                        <Select.Option value={5}>5 - Sangat Sering (Pasti)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label="Tingkat Keparahan (Severity 1 - 5)" name="severity">
                      <Select size="large" value={severity} onChange={handleSeverityChange}>
                        <Select.Option value={1}>1 - Tidak Signifikan (P3K)</Select.Option>
                        <Select.Option value={2}>2 - Ringan (&lt;3 hari istirahat)</Select.Option>
                        <Select.Option value={3}>3 - Sedang (Rawat Medis)</Select.Option>
                        <Select.Option value={4}>4 - Berat (Cacat Permanen)</Select.Option>
                        <Select.Option value={5}>5 - Katastropik (Kematian/Fatal)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center", padding: "8px 0" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        NILAI RISIKO (L × S)
                      </Text>
                      <div style={{ fontSize: 32, fontWeight: 700, color: "#262626" }}>
                        {riskScore}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                        Level: {riskLevel}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Hierarki Pengendalian */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Pengendalian yang Sudah Ada (Existing Control)"
                name="existingControl"
                rules={[{ required: true, message: "Pengendalian existing wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Contoh: Masker kain biasa, himbauan lisan"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Pengendalian Tambahan / Tindakan Perbaikan"
                name="additionalControl"
                rules={[{ required: true, message: "Pengendalian tambahan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Contoh: Pengadaan respirator gas kimia P100, instalasi exhaust chamber, SOP tertulis"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Penanggung Jawab (PIC)"
                name="responsiblePerson"
                rules={[{ required: true, message: "Penanggung jawab wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Siti Rahmawati (Tim K3)" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Target Waktu Penyelesaian" name="targetDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/keselamatan/hiradc")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{ background: "#595959", borderColor: "#595959" }}
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
