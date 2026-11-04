import React from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Card,
  Descriptions,
  Table,
  Button,
  Alert,
  Tag,
  Row,
  Col,
  FormInstance,
} from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { SeverityTag } from "./SeverityTag";
import { InvestigationKorban, InvestigationPerbaikan } from "../../../../types/investigation";

interface StepPengesahanProps {
  form: FormInstance;
  goToStep: (stepIndex: number) => void;
}

export const StepPengesahan: React.FC<StepPengesahanProps> = ({
  form,
  goToStep,
}) => {
  const formValues = form.getFieldsValue(true);
  const insiden = formValues.insiden || {};
  const adaKorban = formValues.ada_korban;
  const korbanList = formValues.korban || [];
  const investigasi = formValues.investigasi || {};
  const perbaikanList = formValues.perbaikan || [];

  // Validation checks per step
  const isStep1Complete = !!(
    insiden.judul &&
    insiden.tanggal_jam &&
    insiden.lokasi &&
    insiden.unit &&
    insiden.jenis &&
    insiden.tingkat_keparahan &&
    insiden.deskripsi
  );

  const isStep2Complete =
    adaKorban === false || (adaKorban !== false && korbanList.length > 0 && korbanList[0]?.nama);

  const isStep3Complete = !!(
    investigasi.tim_investigator?.length > 0 &&
    investigasi.ketua_tim &&
    investigasi.tanggal_mulai &&
    investigasi.tanggal_selesai &&
    investigasi.kronologi?.length > 0 &&
    investigasi.analisis_akar_masalah?.akar_penyebab
  );

  const isStep4Complete = perbaikanList.length > 0 && perbaikanList[0]?.uraian;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Alert
        message="Pratinjau & Pengesahan Data Investigasi"
        description="Periksa kembali ringkasan berkas investigasi di bawah sebelum mengajukan pengesahan. Anda dapat mengklik tombol 'Ubah' pada tiap bagian jika terdapat data yang perlu diperbarui."
        type="info"
        showIcon
        style={{ borderRadius: 8 }}
      />

      {/* Ringkasan Langkah 1: Insiden */}
      <Card
        size="small"
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              1. Data Insiden & Kejadian
            </span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => goToStep(0)}
              style={{ fontWeight: 600 }}
            >
              Ubah Data Insiden
            </Button>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        {!isStep1Complete ? (
          <Alert
            message="Data Insiden Belum Lengkap"
            description="Terdapat field wajib pada langkah 1 yang belum terisi (judul, tanggal kejadian, lokasi, dll)."
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={() => goToStep(0)}>
                Lengkapi
              </Button>
            }
            style={{ borderRadius: 6 }}
          />
        ) : (
          <Descriptions size="small" bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="No. Investigasi">
              <strong>{formValues.nomor || "INV-2026-XXX"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Laporan Terkait">
              {formValues.laporan_nomor ? (
                <Tag color="volcano">{formValues.laporan_nomor}</Tag>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Insiden">
              <Tag color="blue">{insiden.jenis || "-"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Judul Insiden" span={2}>
              {insiden.judul || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tingkat Keparahan">
              <SeverityTag severity={insiden.tingkat_keparahan} />
            </Descriptions.Item>
            <Descriptions.Item label="Tanggal & Jam">
              {insiden.tanggal_jam
                ? dayjs(insiden.tanggal_jam).format("DD/MM/YYYY HH:mm")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Lokasi TKP">
              {insiden.lokasi || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Unit Kerja">
              {insiden.unit || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Deskripsi" span={3}>
              {insiden.deskripsi || "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* Ringkasan Langkah 2: Korban */}
      <Card
        size="small"
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              2. Data Korban Insiden
            </span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => goToStep(1)}
              style={{ fontWeight: 600 }}
            >
              Ubah Data Korban
            </Button>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        {!isStep2Complete ? (
          <Alert
            message="Data Korban Perlu Dilengkapi"
            description="Opsi 'Ada Korban' aktif namun belum ada minimal 1 data korban yang diisi lengkap."
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={() => goToStep(1)}>
                Lengkapi
              </Button>
            }
            style={{ borderRadius: 6 }}
          />
        ) : adaKorban === false ? (
          <div style={{ color: "#64748b", fontStyle: "italic" }}>
            ✔ Insiden dicatat tanpa korban manusia (Near Miss / Aset Kerusakan).
          </div>
        ) : (
          <Table<InvestigationKorban>
            size="small"
            pagination={false}
            dataSource={(korbanList || []) as InvestigationKorban[]}
            rowKey={(r) => String(r.id || r.nama)}
            columns={[
              { title: "Nama Korban", dataIndex: "nama", key: "nama" },
              { title: "NIP/ID", dataIndex: "nip_id", key: "nip_id", render: (v) => v || "-" },
              { title: "Unit / Jabatan", key: "unit", render: (_, r) => `${r.unit || "-"} / ${r.jabatan || "-"}` },
              {
                title: "Jenis Cedera",
                dataIndex: "jenis_cedera",
                key: "jenis_cedera",
              },
              {
                title: "Bagian Tubuh",
                dataIndex: "bagian_tubuh",
                key: "bagian_tubuh",
                render: (tags: string[]) => tags?.map((t) => <Tag key={t}>{t}</Tag>),
              },
              {
                title: "Kondisi",
                dataIndex: "status_kondisi",
                key: "status_kondisi",
                render: (v) => (
                  <Tag color={v === "Sembuh" ? "green" : v === "Rawat" ? "blue" : "volcano"}>
                    {v}
                  </Tag>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Ringkasan Langkah 3: Investigasi & RCA */}
      <Card
        size="small"
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              3. Hasil Investigasi & Analisis Akar Masalah (RCA)
            </span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => goToStep(2)}
              style={{ fontWeight: 600 }}
            >
              Ubah Data Investigasi
            </Button>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        {!isStep3Complete ? (
          <Alert
            message="Data Investigasi Belum Lengkap"
            description="Pastikan tim investigator, ketua tim, rentang tanggal, kronologi, dan akar masalah telah terisi."
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={() => goToStep(2)}>
                Lengkapi
              </Button>
            }
            style={{ borderRadius: 6 }}
          />
        ) : (
          <Descriptions size="small" bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Ketua Tim">
              ⭐ <strong>{investigasi.ketua_tim || "-"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Anggota Tim">
              {investigasi.tim_investigator?.join(", ") || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Rentang Waktu">
              {investigasi.tanggal_mulai && investigasi.tanggal_selesai
                ? `${dayjs(investigasi.tanggal_mulai).format("DD/MM/YYYY")} s.d. ${dayjs(investigasi.tanggal_selesai).format("DD/MM/YYYY")}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kronologi Peristiwa">
              {investigasi.kronologi?.length || 0} Urutan waktu dicatat
            </Descriptions.Item>
            <Descriptions.Item label="Penyebab Langsung" span={2}>
              {investigasi.penyebab_langsung?.uraian || "-"} (
              {investigasi.penyebab_langsung?.kategori?.join(", ") || "-"})
            </Descriptions.Item>
            <Descriptions.Item label="Akar Penyebab Utama (Root Cause)" span={2}>
              <strong style={{ color: "#b45309" }}>
                {investigasi.analisis_akar_masalah?.akar_penyebab || "-"}
              </strong>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* Ringkasan Langkah 4: Rencana Tindakan Perbaikan */}
      <Card
        size="small"
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>
              4. Tindakan Perbaikan & Pencegahan (CAPA)
            </span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => goToStep(3)}
              style={{ fontWeight: 600 }}
            >
              Ubah Tindakan Perbaikan
            </Button>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        {!isStep4Complete ? (
          <Alert
            message="Tindakan Perbaikan Masih Kosong"
            description="Minimal harus ada 1 rencana tindakan perbaikan dengan uraian yang jelas."
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={() => goToStep(3)}>
                Lengkapi
              </Button>
            }
            style={{ borderRadius: 6 }}
          />
        ) : (
          <Table<InvestigationPerbaikan>
            size="small"
            pagination={false}
            dataSource={(perbaikanList || []) as InvestigationPerbaikan[]}
            rowKey={(r) => String(r.id || r.uraian)}
            columns={[
              { title: "No.", width: 50, render: (_, __, i) => i + 1 },
              { title: "Rencana Tindakan", dataIndex: "uraian", key: "uraian" },
              {
                title: "Hirarki",
                dataIndex: "hirarki",
                key: "hirarki",
                width: 140,
                render: (v) => <Tag color="purple">{v}</Tag>,
              },
              { title: "PIC", dataIndex: "penanggung_jawab", key: "pic", width: 160 },
              {
                title: "Target Selesai",
                dataIndex: "target_selesai",
                key: "target",
                width: 130,
                render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: 100,
                render: (v) => (
                  <Tag color={v === "Selesai" ? "green" : v === "Sedang" ? "blue" : "default"}>
                    {v}
                  </Tag>
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* Lembar Pengesahan & Pernyataan */}
      <Card
        size="small"
        title={
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            5. Lembar Pengajuan & Pengesahan
          </span>
        }
        style={{
          borderRadius: 8,
          background: "#fafafa",
          border: "1px solid #d9d9d9",
        }}
      >
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Pemeriksa / Pengesah Laporan</span>}
              name={["pengesahan", "pemeriksa"]}
              rules={[{ required: true, message: "Pengesah wajib dipilih!" }]}
            >
              <Select
                placeholder="Pilih pejabat pemeriksa"
                options={[
                  { value: "Kepala Biro KU", label: "Kepala Biro KU (Ir. Hendra Gunawan, M.M.)" },
                  { value: "Koordinator Tim K3", label: "Koordinator Tim K3 (Siti Rahmawati, S.Tr.Kes)" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Catatan Pengajuan (Opsional)"
              name={["pengesahan", "catatan_pengajuan"]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Tambahkan catatan khusus untuk pemeriksa (misal urgensi pengadaan barang K3)..."
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <div
              style={{
                background: "#f0fdf4",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid #bbf7d0",
              }}
            >
              <Form.Item
                name={["pengesahan", "pernyataan_benar"]}
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Anda harus mencentang pernyataan kebenaran data ini!")
                          ),
                  },
                ]}
                style={{ margin: 0 }}
              >
                <Checkbox>
                  <strong style={{ color: "#166534" }}>
                    Saya menyatakan data investigasi ini benar dan lengkap sesuai fakta lapangan hasil pemeriksaan.
                  </strong>
                </Checkbox>
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
