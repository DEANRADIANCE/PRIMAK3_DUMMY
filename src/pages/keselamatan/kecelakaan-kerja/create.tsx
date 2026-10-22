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
  Space,
  Row,
  Col,
  Radio,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { TaspenCountdown } from "../../../components/common/TaspenCountdown";
import { EmploymentStatus } from "../../../types/accident";

const { Title, Text } = Typography;

export const AccidentReportCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createAccident, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>("ASN");
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const onFinish = (values: any) => {
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
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/kecelakaan")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Form Pelaporan Kecelakaan Kerja Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Pencatatan data insiden kecelakaan kerja pegawai ANRI dan klaim TASPEN
          </Text>
        </div>
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
        <Card
          title="1. Data Kejadian Kecelakaan"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 20,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Tanggal Kejadian"
                name="date"
                rules={[{ required: true, message: "Tanggal wajib diisi!" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  size="large"
                  onChange={(d) => {
                    if (d) setSelectedDate(d.format("YYYY-MM-DD"));
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Waktu / Jam Kejadian" name="time" rules={[{ required: true }]}>
                <TimePicker style={{ width: "100%" }} format="HH:mm" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Jenis Kecelakaan"
                name="accidentType"
                rules={[{ required: true, message: "Jenis kecelakaan wajib dipilih!" }]}
              >
                <Select size="large">
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
                label="Lokasi Spesifik Kejadian"
                name="location"
                rules={[{ required: true, message: "Lokasi kejadian wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tangga Utama Gedung B Lantai 1" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Tingkat Keparahan" name="severityLevel" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="ringan">Ringan (Dapat langsung bekerja kembali / P3K)</Select.Option>
                  <Select.Option value="sedang">Sedang (Perlu istirahat medis 1-3 hari)</Select.Option>
                  <Select.Option value="berat">Berat (Dirujuk ke RS / Istirahat &gt; 3 hari)</Select.Option>
                  <Select.Option value="meninggal">Meninggal Dunia / Fatality</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Kronologi Lengkap Kejadian"
                name="chronology"
                rules={[{ required: true, message: "Kronologi kejadian wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Uraikan alur kejadian secara runtut bagaimana kecelakaan dapat terjadi..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 2: Data Korban */}
        <Card
          title="2. Data Korban Kecelakaan"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 20,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nama Lengkap Korban"
                name="victimName"
                rules={[{ required: true, message: "Nama korban wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Rina Kusuma Dewi, S.Sos." size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="NIP / Nomor Identitas Pegawai"
                name="victimNip"
                rules={[{ required: true, message: "NIP wajib diisi!" }]}
              >
                <Input placeholder="Contoh: 199208142018012003" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Status Kepegawaian (Menentukan Durasi TASPEN)"
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
                label="Unit Kerja Korban"
                name="victimUnit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Pelayanan dan Informasi" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Jenis Cedera yang Dialami"
                name="injuryType"
                rules={[{ required: true, message: "Jenis cedera wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Keseleo pergelangan kaki kanan dan memar siku" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Tindakan Medis Awal yang Diberikan"
                name="medicalAction"
                rules={[{ required: true, message: "Tindakan medis wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Pertolongan pertama kompres es di Klinik Pratama ANRI" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 3: Penginput Tim K3 & Pengajuan TASPEN */}
        <Card
          title="3. Penanganan Tim K3 & Administrasi TASPEN"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 24,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Nama Petugas Tim K3" name="k3Name" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Jabatan Petugas Tim K3" name="k3Position" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Status Pengajuan Klaim JKK TASPEN"
                name="taspenStatus"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Select.Option value="belum">Belum Diajukan</Select.Option>
                  <Select.Option value="diajukan">Sudah Diajukan ke PT TASPEN</Select.Option>
                  <Select.Option value="selesai">Klaim Selesai / Disetujui</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Tindakan Pengamanan Area oleh Tim K3"
                name="k3Handling"
                rules={[{ required: true, message: "Tindakan pengamanan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Contoh: Mengamankan lokasi dengan pita pembatas dan membuat Berita Acara Kejadian"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button onClick={() => navigate("/keselamatan/kecelakaan")}>Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            style={{ background: "#595959", borderColor: "#595959" }}
          >
            Simpan Laporan Kecelakaan
          </Button>
        </div>
      </Form>
    </div>
  );
};
