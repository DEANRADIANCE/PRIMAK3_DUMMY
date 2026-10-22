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
  Checkbox,
  Alert,
  Divider,
  Tag,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { mockSlots } from "../../../mocks/psychologist";
import { IUser } from "../../../types/user";
import "../kesehatan.css";

const { Title, Text, Paragraph } = Typography;

export const PsychologistCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IUser>();
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
      notes: "Sesi konseling tatap muka di Ruang Konseling Klinik Pratama ANRI",
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
    { title: "Panduan & Etik Layanan", icon: <HeartOutlined /> },
    { title: "Data Pasien & Keluhan", icon: <UserOutlined /> },
    { title: "Pilih Jadwal & Finalisasi", icon: <CalendarOutlined /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/kesehatan/konsultasi")}
          style={{ borderRadius: 8, height: 38, width: 38 }}
        />
        <div>
          <Title level={4} style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>
            Pendaftaran Konsultasi Psikolog Klinis ANRI
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Layanan pendampingan psikologis dan manajemen kesehatan mental pegawai ANRI
          </Text>
        </div>
      </div>

      {/* 2. Main Card Container */}
      <Card
        className="health-content-card health-card-animate health-delay-1"
        bordered={false}
        style={{ borderRadius: 14, padding: "10px 10px" }}
      >
        <div style={{ maxWidth: 840, margin: "10px auto 36px" }}>
          <Steps current={currentStep} items={stepItems} />
        </div>

        {/* LANGKAH 1: PANDUAN LAYANAN */}
        {currentStep === 0 && (
          <div style={{ maxWidth: 750, margin: "0 auto" }}>
            <Alert
              type="info"
              showIcon
              icon={<LockOutlined style={{ fontSize: 20, color: "#0d9488" }} />}
              message="Jaminan Kerahasiaan Medis (Kode Etik Psikologi)"
              description="Seluruh isi sesi konsultasi dan catatan keluhan psikologis bersifat strictly confidential (sangat rahasia) hanya antara Anda dan Psikolog Klinis. Pihak manapun tidak dapat melihat riwayat keluhan Anda."
              style={{
                marginBottom: 24,
                borderRadius: 12,
                background: "#f0fdfa",
                border: "1px solid #99f6e4",
              }}
            />

            <Title level={5} style={{ color: "#0f172a", fontWeight: 700 }}>
              A. Cakupan Layanan Psikologi Klinik Pratama ANRI
            </Title>
            <Paragraph style={{ lineHeight: 1.8, color: "#475569" }}>
              Layanan Konsultasi Psikolog ANRI disediakan gratis bagi seluruh pegawai (ASN dan PPPK) untuk membantu mengatasi:
            </Paragraph>
            <ul style={{ paddingLeft: 20, lineHeight: 1.9, marginBottom: 24, color: "#334155" }}>
              <li>Beban kerja tinggi, kejenuhan (burnout), dan stres kerja harian.</li>
              <li>Kecemasan, gangguan tidur (insomnia), dan penurunan konsentrasi kerja.</li>
              <li>Dinamika hubungan interpersonal rekan kerja atau konflik peran kerja.</li>
              <li>Manajemen emosi dan keseimbangan kehidupan kerja (work-life balance).</li>
            </ul>

            <Title level={5} style={{ color: "#0f172a", fontWeight: 700 }}>
              B. Ketentuan Sesi Konseling
            </Title>
            <ul style={{ paddingLeft: 20, lineHeight: 1.9, marginBottom: 28, color: "#334155" }}>
              <li>Setiap sesi berlangsung selama <strong>50 - 60 menit</strong> secara tatap muka (private).</li>
              <li>Tersedia 2 jadwal sesi per hari kerja: <strong>Sesi Pagi (08:00 WIB)</strong> dan <strong>Sesi Siang (13:00 WIB)</strong>.</li>
              <li>Lokasi: Ruang Konseling Klinik Pratama ANRI (Gedung A Lantai 1).</li>
              <li>Harap hadir 10 menit sebelum waktu sesi dimulai.</li>
            </ul>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                className="btn-health-primary"
                style={{ minWidth: 180, height: 42 }}
                onClick={handleNextFromStep1}
              >
                Lanjut ke Data Diri &rarr;
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
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nama Lengkap Pasien / Pegawai</span>}
                name="patientName"
                rules={[{ required: true, message: "Nama wajib diisi!" }]}
              >
                <Input size="large" style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Nomor Telepon / WhatsApp Aktif</span>}
                name="contactNumber"
                rules={[{ required: true, message: "Nomor kontak wajib diisi untuk konfirmasi jadwal!" }]}
              >
                <Input placeholder="08xxxxxxxxxx" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                label={
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    Alasan Konsultasi / Keluhan yang Dirasakan (Hanya Dibaca oleh Psikolog)
                  </span>
                }
                name="reason"
                rules={[{ required: true, message: "Silakan tuliskan gambaran singkat keluhan Anda!" }]}
              >
                <Input.TextArea
                  rows={4}
                  style={{ borderRadius: 8 }}
                  placeholder="Contoh: Sering merasa lelah emosional, sulit berkonsentrasi menghadapi target pekerjaan, atau stres kerja..."
                />
              </Form.Item>
            </Form>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
              <Button size="large" className="btn-health-secondary" style={{ borderRadius: 8 }} onClick={() => setCurrentStep(0)}>
                Kembali
              </Button>
              <Button
                type="primary"
                size="large"
                className="btn-health-primary"
                style={{ minWidth: 180, height: 42 }}
                onClick={handleNextFromStep2}
              >
                Lanjut Pilih Jadwal &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* LANGKAH 3: PILIH JADWAL & KONFIRMASI */}
        {currentStep === 2 && (
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <Row gutter={[24, 24]}>
              {/* Pemilihan Tanggal Kalender */}
              <Col xs={24} md={14}>
                <Card
                  size="small"
                  title={<span style={{ fontWeight: 700, color: "#0f172a" }}>Pilih Tanggal Konsultasi</span>}
                  style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}
                >
                  <Calendar
                    fullscreen={false}
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                    onSelect={(d) => setSelectedDate(d.format("YYYY-MM-DD"))}
                  />
                </Card>
              </Col>

              {/* Pemilihan Slot Jam & Konfirmasi */}
              <Col xs={24} md={10}>
                <Card
                  size="small"
                  title={<span style={{ fontWeight: 700, color: "#0f172a" }}>Pilih Sesi Waktu</span>}
                  style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Tanggal terpilih:</Text>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0d9488" }}>
                      {dayjs(selectedDate).format("dddd, DD MMMM YYYY")}
                    </div>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  <Text strong style={{ fontSize: 13, display: "block", marginBottom: 10, color: "#1e293b" }}>
                    Sesi Tersedia:
                  </Text>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Sesi 08:00 */}
                    <div
                      onClick={() => slot08Available && setSelectedTime("08:00")}
                      style={{
                        padding: "14px",
                        borderRadius: 10,
                        border: selectedTime === "08:00" ? "2px solid #0d9488" : "1px solid #e2e8f0",
                        backgroundColor: !slot08Available ? "#f1f5f9" : selectedTime === "08:00" ? "#f0fdfa" : "#fff",
                        cursor: slot08Available ? "pointer" : "not-allowed",
                        opacity: slot08Available ? 1 : 0.6,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <ClockCircleOutlined style={{ color: selectedTime === "08:00" ? "#0d9488" : "#64748b" }} />
                          <span style={{ fontWeight: 700, color: selectedTime === "08:00" ? "#0f766e" : "#1e293b" }}>
                            08:00 - 09:00 WIB
                          </span>
                        </Space>
                        {slot08Available ? (
                          <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>Tersedia</Tag>
                        ) : (
                          <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>Penuh (Terisi)</Tag>
                        )}
                      </div>
                    </div>

                    {/* Sesi 13:00 */}
                    <div
                      onClick={() => slot13Available && setSelectedTime("13:00")}
                      style={{
                        padding: "14px",
                        borderRadius: 10,
                        border: selectedTime === "13:00" ? "2px solid #0d9488" : "1px solid #e2e8f0",
                        backgroundColor: !slot13Available ? "#f1f5f9" : selectedTime === "13:00" ? "#f0fdfa" : "#fff",
                        cursor: slot13Available ? "pointer" : "not-allowed",
                        opacity: slot13Available ? 1 : 0.6,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Space>
                          <ClockCircleOutlined style={{ color: selectedTime === "13:00" ? "#0d9488" : "#64748b" }} />
                          <span style={{ fontWeight: 700, color: selectedTime === "13:00" ? "#0f766e" : "#1e293b" }}>
                            13:00 - 14:00 WIB
                          </span>
                        </Space>
                        {slot13Available ? (
                          <Tag color="cyan" style={{ borderRadius: 6, fontWeight: 600 }}>Tersedia</Tag>
                        ) : (
                          <Tag color="red" style={{ borderRadius: 6, fontWeight: 600 }}>Penuh (Terisi)</Tag>
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
                    <span style={{ fontSize: 13, color: "#334155" }}>
                      <strong>Centang jika sudah yakin</strong> dengan data dan jadwal yang dipilih
                    </span>
                  </Checkbox>

                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckCircleOutlined />}
                    disabled={!isConfirmed}
                    loading={isLoading}
                    onClick={handleFinalSubmit}
                    className="btn-health-primary"
                    style={{ height: 42 }}
                  >
                    Konfirmasi Booking Konsultasi
                  </Button>
                </Card>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 24 }}>
              <Button size="large" className="btn-health-secondary" style={{ borderRadius: 8 }} onClick={() => setCurrentStep(1)}>
                Kembali
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
