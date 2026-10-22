import React from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Image,
  Divider,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  FilePdfOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import { IHazardReport } from "../../../types/hazard";
import { StatusStepper } from "../../../components/common/StatusStepper";

const { Title, Text, Paragraph } = Typography;

export const HazardReportShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { query } = useOne<IHazardReport>({
    resource: "hazard-reports",
    id: id || "1",
  });

  const report = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !report) {
    return <Card loading={true} />;
  }

  const renderCategoryTag = (cat: string) => {
    switch (cat) {
      case "near_miss":
        return <Tag color="orange">Near Miss (Hampir Celaka)</Tag>;
      case "unsafe_action":
        return <Tag color="volcano">Unsafe Action (Tindakan Tidak Aman)</Tag>;
      case "unsafe_condition":
        return <Tag color="red">Unsafe Condition (Kondisi Tidak Aman)</Tag>;
      default:
        return <Tag>{cat}</Tag>;
    }
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
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/bahaya-resiko")} />
          <div>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              Detail Laporan Bahaya: {report.reportNumber}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Didaftarkan pada {report.date} oleh {report.reporterName}
            </Text>
          </div>
        </Space>

        <Space wrap>
          <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>
            Cetak Laporan
          </Button>
          {(currentUser?.role === "admin" || currentUser?.role === "tim_k3") && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#595959", borderColor: "#595959" }}
              onClick={() => navigate(`/keselamatan/bahaya-resiko/edit/${report.id}`)}
            >
              Ubah Status & Tindak Lanjut
            </Button>
          )}
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Informasi Laporan Bahaya"
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
                <strong>{report.reportNumber}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Kategori" span={1}>
                {renderCategoryTag(report.category)}
              </Descriptions.Item>
              <Descriptions.Item label="Tanggal Temuan" span={1}>
                {report.date}
              </Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={1}>
                {report.unit}
              </Descriptions.Item>
              <Descriptions.Item label="Lokasi Kejadian" span={2}>
                {report.location}
              </Descriptions.Item>
              <Descriptions.Item label="Pelapor" span={2}>
                {report.reporterName}
              </Descriptions.Item>
              <Descriptions.Item label="Deskripsi Temuan" span={2}>
                <Paragraph style={{ margin: 0 }}>{report.description}</Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label="Potensi Dampak" span={2}>
                <Text type="danger" strong>
                  {report.potentialImpact}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {report.photos && report.photos.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <Title level={5}>Foto Bukti Temuan</Title>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {report.photos.map((photo, index) => (
                    <Image
                      key={index}
                      width={180}
                      height={120}
                      src={photo}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Status & Alur Penanganan">
            <StatusStepper status={report.status} history={report.statusHistory} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
