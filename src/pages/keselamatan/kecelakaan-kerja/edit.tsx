import React, { useEffect } from "react";
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
import { ArrowLeftOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { IAccidentReport, EmploymentStatus, SeverityLevel, TaspenStatus, AccidentStatus } from "../../../types/accident";
import "../../../components/common/form-theme.css";

const { Title, Paragraph } = Typography;

interface FormValues {
  date: Dayjs;
  time: Dayjs;
  location: string;
  accidentType: string;
  severityLevel: SeverityLevel;
  chronology: string;
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
  status: AccidentStatus;
}

export const AccidentReportEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { query } = useOne<IAccidentReport>({
    resource: "accident-reports",
    id: id || "1",
  });

  const { mutate: updateAccident, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        date: dayjs(record.date),
        time: dayjs(record.time, "HH:mm"),
        location: record.location,
        accidentType: record.accidentType,
        severityLevel: record.severityLevel,
        chronology: record.chronology,
        victimName: record.victim.name,
        victimNip: record.victim.nip,
        employmentStatus: record.victim.employmentStatus,
        victimUnit: record.victim.unit,
        injuryType: record.victim.injuryType,
        medicalAction: record.victim.medicalAction,
        k3Name: record.k3Team.name,
        k3Position: record.k3Team.position,
        k3Handling: record.k3Team.handling,
        taspenStatus: record.taspenStatus,
        status: record.status,
      });
    }
  }, [record, form]);

  const onFinish = (values: FormValues) => {
    if (!record) return;

    updateAccident(
      {
        resource: "accident-reports",
        id: record.id,
        values: {
          date: values.date.format("YYYY-MM-DD"),
          time: values.time.format("HH:mm"),
          location: values.location,
          accidentType: values.accidentType,
          severityLevel: values.severityLevel,
          chronology: values.chronology,
          victim: {
            name: values.victimName,
            nip: values.victimNip,
            employmentStatus: values.employmentStatus,
            unit: values.victimUnit,
            injuryType: values.injuryType,
            medicalAction: values.medicalAction,
          },
          k3Team: {
            name: values.k3Name,
            position: values.k3Position,
            handling: values.k3Handling,
          },
          taspenStatus: values.taspenStatus,
          status: values.status,
        },
        successNotification: {
          message: "Laporan Kecelakaan Berhasil Diperbarui",
          description: `Perubahan data laporan ${record.reportNumber} berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/kecelakaan/show/${record.id}`);
        },
      }
    );
  };

  if (isLoading || !record) return <Card loading={true} style={{ borderRadius: 14 }} />;

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
                <EditOutlined /> PERBARUI BERKAS INSIDEN & JKK
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>No. Laporan: {record.reportNumber}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit Laporan Kecelakaan Kerja: {record.reportNumber}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui kronologi insiden, data korban kecelakaan, penanganan medis awal, atau status klaim TASPEN.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)}
              className="btn-form-cancel"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            >
              Batal & Kembali
            </Button>
          </Col>
        </Row>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card className="form-content-card form-card-animate form-delay-2" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Ubah Data Kejadian Kecelakaan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Kejadian</span>}
                name="date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Waktu Kejadian</span>}
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
                rules={[{ required: true }]}
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
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tingkat Keparahan</span>}
                name="severityLevel"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="ringan">Ringan</Select.Option>
                  <Select.Option value="sedang">Sedang</Select.Option>
                  <Select.Option value="berat">Berat</Select.Option>
                  <Select.Option value="meninggal">Meninggal Dunia</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Kronologi Lengkap</span>}
                name="chronology"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={4} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="form-content-card form-card-animate form-delay-3" bordered={false} style={{ marginBottom: 20 }}>
          <div className="form-section-title">
            <span className="badge-num">2</span>
            <span>Ubah Data Korban & Penanganan</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nama Lengkap Korban</span>}
                name="victimName"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>NIP Pegawai</span>}
                name="victimNip"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Kepegawaian</span>}
                name="employmentStatus"
                rules={[{ required: true }]}
              >
                <Radio.Group buttonStyle="solid" size="large">
                  <Radio.Button value="ASN">ASN (Batas 5 Hari)</Radio.Button>
                  <Radio.Button value="PPPK">PPPK (Batas 3 Hari)</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja Korban</span>}
                name="victimUnit"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Jenis Cedera</span>}
                name="injuryType"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tindakan Medis Awal</span>}
                name="medicalAction"
                rules={[{ required: true }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="form-content-card form-card-animate form-delay-4" bordered={false} style={{ marginBottom: 24 }}>
          <div className="form-section-title">
            <span className="badge-num">3</span>
            <span>Ubah Status TASPEN & Tindak Lanjut K3</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Pengajuan TASPEN</span>}
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
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Laporan Kasus</span>}
                name="status"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="reported">Dilaporkan</Select.Option>
                  <Select.Option value="verified">Diverifikasi</Select.Option>
                  <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
                  <Select.Option value="resolved">Selesai Ditangani</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tindakan Pengamanan Area oleh Tim K3</span>}
                name="k3Handling"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/keselamatan/kecelakaan/show/${record.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan Laporan
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};
