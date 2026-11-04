import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Table,
  Divider,
  Row,
  Col,
  Alert,
  Modal,
  Input,
  Popconfirm,
  Spin,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate, useGetIdentity, useCan } from "@refinedev/core";
import dayjs from "dayjs";
import { Investigation } from "../../../types/investigation";
import { IUser } from "../../../types/user";
import { StatusTag } from "./components/StatusTag";
import { SeverityTag } from "./components/SeverityTag";
import "../keselamatan.css";
import "../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const InvestigationShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<IUser>();

  const { query } = useOne<Investigation>({
    resource: "investigations",
    id: id || "1",
  });

  const { mutate: updateInvestigation, mutation } = useUpdate();
  const isUpdating = mutation.isPending;

  const record = query.data?.data;
  const isLoading = query.isLoading;

  // Permissions
  const { data: canSahkanData } = useCan({
    resource: "investigations",
    action: "sahkan",
  });
  const canSahkan =
    canSahkanData?.can ??
    (currentUser?.role === "kepala_unit" ||
      currentUser?.role === "tim_k3" ||
      currentUser?.role === "admin");

  const { data: canExportData } = useCan({
    resource: "investigations",
    action: "export",
  });
  const canExport =
    canExportData?.can ??
    (currentUser?.role === "kepala_unit" ||
      currentUser?.role === "tim_k3" ||
      currentUser?.role === "admin");

  const { data: canEditData } = useCan({
    resource: "investigations",
    action: "edit",
  });
  const canEdit =
    canEditData?.can ??
    (currentUser?.role === "tim_k3" || currentUser?.role === "admin");

  // Modal Kembalikan state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnNote, setReturnNote] = useState("");

  if (isLoading || !record) {
    return (
      <Card style={{ textAlign: "center", padding: "60px 0", borderRadius: 14 }}>
        <Spin size="large" tip="Memuat berkas investigasi..." />
      </Card>
    );
  }

  // Handle Pengesahan
  const handleApprove = () => {
    const updated = {
      ...record,
      status: "Disahkan",
      pengesahan: {
        ...record.pengesahan,
        tanggal_pengesahan: dayjs().format("YYYY-MM-DD"),
        pemeriksa_nama: currentUser?.name || "Ir. Hendra Gunawan, M.M.",
        catatan_pengesah: "Disetujui. Seluruh rencana CAPA disahkan untuk dilaksanakan.",
      },
      timestamps: {
        ...record.timestamps,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    updateInvestigation(
      {
        resource: "investigations",
        id: record.id,
        values: updated,
        successNotification: {
          message: "Investigasi Berhasil Disahkan",
          description: "Berkas investigasi telah resmi disahkan oleh pimpinan.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          query.refetch();
        },
      }
    );
  };

  // Handle Kembalikan (Revisi)
  const handleReturnSubmit = () => {
    if (!returnNote.trim()) {
      message.error("Catatan alasan pengembalian wajib diisi!");
      return;
    }

    const updated = {
      ...record,
      status: "Dikembalikan",
      pengesahan: {
        ...record.pengesahan,
        catatan_pengesah: returnNote.trim(),
        tanggal_pengesahan: dayjs().format("YYYY-MM-DD"),
        pemeriksa_nama: currentUser?.name || "Ir. Hendra Gunawan, M.M.",
      },
      timestamps: {
        ...record.timestamps,
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    updateInvestigation(
      {
        resource: "investigations",
        id: record.id,
        values: updated,
        successNotification: {
          message: "Berkas Dikembalikan untuk Revisi",
          description: "Catatan perbaikan telah disimpan dan status berkas dikembalikan.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          setReturnModalOpen(false);
          setReturnNote("");
          query.refetch();
        },
      }
    );
  };

  const isPendingApproval = record.status === "Menunggu Pengesahan";
  const isReturned = record.status === "Dikembalikan";
  const isApproved = record.status === "Disahkan";
  const canModify = (record.status === "Draf" || record.status === "Dikembalikan") && canEdit;

  const insiden = record.insiden || {};
  const korbanList = record.korban || [];
  const investigasi = record.investigasi || {};
  const perbaikanList = record.perbaikan || [];
  const pengesahan = record.pengesahan || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Navigation & Actions Bar dengan Animasi */}
      <div
        className="safety-card-animate safety-delay-1"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          background: "#ffffff",
          padding: "16px 20px",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Space size="middle">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/keselamatan/investigasi")}
            className="btn-safety-secondary"
            style={{ height: 38 }}
          >
            Kembali
          </Button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Title level={4} style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>
                {record.nomor || `INV-2026-${String(record.id).padStart(3, "0")}`}
              </Title>
              <StatusTag status={record.status} />
              <SeverityTag severity={insiden.tingkat_keparahan || "Sedang"} />
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {insiden.judul || "Laporan Investigasi Insiden K3"}
            </Text>
          </div>
        </Space>

        <Space size="middle" wrap>
          {/* Ubah Data (untuk Draf atau Dikembalikan) */}
          {canModify && (
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/keselamatan/investigasi/edit/${record.id}`)}
              className="btn-safety-secondary"
              style={{ height: 38, fontWeight: 600 }}
            >
              Ubah Data
            </Button>
          )}

          {/* Tombol Pengesahan (Pemeriksa / Pengelola K3 / Kepala Biro KU) */}
          {isPendingApproval && canSahkan && (
            <>
              <Button
                danger
                icon={<RollbackOutlined />}
                onClick={() => setReturnModalOpen(true)}
                style={{ height: 38, borderRadius: 8, fontWeight: 600 }}
              >
                Kembalikan (Perlu Revisi)
              </Button>

              <Popconfirm
                title="Sahkan Laporan Investigasi?"
                description="Pastikan data kronologi, akar masalah (RCA), dan rencana tindakan perbaikan (CAPA) telah sesuai."
                onConfirm={handleApprove}
                okText="Ya, Sahkan"
                cancelText="Batal"
              >
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={isUpdating}
                  style={{
                    background: "#0d9488",
                    borderColor: "#0d9488",
                    borderRadius: 8,
                    fontWeight: 700,
                    height: 38,
                    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.35)",
                  }}
                >
                  Sahkan Investigasi
                </Button>
              </Popconfirm>
            </>
          )}

          {/* Tombol Ekspor/Cetak PDF (hanya bila punya izin) */}
          {canExport && (
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
              className="btn-safety-primary"
              style={{ height: 38 }}
            >
              Cetak / Ekspor PDF
            </Button>
          )}
        </Space>
      </div>

      {/* 2. Banner Informasi Status / Catatan Pengembalian */}
      {isReturned && (
        <div className="safety-card-animate safety-delay-2">
          <Alert
            message={
              <span style={{ fontWeight: 700, color: "#991b1b" }}>
                Berkas Dikembalikan untuk Diperbaiki
              </span>
            }
            description={
              <div>
                <div style={{ marginBottom: 4 }}>
                  <strong>Catatan dari Pemeriksa ({pengesahan.pemeriksa_nama || "Pemeriksa"}):</strong>
                </div>
                <div style={{ background: "#fef2f2", padding: "10px 14px", borderRadius: 8, border: "1px solid #fecaca" }}>
                  "{pengesahan.catatan_pengesah || "Mohon lengkapi data dan analisis yang belum sesuai."}"
                </div>
                {canModify && (
                  <div style={{ marginTop: 10 }}>
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      className="btn-safety-danger"
                      onClick={() => navigate(`/keselamatan/investigasi/edit/${record.id}`)}
                    >
                      Buka Formulir untuk Memperbaiki
                    </Button>
                  </div>
                )}
              </div>
            }
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
            style={{ borderRadius: 12 }}
          />
        </div>
      )}

      {isApproved && (
        <div className="safety-card-animate safety-delay-2">
          <Alert
            message={
              <span style={{ fontWeight: 700, color: "#166534" }}>
                Investigasi Telah Disahkan (Terkunci)
              </span>
            }
            description={`Berkas ini telah resmi disetujui oleh ${pengesahan.pemeriksa_nama || "Kepala Biro KU"} pada ${
              pengesahan.tanggal_pengesahan || dayjs().format("DD/MM/YYYY")
            }. Data bersifat read-only dan dapat diekspor ke format dokumen resmi.`}
            type="success"
            showIcon
            icon={<SafetyCertificateOutlined />}
            style={{ borderRadius: 12 }}
          />
        </div>
      )}

      {/* 3. Kop Dokumen Resmi Berita Acara (Printable View) */}
      <Card
        className="safety-content-card safety-card-animate safety-delay-2"
        style={{
          borderRadius: 14,
          padding: "16px 20px",
        }}
        bordered={false}
      >
        {/* Kop Surat Berita Acara ANRI */}
        <div style={{ textAlign: "center", borderBottom: "2px solid #0f172a", paddingBottom: 18, marginBottom: 26 }}>
          <Title level={3} style={{ margin: 0, letterSpacing: 1, color: "#0f172a" }}>
            ARSIP NASIONAL REPUBLIK INDONESIA
          </Title>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0d9488" }}>
            UNIT KESELAMATAN DAN KESEHATAN KERJA (PRIMA K3)
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            Jl. Ampera Raya No. 7, Cilandak Timur, Pasar Minggu, Jakarta Selatan 12560
          </div>
          <Divider style={{ margin: "14px 0 12px" }} />
          <Title level={4} style={{ margin: 0, textTransform: "uppercase", color: "#0f172a", letterSpacing: 0.5 }}>
            BERITA ACARA & LAPORAN INVESTIGASI INSIDEN K3
          </Title>
          <div style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginTop: 4 }}>
            Nomor: {record.nomor || `INV-2026-${String(record.id).padStart(3, "0")}`}
          </div>
        </div>

        {/* Seksi 1: Data Kejadian */}
        <div style={{ marginBottom: 28 }}>
          <Title level={5} style={{ color: "#0f172a", borderLeft: "4px solid #0d9488", paddingLeft: 10, marginBottom: 14 }}>
            I. DATA INSIDEN & KEJADIAN
          </Title>
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Nomor Berita Acara" span={1}>
              <strong>{record.nomor || "-"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Laporan Insiden Terkait" span={1}>
              {record.laporan_nomor ? (
                <Tag color="volcano" style={{ borderRadius: 4, fontWeight: 600 }}>{record.laporan_nomor}</Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Insiden" span={1}>
              <Tag color="blue" style={{ borderRadius: 4 }}>{insiden.jenis || "-"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Waktu Kejadian" span={1}>
              {insiden.tanggal_jam
                ? dayjs(insiden.tanggal_jam).format("dddd, DD MMMM YYYY • HH:mm WIB")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Lokasi Tempat Kejadian" span={2}>
              {insiden.lokasi || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Kerja" span={1}>
              {insiden.unit || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tingkat Keparahan" span={2}>
              <SeverityTag severity={insiden.tingkat_keparahan || "Sedang"} />
            </Descriptions.Item>
            <Descriptions.Item label="Judul / Ringkasan Insiden" span={3}>
              <strong style={{ color: "#0f172a" }}>{insiden.judul || "-"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi Detail Kejadian" span={3}>
              <span style={{ color: "#334155", lineHeight: 1.6 }}>{insiden.deskripsi || "-"}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Seksi 2: Data Korban */}
        <div style={{ marginBottom: 28 }}>
          <Title level={5} style={{ color: "#0f172a", borderLeft: "4px solid #0d9488", paddingLeft: 10, marginBottom: 14 }}>
            II. DATA KORBAN INSIDEN
          </Title>
          {korbanList.length === 0 ? (
            <div style={{ color: "#64748b", fontStyle: "italic", padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
              ✔ Tidak ada korban manusia pada insiden ini (Near Miss / Kerugian Aset).
            </div>
          ) : (
            <Table
              size="small"
              pagination={false}
              dataSource={korbanList}
              rowKey={(r) => String(r.id || r.nama)}
              columns={[
                { title: "No.", width: 50, render: (_, __, i) => i + 1 },
                { title: "Nama Korban", dataIndex: "nama", key: "nama", render: (v) => <strong style={{ color: "#0f172a" }}>{v}</strong> },
                { title: "NIP / ID", dataIndex: "nip_id", key: "nip" },
                { title: "Unit / Jabatan", render: (_, r) => `${r.unit || "-"} • ${r.jabatan || "-"}` },
                { title: "Jenis Cedera", dataIndex: "jenis_cedera" },
                {
                  title: "Bagian Tubuh",
                  dataIndex: "bagian_tubuh",
                  render: (tags: string[]) => tags?.map((t) => <Tag key={t} style={{ borderRadius: 4 }}>{t}</Tag>),
                },
                { title: "Pertolongan Medis (P3K)", dataIndex: "tindakan_medis" },
                {
                  title: "Kondisi",
                  dataIndex: "status_kondisi",
                  render: (v) => (
                    <Tag color={v === "Sembuh" ? "green" : v === "Rawat" ? "blue" : "volcano"} style={{ borderRadius: 6, fontWeight: 600 }}>
                      {v}
                    </Tag>
                  ),
                },
              ]}
            />
          )}
        </div>

        {/* Seksi 3: Hasil Investigasi & Kronologi & RCA */}
        <div style={{ marginBottom: 28 }}>
          <Title level={5} style={{ color: "#0f172a", borderLeft: "4px solid #0d9488", paddingLeft: 10, marginBottom: 14 }}>
            III. HASIL INVESTIGASI & ANALISIS AKAR MASALAH (ROOT CAUSE ANALYSIS)
          </Title>

          <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Ketua Tim Investigator">
              ⭐ <strong>{investigasi.ketua_tim || "-"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Anggota Tim">
              {investigasi.tim_investigator?.join(", ") || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Rentang Waktu Investigasi">
              {investigasi.tanggal_mulai && investigasi.tanggal_selesai
                ? `${dayjs(investigasi.tanggal_mulai).format("DD/MM/YYYY")} s.d. ${dayjs(investigasi.tanggal_selesai).format("DD/MM/YYYY")}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Referensi HIRADC">
              {investigasi.hiradc_nomor ? <Tag color="cyan" style={{ borderRadius: 4 }}>{investigasi.hiradc_nomor}</Tag> : "Tidak terkait"}
            </Descriptions.Item>
          </Descriptions>

          {/* Kronologi */}
          <div style={{ marginBottom: 18 }}>
            <Text strong style={{ fontSize: 13, color: "#1e293b" }}>Rekonstruksi Kronologi Peristiwa:</Text>
            <Table
              size="small"
              pagination={false}
              dataSource={investigasi.kronologi || []}
              rowKey={(r) => String(r.id || r.waktu)}
              style={{ marginTop: 8 }}
              columns={[
                { title: "No.", width: 50, render: (_, __, i) => i + 1 },
                { title: "Waktu / Jam", dataIndex: "waktu", width: 130, render: (v) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag> },
                { title: "Uraian Peristiwa & Situasi Lapangan", dataIndex: "uraian" },
              ]}
            />
          </div>

          {/* Saksi */}
          {investigasi.saksi && investigasi.saksi.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <Text strong style={{ fontSize: 13, color: "#1e293b" }}>Keterangan Saksi Mata:</Text>
              <Table
                size="small"
                pagination={false}
                dataSource={investigasi.saksi}
                rowKey={(r) => String(r.id || r.nama)}
                style={{ marginTop: 8 }}
                columns={[
                  { title: "Nama Saksi", dataIndex: "nama", width: 180 },
                  { title: "Unit / Jabatan", render: (_, r) => `${r.unit || "-"} (${r.jabatan || "-"})`, width: 220 },
                  { title: "Kesaksian di Lapangan", dataIndex: "keterangan" },
                ]}
              />
            </div>
          )}

          {/* Penyebab & 5-Why */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card size="small" title="Penyebab Langsung & Faktor Kontribusi" style={{ height: "100%", background: "#fffdfa", borderColor: "#fde68a" }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  <strong>Kategori:</strong>{" "}
                  {investigasi.penyebab_langsung?.kategori?.map((k: string) => (
                    <Tag key={k} color="volcano" style={{ borderRadius: 4 }}>{k}</Tag>
                  )) || "-"}
                </div>
                <div style={{ fontSize: 13, marginBottom: 10 }}>
                  <strong>Uraian:</strong> <span style={{ color: "#334155" }}>{investigasi.penyebab_langsung?.uraian || "-"}</span>
                </div>
                <div style={{ fontSize: 13 }}>
                  <strong>Faktor Kontribusi:</strong>{" "}
                  {investigasi.faktor_kontribusi?.map((f: string) => (
                    <Tag key={f} color="orange" style={{ borderRadius: 4 }}>{f}</Tag>
                  )) || "-"}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card size="small" title="Akar Masalah (5-Why Root Cause Analysis)" style={{ height: "100%", background: "#f0fdfa", borderColor: "#99f6e4" }}>
                <div style={{ fontSize: 13, marginBottom: 6 }}>
                  <strong>5-Why Analysis:</strong>
                </div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
                  {investigasi.analisis_akar_masalah?.five_whys?.why1 && (
                    <li>1. {investigasi.analisis_akar_masalah.five_whys.why1}</li>
                  )}
                  {investigasi.analisis_akar_masalah?.five_whys?.why2 && (
                    <li>2. {investigasi.analisis_akar_masalah.five_whys.why2}</li>
                  )}
                  {investigasi.analisis_akar_masalah?.five_whys?.why3 && (
                    <li>3. {investigasi.analisis_akar_masalah.five_whys.why3}</li>
                  )}
                  {investigasi.analisis_akar_masalah?.five_whys?.why4 && (
                    <li>4. {investigasi.analisis_akar_masalah.five_whys.why4}</li>
                  )}
                  {investigasi.analisis_akar_masalah?.five_whys?.why5 && (
                    <li>5. {investigasi.analisis_akar_masalah.five_whys.why5}</li>
                  )}
                </ul>
                <div style={{ marginTop: 12, fontSize: 13 }}>
                  <strong style={{ color: "#0f766e" }}>Kesimpulan Akar Penyebab:</strong>
                  <div style={{ color: "#115e59", fontWeight: 700, marginTop: 3 }}>
                    {investigasi.analisis_akar_masalah?.akar_penyebab || "-"}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Seksi 4: Rencana Tindakan Perbaikan (CAPA) */}
        <div style={{ marginBottom: 30 }}>
          <Title level={5} style={{ color: "#0f172a", borderLeft: "4px solid #0d9488", paddingLeft: 10, marginBottom: 14 }}>
            IV. TINDAKAN PERBAIKAN & PENCEGAHAN (CORRECTIVE & PREVENTIVE ACTIONS - CAPA)
          </Title>
          <Table
            size="small"
            pagination={false}
            dataSource={perbaikanList}
            rowKey={(r) => String(r.id || r.uraian)}
            columns={[
              { title: "No.", width: 50, render: (_, __, i) => i + 1 },
              { title: "Rencana Tindakan", dataIndex: "uraian", render: (v) => <strong style={{ color: "#0f172a" }}>{v}</strong> },
              { title: "Jenis", dataIndex: "jenis", width: 110 },
              {
                title: "Hirarki Pengendalian",
                dataIndex: "hirarki",
                width: 150,
                render: (v) => <Tag color="purple" style={{ borderRadius: 4 }}>{v}</Tag>,
              },
              { title: "Penanggung Jawab (PIC)", dataIndex: "penanggung_jawab", width: 170 },
              {
                title: "Batas Waktu (Target)",
                dataIndex: "target_selesai",
                width: 125,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
              },
              {
                title: "Status",
                dataIndex: "status",
                width: 110,
                render: (v) => (
                  <Tag
                    color={v === "Selesai" ? "green" : v === "Sedang" ? "blue" : "default"}
                    style={{ borderRadius: 6, fontWeight: 600 }}
                  >
                    {v}
                  </Tag>
                ),
              },
            ]}
          />
        </div>

        {/* Seksi 5: Tanda Tangan & Pengesahan */}
        <div>
          <Title level={5} style={{ color: "#0f172a", borderLeft: "4px solid #0d9488", paddingLeft: 10, marginBottom: 14 }}>
            V. LEMBAR PENGESAHAN HASIL INVESTIGASI
          </Title>
          <Row gutter={24} style={{ marginTop: 14 }}>
            <Col span={12}>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "18px 22px",
                  textAlign: "center",
                  background: "#f8fafc",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b" }}>Ketua Tim Investigator K3:</div>
                <div style={{ margin: "20px 0 14px" }}>
                  <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: "4px 14px", borderRadius: 6, fontWeight: 600 }}>
                    Ditandatangani Digital
                  </Tag>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>
                  {investigasi.ketua_tim || "Koordinator Tim K3"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Pranata K3 Ahli Muda ANRI</div>
              </div>
            </Col>

            <Col span={12}>
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "18px 22px",
                  textAlign: "center",
                  background: "#f8fafc",
                }}
              >
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Pemeriksa & Pengesah ({pengesahan.pemeriksa || "Kepala Biro KU"}):
                </div>
                <div style={{ margin: "20px 0 14px" }}>
                  {isApproved ? (
                    <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: "4px 14px", borderRadius: 6, fontWeight: 600 }}>
                      Disahkan ({pengesahan.tanggal_pengesahan || dayjs().format("DD/MM/YYYY")})
                    </Tag>
                  ) : isReturned ? (
                    <Tag color="error" icon={<CloseCircleOutlined />} style={{ padding: "4px 14px", borderRadius: 6, fontWeight: 600 }}>
                      Dikembalikan ({pengesahan.tanggal_pengesahan || dayjs().format("DD/MM/YYYY")})
                    </Tag>
                  ) : (
                    <Tag color="gold" icon={<ClockCircleOutlined />} style={{ padding: "4px 14px", borderRadius: 6, fontWeight: 600 }}>
                      Menunggu Pengesahan
                    </Tag>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>
                  {pengesahan.pemeriksa_nama || "Ir. Hendra Gunawan, M.M."}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {pengesahan.pemeriksa || "Kepala Biro Keuangan dan Umum"}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Modal Catatan Pengembalian (Wajib Diisi saat Mengembalikan) */}
      <Modal
        title="Kembalikan Berkas Investigasi (Perlu Revisi)"
        open={returnModalOpen}
        onCancel={() => {
          setReturnModalOpen(false);
          setReturnNote("");
        }}
        onOk={handleReturnSubmit}
        confirmLoading={isUpdating}
        okText="Kirim Catatan & Kembalikan"
        cancelText="Batal"
        okButtonProps={{ danger: true }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Tuliskan catatan perbaikan secara spesifik mengenai bagian yang perlu dilengkapi oleh tim investigator (misal analisis 5-Why, bukti TKP, atau rencana tindakan CAPA).
          </Paragraph>
          <TextArea
            rows={4}
            placeholder="Contoh: Mohon lengkapi analisis akar masalah 5-Why pada poin 4 dan 5 sebelum diajukan kembali..."
            value={returnNote}
            onChange={(e) => setReturnNote(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
export default InvestigationShow;
