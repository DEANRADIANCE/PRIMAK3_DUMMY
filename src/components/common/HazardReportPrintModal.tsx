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
  FilePdfOutlined,
} from "@ant-design/icons";
import { IHazardReport } from "../../types/hazard";

interface HazardReportPrintModalProps {
  open: boolean;
  onClose: () => void;
  items: IHazardReport[];
  documentTitle?: string;
}

export const HazardReportPrintModal: React.FC<HazardReportPrintModalProps> = ({
  open,
  onClose,
  items,
  documentTitle = "LAPORAN BAHAYA & RISIKO K3",
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml, setInitialHtml] = useState<string>("");

  const isSingle = items.length === 1;
  const singleItem = items[0];

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
    const orientation = isSingle ? "portrait" : "landscape";
    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle} - ANRI</title>
          <style>
            @page {
              size: A4 ${orientation};
              margin: 10mm 12mm;
            }
            body {
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 9pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 10px;
            }
            th, td {
              border: 1px solid #334155;
              padding: 5px 8px;
              vertical-align: top;
            }
            th {
              background-color: #f1f5f9 !important;
              font-weight: 700;
            }
            .borderless-table td {
              border: none !important;
            }
            .sig-table td {
              border: none !important;
            }
            .badge-status {
              display: inline-block;
              padding: 2px 7px;
              border-radius: 4px;
              font-weight: 700;
              font-size: 8pt;
              text-transform: uppercase;
            }
            .badge-reported { background-color: #fef3c7 !important; color: #92400e !important; }
            .badge-verified { background-color: #e0f2fe !important; color: #0369a1 !important; }
            .badge-in_progress { background-color: #fed7aa !important; color: #9a3412 !important; }
            .badge-resolved { background-color: #dcfce7 !important; color: #166534 !important; }
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

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "near_miss":
        return "Near Miss (Hampir Celaka)";
      case "unsafe_action":
        return "Unsafe Action (Tindakan Tidak Aman)";
      case "unsafe_condition":
        return "Unsafe Condition (Kondisi Tidak Aman)";
      case "fire_hazard":
        return "Bahaya Kebakaran";
      case "ergonomic_hazard":
        return "Bahaya Ergonomi";
      default:
        return cat || "Umum";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>DILAPORKAN</span>;
      case "verified":
        return <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>DIVERIFIKASI</span>;
      case "in_progress":
        return <span style={{ background: "#fed7aa", color: "#9a3412", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>TINDAK LANJUT</span>;
      case "resolved":
        return <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>SELESAI (RESOLVED)</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={isSingle ? 900 : 1200}
      style={{ top: 15 }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 32 }}>
          <Space>
            <FilePdfOutlined style={{ color: "#ef4444", fontSize: 20 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
                Format Cetak Dokumen Laporan Bahaya &amp; Risiko
              </div>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>
                Dilengkapi Text Editor interaktif untuk mengubah isi dokumen sebelum diekspor ke PDF
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
          Cetak Dokumen ({isSingle ? "Portrait PDF" : "Landscape PDF"})
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
            ? "✍️ Mode Edit Aktif: Klik pada bagian teks dokumen di bawah untuk mengubah isi secara langsung"
            : "👁️ Mode Pratinjau Cetak"}
        </Tag>
      </div>

      {isEditMode && (
        <Alert
          type="info"
          showIcon
          message="Petunjuk Text Editor Dokumen"
          description="Anda dapat langsung mengubah teks deskripsi temuan, menambah catatan rekomendasi, atau mengedit nama penandatangan sebelum mencetak ke PDF."
          style={{ marginBottom: 12, borderRadius: 8 }}
        />
      )}

      {/* 2. AREA DOKUMEN CETAK */}
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          padding: "24px",
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
            minWidth: isSingle ? "700px" : "1050px",
            fontFamily: "Arial, sans-serif",
            color: "#0f172a",
            outline: "none",
            lineHeight: 1.5,
          }}
        >
          {/* KOP RESMI DOKUMEN ARSIP NASIONAL REPUBLIK INDONESIA */}
          <table className="borderless-table" style={{ width: "100%", borderBottom: "2px solid #0f172a", marginBottom: 14 }}>
            <tbody>
              <tr>
                <td style={{ width: "65px", textAlign: "center", verticalAlign: "middle", padding: "0 10px 10px 0" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "#0f172a",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 15,
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
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#0284c7" }}>
                    SISTEM MANAJEMEN KESELAMATAN DAN KESEHATAN KERJA (SMK3 PP 50/2012)
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 900, color: "#b91c1c", marginTop: 2 }}>
                    {isSingle
                      ? "BERITA ACARA LAPORAN TEMUAN POTENSI BAHAYA DAN RISIKO (HAZARD REPORT)"
                      : "REKAPITULASI LAPORAN POTENSI BAHAYA DAN RISIKO K3 (HAZARD REGISTER)"}
                  </div>
                </td>
                <td style={{ width: "220px", textAlign: "right", verticalAlign: "middle", fontSize: 9, color: "#475569", paddingBottom: "10px" }}>
                  <div><strong>No. Format:</strong> ANRI-K3-HAZ-F01</div>
                  <div><strong>Status:</strong> Terkendali / Resmi</div>
                  <div><strong>Tanggal:</strong> {new Date().toLocaleDateString("id-ID")}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* JIKA CETAK 1 LAPORAN SPESIFIK (SINGLE DETAIL) */}
          {isSingle && singleItem && (
            <div>
              {/* TABEL METADATA */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", marginBottom: 14 }}>
                <tbody>
                  <tr>
                    <td style={{ width: "22%", background: "#f8fafc", fontWeight: 700 }}>Nomor Laporan</td>
                    <td style={{ width: "28%" }}><strong>{singleItem.reportNumber}</strong></td>
                    <td style={{ width: "22%", background: "#f8fafc", fontWeight: 700 }}>Tanggal Temuan</td>
                    <td style={{ width: "28%" }}>{singleItem.date}</td>
                  </tr>
                  <tr>
                    <td style={{ background: "#f8fafc", fontWeight: 700 }}>Unit Kerja Terkait</td>
                    <td>{singleItem.unit}</td>
                    <td style={{ background: "#f8fafc", fontWeight: 700 }}>Kategori Bahaya</td>
                    <td><strong>{getCategoryLabel(singleItem.category)}</strong></td>
                  </tr>
                  <tr>
                    <td style={{ background: "#f8fafc", fontWeight: 700 }}>Lokasi Kejadian</td>
                    <td>{singleItem.location}</td>
                    <td style={{ background: "#f8fafc", fontWeight: 700 }}>Pelapor</td>
                    <td>{singleItem.reporterName}</td>
                  </tr>
                  <tr>
                    <td style={{ background: "#f8fafc", fontWeight: 700 }}>Status Penanganan</td>
                    <td colSpan={3}>{getStatusBadge(singleItem.status)}</td>
                  </tr>
                </tbody>
              </table>

              {/* URAIAN TEMUAN & DAMPAK */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: "10pt", color: "#0f172a", marginBottom: 6 }}>
                  A. Deskripsi Temuan Bahaya &amp; Kondisi di Lapangan:
                </div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: "9.5pt",
                    lineHeight: 1.6,
                  }}
                >
                  {singleItem.description}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: "10pt", color: "#b91c1c", marginBottom: 6 }}>
                  B. Potensi Dampak / Risiko yang Dapat Ditimbulkan:
                </div>
                <div
                  style={{
                    background: "#fff1f2",
                    border: "1px solid #fecaca",
                    padding: "10px 14px",
                    borderRadius: 6,
                    fontSize: "9.5pt",
                    color: "#991b1b",
                    fontWeight: 600,
                  }}
                >
                  {singleItem.potentialImpact}
                </div>
              </div>

              {/* RIWAYAT TINDAK LANJUT / STATUS HISTORY */}
              {singleItem.statusHistory && singleItem.statusHistory.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: "10pt", color: "#0f172a", marginBottom: 6 }}>
                    C. Riwayat Tindak Lanjut &amp; Verifikasi Tim K3:
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8.5pt" }}>
                    <thead>
                      <tr style={{ background: "#f1f5f9" }}>
                        <th style={{ width: "35px", textAlign: "center" }}>No</th>
                        <th style={{ width: "130px" }}>Tahapan Status</th>
                        <th style={{ width: "160px" }}>Petugas / Validator</th>
                        <th style={{ width: "130px" }}>Waktu Tindak Lanjut</th>
                        <th>Catatan &amp; Tindakan Perbaikan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleItem.statusHistory.map((hist, idx) => (
                        <tr key={idx}>
                          <td style={{ textAlign: "center" }}>{idx + 1}</td>
                          <td><strong>{hist.status}</strong></td>
                          <td>{hist.changedBy}</td>
                          <td>{hist.changedAt}</td>
                          <td>{hist.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FOTO BUKTI TEMUAN */}
              {singleItem.photos && singleItem.photos.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: "10pt", color: "#0f172a", marginBottom: 6 }}>
                    D. Foto Bukti Temuan Lapangan:
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {singleItem.photos.map((p, idx) => (
                      <div key={idx} style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: 4 }}>
                        <img
                          src={p}
                          alt={`Bukti Temuan ${idx + 1}`}
                          style={{ width: "190px", height: "130px", objectFit: "cover", borderRadius: 4 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEMBAR PENGESAHAN */}
              <table className="sig-table" style={{ width: "100%", marginTop: "24px", fontSize: "9pt" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Dilaporkan Oleh,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Petugas / Pegawai Pelapor</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>({singleItem.reporterName})</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>Tanggal: {singleItem.date}</div>
                    </td>
                    <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Diverifikasi Oleh,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Petugas / Tim K3 ANRI</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Siti Rahmawati, S.Tr.K3)</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19850614 201012 2 001</div>
                    </td>
                    <td style={{ width: "34%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Mengetahui,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Kepala Unit Kerja Terkait</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Dr. Budi Santoso, M.Hum)</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19710315 199803 1 001</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* JIKA CETAK BANYAK LAPORAN (REKAPITULASI HAZARD REGISTER) */}
          {!isSingle && (
            <div>
              <div style={{ marginBottom: 12, fontSize: "9pt", color: "#475569" }}>
                Daftar rekapitulasi temuan potensi bahaya, unsafe action, unsafe condition, dan near miss di lingkungan Arsip Nasional Republik Indonesia.
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", marginBottom: 14 }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "center" }}>
                    <th style={{ width: "25px" }}>No</th>
                    <th style={{ width: "95px" }}>No. Laporan</th>
                    <th style={{ width: "70px" }}>Tanggal</th>
                    <th style={{ width: "120px" }}>Unit Kerja</th>
                    <th style={{ width: "110px" }}>Lokasi</th>
                    <th style={{ width: "110px" }}>Kategori</th>
                    <th>Deskripsi Potensi Bahaya</th>
                    <th style={{ width: "160px" }}>Potensi Dampak</th>
                    <th style={{ width: "90px" }}>Pelapor</th>
                    <th style={{ width: "80px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r, idx) => (
                    <tr key={r.id || idx}>
                      <td style={{ textAlign: "center" }}>{idx + 1}</td>
                      <td><strong>{r.reportNumber}</strong></td>
                      <td>{r.date}</td>
                      <td>{r.unit}</td>
                      <td>{r.location}</td>
                      <td>{getCategoryLabel(r.category)}</td>
                      <td>{r.description}</td>
                      <td style={{ color: "#b91c1c", fontWeight: 600 }}>{r.potentialImpact}</td>
                      <td>{r.reporterName}</td>
                      <td style={{ textAlign: "center" }}>{getStatusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table className="sig-table" style={{ width: "100%", marginTop: "24px", fontSize: "9pt" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Disusun Oleh,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Tim Pengawas K3 ANRI</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Ahmad Fauzi)</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>Koordinator Pelaporan K3</div>
                    </td>
                    <td style={{ width: "33%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Diperiksa Oleh,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Ketua Tim K3 ANRI</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Ir. Hendra Gunawan, M.Si)</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19780512 200212 1 002</div>
                    </td>
                    <td style={{ width: "34%", textAlign: "center", verticalAlign: "top" }}>
                      <div>Menyetujui,</div>
                      <div style={{ fontWeight: 700, color: "#475569" }}>Kepala Biro Umum &amp; Keuangan</div>
                      <div style={{ height: "55px" }}></div>
                      <div style={{ fontWeight: 700, textDecoration: "underline" }}>(Dr. Budi Santoso, M.Hum)</div>
                      <div style={{ fontSize: "8pt", color: "#64748b" }}>NIP. 19710315 199803 1 001</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
