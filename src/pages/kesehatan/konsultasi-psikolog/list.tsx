import React from "react";
import { Table, Button, Space, Tag, Card, Typography, Tooltip } from "antd";
import { PlusOutlined, LockOutlined, CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import { IPsychologistBooking } from "../../../types/psychologist";

const { Title, Text } = Typography;

export const PsychologistList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();

  const { tableProps } = useTable<IPsychologistBooking>({
    resource: "psychologist-bookings",
    pagination: { pageSize: 10 },
  });

  const isPrivileged = currentUser?.role === "admin";

  const renderStatus = (st: string) => {
    switch (st) {
      case "confirmed":
        return <Tag color="blue">Jadwal Dikonfirmasi</Tag>;
      case "completed":
        return <Tag color="green">Selesai Konseling</Tag>;
      case "cancelled":
        return <Tag color="red">Dibatalkan</Tag>;
      default:
        return <Tag color="gold">Menunggu Konfirmasi</Tag>;
    }
  };

  const columns = [
    {
      title: "No.",
      width: 50,
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "Nama Pasien",
      dataIndex: "patientName",
      key: "patientName",
      width: 200,
      render: (val: string, record: IPsychologistBooking) => {
        // Jika bukan admin dan bukan pemilik record, anonimkan sebagian untuk privasi
        const isSelf = record.patientName.includes(currentUser?.name || "");
        if (!isPrivileged && !isSelf) {
          return <span>Pegawai ANRI ({val.substring(0, 3)}***)</span>;
        }
        return <strong>{val}</strong>;
      },
    },
    {
      title: "Tanggal & Jam Sesi",
      key: "datetime",
      width: 180,
      render: (_: any, record: IPsychologistBooking) => (
        <div>
          <Space>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontWeight: 600 }}>{record.sessionDate}</span>
          </Space>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>
            Sesi Pukul {record.sessionTime} WIB
          </div>
        </div>
      ),
    },
    {
      title: "No. Kontak",
      dataIndex: "contactNumber",
      key: "contactNumber",
      width: 140,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "");
        if (!isPrivileged && !isSelf) {
          return <span>0812-****-****</span>;
        }
        return <span>{val}</span>;
      },
    },
    {
      title: "Keluhan / Alasan Konsultasi (Rahasia)",
      dataIndex: "reason",
      key: "reason",
      width: 250,
      render: (val: string, record: IPsychologistBooking) => {
        const isSelf = record.patientName.includes(currentUser?.name || "");
        if (isPrivileged || isSelf) {
          return <span>{val}</span>;
        }
        return (
          <Tooltip title="Data keluhan medis/psikologis bersifat rahasia kode etik klinis.">
            <Tag icon={<LockOutlined />} color="default">
              Rahasia Medis
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Status Sesi",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (val: string) => renderStatus(val),
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
            Layanan Konsultasi Psikolog Klinis ANRI
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Konseling tatap muka rahasia untuk kesehatan mental dan kesejahteraan pegawai
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "#595959", borderColor: "#595959" }}
          onClick={() => navigate("/kesehatan/konsultasi/create")}
        >
          Booking Jadwal Konsultasi
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
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 920 }}
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
