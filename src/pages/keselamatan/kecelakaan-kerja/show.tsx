import React from "react";
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
  FilePdfOutlined,
  AlertOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import { IAccidentReport } from "../../../types/accident";
import { TaspenCountdown } from "../../../components/common/TaspenCountdown";
import { StatusStepper } from "../../../components/common/StatusStepper";

const { Title, Text, Paragraph } = Typography;

export const AccidentReportShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { query } = useOne<IAccidentReport>({
    resource: "accident-reports",
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
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/kecelakaan")} />
          <div>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              Detail Kecelakaan Kerja: {record.reportNumber}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Korban: {record.victim.name} ({record.victim.employmentStatus}) | Tanggal: {record.date}
            </Text>
          </div>
        </Space>

        <Space wrap>
          <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>
            Cetak Berita Acara (PDF)
          </Button>
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#595959", borderColor: "#595959" }}
              onClick={() => navigate(`/keselamatan/kecelakaan/edit/${record.id}`)}
            >
              Ubah Data & TASPEN
            </Button>
          )}
        </Space>
      </div>

      {/* Warning Durasi TASPEN */}
      <div style={{ marginBottom: 20 }}>
        <TaspenCountdown
          accidentDate={record.date}
          employmentStatus={record.victim.employmentStatus}
          taspenStatus={record.taspenStatus}
          showBanner={true}
        />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Data Kejadian */}
          <Card
            title="Data Kejadian & Lokasi"
            bordered={false}
            style={{
              marginBottom: 24,
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Nomor Laporan" span={1}>
                <strong>{record.reportNumber}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Kecelakaan" span={1}>
                {record.accidentType}
              </Descriptions.Item>
              <Descriptions.Item label="Waktu Kejadian" span={1}>
                {record.date} pukul {record.time} WIB
              </Descriptions.Item>
              <Descriptions.Item label="Tingkat Keparahan" span={1}>
                <Tag color={record.severityLevel === "ringan" ? "green" : "orange"}>
                  {record.severityLevel.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Lokasi Kejadian" span={2}>
                {record.location}
              </Descriptions.Item>
              <Descriptions.Item label="Kronologi Lengkap" span={2}>
                <Paragraph style={{ margin: 0 }}>{record.chronology}</Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Data Korban */}
          <Card
            title="Identitas Korban & Penanganan Medis"
            bordered={false}
            style={{
              marginBottom: 24,
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Nama Korban" span={1}>
                <strong>{record.victim.name}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Status Kepegawaian" span={1}>
                <Tag color={record.victim.employmentStatus === "ASN" ? "blue" : "purple"}>
                  {record.victim.employmentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="NIP / Identitas" span={1}>
                {record.victim.nip}
              </Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={1}>
                {record.victim.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Jenis Cedera" span={2}>
                <Text type="danger" strong>
                  {record.victim.injuryType}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tindakan Medis Klinik" span={2}>
                {record.victim.medicalAction}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Penanganan Tim K3 */}
          <Card
            title="Penanganan & Pendampingan Tim K3"
            bordered={false}
            style={{
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Petugas K3" span={1}>
                {record.k3Team.name}
              </Descriptions.Item>
              <Descriptions.Item label="Jabatan" span={1}>
                {record.k3Team.position}
              </Descriptions.Item>
              <Descriptions.Item label="Tindakan Pengamanan" span={2}>
                {record.k3Team.handling}
              </Descriptions.Item>
              <Descriptions.Item label="Status Klaim TASPEN" span={2}>
                <Tag color={record.taspenStatus === "selesai" ? "success" : "processing"}>
                  {record.taspenStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Status Laporan">
            <StatusStepper status={record.status} history={record.statusHistory} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
