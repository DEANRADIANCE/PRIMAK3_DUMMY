import React, { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Card,
  Typography,
  Input,
  Popconfirm,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  AlertOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IInspection, InspectionType } from "../../../types/inspection";

const { Title, Text } = Typography;

export const InspectionList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [activeTab, setActiveTab] = useState<InspectionType>("environment");

  const { tableProps, setFilters } = useTable<IInspection>({
    resource: "inspections",
    filters: { initial: [{ field: "type", operator: "eq", value: "environment" }] },
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteInspection } = useDelete();

  const handleTabChange = (key: string) => {
    const typeKey = key as InspectionType;
    setActiveTab(typeKey);
    setFilters([{ field: "type", operator: "eq", value: typeKey }], "replace");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#52c41a";
    if (score >= 70) return "#faad14";
    return "#ff4d4f";
  };

  const columns = [
    {
      title: "No.",
      width: 50,
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "Tanggal Inspeksi",
      dataIndex: "date",
      key: "date",
      width: 130,
      render: (val: string, record: IInspection) => (
        <a onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)} style={{ fontWeight: 600 }}>
          {val}
        </a>
      ),
    },
    {
      title: "Lokasi & Unit",
      key: "location",
      width: 200,
      render: (_: any, record: IInspection) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.location}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Auditor / Inspektur",
      dataIndex: "inspector",
      key: "inspector",
      width: 170,
    },
    {
      title: "Skor Kepatuhan",
      dataIndex: "complianceScore",
      key: "complianceScore",
      width: 160,
      render: (score: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Progress
            percent={score}
            size="small"
            strokeColor={getScoreColor(score)}
            style={{ width: 100 }}
          />
          <Text strong style={{ color: getScoreColor(score) }}>
            {score}%
          </Text>
        </div>
      ),
    },
    {
      title: "Catatan Temuan Utama",
      dataIndex: "findings",
      key: "findings",
      width: 220,
      ellipsis: true,
    },
    {
      title: "PIC Tindak Lanjut",
      dataIndex: "responsiblePerson",
      key: "responsiblePerson",
      width: 150,
    },
    {
      title: "Aksi",
      key: "actions",
      width: 110,
      render: (_: any, record: IInspection) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/keselamatan/inspeksi/show/${record.id}`)}
          />
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Data Inspeksi?"
              onConfirm={() =>
                deleteInspection({
                  resource: "inspections",
                  id: record.id,
                })
              }
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "environment", label: "Pemantauan Lingkungan" },
    { key: "emergency", label: "Sarpras Tanggap Darurat" },
    { key: "behavior", label: "Perilaku Kerja" },
    { key: "5r", label: "5R (Ringkas, Rapi, Resik, Rawat, Rajin)" },
    { key: "apd", label: "Alat Pelindung Diri (APD)" },
    { key: "tools", label: "Alat Kerja & Mesin" },
  ];

  const tabDescriptions: Record<InspectionType, string> = {
    environment: "Pengukuran intensitas cahaya, kebisingan, suhu/kelembapan, dan kadar gas terukur vs NAB.",
    emergency: "Inspeksi kesiapan tabung APAR, hydrant, emergency exit lamp, kotak P3K, dan assembly point.",
    behavior: "Pengamatan langsung kedisiplinan APD, ergonomi postur kerja, dan ketaatan SOP operasional.",
    "5r": "Audit Ringkas, Rapi, Resik, Rawat, dan Rajin di area kerja depo dan perkantoran.",
    apd: "Pemeriksaan kelayakan dan ketersediaan stok helm, respirator, kacamata, dan sarung tangan.",
    tools: "Pemeriksaan mekanisme safety emergency switch mesin shredder arsip dan tangga dorong gudang.",
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
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Audit & Inspeksi K3 Terpadu
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Pemeriksaan rutin kepatuhan K3 multi-parameter terintegrasi dengan Skor Kepatuhan Dashboard
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "#595959", borderColor: "#595959" }}
          onClick={() => navigate(`/keselamatan/inspeksi/create?type=${activeTab}`)}
        >
          Inspeksi Baru ({tabItems.find((t) => t.key === activeTab)?.label})
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
        <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

        <div
          style={{
            background: "#fafafa",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            <strong>Fokus Pemeriksaan:</strong> {tabDescriptions[activeTab]}
          </Text>
        </div>

        <Table
          {...tableProps}
          columns={columns as any}
          rowKey="id"
          scroll={{ x: 1050 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>
    </div>
  );
};
