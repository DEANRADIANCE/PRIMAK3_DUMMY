import React from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Space,
  Popconfirm,
  Tag,
  FormInstance,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { initialManagedUsers } from "../../../../mocks/managedUsers";

interface StepKorbanProps {
  form: FormInstance;
}

export const StepKorban: React.FC<StepKorbanProps> = ({ form }) => {
  const adaKorban = Form.useWatch("ada_korban", form);

  const handleDuplicate = (add: (val: any) => void, record: any) => {
    add({
      ...record,
      id: Date.now(),
      nama: record.nama ? `${record.nama} (Salinan)` : "",
    });
  };

  const handleSelectEmployee = (name: string, index: number) => {
    const user = initialManagedUsers.find((u) => u.name === name);
    if (!user) return;

    const currentKorban = form.getFieldValue("korban") || [];
    currentKorban[index] = {
      ...currentKorban[index],
      nama: user.name,
      nip_id: `199${index + 1}0512202001100${user.id || 1}`,
      unit: user.unit,
      jabatan: user.role === "Pegawai" ? "Staf Pelaksana" : user.role,
    };
    form.setFieldsValue({ korban: [...currentKorban] });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Switch Ada Korban */}
      <Card
        size="small"
        style={{
          background: "#f8fafc",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
              Apakah terdapat korban dalam insiden ini?
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Jika tidak ada korban cedera (misal Near Miss atau kerusakan properti saja), nonaktifkan sakelar ini.
            </div>
          </div>
          <Form.Item name="ada_korban" valuePropName="checked" noStyle>
            <Switch
              checkedChildren="Ada Korban"
              unCheckedChildren="Tidak Ada Korban"
            />
          </Form.Item>
        </div>
      </Card>

      {/* Jika Tidak Ada Korban */}
      {adaKorban === false && (
        <Alert
          message="Tidak Ada Korban"
          description="Laporan ini dicatat tanpa korban manusia (misal kerugian aset, near-miss, atau bahaya lingkungan). Langkah data korban dinyatakan selesai."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ borderRadius: 8 }}
        />
      )}

      {/* Jika Ada Korban */}
      {adaKorban !== false && (
        <Form.List
          name="korban"
          rules={[
            {
              validator: async (_, korbanList) => {
                if (adaKorban && (!korbanList || korbanList.length < 1)) {
                  return Promise.reject(new Error("Minimal harus ada 1 data korban jika opsi 'Ada Korban' diaktifkan!"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map(({ key, name, ...restField }, index) => {
                const currentVictim = form.getFieldValue(["korban", name]) || {};
                const victimName = currentVictim.nama || `Korban #${index + 1}`;
                const victimStatus = currentVictim.status_kondisi || "Belum dipilih";

                return (
                  <Card
                    key={key}
                    size="small"
                    style={{
                      borderRadius: 10,
                      border: "1px solid #cbd5e1",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                    title={
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <UserOutlined style={{ color: "#4f46e5" }} />
                        <span style={{ fontWeight: 700, color: "#0f172a" }}>
                          Korban #{index + 1}: {victimName}
                        </span>
                        {currentVictim.status_kondisi && (
                          <Tag color={victimStatus === "Sembuh" ? "green" : victimStatus === "Rawat" ? "blue" : "volcano"}>
                            {victimStatus}
                          </Tag>
                        )}
                      </div>
                    }
                    extra={
                      <Space>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => handleDuplicate(add, currentVictim)}
                          title="Duplikasi Data Korban"
                        >
                          Duplikasi
                        </Button>
                        {fields.length > 1 && (
                          <Popconfirm
                            title="Hapus data korban ini?"
                            onConfirm={() => remove(name)}
                            okText="Hapus"
                            cancelText="Batal"
                          >
                            <Button size="small" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        )}
                      </Space>
                    }
                  >
                    <Row gutter={[16, 8]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Pilih Pegawai (Opsional Auto-fill)"
                          extra="Pilih pegawai yang terdaftar atau ketik manual pada field Nama Korban"
                        >
                          <Select
                            showSearch
                            placeholder="Cari nama pegawai terdaftar..."
                            allowClear
                            onChange={(val) => handleSelectEmployee(val, name)}
                            options={initialManagedUsers.map((u) => ({
                              value: u.name,
                              label: `${u.name} (${u.unit})`,
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Nama Lengkap Korban"
                          name={[name, "nama"]}
                          rules={[{ required: true, message: "Nama korban wajib diisi!" }]}
                        >
                          <Input placeholder="Contoh: Rina Kusuma Dewi, S.Sos." />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="NIP / Nomor Identitas Pegawai"
                          name={[name, "nip_id"]}
                        >
                          <Input placeholder="Contoh: 199208142018012003" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Unit Kerja Korban"
                          name={[name, "unit"]}
                          rules={[{ required: true, message: "Unit kerja korban wajib diisi!" }]}
                        >
                          <Input placeholder="Contoh: Direktorat Pelayanan dan Informasi" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Jabatan Korban"
                          name={[name, "jabatan"]}
                          rules={[{ required: true, message: "Jabatan korban wajib diisi!" }]}
                        >
                          <Input placeholder="Contoh: Arsiparis Pertama" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Jenis Cedera"
                          name={[name, "jenis_cedera"]}
                          rules={[{ required: true, message: "Jenis cedera wajib dipilih!" }]}
                        >
                          <Select
                            placeholder="Pilih jenis cedera"
                            options={[
                              { value: "Memar / Kontusio", label: "Memar / Kontusio" },
                              { value: "Sprain / Terkilir", label: "Sprain / Terkilir" },
                              { value: "Laserasi / Luka Robek", label: "Laserasi / Luka Robek" },
                              { value: "Fraktur / Patah Tulang", label: "Fraktur / Patah Tulang" },
                              { value: "Luka Bakar", label: "Luka Bakar" },
                              { value: "Iritasi Kimia / Racun", label: "Iritasi Kimia / Racun" },
                              { value: "Cedera Kepala / Gegar Otak", label: "Cedera Kepala / Gegar Otak" },
                              { value: "Luka Sayat / Luka Terpotong", label: "Luka Sayat / Luka Terpotong" },
                              { value: "Lainnya", label: "Lainnya" },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Bagian Tubuh yang Cedera"
                          name={[name, "bagian_tubuh"]}
                          rules={[{ required: true, message: "Minimal pilih 1 bagian tubuh!" }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Pilih bagian tubuh yang terkena"
                            options={[
                              { value: "Kepala", label: "Kepala" },
                              { value: "Mata", label: "Mata" },
                              { value: "Wajah", label: "Wajah" },
                              { value: "Leher", label: "Leher" },
                              { value: "Bahu", label: "Bahu" },
                              { value: "Tangan", label: "Tangan" },
                              { value: "Jari Tangan", label: "Jari Tangan" },
                              { value: "Dada", label: "Dada" },
                              { value: "Punggung", label: "Punggung" },
                              { value: "Perut", label: "Perut" },
                              { value: "Pinggang / Panggul", label: "Pinggang / Panggul" },
                              { value: "Kaki", label: "Kaki" },
                              { value: "Lutut", label: "Lutut" },
                              { value: "Pergelangan Kaki", label: "Pergelangan Kaki" },
                              { value: "Jari Kaki", label: "Jari Kaki" },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={8}>
                        <Form.Item
                          {...restField}
                          label="Tingkat Keparahan Cedera"
                          name={[name, "tingkat_keparahan_cedera"]}
                          rules={[{ required: true, message: "Tingkat keparahan cedera wajib dipilih!" }]}
                        >
                          <Select
                            placeholder="Pilih tingkat cedera"
                            options={[
                              { value: "Ringan", label: "Ringan (Lecet / Memar ringan)" },
                              { value: "Sedang", label: "Sedang (Perlu istirahat medis / jahitan)" },
                              { value: "Berat", label: "Berat (Fraktur / rawat inap intensif)" },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Tindakan Medis / Pertolongan Pertama (P3K)"
                          name={[name, "tindakan_medis"]}
                          rules={[{ required: true, message: "Tindakan medis wajib diisi!" }]}
                        >
                          <Input.TextArea
                            rows={2}
                            placeholder="Uraikan tindakan pertolongan pertama (misal: RICE, balut tekan, pemberian oksigen)..."
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Fasilitas Rujukan Medis (RS / Klinik)"
                          name={[name, "dirujuk_ke"]}
                        >
                          <Input placeholder="Contoh: RSUD Pasar Minggu / Klinik Pratama ANRI" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Jumlah Hari Kerja Hilang (LTI)"
                          name={[name, "hari_kerja_hilang"]}
                          rules={[{ required: true, message: "Jumlah hari kerja hilang wajib diisi (0 bila tidak ada)!" }]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="0"
                            addonAfter="Hari"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} md={12}>
                        <Form.Item
                          {...restField}
                          label="Status Kondisi Terakhir Korban"
                          name={[name, "status_kondisi"]}
                          rules={[{ required: true, message: "Status kondisi korban wajib dipilih!" }]}
                        >
                          <Select
                            placeholder="Pilih status kondisi korban"
                            options={[
                              { value: "Sembuh", label: "Sembuh (Kembali bekerja normal)" },
                              { value: "Rawat", label: "Rawat (Istirahat medis / rawat jalan / RS)" },
                              { value: "Cacat", label: "Cacat (Cacat fungsi sementara / tetap)" },
                              { value: "Meninggal", label: "Meninggal Dunia (Fatal)" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}

              <Button
                type="dashed"
                onClick={() =>
                  add({
                    id: Date.now(),
                    nama: "",
                    nip_id: "",
                    unit: "",
                    jabatan: "",
                    jenis_cedera: "Memar / Kontusio",
                    bagian_tubuh: [],
                    tingkat_keparahan_cedera: "Sedang",
                    tindakan_medis: "",
                    dirujuk_ke: "",
                    hari_kerja_hilang: 0,
                    status_kondisi: "Rawat",
                  })
                }
                block
                icon={<PlusOutlined />}
                style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
              >
                + Tambah Data Korban Lainnya
              </Button>

              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      )}
    </div>
  );
};
