import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Alert,
  Upload,
  Button,
  FormInstance,
  message,
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { initialAccidents } from "../../../../mocks/accidents";

interface StepInsidenProps {
  form: FormInstance;
  autoFilledReport?: string | null;
  setAutoFilledReport: (val: string | null) => void;
}

export const StepInsiden: React.FC<StepInsidenProps> = ({
  form,
  autoFilledReport,
  setAutoFilledReport,
}) => {
  const [fileList, setFileList] = useState<any[]>(
    form.getFieldValue(["insiden", "lampiran"]) || []
  );

  const handleSelectAccident = (reportNumber: string) => {
    if (!reportNumber) {
      setAutoFilledReport(null);
      return;
    }

    const accident = initialAccidents.find((a) => a.reportNumber === reportNumber);
    if (!accident) return;

    setAutoFilledReport(accident.reportNumber);

    const severityMap: Record<string, "Ringan" | "Sedang" | "Berat" | "Fatal"> = {
      ringan: "Ringan",
      sedang: "Sedang",
      berat: "Berat",
      fatal: "Fatal",
    };

    // Auto-fill incident fields
    form.setFieldsValue({
      laporan_id: accident.id,
      laporan_nomor: accident.reportNumber,
      insiden: {
        judul: `Insiden ${accident.accidentType} di ${accident.location}`,
        tanggal_jam: accident.date && accident.time ? dayjs(`${accident.date} ${accident.time}`) : dayjs(),
        lokasi: accident.location,
        unit: accident.victim?.unit || "Unit Kerja Terkait",
        jenis: "Kecelakaan Kerja",
        tingkat_keparahan: severityMap[accident.severityLevel?.toLowerCase()] || "Sedang",
        deskripsi: accident.chronology || "",
      },
    });

    // Also auto-fill victim if present
    if (accident.victim) {
      form.setFieldsValue({
        ada_korban: true,
        korban: [
          {
            id: 1,
            nama: accident.victim.name,
            nip_id: accident.victim.nip,
            unit: accident.victim.unit,
            jabatan: accident.victim.employmentStatus === "ASN" ? "Pegawai ASN" : "Pegawai PPPK",
            jenis_cedera: accident.victim.injuryType || "Luka Memar",
            bagian_tubuh: ["Kaki", "Tangan"],
            tingkat_keparahan_cedera: severityMap[accident.severityLevel?.toLowerCase()] || "Sedang",
            tindakan_medis: accident.victim.medicalAction || "Pertolongan pertama di klinik",
            dirujuk_ke: "Klinik Pratama ANRI",
            hari_kerja_hilang: 1,
            status_kondisi: "Rawat",
          },
        ],
      });
    }

    message.success(`Data berhasil diisi otomatis dari laporan ${accident.reportNumber}`);
  };

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    form.setFieldValue(
      ["insiden", "lampiran"],
      newFileList.map((f: any) => ({
        uid: f.uid,
        name: f.name,
        size: f.size,
        type: f.type,
        url: f.url || (f.originFileObj ? URL.createObjectURL(f.originFileObj) : ""),
      }))
    );
  };

  const beforeUpload = (file: File) => {
    const isAllowedType =
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isAllowedType) {
      message.error("Hanya file Gambar (JPG/PNG), PDF, atau DOCX yang diizinkan!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ukuran file tidak boleh melebihi 5MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent auto-uploading to external server (client-side mock)
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Alert bila data diisi dari laporan insiden */}
      {autoFilledReport && (
        <Alert
          message={
            <span>
              <strong>Data diisi dari laporan:</strong> {autoFilledReport}. Anda tetap dapat mengubah nilai field di bawah sesuai hasil pemeriksaan terbaru.
            </span>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          closable
          onClose={() => setAutoFilledReport(null)}
          style={{ borderRadius: 8 }}
        />
      )}

      <Row gutter={[16, 8]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Pilih Laporan Insiden Terkait (Opsional)"
            name="laporan_nomor"
            extra="Pilih dari daftar pelaporan kecelakaan kerja yang telah masuk untuk auto-fill data"
          >
            <Select
              showSearch
              placeholder="Cari nomor laporan atau nama korban..."
              allowClear
              onChange={handleSelectAccident}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={initialAccidents.map((acc) => ({
                value: acc.reportNumber,
                label: `${acc.reportNumber} - ${acc.accidentType} (${acc.victim?.name || "Tanpa korban"})`,
              }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="No. Investigasi (Otomatis)"
            name="nomor"
            extra="Dihasilkan otomatis oleh sistem"
          >
            <Input disabled placeholder="INV-2026-XXX" style={{ fontWeight: 600, color: "#1f2937" }} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Judul / Ringkasan Insiden"
            name={["insiden", "judul"]}
            rules={[{ required: true, message: "Judul insiden wajib diisi!" }]}
          >
            <Input
              placeholder="Contoh: Pegawai terpeleset saat menuruni tangga utama Gedung B"
              maxLength={150}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Tanggal & Jam Kejadian"
            name={["insiden", "tanggal_jam"]}
            rules={[{ required: true, message: "Tanggal dan jam kejadian wajib dipilih!" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
              placeholder="Pilih tanggal dan jam kejadian"
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Lokasi Tempat Kejadian Perkara (TKP)"
            name={["insiden", "lokasi"]}
            rules={[{ required: true, message: "Lokasi kejadian wajib diisi!" }]}
          >
            <Input placeholder="Contoh: Tangga Utama Gedung B Lantai 1 Menuju Lantai 2" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Unit Kerja Terkait"
            name={["insiden", "unit"]}
            rules={[{ required: true, message: "Unit kerja wajib dipilih/diisi!" }]}
          >
            <Select
              showSearch
              placeholder="Pilih unit kerja"
              options={[
                { value: "Direktorat Pelayanan dan Informasi", label: "Direktorat Pelayanan dan Informasi" },
                { value: "Direktorat Pengolahan Arsip", label: "Direktorat Pengolahan Arsip" },
                { value: "Direktorat Akuisisi Arsip", label: "Direktorat Akuisisi Arsip" },
                { value: "Biro Keuangan dan Umum", label: "Biro Keuangan dan Umum" },
                { value: "Subbagian Rumah Tangga dan Sarpras", label: "Subbagian Rumah Tangga dan Sarpras" },
                { value: "Pusat Data dan Informasi", label: "Pusat Data dan Informasi" },
                { value: "Klinik Pratama ANRI", label: "Klinik Pratama ANRI" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Jenis Insiden"
            name={["insiden", "jenis"]}
            rules={[{ required: true, message: "Jenis insiden wajib dipilih!" }]}
          >
            <Select
              placeholder="Pilih jenis insiden"
              options={[
                { value: "Kecelakaan Kerja", label: "Kecelakaan Kerja" },
                { value: "Near Miss", label: "Near Miss (Hampir Celaka)" },
                { value: "Unsafe Action", label: "Unsafe Action (Tindakan Tidak Aman)" },
                { value: "Unsafe Condition", label: "Unsafe Condition (Kondisi Tidak Aman)" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Tingkat Keparahan Insiden"
            name={["insiden", "tingkat_keparahan"]}
            rules={[{ required: true, message: "Tingkat keparahan wajib dipilih!" }]}
          >
            <Select
              placeholder="Pilih tingkat keparahan"
              options={[
                { value: "Ringan", label: "Ringan (Pertolongan P3K ringan)" },
                { value: "Sedang", label: "Sedang (Perawatan medis / rawat jalan)" },
                { value: "Berat", label: "Berat (Rawat inap / cedera serius)" },
                { value: "Fatal", label: "Fatal (Mengancam jiwa / korban jiwa)" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Deskripsi Kejadian Singkat"
            name={["insiden", "deskripsi"]}
            rules={[{ required: true, message: "Deskripsi kejadian wajib diisi!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Uraikan gambaran umum kejadian, apa yang terjadi, serta situasi lingkungan di sekeliling lokasi saat insiden berlangsung..."
              showCount
              maxLength={600}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label="Lampiran Foto / Dokumen Kejadian"
            extra="Format yang didukung: JPG, PNG, PDF, DOCX (Maksimal 5MB per file)."
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Unggah Berkas / Foto TKP</Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
