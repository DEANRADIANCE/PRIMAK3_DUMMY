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
  Modal,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity } from "@refinedev/core";
import { IAccidentReport, TaspenStatus } from "../../../types/accident";
import { TaspenCountdown } from "../../../components/common/TaspenCountdown";

const { Title, Text } = Typography;

export const AccidentReportList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { tableProps, setFilters } = useTable<IAccidentReport>({
    resource: "accident-reports",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteAccident } = useDelete();

  const renderSeverityTag = (sev: string) => {
    switch (sev) {
      case "ringan":
        return <Tag color="green">Ringan</Tag>;
      case "sedang":
        return <Tag color="gold">Sedang</Tag>;
      case "berat":
        return <Tag color="orange">Berat</Tag>;
      case "meninggal":
        return <Tag color="red">Meninggal</Tag>;
      default:
        return <Tag>{sev}</Tag>;
    }
  };

  const renderTaspenStatus = (st: TaspenStatus) => {
    switch (st) {
      case "belum":
        return <Tag color="red">Belum Diajukan</Tag>;
      case "diajukan":
        return <Tag color="processing">Dalam Pengajuan</Tag>;
      case "selesai":
        return <Tag color="success">Selesai / Cair</Tag>;
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const columns = [
    {
      title: "No. Laporan",
      dataIndex: "reportNumber",
      key: "reportNumber",
      width: 130,
      render: (val: string, record: IAccidentReport) => (
        <a onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)} style={{ fontWeight: 600 }}>
          {val}
        </a>
      ),
    },
    {
      title: "Tanggal & Jam",
      key: "datetime",
      width: 140,
      render: (_: any, record: IAccidentReport) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.date}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Pukul {record.time} WIB
          </Text>
        </div>
      ),
    },
    {
      title: "Korban & Unit",
      key: "victim",
      width: 220,
      render: (_: any, record: IAccidentReport) => (
        <div>
          <Space>
            <span style={{ fontWeight: 600 }}>{record.victim.name}</span>
            <Tag color={record.victim.employmentStatus === "ASN" ? "blue" : "purple"}>
              {record.victim.employmentStatus}
            </Tag>
          </Space>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            {record.victim.unit} (NIP: {record.victim.nip})
          </div>
        </div>
      ),
    },
    {
      title: "Jenis & Keparahan",
      key: "accidentType",
      width: 180,
      render: (_: any, record: IAccidentReport) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.accidentType}</div>
          <div style={{ marginTop: 2 }}>{renderSeverityTag(record.severityLevel)}</div>
        </div>
      ),
    },
    {
      title: "Status Klaim TASPEN (JKK)",
      key: "taspenCountdown",
      width: 250,
      render: (_: any, record: IAccidentReport) => (
        <div>
          <div style={{ marginBottom: 4 }}>{renderTaspenStatus(record.taspenStatus)}</div>
          <TaspenCountdown
            accidentDate={record.date}
            employmentStatus={record.victim.employmentStatus}
            taspenStatus={record.taspenStatus}
          />
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 140,
      render: (_: any, record: IAccidentReport) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)}
          >
            Detail
          </Button>
          {(currentUser?.role === "admin" || currentUser?.role === "tim_k3") && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/keselamatan/kecelakaan/edit/${record.id}`)}
            />
          )}
          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Laporan Kecelakaan?"
              onConfirm={() =>
                deleteAccident({
                  resource: "accident-reports",
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
            Pelaporan Kecelakaan Kerja & Klaim TASPEN
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Pencatatan insiden kerja, pertolongan medis, dan pemantauan batas pengajuan JKK ASN/PPPK
          </Text>
        </div>

        <Space wrap>
          <Button icon={<FilePdfOutlined />} onClick={() => window.print()}>
            Ekspor Laporan
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#595959", borderColor: "#595959" }}
            onClick={() => navigate("/keselamatan/kecelakaan/create")}
          >
            Lapor Kecelakaan Baru
          </Button>
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
            placeholder="Cari nama korban, NIP, jenis kecelakaan, atau lokasi..."
            prefix={<SearchOutlined />}
            style={{ width: 340 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "accidentType", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />

          <Select
            placeholder="Status TASPEN"
            style={{ width: 170 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "taspenStatus", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="belum">Belum Diajukan</Select.Option>
            <Select.Option value="diajukan">Dalam Proses</Select.Option>
            <Select.Option value="selesai">Selesai / Cair</Select.Option>
          </Select>

          <Select
            placeholder="Tingkat Keparahan"
            style={{ width: 160 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "severityLevel", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="ringan">Ringan</Select.Option>
            <Select.Option value="sedang">Sedang</Select.Option>
            <Select.Option value="berat">Berat</Select.Option>
          </Select>
        </div>

        <Table
          {...tableProps}
          columns={columns}
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
