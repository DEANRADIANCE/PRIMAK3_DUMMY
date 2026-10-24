import React, { useState } from "react";
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
  Radio,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { TaspenCountdown } from "../../../components/common/TaspenCountdown";
import { EmploymentStatus, SeverityLevel, TaspenStatus } from "../../../types/accident";
import { IUser } from "../../../types/user";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  date: Dayjs;
  time: Dayjs;
  location: string;
  accidentType: string;
  chronology: string;
  severityLevel: SeverityLevel;
  victimName: string;
  victimNip: string;
  employmentStatus: EmploymentStatus;
  victimUnit: string;
  injuryType: string;
  medicalAction: string;
  k3Name: string;
  k3Position: string;
  k3Handling: string;
  taspenStatus: TaspenStatus;
}

export const AccidentReportCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
  const [form] = Form.useForm();
  const { mutate: createAccident, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>("ASN");
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const onFinish = (values: FormValues) => {
    const formatted = {
      date: values.date ? values.date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      time: values.time ? values.time.format("HH:mm") : "09:00",
      location: values.location,
      accidentType: values.accidentType,
      chronology: values.chronology,
      severityLevel: values.severityLevel,
      victim: {
        name: values.victimName,
        nip: values.victimNip,
        employmentStatus: values.employmentStatus,
        unit: values.victimUnit,
        injuryType: values.injuryType,
        medicalAction: values.medicalAction,
      },
      k3Team: {
        name: values.k3Name || user?.name || "Tim K3 ANRI",
        position: values.k3Position || "Koordinator Tim K3",
        handling: values.k3Handling,
      },
      taspenStatus: values.taspenStatus || "belum",
      taspenDeadline: dayjs(selectedDate).add(values.employmentStatus === "ASN" ? 5 : 3, "day").format("YYYY-MM-DD"),
      status: "reported",
      statusHistory: [
        {
          status: "Dilaporkan",
          changedBy: user?.name || "Tim K3 ANRI",
          changedAt: dayjs().format("YYYY-MM-DD HH:mm"),
          notes: "Laporan kecelakaan kerja baru dicatat",
        },
      ],
      photos: [],
    };

    createAccident(
      {
        resource: "accident-reports",
        values: formatted,
        successNotification: {
          message: "Laporan Kecelakaan Berhasil Disimpan",
          description: `Laporan kecelakaan kerja korban ${values.victimName} telah terdaftar.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/kecelakaan");
        },
      }
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-danger form-card-animate form-delay-1">
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
                <AlertOutlined /> INSIDEN KERJA & KLAIM JKK TASPEN
              </Tag>
              <span style={{ fontSize: 13, color: "#fee2e2" }}>Batas Pelaporan 2x24 Jam</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Formulir Pelaporan Kecelakaan Kerja Baru
            </Title>
            <Paragraph style={{ color: "#fee2e2", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Catat data insiden kecelakaan kerja, identitas korban, pertolongan medis awal, dan pengajuan klaim jaminan kecelakaan kerja PT TASPEN.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/keselamatan/kecelakaan")}
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
          date: dayjs(),
          time: dayjs(),
          employmentStatus: "ASN",
          severityLevel: "sedang",
          taspenStatus: "belum",
          k3Name: user?.name || "Siti Rahmawati, S.Tr.Kes",
          k3Position: "Koordinator Tim K3",
        }}
      >
        {/* Banner Durasi TASPEN */}
        <div style={{ marginBottom: 20 }}>
          <TaspenCountdown
            accidentDate={selectedDate}
            employmentStatus={employmentStatus}
            taspenStatus="belum"
            showBanner={true}
          />
        </div>

        {/* Seksi 1: Data Kejadian */}
        <Card className="form-content-card form-card-animate form-delay-2" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Data Waktu & Lokasi Kejadian Kecelakaan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Kejadian</span>}
                name="date"
                rules={[{ required: true, message: "Tanggal wajib diisi!" }]}
              >
                <DatePicker
                  style={{ width: "100%", borderRadius: 8 }}
                  format="DD/MM/YYYY"
                  size="large"
                  onChange={(d) => {
                    if (d) setSelectedDate(d.format("YYYY-MM-DD"));
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Waktu / Jam Kejadian</span>}
                name="time"
                rules={[{ required: true }]}
              >
                <TimePicker style={{ width: "100%", borderRadius: 8 }} format="HH:mm" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jenis Kecelakaan</span>}
                name="accidentType"
                rules={[{ required: true, message: "Jenis kecelakaan wajib dipilih!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="Terjatuh / Terpeleset">Terjatuh / Terpeleset</Select.Option>
                  <Select.Option value="Tertimpa Benda">Tertimpa Benda</Select.Option>
                  <Select.Option value="Tersengat Listrik">Tersengat Listrik</Select.Option>
                  <Select.Option value="Terhirup Gas / Kimia">Terhirup Gas / Kimia</Select.Option>
                  <Select.Option value="Terjepit Mesin / Rak">Terjepit Mesin / Rak</Select.Option>
                  <Select.Option value="Lainnya">Lainnya</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Spesifik Kejadian</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi kejadian wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tangga Utama Gedung B Lantai 1" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tingkat Keparahan Cedera</span>}
                name="severityLevel"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="ringan">Ringan (Dapat langsung bekerja kembali / P3K)</Select.Option>
                  <Select.Option value="sedang">Sedang (Perlu istirahat medis 1-3 hari)</Select.Option>
                  <Select.Option value="berat">Berat (Dirujuk ke RS / Istirahat &gt; 3 hari)</Select.Option>
                  <Select.Option value="meninggal">Meninggal Dunia / Fatality</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kronologi Lengkap Kejadian</span>}
                name="chronology"
                rules={[{ required: true, message: "Kronologi kejadian wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={4}
                  style={{ borderRadius: 8 }}
                  placeholder="Uraikan alur kejadian secara runtut bagaimana kecelakaan dapat terjadi..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 2: Data Korban */}
        <Card className="form-content-card form-card-animate form-delay-3" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">2</span>
            <span>Identitas Korban & Penanganan Medis</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nama Lengkap Korban</span>}
                name="victimName"
                rules={[{ required: true, message: "Nama korban wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Rina Kusuma Dewi, S.Sos." size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>NIP / Nomor Identitas Pegawai</span>}
                name="victimNip"
                rules={[{ required: true, message: "NIP wajib diisi!" }]}
              >
                <Input placeholder="Contoh: 199208142018012003" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Kepegawaian (Menentukan Durasi TASPEN)</span>}
                name="employmentStatus"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  value={employmentStatus}
                  buttonStyle="solid"
                  size="large"
                >
                  <Radio.Button value="ASN">ASN (Batas Klaim 5 Hari)</Radio.Button>
                  <Radio.Button value="PPPK">PPPK (Batas Klaim 3 Hari)</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja Korban</span>}
                name="victimUnit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Pelayanan dan Informasi" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jenis Cedera yang Dialami</span>}
                name="injuryType"
                rules={[{ required: true, message: "Jenis cedera wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Keseleo pergelangan kaki kanan dan memar siku" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tindakan Medis Awal yang Diberikan</span>}
                name="medicalAction"
                rules={[{ required: true, message: "Tindakan medis wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Pertolongan pertama kompres es di Klinik Pratama ANRI" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 3: Penginput Tim K3 & Pengajuan TASPEN */}
        <Card className="form-content-card form-card-animate form-delay-4" bordered={false} style={{ marginBottom: 24 }}>
          <div className="form-section-title">
            <span className="badge-num">3</span>
            <span>Penanganan Tim K3 & Administrasi TASPEN</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nama Petugas Tim K3</span>}
                name="k3Name"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jabatan Petugas Tim K3</span>}
                name="k3Position"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Pengajuan Klaim JKK TASPEN</span>}
                name="taspenStatus"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="belum">Belum Diajukan</Select.Option>
                  <Select.Option value="diajukan">Sudah Diajukan ke PT TASPEN</Select.Option>
                  <Select.Option value="selesai">Klaim Selesai / Disetujui</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tindakan Pengamanan Area oleh Tim K3</span>}
                name="k3Handling"
                rules={[{ required: true, message: "Tindakan pengamanan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  style={{ borderRadius: 8 }}
                  placeholder="Contoh: Mengamankan lokasi dengan pita pembatas dan membuat Berita Acara Kejadian"
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate("/keselamatan/kecelakaan")}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="btn-form-submit"
            >
              Simpan Laporan Kecelakaan
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};
