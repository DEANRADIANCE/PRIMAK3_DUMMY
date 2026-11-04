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
  Table,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import {
  IHiradc,
  getNfrColor,
  getNfrTagColor,
  calculateNfrRiskLevel,
} from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import { HiradcPrintModal } from "../../../components/common/HiradcPrintModal";

const { Title, Text, Paragraph } = Typography;

export const HiradcShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} style={{ borderRadius: 14 }} />;

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3" || currentUser?.role === "super_admin";

  const currentNfr = record.currentNfr ?? (record.currentLikelihood ? record.currentLikelihood * record.currentSeverity : record.riskScore);
  const currentRiskLevel = record.currentRiskLevel ?? calculateNfrRiskLevel(currentNfr);

  const residualNfr = record.residualNfr ?? (record.residualLikelihood ? record.residualLikelihood * record.residualSeverity : Math.max(1, Math.round(currentNfr * 0.4)));
  const residualRiskLevel = record.residualRiskLevel ?? calculateNfrRiskLevel(residualNfr);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/hiradc")}>
            Kembali
          </Button>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e293b" }}>
              Detail Dokumen HIRADC: {record.activity}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Unit: {record.unit} | Lokasi: {record.location} | ID: #{record.id}
            </Text>
          </div>
        </Space>

        <Space wrap>
          <Button icon={<InfoCircleOutlined />} onClick={() => setMatrixModalOpen(true)}>
            Panduan Matriks K3
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => setPrintModalOpen(true)}>
            Cetak / PDF
          </Button>
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#0284c7", borderColor: "#0284c7" }}
              onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}`)}
            >
              Ubah Data
            </Button>
          )}
        </Space>
      </div>

      {/* 2. Top Banner Card */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag color="cyan" style={{ borderRadius: 12, fontWeight: 700 }}>
                <SafetyCertificateOutlined /> HIRADC TERVERIFIKASI
              </Tag>
              {record.activityType && (
                <Tag color={record.activityType.includes("Non") ? "volcano" : "blue"} style={{ borderRadius: 12, fontWeight: 700 }}>
                  {record.activityType}
                </Tag>
              )}
              {record.controlStatus && (
                <Tag color={record.controlStatus === "Close" ? "green" : "orange"} style={{ borderRadius: 12, fontWeight: 700 }}>
                  Status: {record.controlStatus.toUpperCase()}
                </Tag>
              )}
            </div>
            <Title level={3} style={{ color: "#fff", margin: "0 0 8px 0" }}>
              {record.activity}
            </Title>
            <Paragraph style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
              <strong>Unit Kerja:</strong> {record.unit} | <strong>Lokasi:</strong> {record.location}
            </Paragraph>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {record.hazardClassification?.map((cls, idx) => (
                <Tag key={idx} color="geekblue" style={{ borderRadius: 6 }}>
                  {cls}
                </Tag>
              ))}
            </div>
          </Col>

          {/* Perbandingan Skor NFR Awal vs Sisa */}
          <Col xs={24} md={10}>
            <Row gutter={12}>
              <Col span={12}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <Text style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>NFR AWAL (EXISTING)</Text>
                  <div style={{ fontSize: 32, fontWeight: 800, color: getNfrColor(currentRiskLevel), lineHeight: 1.2 }}>
                    {currentNfr}
                  </div>
                  <Tag color={getNfrTagColor(currentRiskLevel)} style={{ fontWeight: 700, marginTop: 4 }}>
                    {currentRiskLevel.toUpperCase()}
                  </Tag>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
                    L: {record.currentLikelihood ?? record.likelihood} × S: {record.currentSeverity ?? record.severity}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <Text style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>NFR TARGET (SISA)</Text>
                  <div style={{ fontSize: 32, fontWeight: 800, color: getNfrColor(residualRiskLevel), lineHeight: 1.2 }}>
                    {residualNfr}
                  </div>
                  <Tag color={getNfrTagColor(residualRiskLevel)} style={{ fontWeight: 700, marginTop: 4 }}>
                    {residualRiskLevel.toUpperCase()}
                  </Tag>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
                    L: {record.residualLikelihood ?? 2} × S: {record.residualSeverity ?? 2}
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 3. Section Detail Dokumen */}
      <Card
        title={
          <Space>
            <AuditOutlined style={{ color: "#0284c7" }} />
            <span>1. Informasi Dokumen &amp; Penilaian Kerja</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="middle">
          <Descriptions.Item label="Unit Kerja">{record.unit}</Descriptions.Item>
          <Descriptions.Item label="Lokasi">{record.location}</Descriptions.Item>
          <Descriptions.Item label="Tanggal Penilaian">{record.assessmentDate || record.createdAt}</Descriptions.Item>
          <Descriptions.Item label="Pemeriksa / Tim Penilai">{record.assessor || "Tim K3 ANRI"}</Descriptions.Item>
          <Descriptions.Item label="Sifat Aktivitas">{record.activityType || "Rutin (R)"}</Descriptions.Item>
          <Descriptions.Item label="Klasifikasi Bahaya">
            {record.hazardClassification?.join(", ") || record.category || "Safety (S)"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 4. Section 5 Faktor Bahaya & Dampak Risiko */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ color: "#ef4444" }} />
            <span>2. Identifikasi 5 Faktor Bahaya &amp; Dampak Risiko</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle">
          <Descriptions.Item label="1. Bahaya Fisika">
            {record.hazardPhysics || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="2. Bahaya Kimia">
            {record.hazardChemical || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="3. Bahaya Biologi">
            {record.hazardBiology || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="4. Bahaya Ergonomi">
            {record.hazardErgonomics || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="5. Bahaya Psikososial" span={2}>
            {record.hazardPsychosocial || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Risiko / Penyakit Yang Ditimbulkan" span={2}>
            <Text strong style={{ color: "#dc2626" }}>
              {record.riskImpact || record.risk || "-"}
            </Text>
          </Descriptions.Item>
          {record.hazard && (
            <Descriptions.Item label="Ringkasan Bahaya (Hazard)" span={2}>
              <Text type="secondary">{record.hazard}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 5. Section Komparasi Pengendalian K3 (Existing vs Residual) */}
      <Row gutter={[20, 20]}>
        {/* Kolom Kiri: Pengendalian Saat Ini */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined style={{ color: "#f59e0b" }} />
                <span>3. Pengendalian Saat Ini (Existing Control)</span>
              </Space>
            }
            extra={
              <Tag color={getNfrTagColor(currentRiskLevel)} style={{ fontWeight: 700 }}>
                NFR: {currentNfr} ({currentRiskLevel})
              </Tag>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #fed7aa", height: "100%" }}
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Eliminasi">{record.currentElimination || "-"}</Descriptions.Item>
              <Descriptions.Item label="Substitusi">{record.currentSubstitution || "-"}</Descriptions.Item>
              <Descriptions.Item label="Engineering">{record.currentEngineering || "-"}</Descriptions.Item>
              <Descriptions.Item label="Administrasi">{record.currentAdministrative || "-"}</Descriptions.Item>
              <Descriptions.Item label="APD">{record.currentApd || "-"}</Descriptions.Item>
              <Descriptions.Item label="Evaluasi Matriks">
                <strong>Peluang (L): {record.currentLikelihood ?? record.likelihood}</strong> | <strong>Keparahan (S): {record.currentSeverity ?? record.severity}</strong> &rarr; <strong>NFR: {currentNfr}</strong>
              </Descriptions.Item>
              {record.existingControl && (
                <Descriptions.Item label="Catatan Tambahan">
                  <Text type="secondary">{record.existingControl}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* Kolom Kanan: Pengendalian Lanjutan */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <CheckCircleOutlined style={{ color: "#10b981" }} />
                <span>4. Pengendalian Lanjutan (Determining Control)</span>
              </Space>
            }
            extra={
              <Tag color={getNfrTagColor(residualRiskLevel)} style={{ fontWeight: 700 }}>
                Target NFR Sisa: {residualNfr} ({residualRiskLevel})
              </Tag>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #a7f3d0", height: "100%" }}
          >
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Eliminasi">{record.residualElimination || "-"}</Descriptions.Item>
              <Descriptions.Item label="Substitusi">{record.residualSubstitution || "-"}</Descriptions.Item>
              <Descriptions.Item label="Engineering">{record.residualEngineering || "-"}</Descriptions.Item>
              <Descriptions.Item label="Administrasi">{record.residualAdministrative || "-"}</Descriptions.Item>
              <Descriptions.Item label="APD">{record.residualApd || "-"}</Descriptions.Item>
              <Descriptions.Item label="Evaluasi Matriks Sisa">
                <strong>Peluang (L): {record.residualLikelihood ?? 2}</strong> | <strong>Keparahan (S): {record.residualSeverity ?? 2}</strong> &rarr; <strong>NFR Target: {residualNfr}</strong>
              </Descriptions.Item>
              {record.additionalControl && (
                <Descriptions.Item label="Catatan Mitigasi">
                  <Text type="secondary">{record.additionalControl}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* 6. Section Durasi, Status, PIC & Target Waktu */}
      <Card
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: "#0284c7" }} />
            <span>5. Durasi Pengendalian &amp; Penanggung Jawab</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 4 }} size="middle">
          <Descriptions.Item label="Durasi Pengendalian">
            <Tag color="blue" style={{ fontWeight: 700 }}>
              {record.controlDuration || "30 Hari"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status Pengendalian">
            <Tag color={record.controlStatus === "Close" ? "green" : "orange"} style={{ fontWeight: 700 }}>
              {record.controlStatus || "Open"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Penanggung Jawab (PIC)">
            <strong>{record.responsiblePerson}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Target Penyelesaian">
            {record.targetDate}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 7. Riwayat Status & Log Penilaian */}
      {record.statusHistory && record.statusHistory.length > 0 && (
        <Card
          title="Riwayat Status & Validasi Penilaian"
          bordered={false}
          style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
        >
          <Table
            dataSource={record.statusHistory}
            rowKey={(item, index) => `${item.status}-${index}`}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (val: string) => <Tag color="blue">{val}</Tag>,
              },
              {
                title: "Divalidasi Oleh",
                dataIndex: "changedBy",
                key: "changedBy",
              },
              {
                title: "Waktu",
                dataIndex: "changedAt",
                key: "changedAt",
              },
              {
                title: "Catatan",
                dataIndex: "notes",
                key: "notes",
                render: (val?: string) => val || "-",
              },
            ]}
          />
        </Card>
      )}

      {/* Modal Matriks */}
      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={record.currentLikelihood ?? record.likelihood}
        selectedSeverity={record.currentSeverity ?? record.severity}
      />

      {/* Modal Format Cetak PDF & Text Editor */}
      <HiradcPrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        items={[record]}
        documentTitle={`HIRADC - ${record.activity}`}
      />
    </div>
  );
};
