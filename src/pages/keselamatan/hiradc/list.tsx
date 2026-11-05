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
  Row,
  Col,
  message,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  SlidersOutlined,
  CheckCircleOutlined,
  AimOutlined,
  FilePdfOutlined,
  ApartmentOutlined,
  OrderedListOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/antd";
import { useDelete, useUpdate, useGetIdentity } from "@refinedev/core";
import {
  IHiradc,
  IHiradcSubActivity,
  calculateNfrRiskLevel,
  getNfrTagColor,
} from "../../../types/hiradc";
import { IUser } from "../../../types/user";
import { RiskBadge } from "../../../components/common/RiskBadge";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import { HiradcPrintModal } from "../../../components/common/HiradcPrintModal";
import "../keselamatan.css";

const { Title, Text, Paragraph } = Typography;

export const HiradcList: React.FC = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printItems, setPrintItems] = useState<IHiradc[]>([]);

  const { tableProps, setFilters } = useTable<IHiradc>({
    resource: "hiradc",
    pagination: { pageSize: 10 },
  });

  const { mutate: deleteHiradc } = useDelete();
  const { mutate: updateHiradc } = useUpdate();
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3" || currentUser?.role === "super_admin";

  // Handler untuk menghapus tahapan proses kerja tertentu dari record kegiatan
  const handleDeleteSubActivity = (record: IHiradc, targetIndexOrId: string | number) => {
    const currentSubs: IHiradcSubActivity[] =
      record.subActivities && record.subActivities.length > 0
        ? [...record.subActivities]
        : [
            {
              id: `sub-single-${record.id}`,
              activity: record.activity,
              location: record.location,
              activityType: record.activityType,
              hazardClassification: record.hazardClassification,
              riskImpact: record.riskImpact || record.risk || "-",
              controlDescription: record.controlDescription,
              selectedControls: record.selectedControls,
              currentLikelihood: record.currentLikelihood,
              currentSeverity: record.currentSeverity,
              currentNfr: record.currentNfr,
              currentRiskLevel: record.currentRiskLevel,
              residualLikelihood: record.residualLikelihood,
              residualSeverity: record.residualSeverity,
              residualNfr: record.residualNfr,
              residualRiskLevel: record.residualRiskLevel,
              controlDuration: record.controlDuration,
              controlStatus: record.controlStatus,
              responsiblePerson: record.responsiblePerson,
              targetDate: record.targetDate,
            } as IHiradcSubActivity,
          ];

    if (currentSubs.length <= 1) {
      message.warning("Kegiatan minimal harus memiliki 1 tahapan proses kerja!");
      return;
    }

    const updatedSubs = currentSubs.filter((sub, idx) => {
      if (typeof targetIndexOrId === "number") {
        return idx !== targetIndexOrId;
      }
      return (sub.id || `sub-${idx}`) !== targetIndexOrId;
    });

    updateHiradc(
      {
        resource: "hiradc",
        id: record.id,
        values: {
          ...record,
          subActivities: updatedSubs,
        },
      },
      {
        onSuccess: () => {
          message.success("Tahapan proses kerja berhasil dihapus!");
        },
        onError: (err: any) => {
          message.error("Gagal menghapus proses kerja: " + (err?.message || "Terjadi kesalahan"));
        },
      }
    );
  };

  const allHiradc = (tableProps.dataSource || []) as IHiradc[];

  // Hitung jumlah proses kerja keseluruhan
  const totalSubActivitiesCount = allHiradc.reduce((sum, h) => {
    return sum + (h.subActivities && h.subActivities.length > 0 ? h.subActivities.length : 1);
  }, 0);

  // Helper menghitung akumulasi nilai dari jumlah NFR Sisa tiap proses kerja,
  // atau jika belum ada nilai NFR Sisa, diambil dari akumulasi jumlah NFR Awal detail proses kerja.
  const getAccumulatedNfrInfo = (record: IHiradc) => {
    if (record.subActivities && record.subActivities.length > 0) {
      const sumResidual = record.subActivities.reduce((sum, s) => {
        const res =
          typeof s.residualNfr === "number" && s.residualNfr > 0
            ? s.residualNfr
            : s.residualLikelihood && s.residualSeverity
            ? s.residualLikelihood * s.residualSeverity
            : 0;
        return sum + res;
      }, 0);

      const sumCurrent = record.subActivities.reduce((sum, s) => {
        const cur =
          typeof s.currentNfr === "number" && s.currentNfr > 0
            ? s.currentNfr
            : s.currentLikelihood && s.currentSeverity
            ? s.currentLikelihood * s.currentSeverity
            : 0;
        return sum + cur;
      }, 0);

      // Jika ada akumulasi NFR Sisa, gunakan NFR Sisa. Jika belum ada, gunakan NFR Awal.
      if (sumResidual > 0) {
        return { nfr: sumResidual, isResidual: true, typeLabel: "NFR Sisa" };
      }
      return { nfr: sumCurrent, isResidual: false, typeLabel: "NFR Awal" };
    }

    // Fallback untuk record tunggal
    const res =
      record.residualNfr ??
      (record.residualLikelihood && record.residualSeverity
        ? record.residualLikelihood * record.residualSeverity
        : 0);
    if (res > 0) {
      return { nfr: res, isResidual: true, typeLabel: "NFR Sisa" };
    }
    const cur =
      record.currentNfr ??
      record.riskScore ??
      ((record.likelihood || 1) * (record.severity || 1));
    return { nfr: cur, isResidual: false, typeLabel: "NFR Awal" };
  };

  const getAccumulatedNfr = (record: IHiradc) => getAccumulatedNfrInfo(record).nfr;

  const highRiskCount = allHiradc.filter((h) => {
    const nfr = getAccumulatedNfr(h);
    return nfr >= 5;
  }).length;
  const lowRiskCount = allHiradc.filter((h) => {
    const nfr = getAccumulatedNfr(h);
    return nfr < 5;
  }).length;

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 55,
      align: "center" as const,
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{ fontWeight: 600, color: "#64748b" }}>{index + 1}</span>
      ),
    },
    {
      title: "Judul Kegiatan",
      key: "parent_activity",
      render: (_: unknown, record: IHiradc) => {
        const parentTitle = record.parentActivity || record.activity;

        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <a
                onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
                style={{ fontWeight: 700, color: "#0284c7", fontSize: 14, lineHeight: 1.4 }}
              >
                {parentTitle}
              </a>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {record.activityType && (
                <Tag
                  color={record.activityType.includes("Non") ? "volcano" : "blue"}
                  style={{ fontSize: 11, borderRadius: 4, margin: 0 }}
                >
                  {record.activityType}
                </Tag>
              )}
              <Text type="secondary" style={{ fontSize: 11.5 }}>
                {record.unit} • {record.location}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Jumlah Proses Kerja",
      key: "sub_activities_count",
      width: 170,
      align: "center" as const,
      render: (_: unknown, record: IHiradc) => {
        const count = record.subActivities && record.subActivities.length > 0 ? record.subActivities.length : 1;
        return (
          <Tag
            color="cyan"
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 12,
              margin: 0,
              border: "1px solid #a5f3fc",
              color: "#0e7490",
              background: "#ecfeff",
            }}
          >
            {count} Proses Kerja
          </Tag>
        );
      },
    },
    {
      title: "NFR",
      key: "accumulated_nfr",
      width: 130,
      align: "center" as const,
      sorter: (a: IHiradc, b: IHiradc) => getAccumulatedNfr(a) - getAccumulatedNfr(b),
      render: (_: unknown, record: IHiradc) => {
        const { nfr, isResidual, typeLabel } = getAccumulatedNfrInfo(record);
        const level = calculateNfrRiskLevel(nfr);
        return (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: isResidual ? "#059669" : "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {nfr}
            </div>
            <div style={{ marginTop: 3 }}>
              <Tag
                color={getNfrTagColor(level)}
                style={{ borderRadius: 4, fontSize: 11, fontWeight: 700, margin: 0 }}
              >
                {level}
              </Tag>
            </div>
            <div
              style={{
                fontSize: 10,
                color: isResidual ? "#059669" : "#64748b",
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              {typeLabel}
            </div>
          </div>
        );
      },
    },
    {
      title: "Durasi & Status",
      key: "control_status",
      width: 140,
      align: "center" as const,
      render: (_: unknown, record: IHiradc) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 3 }}>
            ⏱ {record.controlDuration || "30 Hari"}
          </div>
          <Tag
            color={record.controlStatus === "Close" ? "green" : "orange"}
            style={{ borderRadius: 4, fontWeight: 700, margin: 0 }}
          >
            {record.controlStatus || "Open"}
          </Tag>
        </div>
      ),
    },
    {
      title: "PIC",
      key: "pic",
      width: 140,
      render: (_: unknown, record: IHiradc) => (
        <div style={{ fontWeight: 600, fontSize: 12.5, color: "#0f172a" }}>
          {record.responsiblePerson || "-"}
        </div>
      ),
    },
    {
      title: "Target",
      key: "target",
      width: 140,
      render: (_: unknown, record: IHiradc) => (
        <div style={{ fontSize: 12, color: "#334155", fontWeight: 500 }}>
          {record.targetDate ? `📅 ${record.targetDate}` : "-"}
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "actions",
      width: 140,
      align: "center" as const,
      render: (_: unknown, record: IHiradc) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            title="Lihat Rincian"
            style={{ borderRadius: 6 }}
            onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
          />
          <Button
            size="small"
            icon={<FilePdfOutlined />}
            title="Format Cetak PDF"
            style={{ borderRadius: 6, color: "#dc2626" }}
            onClick={() => {
              setPrintItems([record]);
              setPrintModalOpen(true);
            }}
          />
          {canEdit && (
            <Button
              size="small"
              icon={<EditOutlined />}
              title="Ubah Data"
              style={{ borderRadius: 6 }}
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
              <Button size="small" danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Render sub-table saat baris di-expand
  const expandedRowRender = (record: IHiradc) => {
    const subList: IHiradcSubActivity[] = (record.subActivities && record.subActivities.length > 0)
      ? record.subActivities
      : [
          {
            id: `sub-single-${record.id}`,
            activity: record.activity,
            activityType: record.activityType,
            riskImpact: record.riskImpact || record.risk || "-",
            currentNfr: record.currentNfr ?? 9,
            currentRiskLevel: record.currentRiskLevel ?? "Sedang",
            residualNfr: record.residualNfr ?? 3,
            residualRiskLevel: record.residualRiskLevel ?? "Sedang",
            currentEngineering: record.currentEngineering,
            residualEngineering: record.residualEngineering,
            controlDuration: record.controlDuration,
            controlStatus: record.controlStatus,
            responsiblePerson: record.responsiblePerson,
          } as IHiradcSubActivity,
        ];

    return (
      <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: 8, border: "1px dashed #cbd5e1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <OrderedListOutlined style={{ color: "#0284c7" }} />
          <Text strong style={{ color: "#0f172a", fontSize: 13 }}>
            Rincian Tahapan Proses Kerja ({subList.length} Proses) di Bawah Kegiatan "{record.parentActivity || record.activity}":
          </Text>
        </div>

        <Table
          dataSource={subList}
          rowKey={(s, i) => s.id || `sub-${i}`}
          pagination={false}
          size="small"
          bordered
          columns={[
            {
              title: "Tahap #",
              width: 70,
              align: "center",
              render: (_, __, i) => <Tag color="blue" style={{ fontWeight: 700 }}>#{i + 1}</Tag>,
            },
            {
              title: "Nama Aktivitas / Proses Kerja",
              dataIndex: "activity",
              key: "activity",
              render: (val: string, s: IHiradcSubActivity) => (
                <div>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>{val}</span>
                  {s.activityType && (
                    <Tag style={{ marginLeft: 6, fontSize: 10 }}>{s.activityType}</Tag>
                  )}
                </div>
              ),
            },
            {
              title: "Dampak Risiko",
              dataIndex: "riskImpact",
              key: "riskImpact",
              render: (val: string) => <span style={{ color: "#dc2626", fontSize: 11.5 }}>{val}</span>,
            },
            {
              title: "NFR Awal",
              width: 100,
              align: "center",
              render: (_, s) => {
                const nfr = s.currentNfr || (s.currentLikelihood * s.currentSeverity);
                const lvl = s.currentRiskLevel || calculateNfrRiskLevel(nfr);
                return <Tag color={getNfrTagColor(lvl)} style={{ fontWeight: 700 }}>{nfr} • {lvl}</Tag>;
              },
            },
            {
              title: "NFR Sisa",
              width: 100,
              align: "center",
              render: (_, s) => {
                const nfr = s.residualNfr || ((s.residualLikelihood ?? 2) * (s.residualSeverity ?? 2));
                const lvl = s.residualRiskLevel || calculateNfrRiskLevel(nfr);
                return <Tag color={getNfrTagColor(lvl)} style={{ fontWeight: 700 }}>{nfr} • {lvl}</Tag>;
              },
            },
            {
              title: "Pengendalian Utama",
              render: (_, s) => (
                <div style={{ fontSize: 11 }}>
                  <div><strong>Existing:</strong> {s.currentEngineering || s.currentAdministrative || "-"}</div>
                  <div><strong>Lanjutan:</strong> {s.residualEngineering || s.residualAdministrative || "-"}</div>
                </div>
              ),
            },
            {
              title: "Status & PIC",
              width: 140,
              render: (_, s) => (
                <div style={{ fontSize: 11 }}>
                  <Tag color={s.controlStatus === "Close" ? "green" : "orange"} style={{ fontSize: 10 }}>
                    {s.controlStatus || "Open"}
                  </Tag>
                  <div style={{ marginTop: 2, color: "#475569" }}>{s.responsiblePerson || "-"}</div>
                </div>
              ),
            },
            {
              title: "Aksi",
              width: 90,
              align: "center",
              render: (_, s, i) => (
                canEdit ? (
                  <Space size={4}>
                    <Tooltip title="Edit Proses Kerja">
                      <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined style={{ color: "#f59e0b" }} />}
                        onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}?step=${s.id || i}`)}
                      />
                    </Tooltip>
                    <Tooltip title="Hapus Tahap Proses Kerja">
                      <Popconfirm
                        title="Hapus Proses Kerja"
                        description={`Yakin hapus proses kerja "${s.activity || `Tahap #${i + 1}`}"?`}
                        onConfirm={() => handleDeleteSubActivity(record, s.id || i)}
                        okText="Hapus"
                        cancelText="Batal"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                ) : (
                  <span style={{ color: "#94a3b8" }}>-</span>
                )
              ),
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Hero Banner Modern Gradient */}
      <div className="safety-hero-banner safety-banner-hiradc">
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
                <SafetyCertificateOutlined /> RISK MANAGEMENT MATRIX
              </Tag>
              <span style={{ fontSize: 13, color: "#e0f2fe" }}>Standar K3 ANRI (ISO 45001 / SMK3 PP 50/2012)</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              HIRADC (Hazard Identification, Risk Assessment &amp; Determining Control)
            </Title>
            <Paragraph style={{ color: "#e0f2fe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Identifikasi 5 faktor bahaya kerja (Fisika, Kimia, Biologi, Ergonomi, Psikososial), evaluasi Nilai Faktor Risiko (NFR) berdasarkan <strong>Judul Kegiatan Utama</strong> beserta rincian <strong>Aktivitas / Proses Kerja</strong> di dalamnya.
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
              <div style={{ fontSize: 11, color: "#e0f2fe", fontWeight: 600 }}>TOTAL DOKUMEN &amp; PROSES</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                {allHiradc.length} <span style={{ fontSize: 13, fontWeight: 400 }}>Kegiatan</span> ({totalSubActivitiesCount} <span style={{ fontSize: 12, fontWeight: 400 }}>Proses</span>)
              </div>
              <Tag color="cyan" style={{ marginTop: 6, borderRadius: 10, fontWeight: 600 }}>
                ● Matriks NFR 5×5 Terstruktur
              </Tag>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Stat Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-1">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0f9ff", color: "#0284c7" }}>
              <ApartmentOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Judul Kegiatan Induk</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{allHiradc.length} Pekerjaan</div>
              <Text style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>{totalSubActivitiesCount} Tahapan Proses Kerja</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-2">
            <div className="safety-stat-icon-wrapper" style={{ background: "#fff1f2", color: "#e11d48" }}>
              <ThunderboltOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Risiko Tinggi &amp; Ekstrem</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{highRiskCount} Kegiatan</div>
              <Text style={{ fontSize: 11.5, color: "#e11d48", fontWeight: 600 }}>Tindakan Segera / &lt;12 Bln</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-3">
            <div className="safety-stat-icon-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
              <CheckCircleOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Risiko Rendah / Sedang</Text>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{lowRiskCount} Kegiatan</div>
              <Text style={{ fontSize: 11.5, color: "#059669", fontWeight: 600 }}>Mitigasi Memadai</Text>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="safety-stat-card safety-card-animate safety-delay-4">
            <div className="safety-stat-icon-wrapper" style={{ background: "#f0fdfa", color: "#0d9488" }}>
              <SlidersOutlined />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>Hierarki Kontrol</Text>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>5 Tingkat</div>
              <Text style={{ fontSize: 11.5, color: "#0d9488", fontWeight: 600 }}>Eliminasi s/d APD</Text>
            </div>
          </div>
        </Col>
      </Row>

      {/* 3. Control Filter Bar & Tombol Tambah */}
      <div
        className="safety-card-animate safety-delay-2"
        style={{
          background: "#ffffff",
          padding: "14px 18px",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Input
            placeholder="Cari kegiatan (Menata Arsip, Fumigasi), proses kerja, PIC..."
            prefix={<SearchOutlined style={{ color: "#0284c7" }} />}
            style={{ width: 340, borderRadius: 8 }}
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
            placeholder="Status Pengendalian"
            style={{ width: 170 }}
            allowClear
            onChange={(val) => {
              setFilters(
                val ? [{ field: "controlStatus", operator: "eq", value: val }] : [],
                "merge"
              );
            }}
          >
            <Select.Option value="Open">Status: Open</Select.Option>
            <Select.Option value="Close">Status: Close</Select.Option>
          </Select>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            icon={<FilePdfOutlined />}
            className="btn-safety-secondary"
            style={{ height: 40 }}
            onClick={() => {
              setPrintItems(allHiradc);
              setPrintModalOpen(true);
            }}
          >
            Cetak Dokumen PDF
          </Button>

          <Button
            icon={<InfoCircleOutlined />}
            className="btn-safety-secondary"
            style={{ height: 40 }}
            onClick={() => setMatrixModalOpen(true)}
          >
            Panduan Matriks K3 (5×5)
          </Button>

          {canEdit && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="btn-safety-primary"
              style={{ height: 40, padding: "0 20px" }}
              onClick={() => navigate("/keselamatan/hiradc/create")}
            >
              Penilaian HIRADC Baru
            </Button>
          )}
        </div>
      </div>

      {/* 4. Content Card & Tabel */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-3"
        bordered={false}
      >
        <Table
          {...tableProps}
          columns={columns}
          rowKey="id"
          scroll={{ x: 1100 }}
          expandable={{
            expandedRowRender,
            rowExpandable: () => true,
            expandIcon: ({ expanded, onExpand, record }) => (
              <Button
                type="text"
                size="small"
                onClick={(e) => onExpand(record, e)}
                style={{
                  width: 24,
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0284c7",
                  padding: 0,
                }}
                icon={
                  expanded ? (
                    <DownOutlined style={{ fontSize: 13, fontWeight: "bold" }} />
                  ) : (
                    <RightOutlined style={{ fontSize: 13, fontWeight: "bold" }} />
                  )
                }
              />
            ),
          }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
        />
      </Card>

      {/* 5. Hierarki Pengendalian Risiko K3 */}
      <div className="safety-card-animate safety-delay-4">
        <Title level={4} style={{ margin: "10px 0 14px", color: "#0f172a", fontWeight: 700 }}>
          🎯 5 Tingkat Hierarki Pengendalian Risiko K3 (Hierarchy of Controls)
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Eliminasi &amp; Substitusi</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Menghilangkan sumber bahaya secara total atau mengganti zat/peralatan berbahaya dengan alternatif yang lebih aman bagi pegawai arsip.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284c7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Rekayasa Teknik &amp; Administrasi</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Pemasangan ventilasi exhaust di depo fumigasi arsip, pembatasan akses ruang genset, penyusunan SOP aman, dan rotasi kerja terjadwal.
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className="safety-tip-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#d97706", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Alat Pelindung Diri (APD)</div>
              </div>
              <Paragraph style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Lapisan pertahanan terakhir: wajib menggunakan masker respirator N95 di ruang restorasi kertas tua, sarung tangan nitril, dan safety shoes.
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modal Matriks Risiko 5x5 */}
      <RiskMatrixModal open={matrixModalOpen} onClose={() => setMatrixModalOpen(false)} />

      {/* Modal Format Cetak Dokumen PDF & Text Editor */}
      <HiradcPrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        items={printItems.length > 0 ? printItems : allHiradc}
        documentTitle="DAFTAR PENILAIAN RISIKO HIRADC"
      />
    </div>
  );
};
