import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Divider,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import { IHiradc } from "../../../types/hiradc";
import { RiskBadge } from "../../../components/common/RiskBadge";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";

const { Title, Text, Paragraph } = Typography;

export const HiradcShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} />;

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

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
              Detail Penilaian HIRADC: {record.activity}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Unit: {record.unit} | Target: {record.targetDate}
            </Text>
          </div>
        </Space>

        <Space wrap>
          <Button icon={<InfoCircleOutlined />} onClick={() => setMatrixModalOpen(true)}>
            Panduan Matriks
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>
            Cetak PDF
          </Button>
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#595959", borderColor: "#595959" }}
              onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}`)}
            >
              Ubah Data
            </Button>
          )}
        </Space>
      </div>

      <Card
        bordered={false}
        style={{
          marginBottom: 24,
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Aktivitas Kerja" span={2}>
            <strong>{record.activity}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Unit Kerja Terkait" span={1}>
            {record.unit}
          </Descriptions.Item>

          <Descriptions.Item label="Lokasi" span={1}>
            {record.location}
          </Descriptions.Item>

          <Descriptions.Item label="Identifikasi Bahaya (Hazard)" span={2}>
            <Text strong style={{ color: "#cf1322" }}>
              {record.hazard}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Risiko / Dampak Kejadian" span={2}>
            {record.risk}
          </Descriptions.Item>

          <Descriptions.Item label="Peluang (Likelihood)" span={1}>
            Skala {record.likelihood} dari 5
          </Descriptions.Item>

          <Descriptions.Item label="Keparahan (Severity)" span={1}>
            Skala {record.severity} dari 5
          </Descriptions.Item>

          <Descriptions.Item label="Nilai & Tingkat Risiko" span={2}>
            <Space size="large">
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                Skor: {record.riskScore} ({record.likelihood} × {record.severity})
              </span>
              <RiskBadge level={record.riskLevel} score={record.riskScore} />
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Pengendalian yang Sudah Ada" span={2}>
            {record.existingControl}
          </Descriptions.Item>

          <Descriptions.Item label="Pengendalian Tambahan (Mitigasi)" span={2}>
            <Paragraph style={{ margin: 0, fontWeight: 500 }}>{record.additionalControl}</Paragraph>
          </Descriptions.Item>

          <Descriptions.Item label="Penanggung Jawab (PIC)" span={1}>
            <strong>{record.responsiblePerson}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Target Tanggal Penyelesaian" span={1}>
            {record.targetDate}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={record.likelihood}
        selectedSeverity={record.severity}
      />
    </div>
  );
};
