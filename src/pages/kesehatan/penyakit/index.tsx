import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Progress,
  Divider,
  Alert,
  Tooltip,
} from "antd";
import {
  MedicineBoxOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { initialDiseases, initialDiseaseTrends } from "../../../mocks/diseases";

const { Title, Text, Paragraph } = Typography;

export const DiseasePage: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState("Semua");

  const topDiseases = [...initialDiseases].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...topDiseases.map((d) => d.count), 1);

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
        <div>
          <Space align="center" wrap>
            <Title level={4} style={{ margin: 0, color: "#262626" }}>
              Surveilans Penyakit & Kesehatan Kerja
            </Title>
            <Tag color="volcano" style={{ fontWeight: 600 }}>
              DATA COMING SOON
            </Tag>
          </Space>
          <Text type="secondary" style={{ fontSize: 13, display: "block", marginTop: 4 }}>
            Pemantauan morbiditas penyakit umum dan penyakit akibat kerja (PAK) pegawai ANRI
          </Text>
        </div>

        <Tooltip title="Fitur impor data rekam medis CSV akan tersedia saat integrasi database Klinik SIMRS">
          <Button icon={<UploadOutlined />} disabled>
            Impor CSV Rekam Medis (Non-aktif)
          </Button>
        </Tooltip>
      </div>

      <Alert
        message="Integrasi Modul Penyakit Sedang Disiapkan"
        description="Data rincian rekam medis pasien individu dirahasiakan dan saat ini sedang dalam proses sinkronisasi dengan Sistem Informasi Klinik Pratama ANRI. Grafik agregat tren penyakit di bawah ini disiapkan untuk analisis epidemiologi kesehatan kerja."
        type="info"
        showIcon
        style={{ marginBottom: 20, borderRadius: 8 }}
      />

      <Row gutter={[20, 20]}>
        {/* Grafik 1: Bar Penyakit Terbanyak */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined style={{ color: "#1890ff" }} />
                <span>Penyakit Terbanyak (Bulan Maret 2026)</span>
              </Space>
            }
            extra={<Tag color="blue">Klinik Pratama ANRI</Tag>}
            bordered={false}
            style={{
              height: "100%",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {topDiseases.map((d, index) => {
                const percent = Math.round((d.count / maxCount) * 100);
                return (
                  <div key={d.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 13 }}>
                        {index + 1}. {d.name}
                      </Text>
                      <Text style={{ fontSize: 13, fontWeight: 600 }}>
                        {d.count} Kasus ({percent}%)
                      </Text>
                    </div>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      strokeColor={index === 0 ? "#ff4d4f" : index === 1 ? "#faad14" : "#595959"}
                      size={["100%", 10]}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Grafik 2: Tren Penyakit Per Bulan */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: "#52c41a" }} />
                <span>Tren Fluktuasi Kasus Penyakit (Jan - Mar 2026)</span>
              </Space>
            }
            bordered={false}
            style={{
              height: "100%",
              borderRadius: 12,
              border: "1px solid #e8e8e8",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Perbandingan tren kasus bulanan 4 diagnosis terbanyak:
              </Text>
            </div>

            <div style={{ height: 220, display: "flex", alignItems: "flex-end", gap: 16, paddingTop: 20 }}>
              {["Flu / ISPA", "Diare", "DBD", "Radang"].map((diseaseName, idx) => {
                const records = initialDiseaseTrends.filter((t) => t.disease === diseaseName);
                const colors = ["#ff4d4f", "#faad14", "#1890ff", "#722ed1"];
                return (
                  <div key={idx} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: 140,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: 4,
                      }}
                    >
                      {records.map((r, rIdx) => (
                        <div
                          key={rIdx}
                          style={{
                            width: 14,
                            height: `${(r.count / 50) * 100}%`,
                            backgroundColor: colors[idx],
                            opacity: rIdx === 0 ? 0.4 : rIdx === 1 ? 0.7 : 1,
                            borderRadius: "3px 3px 0 0",
                          }}
                          title={`${r.month}: ${r.count} kasus`}
                        />
                      ))}
                    </div>
                    <div style={{ marginTop: 10, fontWeight: 600, fontSize: 12 }}>{diseaseName}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {records[records.length - 1]?.count || 0} kasus (Mar)
                    </Text>
                  </div>
                );
              })}
            </div>

            <Divider style={{ margin: "16px 0 12px" }} />
            <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 12, color: "#8c8c8c" }}>
              <span>■ Jan (Transparan)</span>
              <span>■ Feb (Sedang)</span>
              <span>■ Mar (Penuh)</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
