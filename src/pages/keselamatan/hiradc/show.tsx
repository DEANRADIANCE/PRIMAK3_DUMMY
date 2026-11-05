import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Row,
  Col,
  Table,
  Tabs,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  InfoCircleOutlined,
  FilePdfOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  AuditOutlined,
  ApartmentOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useOne, useGetIdentity } from "@refinedev/core";
import {
  IHiradc,
  IHiradcSubActivity,
  getNfrColor,
  getNfrTagColor,
  calculateNfrRiskLevel,
} from "../../../types/hiradc";
import { RiskMatrixModal } from "../../../components/common/RiskMatrixModal";
import { HiradcPrintModal } from "../../../components/common/HiradcPrintModal";

const { Title, Text, Paragraph } = Typography;

export const HiradcShow: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<any>();
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string>(searchParams.get("tab") || "0");

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab !== null) {
      setActiveTabKey(tab);
    }
  }, [searchParams]);

  const { query } = useOne<IHiradc>({
    resource: "hiradc",
    id: id || "1",
  });

  const record = query.data?.data;
  const isLoading = query.isLoading;

  if (isLoading || !record) return <Card loading={true} style={{ borderRadius: 14 }} />;

  const canEdit = currentUser?.role === "admin" || currentUser?.role === "tim_k3" || currentUser?.role === "super_admin";

  // Ambil daftar sub-aktivitas / proses kerja
  const subActivities: IHiradcSubActivity[] = (record.subActivities && record.subActivities.length > 0)
    ? record.subActivities
    : [
        {
          id: `sub-single-${record.id}`,
          activity: record.activity,
          activityType: record.activityType,
          hazardClassification: record.hazardClassification,
          hazardPhysics: record.hazardPhysics,
          hazardChemical: record.hazardChemical,
          hazardBiology: record.hazardBiology,
          hazardErgonomics: record.hazardErgonomics,
          hazardPsychosocial: record.hazardPsychosocial,
          riskImpact: record.riskImpact || record.risk || "-",
          controlDescription: record.controlDescription,
          selectedControls: record.selectedControls,
          currentElimination: record.currentElimination,
          currentSubstitution: record.currentSubstitution,
          currentEngineering: record.currentEngineering,
          currentAdministrative: record.currentAdministrative,
          currentApd: record.currentApd,
          currentLikelihood: record.currentLikelihood ?? record.likelihood ?? 3,
          currentSeverity: record.currentSeverity ?? record.severity ?? 3,
          currentNfr: record.currentNfr ?? record.riskScore ?? 9,
          currentRiskLevel: record.currentRiskLevel ?? "Sedang",
          residualElimination: record.residualElimination,
          residualSubstitution: record.residualSubstitution,
          residualEngineering: record.residualEngineering,
          residualAdministrative: record.residualAdministrative,
          residualApd: record.residualApd,
          residualLikelihood: record.residualLikelihood ?? 2,
          residualSeverity: record.residualSeverity ?? 2,
          residualNfr: record.residualNfr ?? 4,
          residualRiskLevel: record.residualRiskLevel ?? "Sedang",
          controlDuration: record.controlDuration,
          controlStatus: record.controlStatus,
          responsiblePerson: record.responsiblePerson,
          targetDate: record.targetDate,
        },
      ];

  // Hitung risiko tertinggi
  const highestCurrentNfr = subActivities.reduce((max, s) => {
    const score = s.currentNfr || ((s.currentLikelihood || 3) * (s.currentSeverity || 3));
    return score > max ? score : max;
  }, 0);
  const highestRiskLevel = calculateNfrRiskLevel(highestCurrentNfr);

  const parentTitle = record.parentActivity || record.activity;

  // Active sub-activity detail
  const currentSubIdx = Number(activeTabKey) || 0;
  const currentSub = subActivities[currentSubIdx] || subActivities[0];
  const curSubNfr = currentSub.currentNfr || (currentSub.currentLikelihood * currentSub.currentSeverity);
  const curSubRiskLevel = currentSub.currentRiskLevel || calculateNfrRiskLevel(curSubNfr);
  const curResNfr = currentSub.residualNfr || ((currentSub.residualLikelihood ?? 2) * (currentSub.residualSeverity ?? 2));
  const curResRiskLevel = currentSub.residualRiskLevel || calculateNfrRiskLevel(curResNfr);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Space wrap>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/hiradc")}>
            Kembali
          </Button>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e293b" }}>
              Detail Dokumen HIRADC: {parentTitle}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Unit: {record.unit} | Lokasi: {record.location} | ID: #{record.id}
            </Text>
          </div>
        </Space>

        <Space wrap>
          <Button icon={<InfoCircleOutlined />} onClick={() => setMatrixModalOpen(true)}>
            Panduan Matriks K3
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => setPrintModalOpen(true)}>
            Cetak / PDF Resmi
          </Button>
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#0284c7", borderColor: "#0284c7" }}
              onClick={() => navigate(`/keselamatan/hiradc/edit/${record.id}`)}
            >
              Ubah Data
            </Button>
          )}
        </Space>
      </div>

      {/* 2. Top Banner Card */}
      <Card
        bordered={false}
        style={{
          borderRadius: 14,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <Tag color="cyan" style={{ borderRadius: 12, fontWeight: 700 }}>
                <SafetyCertificateOutlined /> DOKUMEN HIRADC TERVERIFIKASI
              </Tag>
              <Tag color="geekblue" style={{ borderRadius: 12, fontWeight: 700 }}>
                <ApartmentOutlined /> JUDUL KEGIATAN INDUK
              </Tag>
              <Tag color="purple" style={{ borderRadius: 12, fontWeight: 700 }}>
                {subActivities.length} Tahapan Proses Kerja
              </Tag>
            </div>
            <Title level={2} style={{ color: "#fff", margin: "0 0 8px 0", fontWeight: 800 }}>
              {parentTitle}
            </Title>
            <Paragraph style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
              <strong>Unit Kerja:</strong> {record.unit} | <strong>Lokasi:</strong> {record.location} | <strong>Tanggal Penilaian:</strong> {record.assessmentDate || record.createdAt}
            </Paragraph>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Text style={{ color: "#cbd5e1", fontSize: 13 }}>
                <strong>Pemeriksa / Tim Penilai:</strong> {record.assessor || "Tim K3 ANRI"}
              </Text>
            </div>
          </Col>

          {/* Perbandingan Skor NFR Tertinggi Kegiatan */}
          <Col xs={24} md={10}>
            <Row gutter={12}>
              <Col span={12}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <Text style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>RISIKO TERTINGGI (AWAL)</Text>
                  <div style={{ fontSize: 32, fontWeight: 800, color: getNfrColor(highestRiskLevel), lineHeight: 1.2 }}>
                    {highestCurrentNfr}
                  </div>
                  <Tag color={getNfrTagColor(highestRiskLevel)} style={{ fontWeight: 700, marginTop: 4 }}>
                    {highestRiskLevel.toUpperCase()}
                  </Tag>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>
                    Dari {subActivities.length} proses kerja
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <Text style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 700 }}>STATUS TINDAKAN</Text>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#38bdf8", marginTop: 4, lineHeight: 1.4 }}>
                    {subActivities.filter(s => s.controlStatus === "Close").length} / {subActivities.length} Selesai
                  </div>
                  <Tag color="cyan" style={{ fontWeight: 700, marginTop: 8 }}>
                    MITIGASI K3 TERMONITOR
                  </Tag>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 3. Tabel Rekapitulasi Rangkaian Proses Kerja */}
      <Card
        title={
          <Space>
            <OrderedListOutlined style={{ color: "#0284c7" }} />
            <span>Rekapitulasi Tahapan Proses Kerja ({subActivities.length} Proses di Bawah "{parentTitle}")</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Table
          dataSource={subActivities}
          rowKey={(s, i) => s.id || `sub-${i}`}
          pagination={false}
          size="middle"
          columns={[
            {
              title: "No.",
              width: 50,
              align: "center",
              render: (_, __, idx) => <span style={{ fontWeight: 700, color: "#64748b" }}>{idx + 1}</span>,
            },
            {
              title: "Aktivitas / Proses Kerja",
              dataIndex: "activity",
              key: "activity",
              render: (val: string, item: IHiradcSubActivity, idx) => (
                <div>
                  <a
                    onClick={() => setActiveTabKey(String(idx))}
                    style={{ fontWeight: 700, color: "#0284c7", fontSize: 13.5 }}
                  >
                    {val}
                  </a>
                  <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Tag color={item.activityType?.includes("Non") ? "volcano" : "blue"} style={{ fontSize: 11 }}>
                      {item.activityType || "Rutin"}
                    </Tag>
                    {item.hazardClassification?.map((cls, cIdx) => (
                      <Tag key={cIdx} style={{ fontSize: 11 }}>{cls}</Tag>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              title: "Risiko / Dampak",
              dataIndex: "riskImpact",
              key: "riskImpact",
              render: (val: string) => (
                <span style={{ color: "#dc2626", fontWeight: 500, fontSize: 12.5 }}>{val || "-"}</span>
              ),
            },
            {
              title: "NFR Awal",
              width: 105,
              align: "center",
              render: (_, s) => {
                const nfr = s.currentNfr || (s.currentLikelihood * s.currentSeverity);
                const lvl = s.currentRiskLevel || calculateNfrRiskLevel(nfr);
                return (
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{nfr}</div>
                    <Tag color={getNfrTagColor(lvl)} style={{ fontSize: 10, margin: 0 }}>{lvl}</Tag>
                  </div>
                );
              },
            },
            {
              title: "NFR Sisa",
              width: 105,
              align: "center",
              render: (_, s) => {
                const nfr = s.residualNfr || ((s.residualLikelihood ?? 2) * (s.residualSeverity ?? 2));
                const lvl = s.residualRiskLevel || calculateNfrRiskLevel(nfr);
                return (
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{nfr}</div>
                    <Tag color={getNfrTagColor(lvl)} style={{ fontSize: 10, margin: 0 }}>{lvl}</Tag>
                  </div>
                );
              },
            },
            {
              title: "Durasi & Status",
              width: 120,
              align: "center",
              render: (_, s) => (
                <div>
                  <div style={{ fontSize: 11.5, color: "#475569" }}>{s.controlDuration || "-"}</div>
                  <Tag color={s.controlStatus === "Close" ? "green" : "orange"} style={{ fontSize: 10, margin: "2px 0 0 0" }}>
                    {s.controlStatus || "Open"}
                  </Tag>
                </div>
              ),
            },
            {
              title: "PIC & Target",
              width: 140,
              render: (_, s) => (
                <div style={{ fontSize: 11.5 }}>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>{s.responsiblePerson || "-"}</div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{s.targetDate || "-"}</Text>
                </div>
              ),
            },
            {
              title: "Aksi",
              width: 90,
              align: "center",
              render: (_, __, idx) => (
                <Button
                  size="small"
                  type={activeTabKey === String(idx) ? "primary" : "default"}
                  onClick={() => setActiveTabKey(String(idx))}
                  style={{ borderRadius: 6, fontSize: 11.5 }}
                >
                  Detail
                </Button>
              ),
            },
          ]}
        />
      </Card>

      {/* 4. Rincian Detail Proses Kerja Terpilih */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ color: "#ef4444" }} />
            <span>
              Detail Penilaian Proses Kerja #{currentSubIdx + 1}: <strong>{currentSub.activity}</strong>
            </span>
          </Space>
        }
        extra={
          <Tabs
            activeKey={activeTabKey}
            onChange={(key) => setActiveTabKey(key)}
            size="small"
            style={{ marginBottom: -16 }}
            items={subActivities.map((_, idx) => ({
              key: String(idx),
              label: `Proses #${idx + 1}`,
            }))}
          />
        }
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
      >
        <Alert
          type={curSubRiskLevel === "Sangat Tinggi" ? "error" : curSubRiskLevel === "Tinggi" ? "warning" : curSubRiskLevel === "Sedang" ? "info" : "success"}
          showIcon
          message={
            <span>
              Penilaian Risiko Proses Kerja: <strong>{currentSub.activity}</strong> — NFR Awal {curSubNfr} [{curSubRiskLevel}] ➔ NFR Sisa Target {curResNfr} [{curResRiskLevel}]
            </span>
          }
          style={{ marginBottom: 16, borderRadius: 8 }}
        />

        {/* 5 Faktor Bahaya & Identifikasi Terstruktur */}
        <Title level={5} style={{ color: "#0f172a", marginBottom: 12 }}>
          1. Identifikasi Bahaya dan Risiko (Sesuai Format Formulir K3)
        </Title>

        {/* Jenis Bahaya yang dicentang */}
        <div style={{ marginBottom: 14, background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
            Jenis Bahaya yang Dicentang:
          </div>
          <Space wrap size={8}>
            {["Fisika", "Kimia", "Biologi", "Ergonomi", "Psikososial"].map((t) => {
              const isChecked = currentSub.selectedHazardTypes?.includes(t as any) ||
                (t === "Fisika" && currentSub.hazardPhysics && currentSub.hazardPhysics !== "-") ||
                (t === "Kimia" && currentSub.hazardChemical && currentSub.hazardChemical !== "-") ||
                (t === "Biologi" && currentSub.hazardBiology && currentSub.hazardBiology !== "-") ||
                (t === "Ergonomi" && currentSub.hazardErgonomics && currentSub.hazardErgonomics !== "-") ||
                (t === "Psikososial" && currentSub.hazardPsychosocial && currentSub.hazardPsychosocial !== "-");

              return (
                <Tag
                  key={t}
                  color={isChecked ? "blue" : "default"}
                  style={{
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontWeight: isChecked ? 700 : 400,
                    opacity: isChecked ? 1 : 0.6,
                    border: isChecked ? "1.5px solid #2563eb" : "1px dashed #cbd5e1",
                  }}
                >
                  {isChecked ? `✓ ${t}` : `☐ ${t}`}
                </Tag>
              );
            })}
          </Space>
        </div>

        {/* Rincian Tabel Deskripsi Bahaya Ke Bawah */}
        {currentSub.hazardRows && currentSub.hazardRows.length > 0 ? (
          <div style={{ marginBottom: 20, overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#ffffff",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 12.5,
              }}
            >
              <thead>
                <tr style={{ background: "#f1f5f9", textAlign: "left", borderBottom: "1.5px solid #cbd5e1" }}>
                  <th style={{ padding: "9px 10px", width: "40px", textAlign: "center" }}>No</th>
                  <th style={{ padding: "9px 12px", width: "32%" }}>Deskripsi Bahaya</th>
                  <th style={{ padding: "9px 12px", width: "24%" }}>Jenis Bahaya Terkait</th>
                  <th style={{ padding: "9px 12px", width: "22%" }}>⚠️ Risiko Yang Ditimbulkan</th>
                  <th style={{ padding: "9px 12px", width: "22%" }}>💥 Dampak / Penyakit</th>
                </tr>
              </thead>
              <tbody>
                {currentSub.hazardRows.map((r, rIdx) => (
                  <tr key={r.id || rIdx} style={{ borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontWeight: 700, color: "#64748b" }}>
                      {rIdx + 1}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0f172a" }}>
                      {r.deskripsi}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <Space wrap size={4}>
                        {(r.jenisBahaya || []).map((t) => (
                          <Tag
                            key={t}
                            color={
                              t === "Fisika" ? "blue" :
                              t === "Kimia" ? "purple" :
                              t === "Biologi" ? "green" :
                              t === "Ergonomi" ? "orange" : "magenta"
                            }
                            style={{ fontWeight: 700, fontSize: 11.5, borderRadius: 4 }}
                          >
                            {t === "Fisika" ? "⚡ " : t === "Kimia" ? "🧪 " : t === "Biologi" ? "🦠 " : t === "Ergonomi" ? "🏋️ " : "🧠 "}
                            {t}
                          </Tag>
                        ))}
                      </Space>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <Space wrap size={4}>
                        {(r.risikoList || []).filter(Boolean).map((risk, rkIdx) => (
                          <Tag key={rkIdx} color="red" style={{ fontSize: 11, borderRadius: 4 }}>
                            ⚠️ {risk}
                          </Tag>
                        ))}
                      </Space>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <Space wrap size={4}>
                        {(r.dampakList || []).filter(Boolean).map((dmpk, dpIdx) => (
                          <Tag key={dpIdx} color="orange" style={{ fontSize: 11, borderRadius: 4 }}>
                            💥 {dmpk}
                          </Tag>
                        ))}
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : currentSub.hazardDetails && Object.keys(currentSub.hazardDetails).some((k) => (currentSub.hazardDetails as any)[k]?.length > 0) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {Object.entries(currentSub.hazardDetails).map(([catKey, items]) => {
              if (!items || items.length === 0) return null;
              const hasContent = items.some((it) => it.deskripsi && it.deskripsi.trim());
              if (!hasContent && !currentSub.selectedHazardTypes?.includes(catKey as any)) return null;

              return (
                <div
                  key={catKey}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    padding: "14px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Tag color="cyan" style={{ fontWeight: 800, fontSize: 12 }}>
                      Bahaya {catKey}
                    </Tag>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      ({items.length} Deskripsi Bahaya)
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((it, itIdx) => (
                      <div
                        key={it.id || itIdx}
                        style={{
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 6 }}>
                          Deskripsi #{itIdx + 1}: {it.deskripsi || "-"}
                        </div>

                        <Row gutter={12}>
                          <Col xs={24} md={12}>
                            <div style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600, marginBottom: 4 }}>
                              Risiko Yang Ditimbulkan:
                            </div>
                            <Space wrap size={4}>
                              {(it.risikoList || []).filter(Boolean).length > 0 ? (
                                it.risikoList.filter(Boolean).map((r, rIdx) => (
                                  <Tag key={rIdx} color="red" style={{ fontSize: 11, borderRadius: 4 }}>
                                    ⚠️ {r}
                                  </Tag>
                                ))
                              ) : (
                                <span style={{ fontSize: 11.5, color: "#94a3b8" }}>-</span>
                              )}
                            </Space>
                          </Col>

                          <Col xs={24} md={12}>
                            <div style={{ fontSize: 12, color: "#c2410c", fontWeight: 600, marginBottom: 4 }}>
                              Dampak / Penyakit:
                            </div>
                            <Space wrap size={4}>
                              {(it.dampakList || []).filter(Boolean).length > 0 ? (
                                it.dampakList.filter(Boolean).map((d, dIdx) => (
                                  <Tag key={dIdx} color="orange" style={{ fontSize: 11, borderRadius: 4 }}>
                                    💥 {d}
                                  </Tag>
                                ))
                              ) : (
                                <span style={{ fontSize: 11.5, color: "#94a3b8" }}>-</span>
                              )}
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="middle" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="1. Bahaya Fisika">{currentSub.hazardPhysics || "-"}</Descriptions.Item>
            <Descriptions.Item label="2. Bahaya Kimia">{currentSub.hazardChemical || "-"}</Descriptions.Item>
            <Descriptions.Item label="3. Bahaya Biologi">{currentSub.hazardBiology || "-"}</Descriptions.Item>
            <Descriptions.Item label="4. Bahaya Ergonomi">{currentSub.hazardErgonomics || "-"}</Descriptions.Item>
            <Descriptions.Item label="5. Bahaya Psikososial">{currentSub.hazardPsychosocial || "-"}</Descriptions.Item>
            <Descriptions.Item label="Sifat & Klasifikasi">
              {currentSub.activityType || "Rutin"} • {currentSub.hazardClassification?.join(", ") || "Safety"}
            </Descriptions.Item>
            <Descriptions.Item label="Risiko / Penyakit Yang Ditimbulkan" span={3}>
              <Text strong style={{ color: "#dc2626", fontSize: 13.5 }}>
                {currentSub.riskImpact || "-"}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* Komparasi 5 Hierarki Pengendalian K3 */}
        <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
          {/* Kolom Kiri: Existing Control */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: "#f59e0b" }} />
                  <span>Pengendalian Saat Ini (Existing Control)</span>
                </Space>
              }
              extra={
                <Tag color={getNfrTagColor(curSubRiskLevel)} style={{ fontWeight: 700 }}>
                  NFR: {curSubNfr} ({curSubRiskLevel})
                </Tag>
              }
              bordered={false}
              style={{ borderRadius: 10, border: "1px solid #fed7aa", height: "100%", background: "#fffbeb" }}
            >
              <Descriptions bordered column={1} size="small">
                {currentSub.controlDescription && (
                  <Descriptions.Item label="Uraian Kontrol">{currentSub.controlDescription}</Descriptions.Item>
                )}
                {currentSub.selectedControls && currentSub.selectedControls.length > 0 && (
                  <Descriptions.Item label="Hirarki Terpilih">
                    <Space wrap size={[4, 4]}>
                      {currentSub.selectedControls.map((c) => (
                        <Tag key={c} color="blue" style={{ fontWeight: 700, margin: 0 }}>
                          {c}
                        </Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Eliminasi">
                  {currentSub.currentElimination === "✓" ? <Tag color="green">✓ Diterapkan</Tag> : (currentSub.currentElimination || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Substitusi">
                  {currentSub.currentSubstitution === "✓" ? <Tag color="cyan">✓ Diterapkan</Tag> : (currentSub.currentSubstitution || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Engineering">
                  {currentSub.currentEngineering === "✓" ? <Tag color="blue">✓ Diterapkan</Tag> : (currentSub.currentEngineering || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Administrasi">
                  {currentSub.currentAdministrative === "✓" ? <Tag color="orange">✓ Diterapkan</Tag> : (currentSub.currentAdministrative || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="APD">
                  {currentSub.currentApd === "✓" ? <Tag color="purple">✓ Diterapkan</Tag> : (currentSub.currentApd || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Evaluasi Matriks">
                  <strong>Peluang (L): {currentSub.currentLikelihood}</strong> | <strong>Keparahan (S): {currentSub.currentSeverity}</strong> &rarr; <strong>NFR: {curSubNfr} [{curSubRiskLevel}]</strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Kolom Kanan: Determining Control */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: "#10b981" }} />
                  <span>Pengendalian Lanjutan (Determining Control)</span>
                </Space>
              }
              extra={
                <Tag color={getNfrTagColor(curResRiskLevel)} style={{ fontWeight: 700 }}>
                  Target Sisa: {curResNfr} ({curResRiskLevel})
                </Tag>
              }
              bordered={false}
              style={{ borderRadius: 10, border: "1px solid #a7f3d0", height: "100%", background: "#f0fdf4" }}
            >
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Eliminasi">
                  {currentSub.residualElimination === "✓" ? <Tag color="green">✓ Diterapkan</Tag> : (currentSub.residualElimination || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Substitusi">
                  {currentSub.residualSubstitution === "✓" ? <Tag color="cyan">✓ Diterapkan</Tag> : (currentSub.residualSubstitution || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Engineering">
                  {currentSub.residualEngineering === "✓" ? <Tag color="blue">✓ Diterapkan</Tag> : (currentSub.residualEngineering || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Administrasi">
                  {currentSub.residualAdministrative === "✓" ? <Tag color="orange">✓ Diterapkan</Tag> : (currentSub.residualAdministrative || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="APD">
                  {currentSub.residualApd === "✓" ? <Tag color="purple">✓ Diterapkan</Tag> : (currentSub.residualApd || "-")}
                </Descriptions.Item>
                <Descriptions.Item label="Evaluasi Matriks Sisa">
                  <strong>Peluang (L): {currentSub.residualLikelihood}</strong> | <strong>Keparahan (S): {currentSub.residualSeverity}</strong> &rarr; <strong>NFR Target: {curResNfr} [{curResRiskLevel}]</strong>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {/* Durasi, Status, PIC & Target */}
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 4 }} size="middle">
          <Descriptions.Item label="Durasi Pengendalian">
            <Tag color="blue" style={{ fontWeight: 700 }}>
              {currentSub.controlDuration || "30 Hari"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status Pengendalian">
            <Tag color={currentSub.controlStatus === "Close" ? "green" : "orange"} style={{ fontWeight: 700 }}>
              {currentSub.controlStatus || "Open"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Penanggung Jawab (PIC)">
            <strong>{currentSub.responsiblePerson || "-"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Target Penyelesaian">
            {currentSub.targetDate || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 5. Riwayat Status & Log Penilaian */}
      {record.statusHistory && record.statusHistory.length > 0 && (
        <Card
          title="Riwayat Status & Validasi Penilaian"
          bordered={false}
          style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
        >
          <Table
            dataSource={record.statusHistory}
            rowKey={(item, index) => `${item.status}-${index}`}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (val: string) => <Tag color="blue">{val}</Tag>,
              },
              {
                title: "Divalidasi Oleh",
                dataIndex: "changedBy",
                key: "changedBy",
              },
              {
                title: "Waktu",
                dataIndex: "changedAt",
                key: "changedAt",
              },
              {
                title: "Catatan",
                dataIndex: "notes",
                key: "notes",
                render: (val?: string) => val || "-",
              },
            ]}
          />
        </Card>
      )}

      {/* Modal Matriks */}
      <RiskMatrixModal
        open={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        selectedLikelihood={currentSub.currentLikelihood}
        selectedSeverity={currentSub.currentSeverity}
      />

      {/* Modal Format Cetak PDF & Text Editor */}
      <HiradcPrintModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        items={[record]}
        documentTitle={`HIRADC - ${parentTitle}`}
      />
    </div>
  );
};
