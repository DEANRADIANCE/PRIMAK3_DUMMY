import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IHiradc } from "../../../types/hiradc";
import { RiskBadge } from "../../../components/common/RiskBadge";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";

const { Title, Text } = Typography;

export const HiradcList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { tableProps, setFilters } = useTable<IHiradc>({
    resource: "hiradc",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteHiradc } = useDelete();

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Aktivitas / Kegiatan Kerja",
      dataIndex: "activity",
      key: "activity",
      width: 220,
      render: (val: string, record: IHiradc) => (
        <a onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)} style={{ fontWeight: 600 }}>
          {val}
        </a>
      ),
    },
    {
      title: "Bahaya & Risiko",
      key: "hazard_risk",
      width: 250,
      render: (_: any, record: IHiradc) => (
        <div>
          <div>
            <strong>Bahaya:</strong> {record.hazard}
          </div>
          <div style={{ color: "#595959", fontSize: 13, marginTop: 2 }}>
            <strong>Risiko:</strong> {record.risk}
          </div>
        </div>
      ),
    },
    {
      title: "L × S",
      key: "score_calc",
      width: 90,
      align: "center" as const,
      render: (_: any, record: IHiradc) => (
        <span style={{ fontWeight: 600 }}>
          {record.likelihood} × {record.severity}
        </span>
      ),
    },
    {
      title: "Tingkat Risiko",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 140,
      render: (level: string, record: IHiradc) => (
        <RiskBadge level={level} score={record.riskScore} />
      ),
    },
    {
      title: "Pengendalian Tambahan",
      dataIndex: "additionalControl",
      key: "additionalControl",
      width: 200,
      ellipsis: true,
    },
    {
      title: "PIC & Target",
      key: "pic_target",
      width: 160,
      render: (_: any, record: IHiradc) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{record.responsiblePerson}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Target: {record.targetDate}
          </Text>
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 130,
      render: (_: any, record: IHiradc) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
          />
          {canEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}`)}
            />
          )}
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Penilaian HIRADC ini?"
              onConfirm={() =>
                deleteHiradc({
                  resource: "hiradc",
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
            HIRADC (Identifikasi Bahaya & Penilaian Risiko)
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Hazard Identification, Risk Assessment, and Determining Control
          </Text>
        </div>

        <Space wrap>
          <Button icon={<InfoCircleOutlined />} onClick={() => setMatrixModalOpen(true)}>
            Panduan Matriks Risiko 5×5
          </Button>

          {canEdit && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#595959", borderColor: "#595959" }}
              onClick={() => navigate("/keselamatan/hiradc/create")}
            >
              Penilaian Risiko Baru
            </Button>
          )}
        </Space>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        {/* Search & Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Cari aktivitas, bahaya, atau penanggung jawab..."
            prefix={<SearchOutlined />}
            style={{ width: 320 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "activity", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />

          <Select
            placeholder="Tingkat Risiko"
            style={{ width: 160 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "riskLevel", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="low">Rendah (1-4)</Select.Option>
            <Select.Option value="medium">Sedang (5-9)</Select.Option>
            <Select.Option value="high">Tinggi (10-16)</Select.Option>
            <Select.Option value="extreme">Ekstrem (17-25)</Select.Option>
          </Select>
        </div>

        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* Modal Matriks Risiko 5x5 */}
      <RiskMatrixModal open={matrixModalOpen} onClose={() => setMatrixModalOpen(false)} />
    </div>
  );
};
