import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  Space,
  Tag,
  Alert,
  Tooltip,
  Divider,
} from "antd";
import {
  PrinterOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  SafetyCertificateOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { IHiradc, getNfrColor, calculateNfrRiskLevel } from "../../types/hiradc";

interface HiradcPrintModalProps {
  open: boolean;
  onClose: () => void;
  items: IHiradc[];
  documentTitle?: string;
}

export const HiradcPrintModal: React.FC<HiradcPrintModalProps> = ({
  open,
  onClose,
  items,
  documentTitle = "FORMULIR PENILAIAN RISIKO HIRADC",
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml, setInitialHtml] = useState<string>("");

  const firstItem = items[0];
  const unitKerja = firstItem?.unit || "Semua Unit Kerja";
  const tglPenilaian = firstItem?.assessmentDate || firstItem?.createdAt || "Februari 2026";
  const timPemeriksa = firstItem?.assessor || "Tim K3 ANRI";

  // Simpan HTML awal saat modal dibuka untuk fitur Reset
  useEffect(() => {
    if (open && editorRef.current) {
      setInitialHtml(editorRef.current.innerHTML);
    }
  }, [open, items]);

  const handleReset = () => {
    if (editorRef.current && initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
  };

  const handlePrint = () => {
    if (!editorRef.current) return;
    const printContents = editorRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=1200,height=850");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle} - ${unitKerja}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 8mm 10mm 10mm 10mm;
            }
            body {
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 8.5pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 8px;
            }
            th, td {
              border: 1px solid #1e293b;
              padding: 4px 5px;
              vertical-align: middle;
            }
            th {
              background-color: #f1f5f9 !important;
              text-align: center;
              font-weight: 700;
            }
            .kop-table td {
              border: none !important;
            }
            .sig-table td {
              border: none !important;
            }
            .badge-nfr {
              display: inline-block;
              padding: 2px 5px;
              border-radius: 3px;
              font-weight: 700;
              font-size: 8pt;
            }
            .badge-rendah { background-color: #dcfce7 !important; color: #15803d !important; }
            .badge-sedang { background-color: #e0f2fe !important; color: #0369a1 !important; }
            .badge-tinggi { background-color: #fef9c3 !important; color: #a16207 !important; }
            .badge-ekstrem { background-color: #fee2e2 !important; color: #b91c1c !important; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1250}
      style={{ top: 15 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 32 }}>
          <Space>
            <FilePdfOutlined style={{ color: "#ef4444", fontSize: 20 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                Format Cetak Dokumen HIRADC (Standar K3 / Spreadsheet)
              </div>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>
                Disesuaikan dengan format tabel 29 kolom, lembar pengesahan, dan editor teks sebelum cetak
              </div>
            </div>
          </Space>
        </div>
      }
      footer={[
        <Button key="close" onClick={onClose}>
          Tutup
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          style={{ background: "#0284c7", borderColor: "#0284c7" }}
          onClick={handlePrint}
        >
          Cetak Dokumen (Landscape PDF)
        </Button>,
      ]}
    >
      {/* 1. Toolbar Editor Teks */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "8px 14px",
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Space wrap>
          <Button
            type={isEditMode ? "primary" : "default"}
            icon={isEditMode ? <EyeOutlined /> : <EditOutlined />}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ borderRadius: 6, fontWeight: 600 }}
          >
            {isEditMode ? "Selesai Mengedit (Mode Pratinjau)" : "Aktifkan Text Editor (Edit Teks)"}
          </Button>

          {isEditMode && (
            <>
              <Divider type="vertical" />
              <Tooltip title="Tebal (Bold)">
                <Button icon={<BoldOutlined />} size="small" onClick={() => handleFormat("bold")} />
              </Tooltip>
              <Tooltip title="Miring (Italic)">
                <Button icon={<ItalicOutlined />} size="small" onClick={() => handleFormat("italic")} />
              </Tooltip>
              <Tooltip title="Garis Bawah (Underline)">
                <Button icon={<UnderlineOutlined />} size="small" onClick={() => handleFormat("underline")} />
              </Tooltip>
              <Tooltip title="Reset ke Isi Semula">
                <Button icon={<ReloadOutlined />} size="small" onClick={handleReset}>
                  Reset
                </Button>
              </Tooltip>
            </>
          )}
        </Space>

        <Tag color={isEditMode ? "orange" : "blue"} style={{ margin: 0, fontWeight: 600 }}>
          {isEditMode
            ? "✍️ Mode Edit Aktif: Klik pada bagian teks/tabel mana pun untuk mengubah isi secara langsung"
            : "👁️ Mode Pratinjau Cetak (Siap Dicetak ke PDF)"}
        </Tag>
      </div>

      {isEditMode && (
        <Alert
          type="info"
          showIcon
          message="Petunjuk Text Editor Dokumen"
          description="Anda dapat langsung mengetik atau mengubah nama penandatangan, menambah baris keterangan, atau mengedit teks kolom di bawah. Perubahan yang Anda ketik akan langsung tercetak saat tombol Cetak PDF ditekan."
          style={{ marginBottom: 12, borderRadius: 8 }}
        />
      )}

      {/* 2. AREA DOKUMEN CETAK (PERSIS GOOGLE SHEET) */}
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          padding: "20px",
          background: "#ffffff",
          border: isEditMode ? "2px dashed #0284c7" : "1px solid #cbd5e1",
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          ref={editorRef}
          contentEditable={isEditMode}
          suppressContentEditableWarning={true}
          style={{
            minWidth: "1120px",
            fontFamily: "Arial, sans-serif",
            color: "#0f172a",
            outline: "none",
            lineHeight: 1.4,
          }}
        >
          {/* KOP RESMI DOKUMEN ARSIP NASIONAL REPUBLIK INDONESIA */}
          <table className="kop-table" style={{ width: "100%", borderBottom: "2px solid #0f172a", marginBottom: 14 }}>
            <tbody>
              <tr>
                <td style={{ width: "70px", textAlign: "center", verticalAlign: "middle", padding: "0 10px 10px 0" }}>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      background: "#0f172a",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      border: "2px solid #f59e0b",
                    }}
                  >
                    ANRI
                  </div>
                </td>
                <td style={{ verticalAlign: "middle", paddingBottom: "10px" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.8, color: "#0f172a" }}>
                    ARSIP NASIONAL REPUBLIK INDONESIA
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0284c7" }}>
                    SISTEM MANAJEMEN KESELAMATAN DAN KESEHATAN KERJA (SMK3 - ISO 45001)
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#b91c1c", marginTop: 2 }}>
                    IDENTIFIKASI BAHAYA, PENILAIAN, DAN PENGENDALIAN RISIKO K3 (HIRADC)
                  </div>
                </td>
                <td style={{ width: "230px", textAlign: "right", verticalAlign: "middle", fontSize: 9.5, color: "#475569", paddingBottom: "10px" }}>
                  <div><strong>No. Dokumen:</strong> ANRI-K3-HIRADC-2026</div>
                  <div><strong>Tanggal Efektif:</strong> 01 Januari 2026</div>
                  <div><strong>Status:</strong> Terkendali / Resmi</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* INFORMASI UNIT KERJA & PENILAIAN (PERSIS B10 - B12 PADA GOOGLE SHEET) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px 16px",
              background: "#f8fafc",
              padding: "10px 14px",
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              fontSize: "10pt",
              marginBottom: 14,
            }}
          >
            <div>
              <span style={{ color: "#64748b" }}>Unit Kerja: </span>
              <strong>{unitKerja}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Tanggal Penilaian: </span>
              <strong>{tglPenilaian}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Pemeriksa / Tim Penilai: </span>
              <strong>{timPemeriksa}</strong>
            </div>
          </div>

          {/* TABEL UTAMA 29 KOLOM PERSIS PADA GOOGLE SHEET */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "8pt",
              marginBottom: 14,
            }}
          >
            <thead>
              {/* Row Header 1 */}
              <tr style={{ background: "#e2e8f0", textAlign: "center" }}>
                <th rowSpan={3} style={{ width: "25px", border: "1px solid #000" }}>No</th>
                <th rowSpan={3} style={{ width: "120px", border: "1px solid #000" }}>Aktivitas / Proses Kerja</th>
                <th rowSpan={3} style={{ width: "85px", border: "1px solid #000" }}>Lokasi</th>
                <th rowSpan={3} style={{ width: "50px", border: "1px solid #000" }}>Rutin / NR</th>
                <th rowSpan={3} style={{ width: "65px", border: "1px solid #000" }}>Klasifikasi Bahaya</th>
                <th colSpan={6} style={{ border: "1px solid #000", background: "#fef3c7" }}>
                  IDENTIFIKASI BAHAYA DAN RISIKO
                </th>
                <th colSpan={8} style={{ border: "1px solid #000", background: "#dbeafe" }}>
                  PENGENDALIAN SAAT INI (EXISTING CONTROL)
                </th>
                <th colSpan={8} style={{ border: "1px solid #000", background: "#dcfce7" }}>
                  PENGENDALIAN LANJUTAN (DETERMINING CONTROL)
                </th>
                <th rowSpan={3} style={{ width: "55px", border: "1px solid #000" }}>Durasi</th>
                <th rowSpan={3} style={{ width: "50px", border: "1px solid #000" }}>Status</th>
                <th rowSpan={3} style={{ width: "80px", border: "1px solid #000" }}>PIC &amp; Target</th>
              </tr>

              {/* Row Header 2 */}
              <tr style={{ background: "#f1f5f9", textAlign: "center" }}>
                {/* 5 Faktor Bahaya & Risiko */}
                <th rowSpan={2} style={{ border: "1px solid #000", width: "70px" }}>Fisika</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "70px" }}>Kimia</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "70px" }}>Biologi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "75px" }}>Ergonomi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "75px" }}>Psikososial</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "95px" }}>Risiko / Dampak</th>

                {/* 5 Hierarki Existing Control */}
                <th rowSpan={2} style={{ border: "1px solid #000", width: "55px" }}>Eliminasi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "55px" }}>Substitusi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "65px" }}>Engineering</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "65px" }}>Administrasi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "60px" }}>APD</th>
                <th colSpan={3} style={{ border: "1px solid #000", width: "75px" }}>Evaluasi Awal</th>

                {/* 5 Hierarki Residual Control */}
                <th rowSpan={2} style={{ border: "1px solid #000", width: "55px" }}>Eliminasi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "55px" }}>Substitusi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "65px" }}>Engineering</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "65px" }}>Administrasi</th>
                <th rowSpan={2} style={{ border: "1px solid #000", width: "60px" }}>APD</th>
                <th colSpan={3} style={{ border: "1px solid #000", width: "75px" }}>Evaluasi Sisa</th>
              </tr>

              {/* Row Header 3: L, S, NFR */}
              <tr style={{ background: "#f8fafc", textAlign: "center" }}>
                <th style={{ border: "1px solid #000", width: "22px" }}>L</th>
                <th style={{ border: "1px solid #000", width: "22px" }}>S</th>
                <th style={{ border: "1px solid #000", width: "31px" }}>NFR</th>
                <th style={{ border: "1px solid #000", width: "22px" }}>L</th>
                <th style={{ border: "1px solid #000", width: "22px" }}>S</th>
                <th style={{ border: "1px solid #000", width: "31px" }}>NFR</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row, index) => {
                const cL = row.currentLikelihood ?? row.likelihood ?? 3;
                const cS = row.currentSeverity ?? row.severity ?? 3;
                const cNfr = row.currentNfr ?? row.riskScore ?? (cL * cS);
                const cLevel = row.currentRiskLevel ?? calculateNfrRiskLevel(cNfr);

                const rL = row.residualLikelihood ?? 2;
                const rS = row.residualSeverity ?? 2;
                const rNfr = row.residualNfr ?? (rL * rS);
                const rLevel = row.residualRiskLevel ?? calculateNfrRiskLevel(rNfr);

                const getBadgeClass = (level: string) => {
                  if (level === "Rendah") return "badge-nfr badge-rendah";
                  if (level === "Sedang") return "badge-nfr badge-sedang";
                  if (level === "Tinggi") return "badge-nfr badge-tinggi";
                  return "badge-nfr badge-ekstrem";
                };

                return (
                  <tr key={row.id || index} style={{ verticalAlign: "top" }}>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{index + 1}</td>
                    <td style={{ border: "1px solid #000" }}><strong>{row.activity}</strong></td>
                    <td style={{ border: "1px solid #000" }}>{row.location}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>
                      {row.activityType ? (row.activityType.includes("Non") ? "NR" : "R") : "R"}
                    </td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>
                      {row.hazardClassification ? row.hazardClassification.join(", ") : row.category || "-"}
                    </td>

                    {/* 5 Faktor Bahaya */}
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.hazardPhysics || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.hazardChemical || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.hazardBiology || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.hazardErgonomics || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.hazardPsychosocial || "-"}</td>
                    <td style={{ border: "1px solid #000", color: "#b91c1c", fontWeight: 600 }}>
                      {row.riskImpact || row.risk || "-"}
                    </td>

                    {/* Existing Controls */}
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.currentElimination || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.currentSubstitution || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.currentEngineering || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.currentAdministrative || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.currentApd || "-"}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{cL}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{cS}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>
                      <span className={getBadgeClass(cLevel)}>{cNfr}</span>
                    </td>

                    {/* Residual Controls */}
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.residualElimination || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.residualSubstitution || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.residualEngineering || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.residualAdministrative || "-"}</td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>{row.residualApd || "-"}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{rL}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{rS}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000" }}>
                      <span className={getBadgeClass(rLevel)}>{rNfr}</span>
                    </td>

                    <td style={{ textAlign: "center", border: "1px solid #000" }}>{row.controlDuration || "30 Hari"}</td>
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 700 }}>
                      {row.controlStatus || "Open"}
                    </td>
                    <td style={{ border: "1px solid #000", fontSize: "7.5pt" }}>
                      <div>{row.responsiblePerson}</div>
                      <div style={{ color: "#64748b" }}>{row.targetDate}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* CATATAN KRITERIA EVALUASI RISIKO (PERSIS SHEET 2 MATRIX) */}
          <div
            style={{
              fontSize: "8pt",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              padding: "8px 12px",
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            <strong>Keterangan Matriks Risiko NFR (Nilai Faktor Risiko = Likelihood × Severity):</strong>
            <div style={{ display: "flex", gap: "16px", marginTop: "4px", flexWrap: "wrap" }}>
              <span>
                <strong style={{ color: "#15803d" }}>● Rendah (1-2):</strong> Tidak diperlukan tindakan khusus.
              </span>
              <span>
                <strong style={{ color: "#0369a1" }}>● Sedang (3-4):</strong> Pemantauan rutin (patrol) prosedur K3.
              </span>
              <span>
                <strong style={{ color: "#a16207" }}>● Tinggi (5-12):</strong> Tindakan mitigasi dalam waktu &lt; 12 bulan.
              </span>
              <span>
                <strong style={{ color: "#b91c1c" }}>● Sangat Tinggi (15-25):</strong> Tindakan segera / pekerjaan dihentikan (maks. 7 hari).
              </span>
            </div>
          </div>

          {/* LEMBAR PENGESAHAN RESMI (SIGNATURE BLOCK) */}
          <table className="sig-table" style={{ width: "100%", marginTop: "16px", fontSize: "9pt" }}>
            <tbody>
              <tr>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Disiapkan Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Pemeriksa / Tim Penilai K3</div>
                  <div style={{ height: "55px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>({timPemeriksa})</div>
                  <div style={{ fontSize: "8pt", color: "#64748b" }}>Tanggal: {tglPenilaian}</div>
                </td>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Diperiksa Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Ketua Tim K3 ANRI</div>
                  <div style={{ height: "55px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Ir. Hendra Gunawan, M.Si)</div>
                  <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19780512 200212 1 002</div>
                </td>
                <td style={{ width: "34%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Disetujui Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Kepala Unit Kerja / Pimpinan</div>
                  <div style={{ height: "55px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Dr. Budi Santoso, M.Hum)</div>
                  <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19710315 199803 1 001</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
