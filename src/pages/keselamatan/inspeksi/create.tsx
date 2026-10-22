import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Radio,
  Progress,
  InputNumber,
  Divider,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { ChecklistStatus, IChecklistItem, InspectionType } from "../../../types/inspection";

const { Title, Text, Paragraph } = Typography;

export const InspectionCreate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = (searchParams.get("type") as InspectionType) || "environment";

  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createInspection, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [inspectionType, setInspectionType] = useState<InspectionType>(defaultType);

  // Initial templates per type
  const defaultChecklists: Record<InspectionType, IChecklistItem[]> = {
    environment: [
      { id: 1, item: "Tingkat Pencahayaan Meja Kerja (Lux)", status: "compliant", notes: "", measuredValue: 350, threshold: 300, unit: "Lux" },
      { id: 2, item: "Tingkat Kebisingan Area Kerja (dBA)", status: "compliant", notes: "", measuredValue: 60, threshold: 85, unit: "dBA" },
      { id: 3, item: "Suhu Ruang Kerja (°C)", status: "compliant", notes: "", measuredValue: 23, threshold: 24, unit: "°C" },
      { id: 4, item: "Kelembapan Udara (%RH)", status: "compliant", notes: "", measuredValue: 55, threshold: 60, unit: "%RH" },
      { id: 5, item: "Kadar Gas CO (ppm)", status: "compliant", notes: "", measuredValue: 2, threshold: 25, unit: "ppm" },
    ],
    emergency: [
      { id: 1, item: "Tekanan dan Segel Tabung APAR Lengkap & Siap Pakai", status: "compliant", notes: "" },
      { id: 2, item: "Kotak P3K Terisi Sesuai Standar Permenaker No. 15/2008", status: "compliant", notes: "" },
      { id: 3, item: "Jalur Evakuasi Bebas Hambatan dan Koridor Terang", status: "compliant", notes: "" },
      { id: 4, item: "Lampu Darurat (Emergency Lighting) Menyala Otomatis", status: "compliant", notes: "" },
      { id: 5, item: "Pintu Keluar Darurat Tidak Terkunci dari Dalam", status: "compliant", notes: "" },
    ],
    behavior: [
      { id: 1, item: "Pegawai Menggunakan APD Wajib Sesuai Area Bahaya", status: "compliant", notes: "" },
      { id: 2, item: "Penerapan Ergonomi Pengangkatan Beban (Manual Handling)", status: "compliant", notes: "" },
      { id: 3, item: "Kepatuhan Larangan Merokok & Makan di Ruang Arsip", status: "compliant", notes: "" },
      { id: 4, item: "Kepatuhan SOP Pengoperasian Alat/Mesin Kerja", status: "compliant", notes: "" },
    ],
    "5r": [
      { id: 1, item: "Ringkas (Memisahkan barang tidak berguna dari area kerja)", status: "compliant", notes: "" },
      { id: 2, item: "Rapi (Menata barang berlabel pada tempatnya)", status: "compliant", notes: "" },
      { id: 3, item: "Resik (Lantai dan meja bersih tanpa sampah / debu tebal)", status: "compliant", notes: "" },
      { id: 4, item: "Rawat (Menjaga konsistensi kebersihan harian)", status: "compliant", notes: "" },
      { id: 5, item: "Rajin (Disiplin mematuhi aturan 5R bersama)", status: "compliant", notes: "" },
    ],
    apd: [
      { id: 1, item: "Kelayakan Fisik Helm Keselamatan (Safety Helmet)", status: "compliant", notes: "" },
      { id: 2, item: "Kelayakan Kacamata Safety Goggles / Pelindung Wajah", status: "compliant", notes: "" },
      { id: 3, item: "Ketersediaan Masker Kimia / Respirator Half Face", status: "compliant", notes: "" },
      { id: 4, item: "Kelayakan Sarung Tangan Karet Nitril Tahan Kimia", status: "compliant", notes: "" },
      { id: 5, item: "Kondisi Sepatu Pengaman (Safety Shoes)", status: "compliant", notes: "" },
    ],
    tools: [
      { id: 1, item: "Fungsi Tombol Emergency Stop Mesin Penghancur Kertas", status: "compliant", notes: "" },
      { id: 2, item: "Kondisi Cover Pelindung Mesin / Safety Guarding", status: "compliant", notes: "" },
      { id: 3, item: "Kondisi Roda Tangga Gudang Bergerak & Kunci Rem", status: "compliant", notes: "" },
      { id: 4, item: "Kondisi Hidrolik Hand Pallet Truck Pengangkut Arsip", status: "compliant", notes: "" },
    ],
  };

  const [checklist, setChecklist] = useState<IChecklistItem[]>(defaultChecklists[defaultType]);

  // Hitung Skor Kepatuhan Otomatis (%)
  const validItems = checklist.filter((item) => item.status !== "na");
  const compliantItems = checklist.filter((item) => item.status === "compliant");
  const autoScore = validItems.length > 0 ? Math.round((compliantItems.length / validItems.length) * 100) : 100;

  const handleStatusChange = (index: number, newStatus: ChecklistStatus) => {
    const updated = [...checklist];
    updated[index].status = newStatus;
    setChecklist(updated);
  };

  const handleNotesChange = (index: number, val: string) => {
    const updated = [...checklist];
    updated[index].notes = val;
    setChecklist(updated);
  };

  const handleMeasuredChange = (index: number, val: number | null) => {
    const updated = [...checklist];
    updated[index].measuredValue = val || 0;
    // Auto check compliant vs threshold
    if (updated[index].threshold) {
      if (updated[index].item.includes("Kebisingan") || updated[index].item.includes("CO") || updated[index].item.includes("Kelembapan")) {
        updated[index].status = (val || 0) <= updated[index].threshold! ? "compliant" : "non_compliant";
      } else if (updated[index].item.includes("Pencahayaan")) {
        updated[index].status = (val || 0) >= updated[index].threshold! ? "compliant" : "non_compliant";
      }
    }
    setChecklist(updated);
  };

  const handleTypeSelect = (type: InspectionType) => {
    setInspectionType(type);
    setChecklist(defaultChecklists[type]);
  };

  const onFinish = (values: any) => {
    const formatted = {
      type: inspectionType,
      date: values.date ? values.date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      inspector: values.inspector || user?.name || "Tim K3 ANRI",
      inspectorId: user?.id || 2,
      unit: values.unit,
      location: values.location,
      checklist,
      findings: values.findings,
      followUp: values.followUp,
      responsiblePerson: values.responsiblePerson,
      complianceScore: autoScore,
      status: "completed",
    };

    createInspection(
      {
        resource: "inspections",
        values: formatted,
        successNotification: {
          message: "Inspeksi Berhasil Disimpan",
          description: `Audit inspeksi tersimpan dengan skor kepatuhan ${autoScore}%.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/keselamatan/inspeksi");
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/inspeksi")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Audit & Inspeksi K3 Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Lengkapi checklist pemeriksaan berkala dan pantau skor kepatuhan otomatis
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: dayjs(),
          type: defaultType,
          inspector: user?.name || "Siti Rahmawati, S.Tr.Kes",
          unit: "Direktorat Preservasi Arsip",
          location: "Laboratorium Preservasi Gedung B",
          responsiblePerson: "Ahmad Fauzi (Sarpras)",
        }}
      >
        <Card
          title="Data Umum Pelaksanaan Inspeksi"
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
              <Form.Item label="Jenis Tab Inspeksi K3" name="type" rules={[{ required: true }]}>
                <Select size="large" value={inspectionType} onChange={handleTypeSelect}>
                  <Select.Option value="environment">Pemantauan Lingkungan</Select.Option>
                  <Select.Option value="emergency">Sarpras Tanggap Darurat</Select.Option>
                  <Select.Option value="behavior">Perilaku Kerja</Select.Option>
                  <Select.Option value="5r">5R (Ringkas, Rapi, Resik, Rawat, Rajin)</Select.Option>
                  <Select.Option value="apd">Alat Pelindung Diri (APD)</Select.Option>
                  <Select.Option value="tools">Alat Kerja & Mesin</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Tanggal Inspeksi" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Auditor / Nama Inspektur" name="inspector" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Unit Kerja Sasaran" name="unit" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Lokasi Area Inspeksi" name="location" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Skor Kepatuhan Banner */}
        <Card style={{ marginBottom: 20, backgroundColor: "#fafafa" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Kalkulasi Skor Kepatuhan Otomatis:
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {compliantItems.length} dari {validItems.length} item dinyatakan SESUAI standar K3
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Progress
                type="circle"
                percent={autoScore}
                width={65}
                strokeColor={autoScore >= 80 ? "#52c41a" : "#faad14"}
              />
              <div style={{ fontSize: 24, fontWeight: 700, color: autoScore >= 80 ? "#52c41a" : "#faad14" }}>
                {autoScore}%
              </div>
            </div>
          </div>
        </Card>

        {/* Checklist Tabel Form */}
        <Card
          title="Daftar Periksa (Checklist) Item K3"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {checklist.map((item, index) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: "16px",
                  background: item.status === "compliant" ? "#f6ffed" : item.status === "non_compliant" ? "#fff1f0" : "#ffffff",
                }}
              >
                <Row gutter={[16, 12]} align="middle">
                  <Col xs={24} md={10}>
                    <Text strong style={{ fontSize: 14 }}>
                      {index + 1}. {item.item}
                    </Text>
                    {item.threshold !== undefined && (
                      <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>
                        Nilai Ambang Standar: {item.threshold} {item.unit}
                      </div>
                    )}
                  </Col>

                  {/* Jika tab environment: input nilai terukur */}
                  {item.threshold !== undefined && (
                    <Col xs={24} sm={10} md={5}>
                      <Space>
                        <Text style={{ fontSize: 12 }}>Terukur:</Text>
                        <InputNumber
                          value={item.measuredValue}
                          onChange={(v) => handleMeasuredChange(index, v)}
                          addonAfter={item.unit}
                          style={{ width: 130 }}
                        />
                      </Space>
                    </Col>
                  )}

                  <Col xs={24} sm={14} md={item.threshold !== undefined ? 9 : 14}>
                    <Radio.Group
                      value={item.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="compliant">Sesuai</Radio.Button>
                      <Radio.Button value="non_compliant">Tidak Sesuai</Radio.Button>
                      <Radio.Button value="na">N/A</Radio.Button>
                    </Radio.Group>
                  </Col>

                  <Col xs={24}>
                    <Input
                      placeholder="Catatan temuan / kondisi spesifik..."
                      value={item.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Card>

        {/* Temuan & Tindak Lanjut */}
        <Card
          title="Kesimpulan Temuan & Tindak Lanjut"
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
              <Form.Item
                label="Catatan Temuan Umum"
                name="findings"
                rules={[{ required: true, message: "Catatan temuan wajib diisi!" }]}
              >
                <Input.TextArea rows={3} placeholder="Rangkuman hasil inspeksi audit..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Rekomendasi Tindak Lanjut Perbaikan"
                name="followUp"
                rules={[{ required: true, message: "Tindak lanjut wajib diisi!" }]}
              >
                <Input.TextArea rows={3} placeholder="Langkah perbaikan yang wajib dilakukan unit..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Penanggung Jawab Tindak Lanjut (PIC)"
                name="responsiblePerson"
                rules={[{ required: true, message: "PIC wajib diisi!" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button onClick={() => navigate("/keselamatan/inspeksi")}>Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            style={{ background: "#595959", borderColor: "#595959" }}
          >
            Simpan Hasil Audit Inspeksi
          </Button>
        </div>
      </Form>
    </div>
  );
};
