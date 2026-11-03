import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
  Button,
  Table,
  Typography,
  Space,
  theme,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  MailOutlined,
  StopOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import "dayjs/locale/id";

import { IManagedUser, SystemRole, UserStatus } from "../../../types/userManagement";
import { SYSTEM_ROLES } from "../../../mocks/rolePermissions";
import { getStoredManagedUsers } from "../../../mocks/managedUsers";
import { RoleTag } from "../components/RoleTag";
import { StatusTag } from "../components/StatusTag";
import { UserFormModal } from "../components/UserFormModal";
import { IUser } from "../../../types/user";

dayjs.locale("id");

const { Title, Text, Paragraph } = Typography;

export const UserListPage: React.FC = () => {
  const { token } = theme.useToken();
  const { data: identity } = useGetIdentity<IUser>();

  // Refine useTable
  const { tableProps, setFilters, filters } = useTable<IManagedUser>({
    resource: "users",
    syncWithLocation: true,
    pagination: {
      pageSize: 10,
    },
  });

  // State untuk data ringkasan keseluruhan
  const [allUsers, setAllUsers] = useState<IManagedUser[]>(() => getStoredManagedUsers());

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"create" | "edit">("create");
  const [editingRecord, setEditingRecord] = useState<IManagedUser | null>(null);

  // Ambil nilai filter saat ini dari query string / tableProps
  const currentQ = useMemo(() => {
    const qFilter = filters?.find((f: any) => f.field === "q");
    return (qFilter?.value as string) || "";
  }, [filters]);

  const currentRole = useMemo(() => {
    const roleFilter = filters?.find((f: any) => f.field === "role");
    return (roleFilter?.value as string) || "Semua peran";
  }, [filters]);

  const currentStatus = useMemo(() => {
    const statusFilter = filters?.find((f: any) => f.field === "status");
    return (statusFilter?.value as string) || "Semua status";
  }, [filters]);

  const [searchValue, setSearchValue] = useState(currentQ);
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setSearchValue(currentQ);
  }, [currentQ]);

  // Listener event perubahan data pengguna untuk perbarui statistik secara realtime
  useEffect(() => {
    const handleUpdate = (e: any) => {
      setAllUsers(e.detail || getStoredManagedUsers());
    };
    window.addEventListener("prima_managed_users_updated", handleUpdate);
    return () => {
      window.removeEventListener("prima_managed_users_updated", handleUpdate);
    };
  }, []);

  // Statistik kartu ringkasan dihitung dari keseluruhan data pengguna
  const stats = useMemo(() => {
    const total = allUsers.length;
    const aktif = allUsers.filter((u) => u.status === "Aktif").length;
    const undangan = allUsers.filter((u) => u.status === "Undangan terkirim").length;
    const nonaktif = allUsers.filter((u) => u.status === "Nonaktif").length;
    return { total, aktif, undangan, nonaktif };
  }, [allUsers]);

  // Debounce search 400ms
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(
        [
          {
            field: "q",
            operator: "contains",
            value: val.trim() ? val.trim() : undefined,
          },
        ],
        "merge"
      );
    }, 400);
  };

  // Filter Peran
  const handleRoleChange = (val: string) => {
    setFilters(
      [
        {
          field: "role",
          operator: "eq",
          value: val === "Semua peran" || !val ? undefined : val,
        },
      ],
      "merge"
    );
  };

  // Filter Status
  const handleStatusChange = (val: string) => {
    setFilters(
      [
        {
          field: "status",
          operator: "eq",
          value: val === "Semua status" || !val ? undefined : val,
        },
      ],
      "merge"
    );
  };

  const handleOpenCreateModal = () => {
    setModalAction("create");
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (record: IManagedUser) => {
    setModalAction("edit");
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    setAllUsers(getStoredManagedUsers());
  };

  // Format tanggal login terakhir menggunakan dayjs lokal 'id'
  const formatLastLogin = (date?: string | null) => {
    if (!date) return <Text type="secondary">Belum pernah</Text>;
    const parsed = dayjs(date);
    if (!parsed.isValid()) return <Text type="secondary">Belum pernah</Text>;
    return parsed.locale("id").format("DD MMM YYYY");
  };

  const columns = [
    {
      title: "Pengguna",
      key: "user",
      render: (_: any, record: IManagedUser) => (
        <Space direction="vertical" size={1}>
          <Text strong style={{ fontSize: 13, color: "#1f2937" }}>
            {record.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: "Unit Kerja",
      dataIndex: "unit",
      key: "unit",
      render: (unit: string) => (
        <span style={{ fontSize: 13, color: "#374151" }}>{unit}</span>
      ),
    },
    {
      title: "Peran",
      dataIndex: "role",
      key: "role",
      render: (role: SystemRole) => <RoleTag role={role} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => <StatusTag status={status} />,
    },
    {
      title: "Login Terakhir",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin?: string | null) => formatLastLogin(lastLogin),
    },
    {
      title: "Aksi",
      key: "actions",
      align: "center" as const,
      width: 90,
      render: (_: any, record: IManagedUser) => (
        <Button
          type="link"
          style={{ padding: 0, fontWeight: 600, color: "#0d9488" }}
          onClick={() => handleOpenEditModal(record)}
        >
          Ubah
        </Button>
      ),
    },
  ];

  const dataSource = (tableProps.dataSource || []) as IManagedUser[];
  const totalInPage = dataSource.length;
  const totalCount = tableProps.pagination ? tableProps.pagination.total || totalInPage : totalInPage;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Halaman */}
      <div>
        <Title level={3} style={{ margin: "0 0 4px 0", color: "#111827", fontWeight: 700 }}>
          Manajemen Pengguna
        </Title>
        <Paragraph type="secondary" style={{ margin: 0, fontSize: 14 }}>
          Kelola akun pegawai, tetapkan peran, dan pantau status akses.
        </Paragraph>
      </div>

      {/* 4 Kartu Ringkasan Statistik */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#64748b" }}>Total Pengguna</span>}
              value={stats.total}
              prefix={<TeamOutlined style={{ color: "#3b82f6", marginRight: 6 }} />}
              valueStyle={{ fontWeight: 700, color: "#1e293b", fontSize: 26 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#64748b" }}>Aktif</span>}
              value={stats.aktif}
              prefix={<CheckCircleOutlined style={{ color: "#16a34a", marginRight: 6 }} />}
              valueStyle={{ fontWeight: 700, color: "#16a34a", fontSize: 26 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#64748b" }}>Undangan Terkirim</span>}
              value={stats.undangan}
              prefix={<MailOutlined style={{ color: "#d97706", marginRight: 6 }} />}
              valueStyle={{ fontWeight: 700, color: "#d97706", fontSize: 26 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered
            style={{
              borderRadius: token.borderRadiusLG,
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <Statistic
              title={<span style={{ fontSize: 13, color: "#64748b" }}>Nonaktif</span>}
              value={stats.nonaktif}
              prefix={<StopOutlined style={{ color: "#6b7280", marginRight: 6 }} />}
              valueStyle={{ fontWeight: 700, color: "#6b7280", fontSize: 26 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Toolbar & Tabel Pengguna */}
      <Card
        bordered
        style={{
          borderRadius: token.borderRadiusLG,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              flex: 1,
            }}
          >
            {/* Input Search */}
            <Input
              placeholder="Cari nama, email, atau unit kerja"
              prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
              value={searchValue}
              onChange={handleSearchChange}
              allowClear
              style={{ width: 280, maxWidth: "100%" }}
            />

            {/* Select Peran */}
            <Select
              value={currentRole}
              onChange={handleRoleChange}
              style={{ width: 180 }}
              options={[
                { label: "Semua peran", value: "Semua peran" },
                ...SYSTEM_ROLES.map((r) => ({ label: r, value: r })),
              ]}
            />

            {/* Select Status */}
            <Select
              value={currentStatus}
              onChange={handleStatusChange}
              style={{ width: 170 }}
              options={[
                { label: "Semua status", value: "Semua status" },
                { label: "Aktif", value: "Aktif" },
                { label: "Undangan terkirim", value: "Undangan terkirim" },
                { label: "Nonaktif", value: "Nonaktif" },
              ]}
            />
          </div>

          {/* Tombol Primary Gelap + Tambah Pengguna */}
          <Button
            type="primary"
            // icon={<UserAddOutlined />}
            onClick={handleOpenCreateModal}
            style={{
              background: "#1f2937",
              borderColor: "#1f2937",
              fontWeight: 600,
            }}
          >
            + Tambah Pengguna
          </Button>
        </div>

        {/* Tabel Ant Design */}
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 800 }}
          footer={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              <span>
                Menampilkan {totalInPage} dari {totalCount} pengguna
              </span>
            </div>
          )}
        />
      </Card>

      {/* Modal Tambah / Ubah Pengguna */}
      <UserFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
        editingRecord={editingRecord}
        currentUserEmail={identity?.email}
        currentUserId={identity?.id}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};
