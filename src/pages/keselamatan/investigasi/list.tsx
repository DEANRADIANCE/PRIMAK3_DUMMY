import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Typography,
  Popconfirm,
  Row,
  Col,
  Popover,
  Select,
  DatePicker,
  Divider,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  AuditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useGetIdentity, useCan } from "@refinedev/core";
import { Investigation } from "../../../types/investigation";
import { IUser } from "../../../types/user";
import { StatusTag } from "./components/StatusTag";
import { SeverityTag } from "./components/SeverityTag";
import dayjs from "dayjs";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

export const InvestigationList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();

  const { data: canCreateData } = useCan({
    resource: "investigations",
    action: "create",
  });
  const canCreate =
    canCreateData?.can ??
    (currentUser?.role === "tim_k3" || currentUser?.role === "admin");

  const { tableProps, setFilters, sorters, setSorters } = useTable<Investigation>({
    resource: "investigations",
    pagination: { pageSize: 10 },
    syncWithLocation: true,
  });

  const { mutate: deleteInvestigation } = useDelete();

  // Search input with 400ms debounce
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState<boolean>(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterSeverity, setFilterSeverity] = useState<string | undefined>(undefined);
  const [filterUnit, setFilterUnit] = useState<string | undefined>(undefined);
  const [filterDateRange, setFilterDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Sorting state (default: terbaru)
  const isAsc = sorters?.find((s) => s.field === "id")?.order === "asc";

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(
        searchValue
          ? [{ field: "q", operator: "contains", value: searchValue }]
          : [],
        "merge"
      );
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, setFilters]);

  const handleApplyFilter = () => {
    const newFilters: any[] = [];
    if (filterStatus) {
      newFilters.push({ field: "status", operator: "eq", value: filterStatus });
    }
    if (filterSeverity) {
      newFilters.push({
        field: "insiden.tingkat_keparahan",
        operator: "eq",
        value: filterSeverity,
      });
    }
    if (filterUnit) {
      newFilters.push({
        field: "insiden.unit",
        operator: "contains",
        value: filterUnit,
      });
    }
    if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
      newFilters.push({
        field: "insiden.tanggal_jam",
        operator: "gte",
        value: filterDateRange[0].format("YYYY-MM-DD"),
      });
      newFilters.push({
        field: "insiden.tanggal_jam",
        operator: "lte",
        value: filterDateRange[1].format("YYYY-MM-DD 23:59"),
      });
    }

    setFilters(newFilters, "replace");
    setFilterPopoverOpen(false);
  };

  const handleResetFilter = () => {
    setFilterStatus(undefined);
    setFilterSeverity(undefined);
    setFilterUnit(undefined);
    setFilterDateRange(null);
    setFilters([], "replace");
    setSearchValue("");
    setFilterPopoverOpen(false);
  };

  const toggleSort = () => {
    setSorters([
      {
        field: "id",
        order: isAsc ? "desc" : "asc",
      },
    ]);
  };

  // Statistic calculation from data
  const dataList = (tableProps.dataSource || []) as Investigation[];
  const totalCount =
    typeof tableProps.pagination === "object"
      ? tableProps.pagination?.total ?? dataList.length
      : dataList.length;
  const draftCount = dataList.filter((i) => i.status === "Draf").length;
  const pendingCount = dataList.filter((i) => i.status === "Menunggu Pengesahan").length;
  const approvedCount = dataList.filter((i) => i.status === "Disahkan").length;

  const activeFilterCount = [
    filterStatus,
    filterSeverity,
    filterUnit,
    filterDateRange,
  ].filter(Boolean).length;

  const filterContent = (
    <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <Text strong style={{ fontSize: 13 }}>Status Investigasi</Text>
        <Select
          style={{ width: "100%", marginTop: 4 }}
          placeholder="Pilih status"
          allowClear
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "Draf", label: "Draf" },
            { value: "Menunggu Pengesahan", label: "Menunggu Pengesahan" },
            { value: "Disahkan", label: "Disahkan" },
            { value: "Dikembalikan", label: "Dikembalikan" },
          ]}
        />
      </div>

      <div>
        <Text strong style={{ fontSize: 13 }}>Tingkat Keparahan</Text>
        <Select
          style={{ width: "100%", marginTop: 4 }}
          placeholder="Pilih tingkat keparahan"
          allowClear
          value={filterSeverity}
          onChange={setFilterSeverity}
          options={[
            { value: "Ringan", label: "Ringan" },
            { value: "Sedang", label: "Sedang" },
            { value: "Berat", label: "Berat" },
            { value: "Fatal", label: "Fatal" },
          ]}
        />
      </div>

      <div>
        <Text strong style={{ fontSize: 13 }}>Unit Kerja</Text>
        <Select
          style={{ width: "100%", marginTop: 4 }}
          placeholder="Pilih unit kerja"
          allowClear
          value={filterUnit}
          onChange={setFilterUnit}
          options={[
            { value: "Pelayanan", label: "Direktorat Pelayanan dan Informasi" },
            { value: "Pengolahan", label: "Direktorat Pengolahan Arsip" },
            { value: "Akuisisi", label: "Direktorat Akuisisi Arsip" },
            { value: "Keuangan", label: "Biro Keuangan dan Umum" },
            { value: "Sarpras", label: "Subbagian Sarpras" },
            { value: "Pusat Data", label: "Pusat Data dan Informasi" },
          ]}
        />
      </div>

      <div>
        <Text strong style={{ fontSize: 13 }}>Rentang Tanggal Kejadian</Text>
        <RangePicker
          style={{ width: "100%", marginTop: 4 }}
          format="DD/MM/YYYY"
          value={filterDateRange}
          onChange={(dates) => setFilterDateRange(dates as any)}
        />
      </div>

      <Divider style={{ margin: "4px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button size="small" onClick={handleResetFilter}>
          Reset
        </Button>
        <Button size="small" type="primary" onClick={handleApplyFilter} className="btn-safety-primary">
          Terapkan Filter
        </Button>
      </div>
    </div>
  );

  const columns = [
    {
      title: "No. Investigasi",
      key: "nomor",
      width: 155,
      render: (_: unknown, record: Investigation) => (
        <a
          onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)}
          style={{ fontWeight: 700, color: "#0d9488" }}
        >
          {record.nomor || `INV-2026-${String(record.id).padStart(3, "0")}`}
        </a>
      ),
    },
    {
      title: "Tanggal Insiden",
      key: "tanggal",
      width: 140,
      render: (_: unknown, record: Investigation) => {
        const rawDate = record.insiden?.tanggal_jam || record.incidentDate;
        return (
          <span style={{ fontSize: 13, color: "#334155" }}>
            {rawDate ? dayjs(rawDate).format("DD MMM YYYY") : "-"}
          </span>
        );
      },
    },
    {
      title: "Lokasi / Unit",
      key: "lokasi_unit",
      width: 220,
      render: (_: unknown, record: Investigation) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>
            {record.insiden?.lokasi || record.incidentLocation || "-"}
          </div>
          <Text type="secondary" style={{ fontSize: 11.5 }}>
            {record.insiden?.unit || "Unit Kerja"}
          </Text>
        </div>
      ),
    },
    {
      title: "Jenis Insiden",
      key: "jenis",
      width: 150,
      render: (_: unknown, record: Investigation) => (
        <Tag style={{ borderRadius: 6, fontWeight: 500 }}>
          {record.insiden?.jenis || "Kecelakaan Kerja"}
        </Tag>
      ),
    },
    {
      title: "Tingkat Keparahan",
      key: "keparahan",
      width: 135,
      render: (_: unknown, record: Investigation) => (
        <SeverityTag severity={record.insiden?.tingkat_keparahan || "Sedang"} />
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 165,
      render: (_: unknown, record: Investigation) => (
        <StatusTag status={record.status} />
      ),
    },
    {
      title: "Tim Investigator",
      key: "investigator",
      width: 180,
      ellipsis: true,
      render: (_: unknown, record: Investigation) => {
        const ketua =
          record.investigasi?.ketua_tim ||
          record.investigatorName ||
          record.investigasi?.tim_investigator?.[0] ||
          "-";
        return (
          <span style={{ fontWeight: 600, color: "#475569", fontSize: 13 }}>
            {ketua}
          </span>
        );
      },
    },
    {
      title: "Aksi",
      key: "actions",
      width: 130,
      fixed: "right" as const,
      render: (_: unknown, record: Investigation) => {
        const isDraftOrReturned =
          record.status === "Draf" || record.status === "Dikembalikan";
        const canEditRecord = isDraftOrReturned && canCreate;
        const canDeleteRecord = record.status === "Draf" && canCreate;

        return (
          <Space size="small">
            <Tooltip title="Lihat detail investigasi">
              <Button
                size="small"
                icon={<EyeOutlined />}
                style={{ borderRadius: 6 }}
                onClick={() => navigate(`/keselamatan/investigasi/show/${record.id}`)}
              />
            </Tooltip>

            {canEditRecord && (
              <Tooltip title="Ubah berkas investigasi">
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  style={{ borderRadius: 6 }}
                  onClick={() => navigate(`/keselamatan/investigasi/edit/${record.id}`)}
                />
              </Tooltip>
            )}

            {canDeleteRecord && (
              <Popconfirm
                title="Hapus Berkas Investigasi?"
                description="Tindakan ini tidak dapat dibatalkan. Berkas draf akan dihapus permanen."
                onConfirm={() =>
                  deleteInvestigation({
                    resource: "investigations",
                    id: record.id,
                    successNotification: {
                      message: "Investigasi Berhasil Dihapus",
                      description: "Berkas draf telah dihapus dari sistem.",
                      type: "success",
                    },
                  })
                }
                okText="Hapus"
                cancelText="Batal"
              >
                <Tooltip title="Hapus draf">
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    style={{ borderRadius: 6 }}
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient (Khas Keselamatan PRIMA K3) */}
      <div className="safety-hero-banner safety-banner-investigasi safety-card-animate safety-delay-1">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={17}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <AuditOutlined /> ROOT CAUSE ANALYSIS (RCA)
              </Tag>
              <span style={{ fontSize: 13, color: "#e0e7ff" }}>Pencegahan Insiden Berulang & CAPA</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Investigasi Insiden & Analisis Akar Masalah
            </Title>
            <Paragraph style={{ color: "#e0e7ff", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Metodologi sistematis (5-Why Analysis & Ishikawa Diagram) untuk menyingkap faktor penyebab langsung dan akar kegagalan sistem agar kecelakaan serupa tidak terulang kembali.
            </Paragraph>
          </Col>

          <Col xs={24} md={7} style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(6px)",
                padding: "12px 18px",
                borderRadius: 14,
                border: "1px solid rgba(255, 255, 255, 0.25)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, color: "#e0e7ff", fontWeight: 600 }}>BERKAS DISAHKAN</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {approvedCount} <span style={{ fontSize: 13, fontWeight: 400 }}>Kasus Tuntas</span>
              </div>
              <Tag color="cyan" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● {pendingCount} Menunggu Pengesahan
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. 4 Kartu Ringkasan (Statistic) dengan Animasi Scroll Reveal */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#eef2ff", color: "#4f46e5" }}>
              <AuditOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Total Investigasi</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{totalCount} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#4f46e5", fontWeight: 600 }}>Tahun Berjalan 2026</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f1f5f9", color: "#64748b" }}>
              <FileTextOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Draf</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{draftCount} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>Sedang Disusun</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fffbe6", color: "#d97706" }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Menunggu Pengesahan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{pendingCount} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#d97706", fontWeight: 600 }}>Review Kepala Biro KU</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Disahkan</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{approvedCount} Berkas</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Rekomendasi Disetujui</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Toolbar Pencarian (Debounce 400ms), Filter Popover, Urutkan & Tambah Data */}
      <div
        className="safety-card-animate safety-delay-2"
        style={{
          background: "#ffffff",
          padding: "14px 18px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 280, maxWidth: 520 }}>
          <Input
            placeholder="Cari data investigasi (nomor, lokasi, jenis, investigator)..."
            prefix={<SearchOutlined style={{ color: "#0d9488" }} />}
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ borderRadius: 8, height: 40 }}
          />
        </div>

        <Space size="middle" wrap>
          <Popover
            content={filterContent}
            title={<span style={{ fontWeight: 700 }}>Filter Data Investigasi</span>}
            trigger="click"
            open={filterPopoverOpen}
            onOpenChange={setFilterPopoverOpen}
            placement="bottomRight"
          >
            <Button
              icon={<FilterOutlined />}
              className="btn-safety-secondary"
              style={{
                height: 40,
                fontWeight: activeFilterCount > 0 ? 700 : 500,
                borderColor: activeFilterCount > 0 ? "#0d9488" : undefined,
                color: activeFilterCount > 0 ? "#0d9488" : undefined,
              }}
            >
              Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Popover>

          <Tooltip title={isAsc ? "Urutan: Terlama ke Terbaru (klik untuk Terbaru)" : "Urutan: Terbaru ke Terlama (klik untuk Terlama)"}>
            <Button
              icon={isAsc ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={toggleSort}
              className="btn-safety-secondary"
              style={{ height: 40 }}
            >
              {isAsc ? "Terlama" : "Terbaru"}
            </Button>
          </Tooltip>

          {canCreate && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="btn-safety-primary"
              onClick={() => navigate("/keselamatan/investigasi/create")}
              style={{ height: 40, padding: "0 22px" }}
            >
            Tambah Data
            </Button>
          )}
        </Space>
      </div>

      {/* 4. Tabel Investigasi */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-3"
        bordered={false}
      >
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              `Menampilkan ${range[0]}-${range[1]} dari ${total} data investigasi`,
          }}
        />
      </Card>

      {/* 5. Alur & Siklus Analisis Investigasi (Advisory Cards) */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🔍 Siklus Investigasi & Corrective Action (CAPA)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Olah TKP & Rekonstruksi</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Amankan tempat kejadian perkara, kumpulkan bukti fisik dan saksi mata, serta susun urutan kronologi waktu peristiwa secara objektif.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Analisis 5-Mengapa (5-Why)</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Gali lapisan penyebab insiden hingga menemukan akar kegagalan sistemik (root causes), mengedepankan budaya tanpa menyalahkan individu (no-blame culture).
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Rekomendasi & Pengesahan CAPA</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Tetapkan tindakan perbaikan sesuai hirarki pengendalian risiko, tunjuk penanggung jawab (PIC), dan ajukan pengesahan kepada Kepala Biro KU.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default InvestigationList;
