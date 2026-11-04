import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Checkbox,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs, { Dayjs } from "dayjs";
import {
  IHiradc,
  calculateNfrRiskLevel,
  calculateRiskLevel,
  getNfrColor,
  ActivityType,
  HazardClassification,
  ControlStatus,
} from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import "../../../components/common/form-theme.css";

const { Title, Text, Paragraph } = Typography;

interface FormValues {
  // Metadata & Identifikasi
  activity: string;
  unit: string;
  location: string;
  assessmentDate: Dayjs;
  assessor: string;
  activityType: ActivityType;
  hazardClassification: HazardClassification[];

  // 5 Faktor Bahaya & Risiko
  hazardPhysics?: string;
  hazardChemical?: string;
  hazardBiology?: string;
  hazardErgonomics?: string;
  hazardPsychosocial?: string;
  riskImpact: string;

  // Pengendalian Saat Ini (Existing Control)
  currentElimination?: string;
  currentSubstitution?: string;
  currentEngineering?: string;
  currentAdministrative?: string;
  currentApd?: string;

  // Pengendalian Lanjutan (Determining / Residual Control)
  residualElimination?: string;
  residualSubstitution?: string;
  residualEngineering?: string;
  residualAdministrative?: string;
  residualApd?: string;

  // Durasi, Status, PIC & Target
  controlDuration?: string;
  controlStatus: ControlStatus;
  responsiblePerson: string;
  targetDate: Dayjs;
}

export const HiradcEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });

  const { mutate: updateHiradc, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  // Matriks Pengendalian Saat Ini (Existing)
  const [currentLikelihood, setCurrentLikelihood] = useState<number>(3);
  const [currentSeverity, setCurrentSeverity] = useState<number>(3);

  // Matriks Pengendalian Lanjutan (Residual)
  const [residualLikelihood, setResidualLikelihood] = useState<number>(2);
  const [residualSeverity, setResidualSeverity] = useState<number>(2);

  // Perhitungan Nilai Faktor Risiko (NFR = L x S)
  const currentNfr = currentLikelihood * currentSeverity;
  const currentRiskLevel = calculateNfrRiskLevel(currentNfr);

  const residualNfr = residualLikelihood * residualSeverity;
  const residualRiskLevel = calculateNfrRiskLevel(residualNfr);

  useEffect(() => {
    if (record) {
      const cL = record.currentLikelihood ?? record.likelihood ?? 3;
      const cS = record.currentSeverity ?? record.severity ?? 3;
      const rL = record.residualLikelihood ?? Math.max(1, cL - 1);
      const rS = record.residualSeverity ?? Math.max(1, cS - 1);

      setCurrentLikelihood(cL);
      setCurrentSeverity(cS);
      setResidualLikelihood(rL);
      setResidualSeverity(rS);

      form.setFieldsValue({
        activity: record.activity,
        unit: record.unit,
        location: record.location,
        assessmentDate: record.assessmentDate ? dayjs(record.assessmentDate) : dayjs(record.createdAt),
        assessor: record.assessor || "Tim K3",
        activityType: record.activityType || "Rutin (R)",
        hazardClassification: record.hazardClassification || ["Safety (S)"],

        // 5 Faktor Bahaya
        hazardPhysics: record.hazardPhysics,
        hazardChemical: record.hazardChemical,
        hazardBiology: record.hazardBiology,
        hazardErgonomics: record.hazardErgonomics,
        hazardPsychosocial: record.hazardPsychosocial,
        riskImpact: record.riskImpact || record.risk || "",

        // Pengendalian Saat Ini
        currentElimination: record.currentElimination,
        currentSubstitution: record.currentSubstitution,
        currentEngineering: record.currentEngineering,
        currentAdministrative: record.currentAdministrative,
        currentApd: record.currentApd,

        // Pengendalian Lanjutan
        residualElimination: record.residualElimination,
        residualSubstitution: record.residualSubstitution,
        residualEngineering: record.residualEngineering,
        residualAdministrative: record.residualAdministrative,
        residualApd: record.residualApd,

        // Durasi, Status, PIC
        controlDuration: record.controlDuration || "30 Hari",
        controlStatus: record.controlStatus || "Open",
        responsiblePerson: record.responsiblePerson,
        targetDate: record.targetDate ? dayjs(record.targetDate) : dayjs().add(1, "month"),
      });
    }
  }, [record, form]);

  const onFinish = (values: FormValues) => {
    if (!record) return;

    // Ringkasan bahaya untuk backward compatibility
    const hazardSummaryParts: string[] = [];
    if (values.hazardPhysics) hazardSummaryParts.push(`Fisika: ${values.hazardPhysics}`);
    if (values.hazardChemical) hazardSummaryParts.push(`Kimia: ${values.hazardChemical}`);
    if (values.hazardBiology) hazardSummaryParts.push(`Biologi: ${values.hazardBiology}`);
    if (values.hazardErgonomics) hazardSummaryParts.push(`Ergonomi: ${values.hazardErgonomics}`);
    if (values.hazardPsychosocial) hazardSummaryParts.push(`Psikososial: ${values.hazardPsychosocial}`);
    const compiledHazard = hazardSummaryParts.length > 0 ? hazardSummaryParts.join("; ") : record.hazard || "-";

    // Ringkasan pengendalian existing & tambahan
    const existingParts: string[] = [];
    if (values.currentElimination) existingParts.push(`Eliminasi: ${values.currentElimination}`);
    if (values.currentSubstitution) existingParts.push(`Substitusi: ${values.currentSubstitution}`);
    if (values.currentEngineering) existingParts.push(`Engineering: ${values.currentEngineering}`);
    if (values.currentAdministrative) existingParts.push(`Administrasi: ${values.currentAdministrative}`);
    if (values.currentApd) existingParts.push(`APD: ${values.currentApd}`);
    const compiledExisting = existingParts.length > 0 ? existingParts.join("; ") : record.existingControl || "-";

    const residualParts: string[] = [];
    if (values.residualElimination) residualParts.push(`Eliminasi: ${values.residualElimination}`);
    if (values.residualSubstitution) residualParts.push(`Substitusi: ${values.residualSubstitution}`);
    if (values.residualEngineering) residualParts.push(`Engineering: ${values.residualEngineering}`);
    if (values.residualAdministrative) residualParts.push(`Administrasi: ${values.residualAdministrative}`);
    if (values.residualApd) residualParts.push(`APD: ${values.residualApd}`);
    const compiledResidual = residualParts.length > 0 ? residualParts.join("; ") : record.additionalControl || "-";

    updateHiradc(
      {
        resource: "hiradc",
        id: record.id,
        values: {
          ...values,
          assessmentDate: values.assessmentDate ? values.assessmentDate.format("YYYY-MM-DD") : undefined,
          targetDate: values.targetDate ? values.targetDate.format("YYYY-MM-DD") : record.targetDate,

          // Matriks Pengendalian Saat Ini
          currentLikelihood,
          currentSeverity,
          currentNfr,
          currentRiskLevel,

          // Matriks Pengendalian Lanjutan
          residualLikelihood,
          residualSeverity,
          residualNfr,
          residualRiskLevel,

          // Fallback backward compatibility
          hazard: compiledHazard,
          risk: values.riskImpact,
          category: values.hazardClassification?.join(", ") || record.category || "Safety (S)",
          likelihood: currentLikelihood,
          severity: currentSeverity,
          riskScore: currentNfr,
          riskLevel: calculateRiskLevel(currentNfr),
          existingControl: compiledExisting,
          additionalControl: compiledResidual,
        },
        successNotification: {
          message: "Data HIRADC Diperbarui",
          description: `Perubahan data aktivitas "${values.activity}" berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/hiradc/show/${record.id}`);
        },
      }
    );
  };

  if (isLoading || !record) return <Card loading={true} style={{ borderRadius: 14 }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Banner Gradient */}
      <div className="form-hero-banner form-banner-edit form-card-animate form-delay-1">
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
                <EditOutlined /> PERBARUI PENILAIAN RISIKO HIRADC
              </Tag>
              <span style={{ fontSize: 13, color: "#dbeafe" }}>ID: #{record.id}</span>
            </div>

            <Title level={3} style={{ color: "#ffffff", margin: "0 0 8px 0", fontWeight: 800 }}>
              Edit HIRADC: {record.activity}
            </Title>
            <Paragraph style={{ color: "#dbeafe", fontSize: 13.5, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>
              Perbarui analisis 5 faktor bahaya kerja, evaluasi ulang nilai NFR awal &amp; residual, serta status pengendalian lanjutan.
            </Paragraph>
          </Col>

          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => setMatrixModalOpen(true)}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Matriks 5×5 &amp; Kriteria
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}
                className="btn-form-cancel"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
              >
                Batal / Kembali
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* 2. Main Form Card */}
      <Card className="form-content-card form-card-animate form-delay-2" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* SECTION 1: HEADER INFORMASI PENILAIAN */}
          <div className="form-section-title">
            <span className="badge-num">1</span>
            <span>Informasi Dokumen &amp; Aktivitas Kerja</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Unit Kerja</span>}
                name="unit"
                rules={[{ required: true, message: "Unit kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Direktorat Preservasi Arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Tanggal Penilaian</span>}
                name="assessmentDate"
                rules={[{ required: true, message: "Tanggal penilaian wajib diisi!" }]}
              >
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Pemeriksa / Tim Penilai</span>}
                name="assessor"
                rules={[{ required: true, message: "Nama pemeriksa wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Tim K3 ANRI / Siti Rahmawati" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Aktivitas / Proses Kerja</span>}
                name="activity"
                rules={[{ required: true, message: "Aktivitas kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Fumigasi Arsip dengan Gas Kimia Beracun" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Lokasi Kerja</span>}
                name="location"
                rules={[{ required: true, message: "Lokasi kerja wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Laboratorium Preservasi Lantai 1 Gedung B" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Sifat Aktivitas (Rutin / Non Rutin)</span>}
                name="activityType"
                rules={[{ required: true, message: "Pilih sifat aktivitas!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="Rutin (R)">Rutin (R) - Pekerjaan berkala terencana sesuai jadwal rutin</Select.Option>
                  <Select.Option value="Non Rutin (NR)">Non Rutin (NR) - Pekerjaan insidental, perbaikan mendadak, atau khusus</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Klasifikasi Bahaya (Pilih yang sesuai)</span>}
                name="hazardClassification"
                rules={[{ required: true, message: "Pilih minimal 1 klasifikasi bahaya!" }]}
              >
                <Checkbox.Group style={{ width: "100%", marginTop: 6 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Checkbox value="Health (H)">
                        <Tag color="magenta">Health (H)</Tag>
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="Safety (S)">
                        <Tag color="volcano">Safety (S)</Tag>
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="Environment (E)">
                        <Tag color="green">Environment (E)</Tag>
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0" }} />

          {/* SECTION 2: IDENTIFIKASI 5 FAKTOR BAHAYA & RISIKO */}
          <div className="form-section-title">
            <span className="badge-num">2</span>
            <span>Identifikasi 5 Faktor Bahaya &amp; Dampak Risiko</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>1. Bahaya Fisika</span>}
                name="hazardPhysics"
                tooltip="Contoh: Kebisingan mesin, getaran alat, radiasi, suhu ekstrem dingin/panas, pencahayaan kurang"
              >
                <Input placeholder="Contoh: Kebisingan pompa exhaust > 85 dBA, suhu ruangan lembab" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>2. Bahaya Kimia</span>}
                name="hazardChemical"
                tooltip="Contoh: Gas/uap fumigan berbahaya, debu partikulat, bahan pelarut (solvent), bahan mudah terbakar"
              >
                <Input placeholder="Contoh: Uap gas phosphine dan pelarut kimia pembersih arsip" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>3. Bahaya Biologi</span>}
                name="hazardBiology"
                tooltip="Contoh: Bakteri, spora jamur aktif pada arsip kuno, virus, serangga kutu buku, tikus"
              >
                <Input placeholder="Contoh: Spora kapang/jamur aspergillus pada arsip tua" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>4. Bahaya Ergonomi</span>}
                name="hazardErgonomics"
                tooltip="Contoh: Angkat beban berat manual, posisi membungkuk berlama-lama, gerakan repetitif"
              >
                <Input placeholder="Contoh: Gerakan membungkuk statis dan pengangkatan bundel arsip > 15 kg" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>5. Bahaya Psikososial</span>}
                name="hazardPsychosocial"
                tooltip="Contoh: Beban kerja berlebih, tenggat waktu mendesak, kebosanan tugas repetitif, stres kerja"
              >
                <Input placeholder="Contoh: Monotonitas pemeriksaan ribuan lembar dan target penyelesaian ketat" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Risiko / Penyakit Yang Ditimbulkan</span>}
                name="riskImpact"
                rules={[{ required: true, message: "Risiko / penyakit yang ditimbulkan wajib diisi!" }]}
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Contoh: Keracunan gas pernapasan akut, gangguan paru obstruktif kronis, iritasi mata parah"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0" }} />

          {/* SECTION 3: PENGENDALIAN SAAT INI (EXISTING CONTROL) & NFR AWAL */}
          <div className="form-section-title">
            <span className="badge-num">3</span>
            <span>Pengendalian Saat Ini (Existing Control) &amp; Evaluasi Risiko Awal</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Eliminasi (Saat Ini)</span>} name="currentElimination">
                <Input placeholder="Contoh: -" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Substitusi (Saat Ini)</span>} name="currentSubstitution">
                <Input placeholder="Contoh: -" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Engineering Control (Saat Ini)</span>} name="currentEngineering">
                <Input placeholder="Contoh: Exhaust fan dinding standar" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Administrasi (Saat Ini)</span>} name="currentAdministrative">
                <Input placeholder="Contoh: Pemasangan tanda peringatan bahaya, instruksi kerja lisan" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Alat Pelindung Diri / APD (Saat Ini)</span>} name="currentApd">
                <Input placeholder="Contoh: Masker kain medis, sarung tangan lateks tipis biasa" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            {/* Matriks Evaluasi Risiko Awal */}
            <Col xs={24}>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "18px 22px",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                    Nilai Faktor Risiko Awal (Existing NFR = L × S):
                  </div>
                  <Tag color={currentRiskLevel === "Sangat Tinggi" ? "red" : currentRiskLevel === "Tinggi" ? "orange" : currentRiskLevel === "Sedang" ? "gold" : "green"}>
                    Kategori: {currentRiskLevel}
                  </Tag>
                </div>

                <Row gutter={24} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Kemungkinan Awal / Likelihood (L: 1 - 5)</span>} style={{ marginBottom: 0 }}>
                      <Select size="large" value={currentLikelihood} onChange={(val) => setCurrentLikelihood(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Sangat Jarang</Select.Option>
                        <Select.Option value={2}>2 - Jarang</Select.Option>
                        <Select.Option value={3}>3 - Sedang</Select.Option>
                        <Select.Option value={4}>4 - Sering</Select.Option>
                        <Select.Option value={5}>5 - Sangat Sering</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Keparahan Awal / Severity (S: 1 - 5)</span>} style={{ marginBottom: 0 }}>
                      <Select size="large" value={currentSeverity} onChange={(val) => setCurrentSeverity(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Tidak Signifikan (Hanya P3K)</Select.Option>
                        <Select.Option value={2}>2 - Ringan (Cedera ringan, &lt; 3 hari)</Select.Option>
                        <Select.Option value={3}>3 - Sedang (Rawat medis, &gt; 3 hari)</Select.Option>
                        <Select.Option value={4}>4 - Berat (Cacat permanen)</Select.Option>
                        <Select.Option value={5}>5 - Katastropik (Fatal)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center", background: "#ffffff", padding: "10px", borderRadius: 8, border: "1px dashed #cbd5e1" }}>
                      <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>
                        NFR SAAT INI (L × S)
                      </Text>
                      <div style={{ fontSize: 28, fontWeight: 800, color: getNfrColor(currentRiskLevel), lineHeight: 1.2 }}>
                        {currentNfr}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getNfrColor(currentRiskLevel) }}>
                        {currentRiskLevel.toUpperCase()}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0" }} />

          {/* SECTION 4: PENGENDALIAN LANJUTAN (RESIDUAL CONTROL) & NFR SISA */}
          <div className="form-section-title">
            <span className="badge-num">4</span>
            <span>Pengendalian Lanjutan (Determining / Residual Control) &amp; Target NFR Sisa</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Eliminasi (Lanjutan)</span>} name="residualElimination">
                <Input placeholder="Contoh: Menghentikan metode semprot manual terbuka" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Substitusi (Lanjutan)</span>} name="residualSubstitution">
                <Input placeholder="Contoh: Mengganti bahan kimia toxic dengan biopestisida ramah lingkungan" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Engineering Control (Lanjutan)</span>} name="residualEngineering">
                <Input placeholder="Contoh: Instalasi lemari asam (fume hood) bersertifikat & sensor deteksi gas otomatis" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Administrasi (Lanjutan)</span>} name="residualAdministrative">
                <Input placeholder="Contoh: Pembuatan SOP fumigasi baku, pelatihan K3 kimia, rotasi jam kerja maks 2 jam" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
              <Form.Item label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Alat Pelindung Diri / APD (Lanjutan)</span>} name="residualApd">
                <Input placeholder="Contoh: Full face respirator canister gas ABEK1P3, chemical coverall Tyvek, sarung tangan nitril 15 mil" size="middle" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            {/* Matriks Evaluasi Risiko Sisa (Residual) */}
            <Col xs={24}>
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "18px 22px",
                  borderRadius: 12,
                  border: "1px solid #bbf7d0",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, color: "#14532d" }}>
                    Nilai Faktor Risiko Sisa Setelah Pengendalian (Residual NFR = L × S):
                  </div>
                  <Tag color={residualRiskLevel === "Sangat Tinggi" ? "red" : residualRiskLevel === "Tinggi" ? "orange" : residualRiskLevel === "Sedang" ? "gold" : "green"}>
                    Target Sisa: {residualRiskLevel}
                  </Tag>
                </div>

                <Row gutter={24} align="middle">
                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600, color: "#166534" }}>Kemungkinan Sisa / Likelihood (L: 1 - 5)</span>} style={{ marginBottom: 0 }}>
                      <Select size="large" value={residualLikelihood} onChange={(val) => setResidualLikelihood(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Sangat Jarang</Select.Option>
                        <Select.Option value={2}>2 - Jarang</Select.Option>
                        <Select.Option value={3}>3 - Sedang</Select.Option>
                        <Select.Option value={4}>4 - Sering</Select.Option>
                        <Select.Option value={5}>5 - Sangat Sering</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item label={<span style={{ fontWeight: 600, color: "#166534" }}>Keparahan Sisa / Severity (S: 1 - 5)</span>} style={{ marginBottom: 0 }}>
                      <Select size="large" value={residualSeverity} onChange={(val) => setResidualSeverity(val)} style={{ borderRadius: 8 }}>
                        <Select.Option value={1}>1 - Tidak Signifikan (P3K)</Select.Option>
                        <Select.Option value={2}>2 - Ringan (&lt;3 hari)</Select.Option>
                        <Select.Option value={3}>3 - Sedang (Rawat Medis)</Select.Option>
                        <Select.Option value={4}>4 - Berat (Cacat Permanen)</Select.Option>
                        <Select.Option value={5}>5 - Katastropik (Fatal)</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <div style={{ textAlign: "center", background: "#ffffff", padding: "10px", borderRadius: 8, border: "1px dashed #86efac" }}>
                      <Text type="secondary" style={{ fontSize: 11, fontWeight: 700 }}>
                        NFR SISA TARGET (L × S)
                      </Text>
                      <div style={{ fontSize: 28, fontWeight: 800, color: getNfrColor(residualRiskLevel), lineHeight: 1.2 }}>
                        {residualNfr}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: getNfrColor(residualRiskLevel) }}>
                        {residualRiskLevel.toUpperCase()}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "24px 0" }} />

          {/* SECTION 5: DURASI, STATUS PENGENDALIAN, PIC & TARGET WAKTU */}
          <div className="form-section-title">
            <span className="badge-num">5</span>
            <span>Durasi, Status Pengendalian &amp; Penanggung Jawab (PIC)</span>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={6}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Durasi Pengendalian</span>}
                name="controlDuration"
                tooltip="Batas waktu pelaksanaan mitigasi berdasarkan kriteria risiko"
                rules={[{ required: true, message: "Pilih durasi pengendalian!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="7 Hari">7 Hari (Tindakan Segera / Sangat Tinggi)</Select.Option>
                  <Select.Option value="14 Hari">14 Hari</Select.Option>
                  <Select.Option value="30 Hari">30 Hari (1 Bulan)</Select.Option>
                  <Select.Option value="3 Bulan">3 Bulan</Select.Option>
                  <Select.Option value="6 Bulan">6 Bulan</Select.Option>
                  <Select.Option value="12 Bulan">12 Bulan (Tindakan Jangka Menengah)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Status Pengendalian</span>}
                name="controlStatus"
                rules={[{ required: true, message: "Pilih status pengendalian!" }]}
              >
                <Select size="large" style={{ borderRadius: 8 }}>
                  <Select.Option value="Open">
                    <Tag color="orange">Open (Sedang / Belum Selesai)</Tag>
                  </Select.Option>
                  <Select.Option value="Close">
                    <Tag color="green">Close (Telah Selesai Diimplementasikan)</Tag>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Penanggung Jawab (PIC)</span>}
                name="responsiblePerson"
                rules={[{ required: true, message: "Penanggung jawab wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Siti Rahmawati (Tim K3)" size="large" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                label={<span style={{ fontWeight: 600, color: "#1e293b" }}>Target Selesai</span>}
                name="targetDate"
                rules={[{ required: true, message: "Target tanggal wajib diisi!" }]}
              >
                <DatePicker style={{ width: "100%", borderRadius: 8 }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
            <Button className="btn-form-cancel" onClick={() => navigate(`/keselamatan/hiradc/show/${record.id}`)}>
              Batal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="btn-form-submit"
            >
              Simpan Perubahan HIRADC
            </Button>
          </div>
        </Form>
      </Card>

      {/* Modal Matriks */}
      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={currentLikelihood}
        selectedSeverity={currentSeverity}
      />
    </div>
  );
};
