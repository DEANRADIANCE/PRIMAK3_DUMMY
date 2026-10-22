import React from "react";
import { Table, Button, Space, Tag, Input, Card, Typography, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IInvestigation } from "../../../types/investigation";

const { Title, Text } = Typography;

export const InvestigationList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { tableProps, setFilters } = useTable<IInvestigation>({
    resource: "investigations",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteInvestigation } = useDelete();

  const canCreate = currentUser?.role === "admin" || currentUser?.role === "tim_k3" || currentUser?.role === "kepala_unit";

  const renderStatus = (st: string) => {
    switch (st) {
      case "completed":
        return <Tag color="green">Selesai Ditandatangani</Tag>;
      case "in_progress":
        return <Tag color="blue">Sedang Investigasi</Tag>;
      case "draft":
        return <Tag color="default">Draft</Tag>;
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const columns = [
    {
      title: "No. Investigasi",
      key: "id",
      width: 140,
      render: (_: any, record: IInvestigation) => (
        <a onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)} style={{ fontWeight: 600 }}>
          INV-2026-{String(record.id).padStart(3, "0")}
        </a>
      ),
    },
    {
      title: "Tautan Insiden",
      dataIndex: "relatedReportNumber",
      key: "relatedReportNumber",
      width: 140,
      render: (val: string) => <Tag color="volcano">{val}</Tag>,
    },
    {
      title: "Tanggal & Lokasi Insiden",
      key: "incident",
      width: 200,
      render: (_: any, record: IInvestigation) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.incidentLocation}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.incidentDate} {record.incidentTime} WIB
          </Text>
        </div>
      ),
    },
    {
      title: "Akar Masalah (Root Causes)",
      key: "rootCauses",
      width: 220,
      ellipsis: true,
      render: (_: any, record: IInvestigation) => (
        <span>{record.rootCauses?.[0] || "-"}</span>
      ),
    },
    {
      title: "Ketua Tim Investigasi",
      dataIndex: "investigatorName",
      key: "investigatorName",
      width: 180,
    },
    {
      title: "Status Form",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (val: string) => renderStatus(val),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 130,
      render: (_: any, record: IInvestigation) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)}
          >
            Form
          </Button>
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Berkas Investigasi?"
              onConfirm={() =>
                deleteInvestigation({
                  resource: "investigations",
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
            Investigasi Insiden & Kecelakaan Kerja
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Analisis akar penyebab kecelakaan (5 Why / Fishbone) dan penetapan tindakan korektif
          </Text>
        </div>

        {canCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate("/keselamatan/investigasi/create")}
          >
            Investigasi Baru
          </Button>
        )}
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Cari nomor laporan, lokasi, atau investigator..."
            prefix={<SearchOutlined />}
            style={{ width: 320 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "incidentLocation", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />
        </div>

        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1000 }}
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
