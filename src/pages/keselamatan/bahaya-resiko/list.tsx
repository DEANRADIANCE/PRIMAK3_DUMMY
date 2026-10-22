import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Modal,
  Form,
  Typography,
  Tabs,
  Popconfirm,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useUpdate, useDelete, useGetIdentity } from "@refinedev/core";
import { IHazardReport, HazardCategory, HazardStatus } from "../../../types/hazard";
import { StatusStepper } from "../../../components/common/StatusStepper";

const { Title, Text } = Typography;

export const HazardReportList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<IHazardReport | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [statusForm] = Form.useForm();
  const { mutate: updateReport } = useUpdate();
  const { mutate: deleteReport } = useDelete();

  // Refine Table hook
  const { tableProps, setFilters } = useTable<IHazardReport>({
    resource: "hazard-reports",
    pagination: { pageSize: 10 },
  });

  const canManageStatus = currentUser?.role === "admin" || currentUser?.role === "tim_k3";

  // Category Tag badge
  const renderCategoryTag = (cat: HazardCategory) => {
    switch (cat) {
      case "near_miss":
        return <Tag color="orange">Near Miss</Tag>;
      case "unsafe_action":
        return <Tag color="volcano">Unsafe Action</Tag>;
      case "unsafe_condition":
        return <Tag color="red">Unsafe Condition</Tag>;
      default:
        return <Tag>{cat}</Tag>;
    }
  };

  // Status Tag
  const renderStatusTag = (st: HazardStatus | string) => {
    switch (st) {
      case "reported":
      case "dilaporkan":
        return <Tag color="blue">Dilaporkan</Tag>;
      case "verified":
      case "diverifikasi":
        return <Tag color="cyan">Diverifikasi</Tag>;
      case "in_progress":
      case "dalam penanganan":
        return <Tag color="gold">Dalam Penanganan</Tag>;
      case "resolved":
      case "selesai":
        return <Tag color="green">Selesai</Tag>;
      default:
        return <Tag>{st}</Tag>;
    }
  };

  const handleOpenStatusModal = (record: IHazardReport) => {
    setActiveReport(record);
    statusForm.setFieldsValue({
      status: record.status,
      notes: "",
    });
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = (values: any) => {
    if (!activeReport) return;

    const newHistory = [
      ...(activeReport.statusHistory || []),
      {
        status: values.status,
        changedBy: currentUser?.name || "Admin",
        changedAt: new Date().toLocaleString("id-ID"),
        notes: values.notes,
      },
    ];

    updateReport({
      resource: "hazard-reports",
      id: activeReport.id,
      values: {
        status: values.status,
        statusHistory: newHistory,
      },
      successNotification: {
        message: "Status Berhasil Diperbarui",
        description: `Laporan ${activeReport.reportNumber} status kini ${values.status}`,
        type: "success",
      },
    });

    setStatusModalOpen(false);
  };

  const columns = [
    {
      title: "No. Laporan",
      dataIndex: "reportNumber",
      key: "reportNumber",
      width: 130,
      render: (val: string, record: IHazardReport) => (
        <a onClick={() => navigate(`/keselamatan/bahaya-resiko/show/${record.id}`)} style={{ fontWeight: 600 }}>
          {val}
        </a>
      ),
    },
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      width: 110,
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (val: HazardCategory) => renderCategoryTag(val),
    },
    {
      title: "Lokasi & Unit",
      key: "location",
      render: (_: any, record: IHazardReport) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.location}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Deskripsi Temuan",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Pelapor",
      dataIndex: "reporterName",
      key: "reporterName",
      width: 140,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (val: string) => renderStatusTag(val),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 180,
      render: (_: any, record: IHazardReport) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setActiveReport(record);
              setDetailModalOpen(true);
            }}
          >
            Detail
          </Button>

          {canManageStatus && (
            <Button
              size="small"
              type="primary"
              style={{ background: "#595959", borderColor: "#595959" }}
              onClick={() => handleOpenStatusModal(record)}
            >
              Ubah Status
            </Button>
          )}

          {currentUser?.role === "admin" && (
            <Popconfirm
              title="Hapus Laporan Bahaya?"
              onConfirm={() =>
                deleteReport({
                  resource: "hazard-reports",
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

  // Filter tab kategori
  const tabItems = [
    { key: "all", label: "Semua Laporan" },
    { key: "near_miss", label: "Near Miss" },
    { key: "unsafe_action", label: "Unsafe Action" },
    { key: "unsafe_condition", label: "Unsafe Condition" },
  ];

  const handleTabChange = (key: string) => {
    setSelectedCategory(key);
    if (key === "all") {
      setFilters([], "replace");
    } else {
      setFilters([{ field: "category", operator: "eq", value: key }], "replace");
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
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Laporan Potensi Bahaya & Resiko
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Pencatatan dan pemantauan tindak lanjut Near Miss, Unsafe Action, dan Unsafe Condition
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: "#595959", borderColor: "#595959" }}
          onClick={() => navigate("/keselamatan/bahaya-resiko/create")}
        >
          Lapor Bahaya Baru
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
        <Tabs activeKey={selectedCategory} onChange={handleTabChange} items={tabItems} style={{ marginBottom: 16 }} />

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <Input
            placeholder="Cari lokasi, deskripsi atau pelapor..."
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              setFilters(
                val ? [{ field: "description", operator: "contains", value: val }] : [],
                "merge"
              );
            }}
          />

          <Select
            placeholder="Filter Status"
            style={{ width: 180 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "status", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="reported">Dilaporkan</Select.Option>
            <Select.Option value="verified">Diverifikasi</Select.Option>
            <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
            <Select.Option value="resolved">Selesai</Select.Option>
          </Select>
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

      {/* Modal Detail */}
      <Modal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            Tutup
          </Button>,
          <Button
            key="full-page"
            type="primary"
            onClick={() => {
              setDetailModalOpen(false);
              navigate(`/keselamatan/bahaya-resiko/show/${activeReport?.id}`);
            }}
          >
            Buka Halaman Lengkap
          </Button>,
        ]}
        title={`Detail Laporan: ${activeReport?.reportNumber}`}
        width={700}
      >
        {activeReport && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <StatusStepper status={activeReport.status} history={activeReport.statusHistory} />
            </div>

            <div style={{ background: "#fafafa", padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <Text type="secondary">Kategori:</Text>
                  <div>{renderCategoryTag(activeReport.category)}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Tanggal Pelaporan:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.date}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Lokasi Kejadian:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.location}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Unit Kerja Terkait:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.unit}</div>
                </Col>
                <Col span={24}>
                  <Text type="secondary">Deskripsi Potensi Bahaya:</Text>
                  <div style={{ marginTop: 4, fontWeight: 500 }}>{activeReport.description}</div>
                </Col>
                <Col span={24}>
                  <Text type="secondary">Potensi Dampak:</Text>
                  <div style={{ marginTop: 4, color: "#cf1322" }}>{activeReport.potentialImpact}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Pelapor:</Text>
                  <div style={{ fontWeight: 600 }}>{activeReport.reporterName}</div>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Ubah Status */}
      <Modal
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        onOk={() => statusForm.submit()}
        title={`Ubah Status Laporan ${activeReport?.reportNumber}`}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item
            name="status"
            label="Pilih Status Baru"
            rules={[{ required: true, message: "Silakan pilih status!" }]}
          >
            <Select size="large">
              <Select.Option value="reported">Dilaporkan</Select.Option>
              <Select.Option value="verified">Diverifikasi (Tim K3)</Select.Option>
              <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
              <Select.Option value="resolved">Selesai</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Catatan Penanganan / Tindak Lanjut">
            <Input.TextArea
              rows={3}
              placeholder="Contoh: Telah dipasang barikade pengaman dan kabel dirapikan oleh teknisi Sarpras."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
