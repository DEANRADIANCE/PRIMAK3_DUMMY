import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Checkbox,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { initialAccidents } from "../../../mocks/accidents";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  relatedReportId?: number;
  relatedReportNumber: string;
  incidentDate: Dayjs;
  incidentTime: Dayjs;
  incidentLocation: string;
  incidentDescription: string;
  chronology: string;
  witness1Name?: string;
  witness1Position?: string;
  witness1Unit?: string;
  witness1Statement?: string;
  directCause1: string;
  directCause2?: string;
  indirectCause1: string;
  indirectCause2?: string;
  rootCause1: string;
  rootCause2?: string;
  recommendation1: string;
  correctiveAction: string;
  actionPic: string;
  actionTarget: Dayjs;
  k3SignerName: string;
  k3Signed?: boolean;
  unitHeadSignerName: string;
  unitHeadSigned?: boolean;
}

export const InvestigationCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createInvestigation, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: FormValues) => {
    const formatted = {
      relatedReportId: values.relatedReportId || 1,
      relatedReportType: "accident",
      relatedReportNumber: values.relatedReportNumber || "ACC-2026-001",
      incidentDate: values.incidentDate ? values.incidentDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      incidentTime: values.incidentTime ? values.incidentTime.format("HH:mm") : "10:15",
      incidentLocation: values.incidentLocation,
      incidentDescription: values.incidentDescription,
      chronology: values.chronology,
      witnesses: [
        {
          name: values.witness1Name || "Saksi Kejadian",
          position: values.witness1Position || "Staf",
          unit: values.witness1Unit || "Direktorat Terkait",
          statement: values.witness1Statement || "Melihat langsung kejadian di lokasi",
        },
      ],
      directCauses: [values.directCause1, values.directCause2].filter(Boolean),
      indirectCauses: [values.indirectCause1, values.indirectCause2].filter(Boolean),
      rootCauses: [values.rootCause1, values.rootCause2].filter(Boolean),
      recommendations: [values.recommendation1].filter(Boolean),
      correctiveActions: [
        {
          action: values.correctiveAction,
          responsiblePerson: values.actionPic,
          targetDate: values.actionTarget ? values.actionTarget.format("YYYY-MM-DD") : dayjs().add(2, "week").format("YYYY-MM-DD"),
          status: "Dalam Proses",
        },
      ],
      k3TeamSignature: {
        name: values.k3SignerName || "Siti Rahmawati, S.Tr.Kes",
        position: "Koordinator Tim K3",
        date: dayjs().format("YYYY-MM-DD"),
        signed: !!values.k3Signed,
      },
      unitHeadSignature: {
        name: values.unitHeadSignerName || "Ir. Hendra Gunawan, M.M.",
        position: "Kepala Unit Kerja",
        date: dayjs().format("YYYY-MM-DD"),
        signed: !!values.unitHeadSigned,
      },
      status: values.k3Signed && values.unitHeadSigned ? "completed" : "in_progress",
      investigatorId: user?.id || 2,
      investigatorName: user?.name || "Tim K3 ANRI",
    };

    createInvestigation(
      {
        resource: "investigations",
        values: formatted,
        successNotification: {
          message: "Form Investigasi Berhasil Disimpan",
          description: "Berkas laporan investigasi kecelakaan kerja telah dibuat.",
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/investigasi");
        },
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-edit form-card-animate form-delay-1">
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
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
              <span style={{ fontSize: 13, color: "#dbeafe" }}>Berkas Investigasi Insiden Baru</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Formulir Investigasi Kecelakaan & Insiden K3
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Pemeriksaan mendalam penyebab langsung, penyebab tidak langsung, dan akar masalah manajerial untuk penetapan tindakan korektif (CAPA).
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/keselamatan/investigasi")}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Kembali ke Daftar
            </Button>
          </Col>
        </Row>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          incidentDate: dayjs(),
          incidentTime: dayjs(),
          relatedReportNumber: "ACC-2026-001",
          k3SignerName: "Siti Rahmawati, S.Tr.Kes",
          unitHeadSignerName: "Ir. Hendra Gunawan, M.M.",
        }}
      >
        {/* Seksi 1: Data Kejadian */}
        <Card className="form-content-card form-card-animate form-delay-2" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Data Kejadian & Tautan Laporan Kecelakaan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tautkan dengan Laporan Kecelakaan</span>}
                name="relatedReportNumber"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  {initialAccidents.map((acc) => (
                    <Select.Option key={acc.id} value={acc.reportNumber}>
                      {acc.reportNumber} - {acc.victim.name} ({acc.accidentType})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Kejadian</span>} name="incidentDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Waktu Kejadian</span>} name="incidentTime" rules={[{ required: true }]}>
                <TimePicker style={{ width: "100%", borderRadius: 8 }} format="HH:mm" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Tempat Kejadian Perkara (TKP)</span>}
                name="incidentLocation"
                rules={[{ required: true, message: "Lokasi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tangga Utama Gedung B Lantai 1" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Ringkasan Insiden</span>}
                name="incidentDescription"
                rules={[{ required: true, message: "Deskripsi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Korban tergelincir saat menuruni tangga membawa boks arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kronologi Hasil Rekonstruksi Investigasi</span>}
                name="chronology"
                rules={[{ required: true, message: "Kronologi investigasi wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  style={{ borderRadius: 8 }}
                  placeholder="Deskripsikan urutan waktu, kondisi lingkungan saat kejadian, dan tindakan sesaat sebelum kecelakaan..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 2: Keterangan Saksi */}
        <Card className="form-content-card form-card-animate form-delay-3" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">2</span>
            <span>Keterangan Saksi Mata</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nama Saksi</span>} name="witness1Name">
                <Input placeholder="Contoh: Nurul Hidayati, S.AP." size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jabatan Saksi</span>} name="witness1Position">
                <Input placeholder="Contoh: Arsiparis Pertama" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja Saksi</span>} name="witness1Unit">
                <Input placeholder="Contoh: Direktorat Pelayanan" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pernyataan / Kesaksian di Lapangan</span>} name="witness1Statement">
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Uraikan apa yang dilihat, didengar, atau diketahui langsung oleh saksi..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 3: Analisis Penyebab */}
        <Card className="form-content-card form-card-animate form-delay-3" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">3</span>
            <span>Analisis Penyebab (Direct, Indirect & Root Causes)</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penyebab Langsung 1 (Kondisi / Tindakan)</span>}
                name="directCause1"
                rules={[{ required: true, message: "Penyebab langsung wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Permukaan anak tangga basah licin sisa cairan deterjen" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penyebab Langsung 2</span>} name="directCause2">
                <Input placeholder="Contoh: Korban membawa tumpukan dokumen tebal menghalangi pandangan" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penyebab Tidak Langsung (Faktor Personal / Kerja)</span>}
                name="indirectCause1"
                rules={[{ required: true, message: "Penyebab tidak langsung wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tidak tersedianya rambu portabel 'Awas Lantai Basah'" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penyebab Tidak Langsung 2</span>} name="indirectCause2">
                <Input placeholder="Contoh: Pengepelan dilakukan pada jam sibuk mobilitas pegawai" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Akar Masalah (Root Cause 1 - Faktor Sistem)</span>}
                name="rootCause1"
                rules={[{ required: true, message: "Akar masalah wajib diidentifikasi!" }]}
              >
                <Input placeholder="Contoh: Belum ada SOP jam khusus pembersihan basah di luar jam sibuk" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Akar Masalah 2</span>} name="rootCause2">
                <Input placeholder="Contoh: Alokasi sarana rambu keselamatan kerja belum merata" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 4: Rekomendasi & Tindakan Korektif */}
        <Card className="form-content-card form-card-animate form-delay-4" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">4</span>
            <span>Rekomendasi & Tindakan Korektif (CAPA)</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Rekomendasi Pencegahan</span>}
                name="recommendation1"
                rules={[{ required: true, message: "Rekomendasi wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Contoh: Pemasangan anti-slip strip pada seluruh anak tangga gedung"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tindakan Korektif Spesifik</span>} name="correctiveAction" rules={[{ required: true }]}>
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Contoh: Pengadaan 12 unit papan peringatan dan instalasi rubber tread"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penanggung Jawab Tindakan (PIC)</span>} name="actionPic" rules={[{ required: true }]}>
                <Input placeholder="Contoh: Subbagian Sarpras" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Target Batas Tanggal Penyelesaian</span>} name="actionTarget" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 5: Pengesahan & Tanda Tangan */}
        <Card className="form-content-card form-card-animate form-delay-4" bordered={false} style={{ marginBottom: 24 }}>
          <div className="form-section-title">
            <span className="badge-num">5</span>
            <span>Lembar Pengesahan Tim Investigasi & Pimpinan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0", height: "100%" }}>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Tim Keselamatan & Kesehatan Kerja (K3)</div>
                <Form.Item label={<span style={{ fontWeight: 600 }}>Nama Petugas K3</span>} name="k3SignerName" rules={[{ required: true }]}>
                  <Input size="large" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item name="k3Signed" valuePropName="checked">
                  <Checkbox>
                    <strong>Tanda Tangan Digital Tim K3</strong> (Menyatakan hasil investigasi sah)
                  </Checkbox>
                </Form.Item>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 10, border: "1px solid #e2e8f0", height: "100%" }}>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Kepala Unit Kerja Terkait</div>
                <Form.Item label={<span style={{ fontWeight: 600 }}>Nama Kepala Unit</span>} name="unitHeadSignerName" rules={[{ required: true }]}>
                  <Input size="large" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item name="unitHeadSigned" valuePropName="checked">
                  <Checkbox>
                    <strong>Tanda Tangan Digital Kepala Unit</strong> (Menyetujui rekomendasi perbaikan)
                  </Checkbox>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/keselamatan/investigasi")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Simpan Berkas Investigasi
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};
