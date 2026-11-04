import React, { useState, useEffect } from "react";
import {
  Form,
  Steps,
  Button,
  Card,
  Popconfirm,
  Space,
  Typography,
  message,
  Grid,
  Row,
  Col,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  RightOutlined,
  LeftOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  AuditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { Investigation } from "../../../../types/investigation";
import { StepInsiden } from "./StepInsiden";
import { StepKorban } from "./StepKorban";
import { StepInvestigasi } from "./StepInvestigasi";
import { StepPerbaikan } from "./StepPerbaikan";
import { StepPengesahan } from "./StepPengesahan";
import "../../keselamatan.css";
import "../../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

type StepSubStatus = "Belum diisi" | "Sedang diisi" | "Selesai" | "Perlu dilengkapi";

interface InvestigationWizardProps {
  mode: "create" | "edit";
  initialData?: Investigation;
  onSave: (values: any, isSubmit: boolean) => Promise<void> | void;
  isLoading?: boolean;
}

export const InvestigationWizard: React.FC<InvestigationWizardProps> = ({
  mode,
  initialData,
  onSave,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [form] = Form.useForm();

  // Active step (0-indexed: 0=Insiden, 1=Korban, 2=Investigasi, 3=Perbaikan, 4=Pengesahan)
  const [currentStep, setCurrentStep] = useState<number>(
    initialData?.lastStep !== undefined ? Math.min(Math.max(initialData.lastStep - 1, 0), 4) : 0
  );

  // Highest unlocked step
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<number>(
    initialData ? 4 : 0
  );

  // Step sub-status states
  const [stepStatuses, setStepStatuses] = useState<StepSubStatus[]>([
    "Sedang diisi",
    "Belum diisi",
    "Belum diisi",
    "Belum diisi",
    "Belum diisi",
  ]);

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [lastAutoSave, setLastAutoSave] = useState<string | null>(null);
  const [autoFilledReport, setAutoFilledReport] = useState<string | null>(
    initialData?.laporan_nomor || null
  );

  const stepTitles = [
    "Insiden",
    "Korban",
    "Investigasi",
    "Perbaikan",
    "Pengesahan",
  ];

  // Initialize form with initialData or defaults
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        insiden: {
          ...initialData.insiden,
          tanggal_jam: initialData.insiden?.tanggal_jam
            ? dayjs(initialData.insiden.tanggal_jam)
            : dayjs(),
        },
        investigasi: {
          ...initialData.investigasi,
          tanggal_mulai: initialData.investigasi?.tanggal_mulai
            ? dayjs(initialData.investigasi.tanggal_mulai)
            : dayjs(),
          tanggal_selesai: initialData.investigasi?.tanggal_selesai
            ? dayjs(initialData.investigasi.tanggal_selesai)
            : dayjs(),
        },
        perbaikan: (initialData.perbaikan || []).map((p) => ({
          ...p,
          target_selesai: p.target_selesai ? dayjs(p.target_selesai) : dayjs().add(2, "week"),
        })),
        ada_korban: initialData.ada_korban !== false,
      });

      // Mark all as completed if editing existing completed record
      setStepStatuses(["Selesai", "Selesai", "Selesai", "Selesai", "Sedang diisi"]);
    } else {
      // Default initial create values
      const newReportNum = `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
      form.setFieldsValue({
        nomor: newReportNum,
        ada_korban: true,
        insiden: {
          tanggal_jam: dayjs(),
          jenis: "Kecelakaan Kerja",
          tingkat_keparahan: "Sedang",
        },
        korban: [
          {
            id: Date.now(),
            nama: "",
            nip_id: "",
            unit: "",
            jabatan: "",
            jenis_cedera: "Memar / Kontusio",
            bagian_tubuh: ["Tangan"],
            tingkat_keparahan_cedera: "Sedang",
            tindakan_medis: "",
            dirujuk_ke: "Klinik Pratama ANRI",
            hari_kerja_hilang: 0,
            status_kondisi: "Rawat",
          },
        ],
        investigasi: {
          tim_investigator: ["Siti Rahmawati, S.Tr.Kes"],
          ketua_tim: "Siti Rahmawati, S.Tr.Kes",
          tanggal_mulai: dayjs(),
          tanggal_selesai: dayjs(),
          kronologi: [
            { id: 1, waktu: dayjs().format("HH:mm"), uraian: "" },
          ],
          saksi: [],
          faktor_kontribusi: ["Metode", "Lingkungan"],
          penyebab_langsung: {
            kategori: ["Kondisi tidak aman"],
            uraian: "",
          },
          analisis_akar_masalah: {
            five_whys: { why1: "" },
            akar_penyebab: "",
          },
        },
        perbaikan: [
          {
            id: Date.now(),
            uraian: "",
            jenis: "Korektif",
            hirarki: "Rekayasa teknik",
            penanggung_jawab: "Ahmad Fauzi, A.Md.",
            target_selesai: dayjs().add(2, "week"),
            status: "Belum",
          },
        ],
        pengesahan: {
          pemeriksa: "Kepala Biro KU",
          pernyataan_benar: false,
        },
      });
    }
  }, [initialData, form]);

  // Autosave interval every 30 seconds if dirty
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        const rawValues = form.getFieldsValue(true);
        onSave(rawValues, false);
        setLastAutoSave(dayjs().format("HH:mm"));
        setIsDirty(false);
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [isDirty, form, onSave]);

  // Form field names per step to validate
  const getStepFieldNames = (stepIdx: number): (string | (string | number)[])[] => {
    switch (stepIdx) {
      case 0:
        return [
          ["insiden", "judul"],
          ["insiden", "tanggal_jam"],
          ["insiden", "lokasi"],
          ["insiden", "unit"],
          ["insiden", "jenis"],
          ["insiden", "tingkat_keparahan"],
          ["insiden", "deskripsi"],
        ];
      case 1: {
        const adaKorban = form.getFieldValue("ada_korban");
        if (adaKorban === false) return [];
        return ["korban"];
      }
      case 2:
        return [
          ["investigasi", "tim_investigator"],
          ["investigasi", "ketua_tim"],
          ["investigasi", "tanggal_mulai"],
          ["investigasi", "tanggal_selesai"],
          ["investigasi", "kronologi"],
          ["investigasi", "penyebab_langsung", "kategori"],
          ["investigasi", "penyebab_langsung", "uraian"],
          ["investigasi", "faktor_kontribusi"],
          ["investigasi", "analisis_akar_masalah", "five_whys", "why1"],
          ["investigasi", "analisis_akar_masalah", "akar_penyebab"],
        ];
      case 3:
        return ["perbaikan"];
      case 4:
        return [
          ["pengesahan", "pemeriksa"],
          ["pengesahan", "pernyataan_benar"],
        ];
      default:
        return [];
    }
  };

  // Validate only the active step
  const validateCurrentStep = async (stepIdx: number): Promise<boolean> => {
    try {
      const fieldNames = getStepFieldNames(stepIdx);
      if (fieldNames.length > 0) {
        await form.validateFields(fieldNames);
      }

      // Extra manual check for Step 1 (Korban)
      if (stepIdx === 1) {
        const adaKorban = form.getFieldValue("ada_korban");
        const korbanList = form.getFieldValue("korban") || [];
        if (adaKorban !== false && korbanList.length === 0) {
          message.error("Minimal harus ada 1 data korban jika opsi 'Ada Korban' diaktifkan!");
          return false;
        }
      }

      // Extra manual check for Step 3 (Perbaikan)
      if (stepIdx === 3) {
        const perbaikanList = form.getFieldValue("perbaikan") || [];
        if (perbaikanList.length === 0) {
          message.error("Minimal harus ada 1 rencana tindakan perbaikan!");
          return false;
        }
      }

      // Mark step as Selesai
      const updatedStatuses = [...stepStatuses];
      updatedStatuses[stepIdx] = "Selesai";
      setStepStatuses(updatedStatuses);
      return true;
    } catch (err: any) {
      const updatedStatuses = [...stepStatuses];
      updatedStatuses[stepIdx] = "Perlu dilengkapi";
      setStepStatuses(updatedStatuses);
      message.error("Mohon lengkapi seluruh field wajib pada langkah ini sebelum melanjutkan.");
      return false;
    }
  };

  // Navigate next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep(currentStep);
    if (!isValid) return;

    const nextStep = currentStep + 1;
    if (nextStep < 5) {
      setCurrentStep(nextStep);
      setMaxUnlockedStep((prev) => Math.max(prev, nextStep));

      const updated = [...stepStatuses];
      if (updated[nextStep] !== "Selesai") {
        updated[nextStep] = "Sedang diisi";
      }
      setStepStatuses(updated);
    }
  };

  // Navigate previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step click handler
  const handleStepClick = (targetIndex: number) => {
    if (targetIndex <= maxUnlockedStep) {
      setCurrentStep(targetIndex);
    } else {
      message.warning("Selesaikan langkah saat ini terlebih dahulu sebelum melompat ke langkah berikutnya.");
    }
  };

  // Save as Draft
  const handleSaveDraft = async () => {
    try {
      const rawValues = form.getFieldsValue(true);
      rawValues.lastStep = currentStep + 1;
      await onSave(rawValues, false);
      setLastAutoSave(dayjs().format("HH:mm"));
      setIsDirty(false);
      message.success("Draf investigasi berhasil disimpan!");
    } catch (err) {
      message.error("Gagal menyimpan draf.");
    }
  };

  // Submit for approval (Step 5)
  const handleSubmitForApproval = async () => {
    for (let step = 0; step < 5; step++) {
      const isStepValid = await validateCurrentStep(step);
      if (!isStepValid) {
        setCurrentStep(step);
        message.error(`Langkah ${step + 1} (${stepTitles[step]}) belum lengkap. Silakan lengkapi terlebih dahulu.`);
        return;
      }
    }

    try {
      const rawValues = form.getFieldsValue(true);
      await onSave(rawValues, true);
      message.success("Berkas investigasi berhasil diajukan untuk pengesahan!");
      navigate("/keselamatan/investigasi");
    } catch (err) {
      message.error("Gagal mengajukan berkas investigasi.");
    }
  };

  // Render Sub-status indicator
  const renderStepItem = (title: string, index: number) => {
    const status = stepStatuses[index];
    let icon = null;
    let color = "#64748b";

    if (status === "Selesai") {
      icon = <CheckCircleOutlined style={{ color: "#0d9488" }} />;
      color = "#0d9488";
    } else if (status === "Perlu dilengkapi") {
      icon = <CloseCircleOutlined style={{ color: "#dc2626" }} />;
      color = "#dc2626";
    } else if (status === "Sedang diisi") {
      icon = <ClockCircleOutlined style={{ color: "#0f172a" }} />;
      color = "#0f172a";
    }

    return {
      title: (
        <span style={{ fontWeight: currentStep === index ? 700 : 600 }}>
          {title}
        </span>
      ),
      description: (
        <span style={{ fontSize: 11.5, color, display: "flex", alignItems: "center", gap: 4 }}>
          {icon}
          {status}
        </span>
      ),
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient (Theme Modul Keselamatan) */}
      <div
        className={`form-hero-banner ${
          mode === "edit" ? "form-banner-edit" : "form-banner-create"
        } form-card-animate form-delay-1`}
      >
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tag
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 10px",
                }}
              >
                <AuditOutlined /> ROOT CAUSE ANALYSIS (RCA)
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>
                {mode === "edit" ? "Perbarui Berkas Investigasi" : "Penyusunan Berkas Baru"}
              </span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              {mode === "edit" ? "Ubah Investigasi Insiden" : "Buat Investigasi Baru"}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Formulir terpadu 5 langkah berurutan untuk analisis penyebab langsung, kontribusi personal/lingkungan, rekonstruksi 5-Mengapa, serta penetapan tindakan perbaikan (CAPA).
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              {isDirty ? (
                <Popconfirm
                  title="Perubahan belum disimpan!"
                  description="Yakin ingin meninggalkan halaman ini? Perubahan yang belum disimpan akan hilang."
                  onConfirm={() => navigate("/keselamatan/investigasi")}
                  okText="Tinggalkan"
                  cancelText="Tetap di sini"
                >
                  <Button
                    icon={<ArrowLeftOutlined />}
                    className="btn-form-cancel"
                    style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
                  >
                    Kembali ke Daftar
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/keselamatan/investigasi")}
                  className="btn-form-cancel"
                  style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
                >
                  Kembali ke Daftar
                </Button>
              )}

              {lastAutoSave && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    padding: "3px 12px",
                    borderRadius: 20,
                    fontSize: 11.5,
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  ✔ Tersimpan otomatis {lastAutoSave} WIB
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Steps Navigation Bar Modern */}
      <div className="form-content-card form-card-animate form-delay-2" style={{ padding: "14px 20px" }}>
        {screens.xs ? (
          // Mobile display: Compact step indicator
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <div>
              <Text strong style={{ fontSize: 14, color: "#0f172a" }}>
                Langkah {currentStep + 1} dari 5: {stepTitles[currentStep]}
              </Text>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Status: {stepStatuses[currentStep]}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {stepTitles.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => handleStepClick(idx)}
                  style={{
                    width: 24,
                    height: 8,
                    borderRadius: 4,
                    background:
                      currentStep === idx
                        ? "#0d9488"
                        : idx <= maxUnlockedStep
                        ? "#10b981"
                        : "#e2e8f0",
                    cursor: idx <= maxUnlockedStep ? "pointer" : "not-allowed",
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          // Desktop display: Full Ant Design Steps
          <Steps
            current={currentStep}
            onChange={handleStepClick}
            type="navigation"
            items={stepTitles.map((title, idx) => renderStepItem(title, idx))}
            style={{ padding: "2px 0" }}
          />
        )}
      </div>

      {/* 3. Satu Instance Form untuk Semua Langkah (Preserve State) */}
      <Form
        form={form}
        layout="vertical"
        preserve={true}
        onValuesChange={() => setIsDirty(true)}
      >
        <div
          className="form-content-card form-card-animate form-delay-3"
          style={{ padding: "24px 28px", minHeight: 480 }}
        >
          {/* Step 1: Insiden */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <div className="form-section-title">
              <span className="badge-num">1</span>
              <span>Data Insiden & Tautan Laporan Kecelakaan</span>
            </div>
            <StepInsiden
              form={form}
              autoFilledReport={autoFilledReport}
              setAutoFilledReport={setAutoFilledReport}
            />
          </div>

          {/* Step 2: Korban */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <div className="form-section-title">
              <span className="badge-num">2</span>
              <span>Data Korban & Dampak Fisik</span>
            </div>
            <StepKorban form={form} />
          </div>

          {/* Step 3: Investigasi */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <div className="form-section-title">
              <span className="badge-num">3</span>
              <span>Pemeriksaan Lapangan, Kronologi & Analisis 5-Mengapa (RCA)</span>
            </div>
            <StepInvestigasi form={form} />
          </div>

          {/* Step 4: Perbaikan */}
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <div className="form-section-title">
              <span className="badge-num">4</span>
              <span>Rencana Tindakan Perbaikan & Pencegahan (CAPA)</span>
            </div>
            <StepPerbaikan form={form} />
          </div>

          {/* Step 5: Pengesahan */}
          <div style={{ display: currentStep === 4 ? "block" : "none" }}>
            <div className="form-section-title">
              <span className="badge-num">5</span>
              <span>Pratinjau Ringkasan & Lembar Pengesahan</span>
            </div>
            <StepPengesahan form={form} goToStep={(s) => setCurrentStep(s)} />
          </div>

          {/* 4. Action Buttons Bar Bawah */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1.5px solid #f1f5f9",
            }}
          >
            <div>
              {currentStep > 0 && (
                <Button
                  icon={<LeftOutlined />}
                  onClick={handlePrev}
                  className="btn-form-cancel"
                >
                  Kembali
                </Button>
              )}
            </div>

            <Space size="middle">
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={isLoading}
                className="btn-form-cancel"
              >
                Simpan Draf
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  className="btn-form-submit"
                >
                  Lanjut <RightOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmitForApproval}
                  loading={isLoading}
                  className="btn-form-submit"
                  style={{
                    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                    borderColor: "#059669",
                  }}
                >
                  Ajukan untuk Pengesahan
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Form>
    </div>
  );
};
