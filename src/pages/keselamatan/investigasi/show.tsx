import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Table,
  Divider,
  Row,
  Col,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne } from "@refinedev/core";
import { IInvestigation } from "../../../types/investigation";

const { Title, Text, Paragraph } = Typography;

export const InvestigationShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { query } = useOne<IInvestigation>({
    resource: "investigations",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} />;

  // TODO: Format investigasi ini berdasarkan formulir investigasi standar K3 internasional/nasional.
  // Sesuaikan dengan dokumen acuan jika telah dapat diakses:
  // https://docs.google.com/document/d/1rNUR9pUWrm2ZINazOkyObvDoDK2eQnPM/edit

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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/investigasi")} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Formulir Laporan Investigasi Insiden K3 (INV-2026-{String(record.id).padStart(3, "0")})
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Tautan Insiden: {record.relatedReportNumber} | Tanggal Kejadian: {record.incidentDate}
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
            Cetak Form PDF
          </Button>
        </Space>
      </div>

      {/* Kop Surat Formulir Resmi */}
      <Card style={{ marginBottom: 24, padding: "12px 16px" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: 16, marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, letterSpacing: 1 }}>
            KLINIK PRATAMA ARSIP NASIONAL REPUBLIK INDONESIA
          </Title>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#595959" }}>
            UNIT KESELAMATAN DAN KESEHATAN KERJA (K3)
          </div>
          <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>
            Jl. Ampera Raya No. 7, Cilandak Timur, Pasar Minggu, Jakarta Selatan 12560
          </div>
          <Divider style={{ margin: "12px 0 0" }} />
          <Title level={4} style={{ margin: "12px 0 0", textTransform: "uppercase" }}>
            BERITA ACARA INVESTIGASI KECELAKAAN KERJA & INSIDEN
          </Title>
        </div>

        {/* 1. Data Kejadian */}
        <Title level={5}>I. DATA KEJADIAN & INFORMASI AWAL</Title>
        <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="Nomor Berita Acara" span={1}>
            INV-2026-{String(record.id).padStart(3, "0")}
          </Descriptions.Item>
          <Descriptions.Item label="Tautan Nomor Laporan" span={1}>
            <Tag color="volcano">{record.relatedReportNumber}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Waktu Kejadian" span={1}>
            {record.incidentDate} pukul {record.incidentTime} WIB
          </Descriptions.Item>
          <Descriptions.Item label="Tempat / Lokasi Kejadian" span={1}>
            {record.incidentLocation}
          </Descriptions.Item>
          <Descriptions.Item label="Ringkasan Insiden" span={2}>
            {record.incidentDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Rekonstruksi Kronologi" span={2}>
            {record.chronology}
          </Descriptions.Item>
        </Descriptions>

        {/* 2. Saksi */}
        <Title level={5}>II. KETERANGAN SAKSI DI TEMPAT KEJADIAN</Title>
        <Table
          size="small"
          pagination={false}
          dataSource={record.witnesses || []}
          rowKey="name"
          scroll={{ x: 600 }}
          style={{ marginBottom: 20 }}
          columns={[
            { title: "Nama Saksi", dataIndex: "name", width: 180 },
            { title: "Jabatan & Unit", dataIndex: "position", width: 200, render: (v: any, r: any) => `${v} - ${r.unit}` },
            { title: "Keterangan / Kesaksian yang Diberikan", dataIndex: "statement" },
          ]}
        />

        {/* 3. Analisis Penyebab */}
        <Title level={5}>III. ANALISIS PENYEBAB INSIDEN (ACCIDENT CAUSATION ANALYSIS)</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} md={8}>
            <Card size="small" title="Penyebab Langsung (Direct Causes)" style={{ height: "100%", background: "#fffbe6" }}>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
                {record.directCauses?.map((c, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{c}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="Penyebab Tidak Langsung (Indirect Causes)" style={{ height: "100%", background: "#e6f7ff" }}>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
                {record.indirectCauses?.map((c, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{c}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title="Akar Masalah (Root Causes - Sistem K3)" style={{ height: "100%", background: "#fff1f0" }}>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
                {record.rootCauses?.map((c, i) => (
                  <li key={i} style={{ marginBottom: 6, fontWeight: 500 }}>{c}</li>
                ))}
              </ul>
            </Card>
          </Col>
        </Row>

        {/* 4. Tindakan Korektif */}
        <Title level={5}>IV. REKOMENDASI & TINDAKAN KOREKTIF (CORRECTIVE ACTIONS)</Title>
        <Table
          size="small"
          pagination={false}
          dataSource={record.correctiveActions || []}
          rowKey="action"
          scroll={{ x: 650 }}
          style={{ marginBottom: 24 }}
          columns={[
            { title: "No.", width: 50, render: (_, __, i) => i + 1 },
            { title: "Rencana Tindakan Korektif", dataIndex: "action" },
            { title: "Penanggung Jawab (PIC)", dataIndex: "responsiblePerson", width: 180 },
            { title: "Target Waktu", dataIndex: "targetDate", width: 120 },
            {
              title: "Status",
              dataIndex: "status",
              width: 120,
              render: (v: any) => <Tag color={v === "Selesai" ? "green" : "blue"}>{v}</Tag>,
            },
          ]}
        />

        {/* 5. Tanda Tangan Pengesahan */}
        <Title level={5}>V. LEMBAR PENGESAHAN HASIL INVESTIGASI</Title>
        <Row gutter={24} style={{ marginTop: 16 }}>
          <Col span={12}>
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                background: "#fafafa",
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                Koordinator Tim Investigasi K3:
              </Text>
              <div style={{ margin: "24px 0 16px" }}>
                {record.k3TeamSignature?.signed ? (
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: "4px 12px", fontSize: 13 }}>
                    Ditandatangani Digital ({record.k3TeamSignature.date})
                  </Tag>
                ) : (
                  <Tag color="default">Belum Ditandatangani</Tag>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{record.k3TeamSignature?.name}</div>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.k3TeamSignature?.position}</div>
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                padding: 16,
                textAlign: "center",
                background: "#fafafa",
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                Kepala Unit Kerja Terkait:
              </Text>
              <div style={{ margin: "24px 0 16px" }}>
                {record.unitHeadSignature?.signed ? (
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: "4px 12px", fontSize: 13 }}>
                    Disetujui & Ditandatangani ({record.unitHeadSignature.date})
                  </Tag>
                ) : (
                  <Tag color="default">Belum Ditandatangani</Tag>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{record.unitHeadSignature?.name}</div>
              <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.unitHeadSignature?.position}</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
