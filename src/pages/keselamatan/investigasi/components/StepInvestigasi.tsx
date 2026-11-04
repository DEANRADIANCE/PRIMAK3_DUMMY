import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  Upload,
  Space,
  Popconfirm,
  Typography,
  FormInstance,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { initialUsers } from "../../../../mocks/users";
import { initialHiradc } from "../../../../mocks/hiradc";

const { Text, Paragraph } = Typography;

interface StepInvestigasiProps {
  form: FormInstance;
}

export const StepInvestigasi: React.FC<StepInvestigasiProps> = ({ form }) => {
  const [selectedTeam, setSelectedTeam] = useState<string[]>(
    form.getFieldValue(["investigasi", "tim_investigator"]) || []
  );

  const [evidenceList, setEvidenceList] = useState<any[]>(
    form.getFieldValue(["investigasi", "bukti_pendukung"]) || []
  );

  const handleTeamChange = (values: string[]) => {
    setSelectedTeam(values);
    // If ketua_tim is not in values, reset ketua_tim to first member
    const currentKetua = form.getFieldValue(["investigasi", "ketua_tim"]);
    if (!values.includes(currentKetua) && values.length > 0) {
      form.setFieldValue(["investigasi", "ketua_tim"], values[0]);
    }
  };

  const handleEvidenceUpload = ({ fileList }: any) => {
    setEvidenceList(fileList);
    form.setFieldValue(
      ["investigasi", "bukti_pendukung"],
      fileList.map((f: any) => ({
        uid: f.uid,
        name: f.name,
        size: f.size,
        type: f.type,
        url: f.url || (f.originFileObj ? URL.createObjectURL(f.originFileObj) : ""),
      }))
    );
  };

  const eligibleInvestigators = initialUsers.filter(
    (u) =>
      u.role === "tim_k3" ||
      u.role === "admin" ||
      u.role === "kepala_unit" ||
      u.role === "pegawai"
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Tim Investigator & Tanggal Pelaksanaan */}
      <Card
        size="small"
        title={
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            <UsergroupAddOutlined style={{ marginRight: 6, color: "#4f46e5" }} />
            Tim Investigator & Rentang Waktu Pemeriksaan
          </span>
        }
        style={{ borderRadius: 8 }}
      >
        <Row gutter={[16, 8]}>
          <Col xs={24} md={14}>
            <Form.Item
              label="Anggota Tim Investigator"
              name={["investigasi", "tim_investigator"]}
              rules={[
                { required: true, message: "Minimal pilih 1 orang tim investigator!" },
              ]}
              extra="Pilih petugas K3 / perwakilan unit yang terlibat dalam investigasi"
            >
              <Select
                mode="multiple"
                placeholder="Pilih anggota tim investigator"
                onChange={handleTeamChange}
                options={eligibleInvestigators.map((u) => ({
                  value: u.name,
                  label: `${u.name} (${u.position})`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10}>
            <Form.Item
              label="Ketua Tim Investigator"
              name={["investigasi", "ketua_tim"]}
              rules={[{ required: true, message: "Ketua tim wajib ditentukan!" }]}
              extra="Dipilih dari anggota tim yang ditugaskan"
            >
              <Select
                placeholder="Pilih ketua tim"
                options={selectedTeam.map((name) => ({
                  value: name,
                  label: `⭐ ${name} (Ketua)`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tanggal Mulai Investigasi"
              name={["investigasi", "tanggal_mulai"]}
              rules={[{ required: true, message: "Tanggal mulai wajib diisi!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Tanggal Mulai" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tanggal Selesai Investigasi"
              name={["investigasi", "tanggal_selesai"]}
              rules={[{ required: true, message: "Tanggal selesai wajib diisi!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Tanggal Selesai" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 2. Kronologi Kejadian Bertahap */}
      <Card
        size="small"
        title={
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            <ClockCircleOutlined style={{ marginRight: 6, color: "#0284c7" }} />
            Kronologi Hasil Rekonstruksi (Urutan Waktu Peristiwa)
          </span>
        }
        style={{ borderRadius: 8 }}
      >
        <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
          Uraikan runtutan kejadian secara terperinci mulai dari situasi sesaat sebelum kejadian, saat peristiwa berlangsung, hingga evakuasi awal.
        </Paragraph>

        <Form.List
          name={["investigasi", "kronologi"]}
          rules={[
            {
              validator: async (_, kronologiList) => {
                if (!kronologiList || kronologiList.length < 1) {
                  return Promise.reject(new Error("Minimal masukkan 1 catatan kronologi peristiwa!"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {fields.map(({ key, name, ...restField }, idx) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    background: "#f8fafc",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#0284c7",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ width: 140 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "waktu"]}
                        rules={[{ required: true, message: "Waktu/jam wajib diisi!" }]}
                        style={{ margin: 0 }}
                      >
                        <Input placeholder="Jam (10:15)" />
                      </Form.Item>
                    </div>

                    <div style={{ flex: 1, minWidth: 260 }}>
                      <Form.Item
                        {...restField}
                        name={[name, "uraian"]}
                        rules={[{ required: true, message: "Uraian tindakan/kejadian wajib diisi!" }]}
                        style={{ margin: 0 }}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Uraian apa yang terjadi pada jam/waktu tersebut..."
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      title="Hapus urutan"
                    />
                  )}
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ id: Date.now(), waktu: "", uraian: "" })}
                icon={<PlusOutlined />}
                style={{ borderRadius: 6 }}
              >
                + Tambah Titik Waktu Kronologi
              </Button>
              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </Card>

      {/* 3. Keterangan Saksi */}
      <Card
        size="small"
        title={<span style={{ fontWeight: 700, color: "#0f172a" }}>Keterangan Saksi Mata</span>}
        style={{ borderRadius: 8 }}
      >
        <Form.List name={["investigasi", "saksi"]}>
          {(fields, { add, remove }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{
                    background: "#ffffff",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Row gutter={[12, 8]}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        label="Nama Saksi"
                        name={[name, "nama"]}
                        rules={[{ required: true, message: "Nama saksi wajib diisi!" }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Contoh: Nurul Hidayati, S.AP." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        label="Unit Kerja Saksi"
                        name={[name, "unit"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Contoh: Direktorat Pelayanan" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                      <Form.Item
                        {...restField}
                        label="Jabatan Saksi"
                        name={[name, "jabatan"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Contoh: Arsiparis Pertama" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={1} style={{ display: "flex", alignItems: "flex-end" }}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        title="Hapus saksi"
                      />
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        {...restField}
                        label="Keterangan / Kesaksian yang Diberikan"
                        name={[name, "keterangan"]}
                        rules={[{ required: true, message: "Keterangan saksi wajib diisi!" }]}
                        style={{ marginBottom: 0, marginTop: 8 }}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Uraikan apa yang disaksikan langsung (kondisi alat, suara, posisi korban)..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}

              <Button
                type="dashed"
                onClick={() => add({ id: Date.now(), nama: "", unit: "", jabatan: "", keterangan: "" })}
                icon={<PlusOutlined />}
                style={{ borderRadius: 6 }}
              >
                + Tambah Keterangan Saksi
              </Button>
            </div>
          )}
        </Form.List>
      </Card>

      {/* 4. Analisis Penyebab Langsung & Faktor Kontribusi */}
      <Card
        size="small"
        title={<span style={{ fontWeight: 700, color: "#0f172a" }}>Analisis Penyebab (Causation Analysis)</span>}
        style={{ borderRadius: 8 }}
      >
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Penyebab Langsung (Direct Causes)"
              name={["investigasi", "penyebab_langsung", "kategori"]}
              rules={[{ required: true, message: "Kategori penyebab langsung wajib dipilih!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Pilih kategori penyebab langsung"
                options={[
                  { value: "Tindakan tidak aman", label: "Tindakan Tidak Aman (Unsafe Action)" },
                  { value: "Kondisi tidak aman", label: "Kondisi Tidak Aman (Unsafe Condition)" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Uraian Penyebab Langsung"
              name={["investigasi", "penyebab_langsung", "uraian"]}
              rules={[{ required: true, message: "Uraian penyebab langsung wajib diisi!" }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Contoh: Permukaan anak tangga licin sisa sabun tanpa rambu penanda..."
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Faktor Kontribusi (Contributing Factors)"
              name={["investigasi", "faktor_kontribusi"]}
              rules={[{ required: true, message: "Minimal pilih 1 faktor kontribusi!" }]}
            >
              <Checkbox.Group style={{ width: "100%" }}>
                <Row gutter={[16, 8]}>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Manusia">Manusia (Human)</Checkbox></Col>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Peralatan">Peralatan (Equipment)</Checkbox></Col>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Material">Material (Material)</Checkbox></Col>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Metode">Metode (Procedure)</Checkbox></Col>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Lingkungan">Lingkungan (Environment)</Checkbox></Col>
                  <Col xs={12} sm={8} md={4}><Checkbox value="Manajemen">Manajemen (System)</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 5. Analisis Akar Masalah "5 Mengapa" (5-Why Analysis) */}
      <Card
        size="small"
        title={
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            <QuestionCircleOutlined style={{ marginRight: 6, color: "#d97706" }} />
            Analisis Akar Masalah "5-Why" (Root Cause Analysis)
          </span>
        }
        style={{ borderRadius: 8, background: "#fffdfa", border: "1px solid #fef3c7" }}
      >
        <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 12 }}>
          Ajukan pertanyaan "Mengapa" secara berulang hingga menyingkap akar kelemahan sistem manajerial atau prosedur (bukan sekadar kesalahan individu).
        </Paragraph>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Mengapa 1 (Mengapa insiden terjadi?)</Text>}
            name={["investigasi", "analisis_akar_masalah", "five_whys", "why1"]}
            rules={[{ required: true, message: "Pertanyaan Mengapa 1 wajib diisi!" }]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Contoh: Korban terpeleset di anak tangga ke-4 saat turun membawa berkas" />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Mengapa 2 (Mengapa kondisi/tindakan tersebut bisa terjadi?)</Text>}
            name={["investigasi", "analisis_akar_masalah", "five_whys", "why2"]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Contoh: Permukaan anak tangga licin dari air sabun pembersih yang belum kering" />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Mengapa 3 (Mengapa hal itu tidak dicegah / tidak terlihat?)</Text>}
            name={["investigasi", "analisis_akar_masalah", "five_whys", "why3"]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Contoh: Rambu 'Lantai Licin' tidak dipasang di area tangga" />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Mengapa 4 (Mengapa rambu peringatan / SOP tidak diterapkan?)</Text>}
            name={["investigasi", "analisis_akar_masalah", "five_whys", "why4"]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Contoh: Pengepelan dilakukan pada jam kerja sibuk dan ketersediaan rambu terbatas" />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13 }}>Mengapa 5 (Akar kegagalan sistemik / manajerial?)</Text>}
            name={["investigasi", "analisis_akar_masalah", "five_whys", "why5"]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Contoh: Belum ada SOP jam khusus pembersihan basah di luar jam kerja sibuk pegawai" />
          </Form.Item>

          <Form.Item
            label={<Text strong style={{ fontSize: 13.5, color: "#b45309" }}>Kesimpulan Akar Penyebab Masalah (Root Cause)</Text>}
            name={["investigasi", "analisis_akar_masalah", "akar_penyebab"]}
            rules={[{ required: true, message: "Akar penyebab masalah wajib dirumuskan!" }]}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              rows={3}
              placeholder="Rumuskan akar kegagalan sistemik yang harus diselesaikan agar kecelakaan serupa tidak dapat terulang kembali..."
            />
          </Form.Item>
        </div>
      </Card>

      {/* 6. Bukti Pendukung & Tautan HIRADC */}
      <Card
        size="small"
        title={<span style={{ fontWeight: 700, color: "#0f172a" }}>Bukti Pendukung & Tinjauan HIRADC</span>}
        style={{ borderRadius: 8 }}
      >
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tautkan dengan Dokumen HIRADC Terkait (Opsional)"
              name={["investigasi", "hiradc_nomor"]}
              extra="Pilih register HIRADC yang memuat bahaya sejenis"
            >
              <Select
                showSearch
                placeholder="Pilih referensi HIRADC"
                allowClear
                options={initialHiradc.map((h) => {
                  const hirNumber = `HIR-2026-${String(h.id).padStart(3, "0")}`;
                  return {
                    value: hirNumber,
                    label: `${hirNumber} - ${h.activity} (${h.hazard})`,
                  };
                })}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Catatan Bahaya HIRADC yang Perlu Ditinjau Ulang"
              name={["investigasi", "catatan_bahaya_hiradc"]}
            >
              <Input placeholder="Contoh: Perlu peningkatan skor keparahan pada aktivitas lalu lintas tangga" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Bukti Pendukung (Foto Tambahan, Rekaman CCTV, Dokumen BAP)"
              extra="Format: JPG, PNG, PDF, MP4, Audio (Maks 10MB per file)"
            >
              <Upload
                fileList={evidenceList}
                onChange={handleEvidenceUpload}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>Unggah Bukti Tambahan</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
