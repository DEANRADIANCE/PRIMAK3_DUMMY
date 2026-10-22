import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Table,
  Progress,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, FilePdfOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne } from "@refinedev/core";
import { IInspection } from "../../../types/inspection";

const { Title, Text, Paragraph } = Typography;

export const InspectionShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { query } = useOne<IInspection>({
    resource: "inspections",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} />;

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#52c41a";
    if (score >= 70) return "#faad14";
    return "#ff4d4f";
  };

  const renderStatusTag = (status: string) => {
    if (status === "compliant") return <Tag color="success">SESUAI</Tag>;
    if (status === "non_compliant") return <Tag color="error">TIDAK SESUAI</Tag>;
    return <Tag color="default">N/A</Tag>;
  };

  const checklistColumns = [
    {
      title: "No.",
      width: 50,
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "Item Pemeriksaan K3",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Nilai Terukur vs NAB",
      key: "measured",
      width: 180,
      render: (_: any, item: any) =>
        item.threshold !== undefined ? (
          <span>
            {item.measuredValue} {item.unit} (Standar: {item.threshold} {item.unit})
          </span>
        ) : (
          <span style={{ color: "#bfbfbf" }}>-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (st: string) => renderStatusTag(st),
    },
    {
      title: "Catatan Auditor",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/inspeksi")} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Hasil Audit Inspeksi: {record.unit} ({record.date})
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Kategori: {record.type.toUpperCase()} | Auditor: {record.inspector}
            </Text>
          </div>
        </Space>

        <Space>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => window.print()}
          >
            Cetak Laporan Inspeksi
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card title="Informasi Pelaksanaan & Hasil Audit" style={{ marginBottom: 24 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Kategori Tab" span={1}>
                <Tag color="blue">{record.type.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Audit" span={1}>
                {record.date}
              </Descriptions.Item>
              <Descriptions.Item label="Auditor" span={1}>
                {record.inspector}
              </Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={1}>
                {record.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Lokasi Spesifik" span={2}>
                {record.location}
              </Descriptions.Item>
              <Descriptions.Item label="Temuan Utama" span={2}>
                <Paragraph style={{ margin: 0 }}>{record.findings}</Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label="Tindak Lanjut yang Harus Dilakukan" span={2}>
                <Paragraph style={{ margin: 0, fontWeight: 500 }}>{record.followUp}</Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label="Penanggung Jawab (PIC)" span={2}>
                <strong>{record.responsiblePerson}</strong>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Skor Kepatuhan K3" style={{ textAlign: "center", marginBottom: 24 }}>
            <Progress
              type="dashboard"
              percent={record.complianceScore}
              strokeColor={getScoreColor(record.complianceScore)}
            />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: getScoreColor(record.complianceScore) }}>
                {record.complianceScore >= 80 ? "Memenuhi Standar K3" : "Perlu Tindakan Koreksi"}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Kontribusi ke Indeks Kepatuhan Dashboard Manajemen
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            title="Rincian Checklist Parameter Audit K3"
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <Table
              size="small"
              pagination={false}
              dataSource={record.checklist}
              columns={checklistColumns}
              rowKey="id"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
