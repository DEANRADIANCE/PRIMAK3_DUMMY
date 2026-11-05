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
import {
  IHiradc,
  IHiradcSubActivity,
  HazardCategoryType,
  getNfrColor,
  calculateNfrRiskLevel,
} from "../../types/hiradc";

interface HiradcPrintModalProps {
  open: boolean;
  onClose: () => void;
  items: IHiradc[];
  documentTitle?: string;
}

interface FlattenedPrintRow {
  activityIndex: number;
  activityTitle: string;
  location: string;
  activityType: string;
  totalRowsForActivity: number;
  isFirstRowOfActivity: boolean;

  // Hazard item
  deskripsiBahaya: string;
  isFisika: boolean;
  isKimia: boolean;
  isBiologi: boolean;
  isErgonomi: boolean;
  isPsikososial: boolean;
  risikoText: string;
  dampakText: string;

  // Controls
  controlDescription: string;
  isEliminasi: boolean;
  isSubstitusi: boolean;
  isEngineering: boolean;
  isAdministrasi: boolean;
  isApd: boolean;
  eliminasi: string;
  substitusi: string;
  engineering: string;
  administrasi: string;
  apd: string;

  // Risk analysis
  likelihood: number;
  severity: number;
  nfr: number;
  riskLevel: string;

  // Follow up
  tenggat: string;
  status: string;
  durasi: string;
  pic: string;
}

export const HiradcPrintModal: React.FC<HiradcPrintModalProps> = ({
  open,
  onClose,
  items,
  documentTitle = "HAZARD IDENTIFICATION RISK ASSESSMENT AND DETERMINING CONTROL (HIRADC)",
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml, setInitialHtml] = useState<string>("");

  const firstItem = items[0];
  const unitKerja = firstItem?.unit || "Direktorat Preservasi dan Pengolahan Arsip";
  const tglPenilaian = firstItem?.assessmentDate || firstItem?.createdAt || "20 Februari 2026";
  const timPemeriksa = firstItem?.assessor || "Tim K3 ANRI";

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
    const printWindow = window.open("", "_blank", "width=1250,height=850");
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
              margin: 6mm 8mm 6mm 8mm;
            }
            body {
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 7.5pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 6px;
            }
            table.hiradc-table {
              border: 1.5px solid #000;
              font-size: 7.5pt;
            }
            table.hiradc-table th, table.hiradc-table td {
              border: 1px solid #000;
              padding: 3.5px 4.5px;
              vertical-align: middle;
            }
            table.hiradc-table th {
              font-weight: 700;
              text-align: center;
              background-color: #f1f5f9;
            }
            .kop-table td {
              border: none !important;
            }
            .sig-table td {
              border: none !important;
            }
            .badge-nfr {
              display: inline-block;
              padding: 1.5px 5px;
              border-radius: 3px;
              font-weight: 800;
              font-size: 7.5pt;
              text-align: center;
            }
            .badge-rendah { background-color: #dcfce7 !important; color: #15803d !important; }
            .badge-sedang { background-color: #fef9c3 !important; color: #854d0e !important; }
            .badge-tinggi { background-color: #ffedd5 !important; color: #c2410c !important; }
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

  // Helper untuk mengekstrak baris-baris cetak sesuai format formulir Google Spreadsheet
  const compilePrintRows = (): FlattenedPrintRow[] => {
    const flattened: FlattenedPrintRow[] = [];
    let actCounter = 0;

    items.forEach((hiradcDoc) => {
      const subList: IHiradcSubActivity[] =
        hiradcDoc.subActivities && hiradcDoc.subActivities.length > 0
          ? hiradcDoc.subActivities
          : [
              {
                id: `root-${hiradcDoc.id}`,
                activity: hiradcDoc.activity,
                location: hiradcDoc.location,
                activityType: hiradcDoc.activityType,
                selectedHazardTypes: hiradcDoc.selectedHazardTypes,
                hazardDetails: hiradcDoc.hazardDetails,
                hazardPhysics: hiradcDoc.hazardPhysics,
                hazardChemical: hiradcDoc.hazardChemical,
                hazardBiology: hiradcDoc.hazardBiology,
                hazardErgonomics: hiradcDoc.hazardErgonomics,
                hazardPsychosocial: hiradcDoc.hazardPsychosocial,
                riskImpact: hiradcDoc.riskImpact || hiradcDoc.risk || "-",
                controlDescription: hiradcDoc.controlDescription,
                currentElimination: hiradcDoc.currentElimination,
                currentSubstitution: hiradcDoc.currentSubstitution,
                currentEngineering: hiradcDoc.currentEngineering,
                currentAdministrative: hiradcDoc.currentAdministrative,
                currentApd: hiradcDoc.currentApd,
                currentLikelihood: hiradcDoc.currentLikelihood ?? hiradcDoc.likelihood ?? 3,
                currentSeverity: hiradcDoc.currentSeverity ?? hiradcDoc.severity ?? 3,
                currentNfr: hiradcDoc.currentNfr ?? hiradcDoc.riskScore ?? 9,
                currentRiskLevel: hiradcDoc.currentRiskLevel ?? "Sedang",
                controlDuration: hiradcDoc.controlDuration,
                controlStatus: hiradcDoc.controlStatus,
                responsiblePerson: hiradcDoc.responsiblePerson,
                targetDate: hiradcDoc.targetDate,
              },
            ];

      subList.forEach((sub) => {
        actCounter += 1;
        const currentLikelihood = sub.currentLikelihood || 3;
        const currentSeverity = sub.currentSeverity || 3;
        const currentNfr = sub.currentNfr || (currentLikelihood * currentSeverity);
        const currentRiskLevel = sub.currentRiskLevel || calculateNfrRiskLevel(currentNfr);

        const hazardRowsForThisSub: {
          deskripsi: string;
          isFisika: boolean;
          isKimia: boolean;
          isBiologi: boolean;
          isErgonomi: boolean;
          isPsikososial: boolean;
          risiko: string;
          dampak: string;
        }[] = [];

        // 1. Cek dari hazardRows (tabel Deskripsi Bahaya ke bawah, bisa centang > 1 jenis bahaya)
        if (sub.hazardRows && sub.hazardRows.length > 0) {
          sub.hazardRows.forEach((r) => {
            if (r.deskripsi && r.deskripsi.trim()) {
              const types = r.jenisBahaya || [];
              const risikoStr = (r.risikoList || []).filter(Boolean).join("; ");
              const dampakStr = (r.dampakList || []).filter(Boolean).join("; ");
              hazardRowsForThisSub.push({
                deskripsi: r.deskripsi.trim(),
                isFisika: types.includes("Fisika"),
                isKimia: types.includes("Kimia"),
                isBiologi: types.includes("Biologi"),
                isErgonomi: types.includes("Ergonomi"),
                isPsikososial: types.includes("Psikososial"),
                risiko: risikoStr || sub.riskImpact || "-",
                dampak: dampakStr || sub.riskImpact || "-",
              });
            }
          });
        }
        // 2. Fallback jika ada hazardDetails per kategori
        else if (sub.hazardDetails && Object.keys(sub.hazardDetails).length > 0) {
          const categories: HazardCategoryType[] = ["Fisika", "Kimia", "Biologi", "Ergonomi", "Psikososial"];
          categories.forEach((cat) => {
            const itemsInCat = sub.hazardDetails![cat] || [];
            itemsInCat.forEach((item) => {
              if (item.deskripsi && item.deskripsi.trim()) {
                const risikoStr = (item.risikoList || []).filter(Boolean).join("; ");
                const dampakStr = (item.dampakList || []).filter(Boolean).join("; ");
                hazardRowsForThisSub.push({
                  deskripsi: item.deskripsi.trim(),
                  isFisika: cat === "Fisika",
                  isKimia: cat === "Kimia",
                  isBiologi: cat === "Biologi",
                  isErgonomi: cat === "Ergonomi",
                  isPsikososial: cat === "Psikososial",
                  risiko: risikoStr || sub.riskImpact || "-",
                  dampak: dampakStr || sub.riskImpact || "-",
                });
              }
            });
          });
        }

        // 2. Fallback jika hazardDetails kosong: parsing dari 5 string field legacy
        if (hazardRowsForThisSub.length === 0) {
          const legacyItems: { key: keyof IHiradcSubActivity; cat: HazardCategoryType }[] = [
            { key: "hazardPhysics", cat: "Fisika" },
            { key: "hazardChemical", cat: "Kimia" },
            { key: "hazardBiology", cat: "Biologi" },
            { key: "hazardErgonomics", cat: "Ergonomi" },
            { key: "hazardPsychosocial", cat: "Psikososial" },
          ];

          legacyItems.forEach(({ key, cat }) => {
            const val = (sub[key] as string) || "";
            if (val && val !== "-" && val.trim()) {
              hazardRowsForThisSub.push({
                deskripsi: val.trim(),
                isFisika: cat === "Fisika",
                isKimia: cat === "Kimia",
                isBiologi: cat === "Biologi",
                isErgonomi: cat === "Ergonomi",
                isPsikososial: cat === "Psikososial",
                risiko: sub.riskImpact || "-",
                dampak: sub.riskImpact || "-",
              });
            }
          });
        }

        // 3. Fallback default jika masih kosong
        if (hazardRowsForThisSub.length === 0) {
          hazardRowsForThisSub.push({
            deskripsi: sub.activity || "Potensi bahaya pekerjaan",
            isFisika: true,
            isKimia: false,
            isBiologi: false,
            isErgonomi: false,
            isPsikososial: false,
            risiko: sub.riskImpact || "-",
            dampak: sub.riskImpact || "-",
          });
        }

        const totalRows = hazardRowsForThisSub.length;

        // Cek hirarki kontrol (centang jika dipilih atau ada nilainya)
        const checkControl = (name: string, legacyVal?: string) => {
          if (sub.selectedControls && sub.selectedControls.includes(name as any)) return true;
          if (legacyVal && legacyVal !== "-" && legacyVal.trim() !== "") return true;
          return false;
        };

        const isEliminasi = checkControl("Eliminasi", sub.currentElimination);
        const isSubstitusi = checkControl("Subtitusi", sub.currentSubstitution);
        const isEngineering = checkControl("Engineering Control", sub.currentEngineering);
        const isAdministrasi = checkControl("Administrasi", sub.currentAdministrative);
        const isApd = checkControl("APD", sub.currentApd);

        hazardRowsForThisSub.forEach((hItem, hIdx) => {
          flattened.push({
            activityIndex: actCounter,
            activityTitle: sub.activity,
            location: sub.location || hiradcDoc.location || "-",
            activityType: sub.activityType ? (sub.activityType.includes("Non") ? "NR" : "R") : "R",
            totalRowsForActivity: totalRows,
            isFirstRowOfActivity: hIdx === 0,

            deskripsiBahaya: hItem.deskripsi,
            isFisika: hItem.isFisika,
            isKimia: hItem.isKimia,
            isBiologi: hItem.isBiologi,
            isErgonomi: hItem.isErgonomi,
            isPsikososial: hItem.isPsikososial,
            risikoText: hItem.risiko,
            dampakText: hItem.dampak,

            controlDescription: sub.controlDescription || "-",
            isEliminasi,
            isSubstitusi,
            isEngineering,
            isAdministrasi,
            isApd,
            eliminasi: isEliminasi ? "✓" : "",
            substitusi: isSubstitusi ? "✓" : "",
            engineering: isEngineering ? "✓" : "",
            administrasi: isAdministrasi ? "✓" : "",
            apd: isApd ? "✓" : "",

            likelihood: currentLikelihood,
            severity: currentSeverity,
            nfr: currentNfr,
            riskLevel: currentRiskLevel,

            tenggat: sub.targetDate || hiradcDoc.targetDate || "-",
            status: sub.controlStatus || hiradcDoc.controlStatus || "Open",
            durasi: sub.controlDuration || hiradcDoc.controlDuration || "30 Hari",
            pic: sub.responsiblePerson || hiradcDoc.responsiblePerson || "Tim K3",
          });
        });
      });
    });

    return flattened;
  };

  const printRows = compilePrintRows();

  const getBadgeClass = (level: string) => {
    if (level === "Rendah") return "badge-nfr badge-rendah";
    if (level === "Sedang") return "badge-nfr badge-sedang";
    if (level === "Tinggi") return "badge-nfr badge-tinggi";
    return "badge-nfr badge-ekstrem";
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1280}
      style={{ top: 15 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 32 }}>
          <Space>
            <FilePdfOutlined style={{ color: "#ef4444", fontSize: 20 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                Format Cetak Formulir HIRADC (Persis Standar Google Spreadsheet K3)
              </div>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>
                Identifikasi Bahaya &amp; Risiko 5 Faktor, 5 Hirarki Pengendalian K3, Analisis NFR, dan Lembar Pengesahan
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
          style={{ background: "#0284c7", borderColor: "#0284c7", fontWeight: 700 }}
          onClick={handlePrint}
        >
          Cetak Dokumen (Landscape PDF)
        </Button>,
      ]}
    >
      {/* 1. Toolbar Editor Teks */}
      <div
        style={{
          background: "#f1f5f9",
          padding: "8px 12px",
          borderRadius: "6px 6px 0 0",
          border: "1px solid #cbd5e1",
          borderBottom: "none",
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
            ? "✍️ Mode Edit Aktif: Klik pada bagian teks/tabel untuk mengubah isi secara langsung"
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

      {/* 2. AREA DOKUMEN CETAK PERSIS FORMAT GOOGLE SPREADSHEET */}
      <div
        style={{
          maxHeight: "72vh",
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
            minWidth: "1150px",
            fontFamily: "Arial, sans-serif",
            color: "#0f172a",
            outline: "none",
            lineHeight: 1.35,
          }}
        >
          {/* HEADER FORMULIR PERSIS SHEET (BARIS 1 - 5) */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: "11pt", fontWeight: 900, letterSpacing: 1.5, color: "#1e293b" }}>
              FORMULIR
            </div>
            <div style={{ fontSize: "13pt", fontWeight: 900, color: "#0f172a", marginTop: 2, letterSpacing: 0.5 }}>
              HAZARD IDENTIFICATION RISK ASSESSMENT AND DETERMINING CONTROL (HIRADC)
            </div>
            <div style={{ fontSize: "9pt", fontWeight: 700, color: "#0284c7", marginTop: 2 }}>
              SISTEM MANAJEMEN KESELAMATAN DAN KESEHATAN KERJA (SMK3 PP 50/2012 / ISO 45001)
            </div>
          </div>

          {/* INFORMASI HEADER DOKUMEN PERSIS BARIS B10 - B12 SPREADSHEET */}
          <table
            style={{
              width: "100%",
              marginBottom: 10,
              fontSize: "8.5pt",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
            }}
          >
            <tbody>
              <tr>
                <td style={{ width: "130px", fontWeight: 700, padding: "4px 8px", border: "none" }}>Unit Kerja</td>
                <td style={{ width: "15px", padding: "4px 0", border: "none" }}>:</td>
                <td style={{ fontWeight: 800, padding: "4px 8px", border: "none", color: "#0f172a" }}>
                  {unitKerja}
                </td>
                <td style={{ width: "160px", fontWeight: 700, padding: "4px 8px", border: "none" }}>No. Dokumen</td>
                <td style={{ width: "15px", padding: "4px 0", border: "none" }}>:</td>
                <td style={{ padding: "4px 8px", border: "none" }}>ANRI-K3-HIRADC-2026</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>Tanggal Penilaian</td>
                <td style={{ padding: "4px 0", border: "none" }}>:</td>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>{tglPenilaian}</td>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>Status Dokumen</td>
                <td style={{ padding: "4px 0", border: "none" }}>:</td>
                <td style={{ padding: "4px 8px", border: "none", color: "#166534", fontWeight: 700 }}>
                  Terkendali / Resmi
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>Pemeriksa</td>
                <td style={{ padding: "4px 0", border: "none" }}>:</td>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>{timPemeriksa}</td>
                <td style={{ fontWeight: 700, padding: "4px 8px", border: "none" }}>Kegiatan Induk</td>
                <td style={{ padding: "4px 0", border: "none" }}>:</td>
                <td style={{ padding: "4px 8px", border: "none", fontWeight: 700 }}>
                  {firstItem?.parentActivity || firstItem?.activity || "Penataan Arsip"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* TABEL 23 KOLOM PERSIS PADA GOOGLE SPREADSHEET */}
          <table
            className="hiradc-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "7.5pt",
              marginBottom: 8,
              border: "1.5px solid #000",
            }}
          >
            <thead>
              {/* Row Header 1 */}
              <tr style={{ background: "#e2e8f0", textAlign: "center" }}>
                <th rowSpan={3} style={{ width: "25px", border: "1px solid #000" }}>No</th>
                <th rowSpan={3} style={{ width: "130px", border: "1px solid #000" }}>Aktivitas / Proses Kerja</th>
                <th rowSpan={3} style={{ width: "85px", border: "1px solid #000" }}>Lokasi</th>
                <th rowSpan={3} style={{ width: "45px", border: "1px solid #000" }}>Rutin (R)/<br/>Non Rutin (NR)</th>
                <th rowSpan={3} style={{ width: "140px", border: "1px solid #000" }}>Deskripsi Bahaya</th>
                <th colSpan={7} style={{ border: "1px solid #000", background: "#fef3c7" }}>
                  IDENTIFIKASI BAHAYA DAN RISIKO
                </th>
                <th rowSpan={3} style={{ width: "105px", border: "1px solid #000", background: "#dbeafe" }}>
                  Deskripsi Pengendalian
                </th>
                <th colSpan={8} style={{ border: "1px solid #000", background: "#dbeafe" }}>
                  PENGENDALIAN
                </th>
                <th rowSpan={3} style={{ width: "70px", border: "1px solid #000" }}>Tenggat Upaya Tindak Lanjut</th>
                <th rowSpan={3} style={{ width: "50px", border: "1px solid #000" }}>Status<br/>Tindak Lanjut</th>
              </tr>

              {/* Row Header 2 */}
              <tr style={{ textAlign: "center" }}>
                {/* Di bawah Identifikasi Bahaya dan Risiko */}
                <th colSpan={5} style={{ border: "1px solid #000", background: "#fffbeb" }}>
                  Jenis Bahaya
                </th>
                <th rowSpan={2} style={{ width: "105px", border: "1px solid #000", background: "#fef3c7" }}>
                  Risiko
                </th>
                <th rowSpan={2} style={{ width: "105px", border: "1px solid #000", background: "#fef3c7" }}>
                  Dampak
                </th>

                {/* Di bawah Pengendalian */}
                <th colSpan={5} style={{ border: "1px solid #000", background: "#eff6ff" }}>
                  Pengendalian
                </th>
                <th colSpan={3} style={{ border: "1px solid #000", background: "#eff6ff" }}>
                  Analisis Risiko
                </th>
              </tr>

              {/* Row Header 3 */}
              <tr style={{ background: "#f8fafc", textAlign: "center", fontSize: "7pt" }}>
                {/* 5 Kolom Jenis Bahaya */}
                <th style={{ border: "1px solid #000", width: "32px", background: "#eff6ff" }}>Fisika</th>
                <th style={{ border: "1px solid #000", width: "32px", background: "#f5f3ff" }}>Kimia</th>
                <th style={{ border: "1px solid #000", width: "32px", background: "#ecfdf5" }}>Biologi</th>
                <th style={{ border: "1px solid #000", width: "35px", background: "#fffbeb" }}>Ergonomi</th>
                <th style={{ border: "1px solid #000", width: "38px", background: "#fdf2f8" }}>Pskososial</th>

                {/* 5 Hirarki Pengendalian */}
                <th style={{ border: "1px solid #000", width: "50px" }}>Eliminasi</th>
                <th style={{ border: "1px solid #000", width: "50px" }}>Subtitusi</th>
                <th style={{ border: "1px solid #000", width: "65px" }}>Engineering Control</th>
                <th style={{ border: "1px solid #000", width: "65px" }}>Administrasi</th>
                <th style={{ border: "1px solid #000", width: "55px" }}>APD</th>

                {/* 3 Kolom Analisis Risiko */}
                <th style={{ border: "1px solid #000", width: "26px" }}>Kemungkinan (L)</th>
                <th style={{ border: "1px solid #000", width: "26px" }}>Keparahan (S)</th>
                <th style={{ border: "1px solid #000", width: "36px" }}>Nilai Faktor Risiko (NFR)</th>
              </tr>
            </thead>

            <tbody>
              {printRows.map((row, rIdx) => {
                return (
                  <tr key={rIdx} style={{ verticalAlign: "top" }}>
                    {/* No (rowSpan jika baris pertama aktivitas) */}
                    {row.isFirstRowOfActivity ? (
                      <td
                        rowSpan={row.totalRowsForActivity}
                        style={{
                          textAlign: "center",
                          fontWeight: 800,
                          border: "1px solid #000",
                          background: "#f8fafc",
                        }}
                      >
                        {row.activityIndex}
                      </td>
                    ) : null}

                    {/* Aktivitas / Proses Kerja (rowSpan) */}
                    {row.isFirstRowOfActivity ? (
                      <td
                        rowSpan={row.totalRowsForActivity}
                        style={{
                          border: "1px solid #000",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {row.activityTitle}
                      </td>
                    ) : null}

                    {/* Lokasi (rowSpan) */}
                    {row.isFirstRowOfActivity ? (
                      <td
                        rowSpan={row.totalRowsForActivity}
                        style={{
                          border: "1px solid #000",
                          fontSize: "7pt",
                        }}
                      >
                        {row.location}
                      </td>
                    ) : null}

                    {/* Rutin / Non-Rutin (rowSpan) */}
                    {row.isFirstRowOfActivity ? (
                      <td
                        rowSpan={row.totalRowsForActivity}
                        style={{
                          textAlign: "center",
                          border: "1px solid #000",
                          fontWeight: 700,
                        }}
                      >
                        {row.activityType}
                      </td>
                    ) : null}

                    {/* Deskripsi Bahaya */}
                    <td style={{ border: "1px solid #000", fontWeight: 600 }}>
                      {row.deskripsiBahaya}
                    </td>

                    {/* 5 Kolom Centang Jenis Bahaya */}
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#1d4ed8" }}>
                      {row.isFisika ? "✓" : ""}
                    </td>
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#7c3aed" }}>
                      {row.isKimia ? "✓" : ""}
                    </td>
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#059669" }}>
                      {row.isBiologi ? "✓" : ""}
                    </td>
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#d97706" }}>
                      {row.isErgonomi ? "✓" : ""}
                    </td>
                    <td style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#db2777" }}>
                      {row.isPsikososial ? "✓" : ""}
                    </td>

                    {/* Risiko */}
                    <td style={{ border: "1px solid #000", color: "#b91c1c", fontSize: "7pt" }}>
                      {row.risikoText}
                    </td>

                    {/* Dampak */}
                    <td style={{ border: "1px solid #000", color: "#c2410c", fontSize: "7pt" }}>
                      {row.dampakText}
                    </td>

                    {/* Deskripsi Pengendalian (rowSpan per aktivitas) */}
                    {row.isFirstRowOfActivity ? (
                      <td
                        rowSpan={row.totalRowsForActivity}
                        style={{
                          border: "1px solid #000",
                          fontSize: "7pt",
                        }}
                      >
                        {row.controlDescription}
                      </td>
                    ) : null}

                    {/* 5 Hirarki Pengendalian (rowSpan per aktivitas) - Centang Saja */}
                    {row.isFirstRowOfActivity ? (
                      <>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#166534", fontSize: "9pt" }}
                        >
                          {row.isEliminasi ? "✓" : ""}
                        </td>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#0891b2", fontSize: "9pt" }}
                        >
                          {row.isSubstitusi ? "✓" : ""}
                        </td>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#2563eb", fontSize: "9pt" }}
                        >
                          {row.isEngineering ? "✓" : ""}
                        </td>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#ea580c", fontSize: "9pt" }}
                        >
                          {row.isAdministrasi ? "✓" : ""}
                        </td>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{ textAlign: "center", border: "1px solid #000", fontWeight: 900, color: "#9333ea", fontSize: "9pt" }}
                        >
                          {row.isApd ? "✓" : ""}
                        </td>
                        <td rowSpan={row.totalRowsForActivity} style={{ textAlign: "center", border: "1px solid #000", fontWeight: 700 }}>
                          {row.likelihood}
                        </td>
                        <td rowSpan={row.totalRowsForActivity} style={{ textAlign: "center", border: "1px solid #000", fontWeight: 700 }}>
                          {row.severity}
                        </td>
                        <td rowSpan={row.totalRowsForActivity} style={{ textAlign: "center", border: "1px solid #000" }}>
                          <span className={getBadgeClass(row.riskLevel)}>{row.nfr}</span>
                          <div style={{ fontSize: "6.5pt", marginTop: 1, fontWeight: 700 }}>{row.riskLevel}</div>
                        </td>
                        <td rowSpan={row.totalRowsForActivity} style={{ border: "1px solid #000", fontSize: "7pt", textAlign: "center" }}>
                          {row.tenggat}
                        </td>
                        <td
                          rowSpan={row.totalRowsForActivity}
                          style={{
                            textAlign: "center",
                            border: "1px solid #000",
                            fontWeight: 800,
                            color: row.status === "Close" ? "#166534" : "#c2410c",
                          }}
                        >
                          {row.status}
                        </td>
                      </>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* CATATAN KETERANGAN PERSIS BARIS 39 - 40 PADA GOOGLE SPREADSHEET */}
          <div
            style={{
              fontSize: "7.5pt",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              padding: "6px 10px",
              borderRadius: 4,
              marginBottom: 14,
              lineHeight: 1.5,
            }}
          >
            <div>
              <strong>Status Pengendalian:</strong> Pengendalian lanjutan yang sudah dikerjakan (Close, Open)
            </div>
            <div>
              <strong>Durasi Pengendalian:</strong> Waktu maksimal pengendalian lanjutan dikerjakan (7 Hari, 14 Hari, 30 Hari, 3 Bulan, 12 Bulan)
            </div>
            <div style={{ marginTop: 3 }}>
              <strong>Keterangan Matriks Nilai Faktor Risiko (NFR = L × S):</strong>{" "}
              <span style={{ color: "#15803d", fontWeight: 700 }}>● Rendah (1-2)</span> &nbsp;|&nbsp;{" "}
              <span style={{ color: "#854d0e", fontWeight: 700 }}>● Sedang (3-4)</span> &nbsp;|&nbsp;{" "}
              <span style={{ color: "#c2410c", fontWeight: 700 }}>● Tinggi (5-12)</span> &nbsp;|&nbsp;{" "}
              <span style={{ color: "#b91c1c", fontWeight: 700 }}>● Sangat Tinggi (15-25)</span>
            </div>
          </div>

          {/* LEMBAR PENGESAHAN RESMI (TANDA TANGAN) */}
          <table className="sig-table" style={{ width: "100%", marginTop: "14px", fontSize: "8.5pt" }}>
            <tbody>
              <tr>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Disiapkan Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Pemeriksa / Tim Penilai K3</div>
                  <div style={{ height: "48px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>({timPemeriksa})</div>
                  <div style={{ fontSize: "7.5pt", color: "#64748b" }}>Tanggal: {tglPenilaian}</div>
                </td>
                <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Diperiksa Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Ketua Tim K3 ANRI</div>
                  <div style={{ height: "48px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Ir. Hendra Gunawan, M.Si)</div>
                  <div style={{ fontSize: "7.5pt", color: "#64748b" }}>NIP. 19780512 200212 1 002</div>
                </td>
                <td style={{ width: "34%", textAlign: "center", verticalAlign: "top" }}>
                  <div>Disetujui Oleh,</div>
                  <div style={{ fontWeight: 700, color: "#475569" }}>Kepala Unit Kerja / Pimpinan</div>
                  <div style={{ height: "48px" }}></div>
                  <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Dr. Budi Santoso, M.Hum)</div>
                  <div style={{ fontSize: "7.5pt", color: "#64748b" }}>NIP. 19710315 199803 1 001</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
