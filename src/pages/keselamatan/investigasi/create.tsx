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
  Space,
  Row,
  Col,
  Checkbox,
  Divider,
  Alert,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { initialAccidents } from "../../../mocks/accidents";

const { Title, Text, Paragraph } = Typography;

export const InvestigationCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createInvestigation, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: any) => {
    // TODO: Field investigasi di bawah mengikuti format formulir investigasi insiden standar K3.
    // Sesuaikan dengan dokumen acuan jika telah dapat diakses:
    // https://docs.google.com/document/d/1rNUR9pUWrm2ZINazOkyObvDoDK2eQnPM/edit

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
      recommendations: [values.recommendation1, values.recommendation2].filter(Boolean),
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/investigasi")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Formulir Investigasi Kecelakaan & Insiden K3
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Pemeriksaan mendalam penyebab langsung, penyebab tidak langsung, dan akar masalah
          </Text>
        </div>
      </div>

      <Alert
        message="Acuan Format Formulir Investigasi K3"
        description="Formulir ini disusun berdasarkan standar investigasi kecelakaan kerja. (TODO: Bidang-bidang isian dapat disesuaikan dengan dokumen acuan Klinik Pratama ANRI jika diperlukan)."
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

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
        {/* Seksi 1: Tautan Laporan & Data Kejadian */}
        <Card
          title="1. Data Kejadian & Tautan Insiden"
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
                label="Tautkan dengan Laporan Kecelakaan"
                name="relatedReportNumber"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  {initialAccidents.map((acc) => (
                    <Select.Option key={acc.id} value={acc.reportNumber}>
                      {acc.reportNumber} - {acc.victim.name} ({acc.accidentType})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Tanggal Kejadian" name="incidentDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Waktu Kejadian" name="incidentTime" rules={[{ required: true }]}>
                <TimePicker style={{ width: "100%" }} format="HH:mm" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Lokasi Tempat Kejadian Perkara"
                name="incidentLocation"
                rules={[{ required: true, message: "Lokasi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tangga Utama Gedung B Lantai 1" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Ringkasan Insiden"
                name="incidentDescription"
                rules={[{ required: true, message: "Deskripsi wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Korban tergelincir saat menuruni tangga membawa boks arsip" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Kronologi Hasil Rekonstruksi Investigasi"
                name="chronology"
                rules={[{ required: true, message: "Kronologi investigasi wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Deskripsikan urutan waktu, kondisi lingkungan saat kejadian, dan tindakan sesaat sebelum kecelakaan..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 2: Keterangan Saksi */}
        <Card
          title="2. Keterangan Saksi Mata"
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
              <Form.Item label="Nama Saksi" name="witness1Name">
                <Input placeholder="Contoh: Nurul Hidayati, S.AP." size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Jabatan Saksi" name="witness1Position">
                <Input placeholder="Contoh: Arsiparis Pertama" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Unit Kerja Saksi" name="witness1Unit">
                <Input placeholder="Contoh: Direktorat Pelayanan" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Pernyataan / Kesaksian" name="witness1Statement">
                <Input.TextArea
                  rows={2}
                  placeholder="Uraikan apa yang dilihat, didengar, atau diketahui langsung oleh saksi..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 3: Analisis Akar Masalah (Why Tree / Fishbone) */}
        <Card
          title="3. Analisis Penyebab (Penyebab Langsung, Tidak Langsung & Akar Masalah)"
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
                label="Penyebab Langsung 1 (Kondisi / Tindakan Tidak Aman)"
                name="directCause1"
                rules={[{ required: true, message: "Penyebab langsung wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Permukaan anak tangga basah licin sisa cairan deterjen" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Penyebab Langsung 2" name="directCause2">
                <Input placeholder="Contoh: Korban membawa tumpukan dokumen tebal menghalangi pandangan" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Penyebab Tidak Langsung (Faktor Kerja / Personal)"
                name="indirectCause1"
                rules={[{ required: true, message: "Penyebab tidak langsung wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tidak tersedianya rambu portabel 'Awas Lantai Basah'" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Penyebab Tidak Langsung 2" name="indirectCause2">
                <Input placeholder="Contoh: Pengepelan dilakukan pada jam ramai mobilitas pegawai" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Akar Masalah (Root Cause 1 - Faktor Sistem / Manajemen)"
                name="rootCause1"
                rules={[{ required: true, message: "Akar masalah wajib diidentifikasi!" }]}
              >
                <Input placeholder="Contoh: Belum ada SOP jam khusus pembersihan basah di luar jam sibuk" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Akar Masalah 2" name="rootCause2">
                <Input placeholder="Contoh: Alokasi sarana rambu keselamatan kerja belum merata" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 4: Rekomendasi & Tindakan Korektif */}
        <Card
          title="4. Rekomendasi & Tindakan Korektif"
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
                label="Rekomendasi Pencegahan"
                name="recommendation1"
                rules={[{ required: true, message: "Rekomendasi wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Contoh: Pemasangan anti-slip strip pada seluruh anak tangga gedung"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Tindakan Korektif Spesifik" name="correctiveAction" rules={[{ required: true }]}>
                <Input.TextArea
                  rows={2}
                  placeholder="Contoh: Pengadaan 12 unit papan peringatan dan instalasi rubber tread"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Penanggung Jawab Tindakan (PIC)" name="actionPic" rules={[{ required: true }]}>
                <Input placeholder="Contoh: Subbagian Sarpras" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Target Tanggal Penyelesaian" name="actionTarget" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Seksi 5: Pengesahan & Tanda Tangan */}
        <Card
          title="5. Lembar Pengesahan Tim Investigasi & Kepala Unit"
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
              <Card size="small" style={{ backgroundColor: "#fafafa", height: "100%" }}>
                <Title level={5}>Tim Keselamatan & Kesehatan Kerja (K3)</Title>
                <Form.Item label="Nama Petugas K3" name="k3SignerName" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
                <Form.Item name="k3Signed" valuePropName="checked">
                  <Checkbox>
                    <strong>Tanda Tangan Digital Tim K3</strong> (Menyatakan hasil investigasi sah)
                  </Checkbox>
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card size="small" style={{ backgroundColor: "#fafafa", height: "100%" }}>
                <Title level={5}>Kepala Unit Kerja Terkait</Title>
                <Form.Item label="Nama Kepala Unit" name="unitHeadSignerName" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
                <Form.Item name="unitHeadSigned" valuePropName="checked">
                  <Checkbox>
                    <strong>Tanda Tangan Digital Kepala Unit</strong> (Menyetujui rekomendasi perbaikan)
                  </Checkbox>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button onClick={() => navigate("/keselamatan/investigasi")}>Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            style={{ background: "#595959", borderColor: "#595959" }}
          >
            Simpan Berkas Investigasi
          </Button>
        </div>
      </Form>
    </div>
  );
};
