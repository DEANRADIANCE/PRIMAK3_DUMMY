import React, { useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  Calendar,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Radio,
  Checkbox,
  Alert,
  Divider,
  Tag,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  HeartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import { mockSlots } from "../../../mocks/psychologist";

const { Title, Text, Paragraph } = Typography;

export const PsychologistCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [currentStep, setCurrentStep] = useState(0);

  const [form] = Form.useForm();
  const { mutate: createBooking, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const [selectedDate, setSelectedDate] = useState<string>(dayjs().add(1, "day").format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState<string>("08:00");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Periksa slot terisi pada tanggal yang dipilih
  const getSlotAvailability = (time: string) => {
    const slot = mockSlots.find((s) => s.date === selectedDate && s.time === time);
    return slot ? slot.available : true;
  };

  const slot08Available = getSlotAvailability("08:00");
  const slot13Available = getSlotAvailability("13:00");

  const handleNextFromStep1 = () => {
    setCurrentStep(1);
  };

  const handleNextFromStep2 = () => {
    form.validateFields().then(() => {
      setCurrentStep(2);
    });
  };

  const handleFinalSubmit = () => {
    if (!isConfirmed) {
      message.error("Silakan centang persetujuan konfirmasi terlebih dahulu!");
      return;
    }

    const formValues = form.getFieldsValue();
    const payload = {
      patientName: formValues.patientName || user?.name || "Pegawai ANRI",
      patientId: user?.id || 4,
      contactNumber: formValues.contactNumber,
      reason: formValues.reason,
      sessionDate: selectedDate,
      sessionTime: selectedTime,
      status: "confirmed",
      notes: "Sesi konseling dijadwalkan tatap muka di Klinik Pratama ANRI",
    };

    createBooking(
      {
        resource: "psychologist-bookings",
        values: payload,
        successNotification: {
          message: "Jadwal Konsultasi Berhasil Dipesan",
          description: `Sesi Anda pada ${selectedDate} pukul ${selectedTime} WIB telah terdaftar. Data Anda dijaga kerahasiaannya.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/kesehatan/konsultasi");
        },
      }
    );
  };

  const stepItems = [
    { title: "Panduan Layanan", icon: <HeartOutlined /> },
    { title: "Detail Pesanan", icon: <UserOutlined /> },
    { title: "Pilih Jadwal & Konfirmasi", icon: <CalendarOutlined /> },
  ];

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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/kesehatan/konsultasi")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Pendaftaran Konsultasi Psikolog Klinis
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Layanan pendampingan psikologis dan manajemen kesehatan mental pegawai ANRI
          </Text>
        </div>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          marginBottom: 24,
        }}
      >
        <Steps current={currentStep} items={stepItems} style={{ maxWidth: 800, margin: "0 auto 32px" }} />

        {/* LANGKAH 1: PANDUAN LAYANAN */}
        {currentStep === 0 && (
          <div style={{ maxWidth: 750, margin: "0 auto" }}>
            <Alert
              type="info"
              showIcon
              icon={<LockOutlined style={{ fontSize: 20 }} />}
              message="Jaminan Kerahasiaan Medis (Kode Etik Psikologi)"
              description="Seluruh isi sesi konsultasi dan catatan keluhan psikologis bersifat strictly confidential (sangat rahasia) hanya antara Anda dan Psikolog Klinis. Atasan kerja dan pihak manapun tidak dapat melihat alasan konsultasi Anda."
              style={{ marginBottom: 24 }}
            />

            <Title level={5}>A. Informasi Layanan Psikologi Klinik Pratama ANRI</Title>
            <Paragraph style={{ lineHeight: 1.8 }}>
              Layanan Konsultasi Psikolog ANRI disediakan gratis bagi seluruh pegawai (ASN dan PPPK) untuk membantu mengatasi:
            </Paragraph>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, marginBottom: 20 }}>
              <li>Beban kerja tinggi, kejenuhan (burnout), dan stres kerja harian.</li>
              <li>Kecemasan, gangguan tidur (insomnia), dan penurunan konsentrasi kerja.</li>
              <li>Dinamika hubungan interpersonal rekan kerja atau konflik peran kerja.</li>
              <li>Manajemen emosi dan keseimbangan kehidupan kerja (work-life balance).</li>
            </ul>

            <Title level={5}>B. Ketentuan Sesi Konseling</Title>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, marginBottom: 24 }}>
              <li>Setiap sesi berlangsung selama <strong>50 - 60 menit</strong>.</li>
              <li>Tersedia 2 jadwal sesi per hari kerja: <strong>Sesi Pagi (08:00 WIB)</strong> dan <strong>Sesi Siang (13:00 WIB)</strong>.</li>
              <li>Lokasi: Ruang Konseling Klinik Pratama ANRI (Gedung A Lantai 1).</li>
              <li>Harap hadir 10 menit sebelum waktu sesi dimulai.</li>
            </ul>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                style={{ background: "#595959", borderColor: "#595959", minWidth: 160 }}
                onClick={handleNextFromStep1}
              >
                Lanjut ke Data Diri
              </Button>
            </div>
          </div>
        )}

        {/* LANGKAH 2: DETAIL PESANAN */}
        {currentStep === 1 && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                patientName: user?.name || "Ahmad Fauzi, A.Md.",
                contactNumber: "081298765432",
                reason: "",
              }}
            >
              <Form.Item
                label="Nama Lengkap Pasien / Pegawai"
                name="patientName"
                rules={[{ required: true, message: "Nama wajib diisi!" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Nomor Telepon / WhatsApp Aktif"
                name="contactNumber"
                rules={[{ required: true, message: "Nomor kontak wajib diisi untuk konfirmasi jadwal!" }]}
              >
                <Input placeholder="08xxxxxxxxxx" size="large" />
              </Form.Item>

              <Form.Item
                label="Alasan Konsultasi / Keluhan yang Dirasakan (Hanya Dibaca oleh Psikolog)"
                name="reason"
                rules={[{ required: true, message: "Silakan tuliskan gambaran singkat keluhan Anda!" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Contoh: Sering merasa lelah emosional, sulit berkonsentrasi menghadapi target pekerjaan, atau stres kerja..."
                />
              </Form.Item>
            </Form>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
              <Button size="large" onClick={() => setCurrentStep(0)}>
                Kembali
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ background: "#595959", borderColor: "#595959", minWidth: 160 }}
                onClick={handleNextFromStep2}
              >
                Lanjut Pilih Jadwal
              </Button>
            </div>
          </div>
        )}

        {/* LANGKAH 3: PILIH JADWAL & KONFIRMASI */}
        {currentStep === 2 && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Row gutter={[24, 24]}>
              {/* Pemilihan Tanggal Kalender */}
              <Col xs={24} md={14}>
                <Card size="small" title="Pilih Tanggal Konsultasi" style={{ background: "#fafafa" }}>
                  <Calendar
                    fullscreen={false}
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                    onSelect={(d) => setSelectedDate(d.format("YYYY-MM-DD"))}
                  />
                </Card>
              </Col>

              {/* Pemilihan Slot Jam & Konfirmasi */}
              <Col xs={24} md={10}>
                <Card size="small" title="Pilih Sesi Waktu">
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">Tanggal terpilih:</Text>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#262626" }}>
                      {dayjs(selectedDate).format("dddd, DD MMMM YYYY")}
                    </div>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                    Sesi Tersedia:
                  </Text>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Sesi 08:00 */}
                    <div
                      onClick={() => slot08Available && setSelectedTime("08:00")}
                      style={{
                        padding: "12px",
                        borderRadius: 8,
                        border: selectedTime === "08:00" ? "2px solid #595959" : "1px solid #d9d9d9",
                        backgroundColor: !slot08Available ? "#f5f5f5" : selectedTime === "08:00" ? "#fafafa" : "#fff",
                        cursor: slot08Available ? "pointer" : "not-allowed",
                        opacity: slot08Available ? 1 : 0.6,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <ClockCircleOutlined />
                          <span style={{ fontWeight: 600 }}>08:00 - 09:00 WIB</span>
                        </Space>
                        {slot08Available ? (
                          <Tag color="success">Tersedia</Tag>
                        ) : (
                          <Tag color="error">Penuh (Terisi)</Tag>
                        )}
                      </div>
                    </div>

                    {/* Sesi 13:00 */}
                    <div
                      onClick={() => slot13Available && setSelectedTime("13:00")}
                      style={{
                        padding: "12px",
                        borderRadius: 8,
                        border: selectedTime === "13:00" ? "2px solid #595959" : "1px solid #d9d9d9",
                        backgroundColor: !slot13Available ? "#f5f5f5" : selectedTime === "13:00" ? "#fafafa" : "#fff",
                        cursor: slot13Available ? "pointer" : "not-allowed",
                        opacity: slot13Available ? 1 : 0.6,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <ClockCircleOutlined />
                          <span style={{ fontWeight: 600 }}>13:00 - 14:00 WIB</span>
                        </Space>
                        {slot13Available ? (
                          <Tag color="success">Tersedia</Tag>
                        ) : (
                          <Tag color="error">Penuh (Terisi)</Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  <Divider style={{ margin: "20px 0 16px" }} />

                  {/* Checkbox Konfirmasi */}
                  <Checkbox
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    style={{ marginBottom: 16 }}
                  >
                    <strong>Centang jika sudah yakin</strong> dengan data dan jadwal yang dipilih
                  </Checkbox>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckCircleOutlined />}
                    disabled={!isConfirmed}
                    loading={isLoading}
                    onClick={handleFinalSubmit}
                    style={{ background: "#595959", borderColor: "#595959" }}
                  >
                    Konfirmasi Booking Konsultasi
                  </Button>
                </Card>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}>
              <Button size="large" onClick={() => setCurrentStep(1)}>
                Kembali
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
