import React from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Progress,
  Space,
  Popconfirm,
  Tag,
  FormInstance,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { initialUsers } from "../../../../mocks/users";

interface StepPerbaikanProps {
  form: FormInstance;
}

export const StepPerbaikan: React.FC<StepPerbaikanProps> = ({ form }) => {
  const perbaikanList = Form.useWatch("perbaikan", form) || [];
  const incidentSeverity = Form.useWatch(["insiden", "tingkat_keparahan"], form) || "Sedang";
  const incidentDateVal = Form.useWatch(["insiden", "tanggal_jam"], form);

  const totalActions = perbaikanList.length;
  const completedActions = perbaikanList.filter(
    (item: any) => item?.status === "Selesai"
  ).length;
  const progressPercent =
    totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  // Guidance alert according to HIRADC risk policy
  const renderRiskPolicyAlert = () => {
    switch (incidentSeverity) {
      case "Fatal":
      case "Berat":
        return (
          <Alert
            message={
              <span style={{ fontWeight: 700 }}>
                Panduan Kebijakan Risiko Tinggi / Fatal (Skor HIRADC 16 - 25)
              </span>
            }
            description="Pekerjaan tidak boleh dilanjutkan sebelum risiko diturunkan! Minimal kontrol administratif wajib diterapkan dalam 7 hari kerja. Hentikan seluruh pekerjaan berbahaya jika risiko tidak dapat diturunkan ke batas yang dapat diterima."
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{ borderRadius: 8 }}
          />
        );
      case "Sedang":
        return (
          <Alert
            message={
              <span style={{ fontWeight: 700 }}>
                Panduan Kebijakan Risiko Sedang (Skor HIRADC 3 - 12)
              </span>
            }
            description="Lakukan monitoring patroli K3 berkala. Tindakan perbaikan wajib menurunkan tingkat risiko sesegera mungkin (maksimal 12 bulan untuk tindakan struktural rekayasa teknik)."
            type="warning"
            showIcon
            icon={<SafetyCertificateOutlined />}
            style={{ borderRadius: 8 }}
          />
        );
      case "Ringan":
      default:
        return (
          <Alert
            message={
              <span style={{ fontWeight: 700 }}>
                Panduan Kebijakan Risiko Rendah (Skor HIRADC 1 - 2)
              </span>
            }
            description="Tingkat risiko dapat dikendalikan dengan instruksi kerja standar dan kesadaran APD. Tetap prioritaskan tindakan koreksi langsung agar tidak berkembang menjadi keparahan lebih tinggi."
            type="info"
            showIcon
            style={{ borderRadius: 8 }}
          />
        );
    }
  };

  const minTargetDate = incidentDateVal ? dayjs(incidentDateVal).startOf("day") : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 1. Panduan Kebijakan HIRADC */}
      {renderRiskPolicyAlert()}

      {/* 2. Ringkasan Otomatis Progres Tindakan */}
      <Card
        size="small"
        style={{
          background: "#f8fafc",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 12]}>
          <Col xs={24} sm={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                <CheckCircleOutlined />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                  Ringkasan Rencana Tindakan Perbaikan (CAPA)
                </div>
                <div style={{ fontSize: 12.5, color: "#64748b" }}>
                  {totalActions} Tindakan terdaftar • {completedActions} Selesai dilaksanakan ({progressPercent}%)
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={8}>
            <Progress
              percent={progressPercent}
              status={progressPercent === 100 ? "success" : "active"}
              strokeColor={{ "0%": "#0284c7", "100%": "#059669" }}
            />
          </Col>
        </Row>
      </Card>

      {/* 3. Form List Tindakan Perbaikan */}
      <Form.List
        name="perbaikan"
        rules={[
          {
            validator: async (_, list) => {
              if (!list || list.length < 1) {
                return Promise.reject(new Error("Minimal buat 1 rencana tindakan perbaikan!"));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fields.map(({ key, name, ...restField }, idx) => {
              const currentAction = form.getFieldValue(["perbaikan", name]) || {};
              const actionStatus = currentAction.status || "Belum";

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
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>
                        Tindakan #{idx + 1}
                      </span>
                      {currentAction.hirarki && (
                        <Tag color="purple">{currentAction.hirarki}</Tag>
                      )}
                      <Tag
                        color={
                          actionStatus === "Selesai"
                            ? "green"
                            : actionStatus === "Sedang"
                            ? "blue"
                            : "default"
                        }
                      >
                        Status: {actionStatus}
                      </Tag>
                    </div>
                  }
                  extra={
                    fields.length > 1 && (
                      <Popconfirm
                        title="Hapus tindakan ini?"
                        onConfirm={() => remove(name)}
                        okText="Hapus"
                        cancelText="Batal"
                      >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    )
                  }
                >
                  <Row gutter={[16, 8]}>
                    <Col xs={24}>
                      <Form.Item
                        {...restField}
                        label="Uraian Rencana Tindakan Perbaikan / Pencegahan"
                        name={[name, "uraian"]}
                        rules={[{ required: true, message: "Uraian tindakan wajib diisi!" }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Contoh: Pemasangan anti-slip strip pada seluruh anak tangga Gedung B..."
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        label="Jenis Tindakan"
                        name={[name, "jenis"]}
                        rules={[{ required: true, message: "Jenis tindakan wajib dipilih!" }]}
                      >
                        <Select
                          placeholder="Pilih jenis"
                          options={[
                            { value: "Koreksi", label: "Koreksi (Perbaikan Langsung di TKP)" },
                            { value: "Korektif", label: "Tindakan Korektif (Menghilangkan Penyebab)" },
                            { value: "Pencegahan", label: "Tindakan Pencegahan (Mencegah Kejadian Serupa)" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        label="Hirarki Pengendalian Risiko"
                        name={[name, "hirarki"]}
                        rules={[{ required: true, message: "Hirarki pengendalian wajib dipilih!" }]}
                      >
                        <Select
                          placeholder="Pilih hirarki"
                          options={[
                            { value: "Eliminasi", label: "1. Eliminasi (Hilangkan Sumber Bahaya)" },
                            { value: "Substitusi", label: "2. Substitusi (Ganti dengan yang Lebih Aman)" },
                            { value: "Rekayasa teknik", label: "3. Rekayasa Teknik (Isolasi / Modifikasi Alat)" },
                            { value: "Administratif", label: "4. Administratif (SOP, Rambu, Pelatihan)" },
                            { value: "APD", label: "5. APD (Alat Pelindung Diri)" },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        label="Penanggung Jawab (PIC)"
                        name={[name, "penanggung_jawab"]}
                        rules={[{ required: true, message: "Penanggung jawab wajib dipilih/diisi!" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Pilih PIC"
                          options={initialUsers.map((u) => ({
                            value: u.name,
                            label: `${u.name} (${u.unit})`,
                          }))}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Target Selesai Penyelesaian"
                        name={[name, "target_selesai"]}
                        rules={[{ required: true, message: "Target tanggal selesai wajib diisi!" }]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="YYYY-MM-DD"
                          placeholder="Pilih target batas waktu"
                          disabledDate={(current) =>
                            minTargetDate ? current && current < minTargetDate : false
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        label="Status Pelaksanaan Tindakan"
                        name={[name, "status"]}
                        rules={[{ required: true, message: "Status tindakan wajib dipilih!" }]}
                      >
                        <Select
                          placeholder="Pilih status pelaksanaan"
                          options={[
                            { value: "Belum", label: "Belum Dilaksanakan" },
                            { value: "Sedang", label: "Sedang Dikerjakan / Dalam Proses" },
                            { value: "Selesai", label: "Selesai Dilaksanakan" },
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
                  uraian: "",
                  jenis: "Korektif",
                  hirarki: "Rekayasa teknik",
                  penanggung_jawab: "Ahmad Fauzi, A.Md.",
                  target_selesai: dayjs().add(2, "week"),
                  status: "Belum",
                })
              }
              block
              icon={<PlusOutlined />}
              style={{ height: 42, borderRadius: 8, fontWeight: 600 }}
            >
              + Tambah Tindakan Perbaikan Lainnya
            </Button>

            <Form.ErrorList errors={errors} />
          </div>
        )}
      </Form.List>
    </div>
  );
};
