import React, { useState, useEffect } from "react";
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
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs from "dayjs";
import { IHiradc, calculateRiskLevel, RiskLevel } from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";

const { Title, Text } = Typography;

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

  const onFinish = (values: any) => {
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

  if (isLoading || !record) return <Card loading={true} />;

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
              Ubah Data Penilaian HIRADC
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {record.activity}
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
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Aktivitas Kerja" name="activity" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Unit Kerja" name="unit" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Potensi Bahaya" name="hazard" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Risiko Kejadian" name="risk" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Peluang (Likelihood 1 - 5)" name="likelihood">
                <Select size="large" value={likelihood} onChange={(v) => setLikelihood(v)}>
                  <Select.Option value={1}>1 - Sangat Jarang</Select.Option>
                  <Select.Option value={2}>2 - Jarang</Select.Option>
                  <Select.Option value={3}>3 - Sedang / Mungkin</Select.Option>
                  <Select.Option value={4}>4 - Sering Terjadi</Select.Option>
                  <Select.Option value={5}>5 - Sangat Sering</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Keparahan (Severity 1 - 5)" name="severity">
                <Select size="large" value={severity} onChange={(v) => setSeverity(v)}>
                  <Select.Option value={1}>1 - Tidak Signifikan</Select.Option>
                  <Select.Option value={2}>2 - Ringan</Select.Option>
                  <Select.Option value={3}>3 - Sedang</Select.Option>
                  <Select.Option value={4}>4 - Berat</Select.Option>
                  <Select.Option value={5}>5 - Katastropik</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Alert
                message={`Nilai Risiko Terhitung: ${riskScore} (Level: ${riskLevel.toUpperCase()})`}
                type={riskLevel === "extreme" ? "error" : riskLevel === "high" ? "warning" : "info"}
                showIcon
                style={{ marginBottom: 16 }}
              />
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Pengendalian Existing" name="existingControl" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Pengendalian Tambahan" name="additionalControl" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Penanggung Jawab" name="responsiblePerson" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Target Selesai" name="targetDate" rules={[{ required: true }]}>
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
              loading={isUpdating}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Simpan Perubahan
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
