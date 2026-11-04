import React from "react";
import { Modal, Table, Tabs, Typography, Button, Space, Tag, Alert, Card, Row, Col } from "antd";
import {
  InfoCircleOutlined,
  TableOutlined,
  FileTextOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { calculateNfrRiskLevel, NfrRiskLevel } from "../../types/hiradc";

const { Title, Text, Paragraph } = Typography;

interface RiskMatrixModalProps {
  open: boolean;
  onClose: () => void;
  selectedLikelihood?: number;
  selectedSeverity?: number;
}

export const RiskMatrixModal: React.FC<RiskMatrixModalProps> = ({
  open,
  onClose,
  selectedLikelihood,
  selectedSeverity,
}) => {
  // 1. Data Likelihood (Frekuensi Kemungkinan) - Sesuai Sheet 2 Matrix
  const likelihoodCriteria = [
    {
      level: 1,
      name: "Sangat Jarang terjadi",
      frequency: "1 kali dalam 5 tahun",
      description:
        "Suatu insiden hampir tidak pernah terjadi atau mungkin dapat terjadi pada suatu kondisi luar biasa, terjadi dari 1 kali dalam 5 tahun.",
    },
    {
      level: 2,
      name: "Jarang terjadi",
      frequency: "1 kali dalam 1-5 tahun",
      description:
        "Suatu kejadian mungkin atau pernah terjadi pada beberapa kondisi tertentu, namun kecil kemungkinan terjadinya, terjadi 1 kali dalam 1-5 tahun.",
    },
    {
      level: 3,
      name: "Dapat terjadi",
      frequency: "1 kali dalam 1 tahun",
      description:
        "Suatu kejadian akan terjadi pada beberapa kondisi tertentu, terjadi dalam kurun waktu 1 kali dalam 1 tahun.",
    },
    {
      level: 4,
      name: "Sering terjadi",
      frequency: "Beberapa kali dalam 1 tahun",
      description:
        "Suatu kejadian mungkin akan terjadi pada hampir semua kondisi, terjadi beberapa kali dalam 1 tahun.",
    },
    {
      level: 5,
      name: "Sangat sering terjadi",
      frequency: "Beberapa kali seminggu / tiap hari",
      description:
        "Suatu kejadian akan terjadi pada semua kondisi, terjadi beberapa kali dalam seminggu atau setiap hari.",
    },
  ];

  // 2. Data Severity (Keparahan / Kerugian / Kerusakan) - Sesuai Sheet 2 Matrix
  const severityCriteria = [
    {
      level: 1,
      name: "Dampak Kecil / P3K",
      description:
        "Hampir tidak ada risiko cedera, berdampak kecil pada K3, memerlukan P3K tetapi pekerja dapat bekerja. No lost time injury.",
    },
    {
      level: 2,
      name: "Cedera / Sakit Sedang",
      description:
        "Cidera/sakit sedang, perlu perawatan medis. Pekerja dapat bekerja kembali tetapi terjadi penurunan performa.",
    },
    {
      level: 3,
      name: "Kehilangan Waktu Kerja",
      description:
        "Cidera/sakit yang memerlukan perawatan khusus sehingga mengakibatkan kehilangan waktu kerja (Lost Time Injury).",
    },
    {
      level: 4,
      name: "Cacat Fisik / Fatal Tunggal",
      description: "Meninggal atau cacat fisik permanen karena pekerjaan.",
    },
    {
      level: 5,
      name: "Katastropik / Fatalitas Ganda",
      description:
        "Meninggal lebih dari satu orang atau cedera cacat permanen lebih satu orang akibat dari pekerjaan.",
    },
  ];

  // 3. Data Tingkat Resiko & Tindakan NFR (Nilai Faktor Resiko) - Sesuai Sheet 2 Matrix
  const nfrActionCriteria = [
    {
      level: "RENDAH",
      range: "1 - 2",
      color: "#22c55e",
      tagColor: "green",
      bg: "#f0fdf4",
      action: "Tidak diperlukan tindakan.",
      timeframe: "Standar operasional rutin",
    },
    {
      level: "SEDANG",
      range: "3 - 4",
      color: "#0284c7",
      tagColor: "blue",
      bg: "#f0f9ff",
      action:
        "Tidak diperlukan tindakan tambahan. Memerlukan pemantauan (patrol) untuk memastikan pengendalian yang ada dipelihara.",
      timeframe: "Pemantauan rutin berkala",
    },
    {
      level: "TINGGI",
      range: "5 - 12",
      color: "#f59e0b",
      tagColor: "gold",
      bg: "#fffbeb",
      action:
        "Harus melakukan tindakan untuk menurunkan tingkat risiko. Pengukuran pengurangan risiko harus diterapkan dalam periode waktu tertentu (12 bulan).",
      timeframe: "Maksimal 12 Bulan",
    },
    {
      level: "SANGAT TINGGI",
      range: "15 - 25",
      color: "#ef4444",
      tagColor: "red",
      bg: "#fef2f2",
      action:
        "Pekerjaan sebaiknya tidak dilakukan sampai tingkat risiko diturunkan. Penggunaan sumberdaya dapat dipertimbangkan untuk dialokasikan dalam menurunkan risiko. Bila risiko melibatkan pekerjaan yang sedang berlangsung, perlu diambil tindakan segera. Jika risiko tidak mungkin diturunkan sekalipun dengan sumberdaya yang tidak terbatas, pekerjaan dihentikan dan tidak boleh dilakukan (dalam waktu 7 hari, minimum pengendalian administratif harus dilakukan).",
      timeframe: "Tindakan Segera (Maksimal 7 Hari)",
    },
  ];

  // 4. Data 5 Faktor Hazard di Tempat Kerja - Sesuai Sheet 3 Hazard
  const hazardReferenceData = [
    {
      key: "1",
      no: "1",
      factor: "Faktor Fisika",
      type: "Bising",
      example: "Suara mesin",
    },
    {
      key: "2",
      no: "",
      factor: "Faktor Fisika",
      type: "Tekanan panas / suhu ekstrim",
      example: "Bekerja di suhu minus atau ruang panas pengering",
    },
    {
      key: "3",
      no: "",
      factor: "Faktor Fisika",
      type: "Getaran",
      example: "Getaran seluruh tubuh misalnya getaran segmental misalnya pekerjaan menggunakan bor / alat pemadat",
    },
    {
      key: "4",
      no: "",
      factor: "Faktor Fisika",
      type: "Radiasi",
      example: "Sinar UV, radiasi elektromagnetik, sinar-X sterilisasi arsip, dll",
    },
    {
      key: "5",
      no: "2",
      factor: "Faktor Kimia",
      type: "Berbagai jenis bahan kimia",
      example: "Basa kuat, asam kuat, pelarut organik (solvent), fumigan phosphine",
    },
    {
      key: "6",
      no: "",
      factor: "Faktor Kimia",
      type: "Debu",
      example: "Debu organik partikel kertas kuno, debu anorganik bangunan",
    },
    {
      key: "7",
      no: "3",
      factor: "Faktor Biologi",
      type: "Bakteri",
      example: "Bekerja di klinik, bekerja di lab restorasi/mikrobiologi",
    },
    {
      key: "8",
      no: "",
      factor: "Faktor Biologi",
      type: "Virus",
      example: "Bekerja di klinik, bekerja di lab pengujian",
    },
    {
      key: "9",
      no: "",
      factor: "Faktor Biologi",
      type: "Jamur",
      example: "Bekerja di lab restorasi kertas kuno berjamur, perkebunan",
    },
    {
      key: "10",
      no: "",
      factor: "Faktor Biologi",
      type: "Parasit & Kutu",
      example: "Kutu buku, serangga perusak kertas, hewan pengerat depo arsip",
    },
    {
      key: "11",
      no: "4",
      factor: "Faktor Ergonomi",
      type: "Manual handling & lifting",
      example: "Kegiatan angkat angkut boks arsip berat secara manual",
    },
    {
      key: "12",
      no: "",
      factor: "Faktor Ergonomi",
      type: "Awkward position (posisi janggal)",
      example: "Bekerja dengan posisi yang tidak sesuai ergonomis tubuh, misalnya tangan terangkat, membungkuk terus-menerus",
    },
    {
      key: "13",
      no: "",
      factor: "Faktor Ergonomi",
      type: "Gerakan repetitif",
      example: "Gerakan berulang, misalnya mengetik berjam-jam, memukul menggunakan palu",
    },
    {
      key: "14",
      no: "",
      factor: "Faktor Ergonomi",
      type: "Manual grip (menggenggam)",
      example: "Memegang benda kerja dengan kuat seperti gunting preservasi, obeng, stang troli",
    },
    {
      key: "15",
      no: "",
      factor: "Faktor Ergonomi",
      type: "Pencahayaan",
      example: "Pengaturan cahaya kurang di depo, silau di layar komputer kantor",
    },
    {
      key: "16",
      no: "5",
      factor: "Faktor Psikososial",
      type: "Stress kerja",
      example: "Tuntutan kerja tinggi, tenggat waktu mendesak",
    },
    {
      key: "17",
      no: "",
      factor: "Faktor Psikososial",
      type: "Kesehatan Mental & Relasi Kerja",
      example: "Sistem shift kerja bergilir, hubungan kerja atasan atau bawahan, beban kerja ganda",
    },
  ];

  // Fungsi penentuan warna sel matriks sesuai Sheet 2 Matrix (Excel RGB: Hijau, Biru, Kuning, Merah)
  const getCellMatrixInfo = (l: number, s: number) => {
    const score = l * s;
    if (score <= 2) {
      return {
        score,
        level: "Rendah",
        bg: "#dcfce7",
        textColor: "#15803d",
        border: "#86efac",
      };
    }
    if (score <= 4) {
      return {
        score,
        level: "Sedang",
        bg: "#e0f2fe",
        textColor: "#0369a1",
        border: "#7dd3fc",
      };
    }
    if (score <= 12) {
      return {
        score,
        level: "Tinggi",
        bg: "#fef9c3",
        textColor: "#a16207",
        border: "#fde047",
      };
    }
    return {
      score,
      level: "Sangat Tinggi",
      bg: "#fee2e2",
      textColor: "#b91c1c",
      border: "#fca5a5",
    };
  };

  // TAB 1: MATRIKS 5x5 & TINDAKAN PENGENDALIAN
  const matrixTab = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <Paragraph style={{ margin: "0 0 10px 0", color: "#475569", fontSize: 13 }}>
          Rumus Nilai Faktor Risiko: <strong>NFR = Likelihood (L) × Severity (S)</strong>. Berdasarkan matriks evaluasi risiko K3 baku, berikut pemetaan nilai dan ambang batas risiko:
        </Paragraph>

        {/* Tabel Matriks 5x5 */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              textAlign: "center",
              borderCollapse: "collapse",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #cbd5e1",
            }}
          >
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  style={{
                    border: "1px solid #cbd5e1",
                    padding: "8px 10px",
                    background: "#0f172a",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    width: 140,
                  }}
                >
                  SEVERITY (S) &darr;
                  <br />
                  <span style={{ fontSize: 10, fontWeight: 400, color: "#94a3b8" }}>
                    LIKELIHOOD (L) &rarr;
                  </span>
                </th>
                <th
                  colSpan={5}
                  style={{
                    border: "1px solid #cbd5e1",
                    padding: "6px 8px",
                    background: "#1e293b",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  FREKUENSI KEMUNGKINAN / LIKELIHOOD (L)
                </th>
              </tr>
              <tr>
                {[1, 2, 3, 4, 5].map((l) => (
                  <th
                    key={l}
                    style={{
                      border: "1px solid #cbd5e1",
                      padding: "6px",
                      background: "#334155",
                      color: "#f8fafc",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    L {l}
                    <div style={{ fontSize: 9.5, fontWeight: 400, color: "#cbd5e1" }}>
                      {l === 1 && "Sgt Jarang"}
                      {l === 2 && "Jarang"}
                      {l === 3 && "Dapat Terjadi"}
                      {l === 4 && "Sering"}
                      {l === 5 && "Sgt Sering"}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((s) => (
                <tr key={s}>
                  <td
                    style={{
                      border: "1px solid #cbd5e1",
                      padding: "8px",
                      fontWeight: 700,
                      background: "#f8fafc",
                      textAlign: "left",
                      fontSize: 11.5,
                      color: "#1e293b",
                    }}
                  >
                    S {s}
                    <span style={{ fontWeight: 400, color: "#64748b", marginLeft: 4 }}>
                      {s === 1 && "(Ringan/P3K)"}
                      {s === 2 && "(Sedang)"}
                      {s === 3 && "(Lost Time)"}
                      {s === 4 && "(Cacat/Fatal)"}
                      {s === 5 && "(Fatal Ganda)"}
                    </span>
                  </td>
                  {[1, 2, 3, 4, 5].map((l) => {
                    const info = getCellMatrixInfo(l, s);
                    const isSelected = selectedLikelihood === l && selectedSeverity === s;
                    return (
                      <td
                        key={l}
                        style={{
                          border: "1px solid #cbd5e1",
                          padding: "10px 6px",
                          backgroundColor: info.bg,
                          color: info.textColor,
                          fontWeight: 800,
                          fontSize: 15,
                          outline: isSelected ? "3px solid #0284c7" : "none",
                          outlineOffset: -2,
                          boxShadow: isSelected ? "inset 0 0 0 2px #fff" : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div>{info.score}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                          {info.level}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Kriteria Tindakan & Waktu Penyelesaian */}
      <div>
        <Title level={5} style={{ margin: "10px 0 8px 0", color: "#0f172a", fontWeight: 700 }}>
          📋 Tindakan dan Batas Waktu yang Dibutuhkan Berdasarkan NFR:
        </Title>
        <Table
          size="small"
          pagination={false}
          dataSource={nfrActionCriteria}
          rowKey="level"
          bordered
          columns={[
            {
              title: "Tingkat Risiko",
              dataIndex: "level",
              width: 130,
              render: (val: string, record) => (
                <Tag color={record.tagColor} style={{ fontWeight: 700, fontSize: 11.5 }}>
                  {val}
                </Tag>
              ),
            },
            {
              title: "Nilai NFR",
              dataIndex: "range",
              width: 90,
              align: "center",
              render: (val: string) => <strong>{val}</strong>,
            },
            {
              title: "Tindakan & Pengendalian yang Diwajibkan",
              dataIndex: "action",
              render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val}</span>,
            },
            {
              title: "Batas Waktu (Durasi)",
              dataIndex: "timeframe",
              width: 180,
              render: (val: string) => (
                <Tag color="cyan" style={{ fontWeight: 600 }}>
                  ⏱ {val}
                </Tag>
              ),
            },
          ]}
        />
      </div>

      {/* 5 Hierarki Pengendalian Risiko */}
      <div
        style={{
          background: "#f8fafc",
          padding: "14px 18px",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8, fontSize: 13 }}>
          🎯 5 Tingkat Hirarki Pengendalian Risiko K3:
        </div>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <div style={{ fontSize: 12, color: "#334155" }}>
              <strong>1. Eliminasi:</strong> Menghilangkan sumber bahaya secara total
            </div>
            <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
              <strong>2. Substitusi:</strong> Mengganti bahan/alat dengan alternatif lebih aman
            </div>
            <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
              <strong>3. Engineering Control:</strong> Modifikasi mesin/alat, isolasi, ventilasi
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ fontSize: 12, color: "#334155" }}>
              <strong>4. Administrasi:</strong> SOP, pelatihan K3, rotasi durasi kerja, rambu &amp; label
            </div>
            <div style={{ fontSize: 12, color: "#334155", marginTop: 4 }}>
              <strong>5. APD (Alat Pelindung Diri):</strong> Respirator, helm, sarung tangan, safety shoes
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );

  // TAB 2: KRITERIA SKALA LIKELIHOOD & SEVERITY LENGKAP
  const criteriaTab = (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <Title level={5} style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
          1. Likelihood (L): Frekuensi Kemungkinan Terjadinya Insiden
        </Title>
        <Table
          size="small"
          pagination={false}
          dataSource={likelihoodCriteria}
          rowKey="level"
          bordered
          columns={[
            {
              title: "Skala L",
              dataIndex: "level",
              width: 70,
              align: "center",
              render: (val: number) => (
                <Tag color="geekblue" style={{ fontWeight: 800 }}>
                  L {val}
                </Tag>
              ),
            },
            {
              title: "Tingkat Frekuensi",
              dataIndex: "name",
              width: 180,
              render: (val: string) => <strong>{val}</strong>,
            },
            {
              title: "Frekuensi Rata-rata",
              dataIndex: "frequency",
              width: 170,
              render: (val: string) => <Tag color="blue">{val}</Tag>,
            },
            {
              title: "Deskripsi Kondisi Operasional",
              dataIndex: "description",
              render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val}</span>,
            },
          ]}
        />
      </div>

      <div>
        <Title level={5} style={{ margin: "0 0 8px 0", color: "#0f172a" }}>
          2. Severity (S): Keparahan / Kerugian / Kerusakan Fisik
        </Title>
        <Table
          size="small"
          pagination={false}
          dataSource={severityCriteria}
          rowKey="level"
          bordered
          columns={[
            {
              title: "Skala S",
              dataIndex: "level",
              width: 70,
              align: "center",
              render: (val: number) => (
                <Tag color="volcano" style={{ fontWeight: 800 }}>
                  S {val}
                </Tag>
              ),
            },
            {
              title: "Tingkat Keparahan",
              dataIndex: "name",
              width: 200,
              render: (val: string) => <strong>{val}</strong>,
            },
            {
              title: "Dampak Cedera & Kehilangan Hari Kerja",
              dataIndex: "description",
              render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val}</span>,
            },
          ]}
        />
      </div>
    </div>
  );

  // TAB 3: REFERENSI HAZARD / FAKTOR BAHAYA DI TEMPAT KERJA
  const hazardTab = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Alert
        message="Pedoman Identifikasi Bahaya K3 (Sheet Hazard Reference)"
        description="Hazard merupakan sesuatu risiko yang spesifik yang ada di tempat kerja atau proses kerja di tempat tersebut. Gunakan klasifikasi 5 faktor di bawah sebagai acuan perumusan potensi bahaya pada formulir HIRADC."
        type="info"
        showIcon
        style={{ borderRadius: 8 }}
      />

      <Table
        size="small"
        pagination={false}
        dataSource={hazardReferenceData}
        rowKey="key"
        bordered
        columns={[
          {
            title: "Faktor Hazard di Tempat Kerja",
            dataIndex: "factor",
            width: 160,
            onCell: (_, index) => {
              // Grouping baris faktor yang sama
              if (index === 0) return { rowSpan: 4 };
              if (index === 1 || index === 2 || index === 3) return { rowSpan: 0 };
              if (index === 4) return { rowSpan: 2 };
              if (index === 5) return { rowSpan: 0 };
              if (index === 6) return { rowSpan: 4 };
              if (index === 7 || index === 8 || index === 9) return { rowSpan: 0 };
              if (index === 10) return { rowSpan: 5 };
              if (index === 11 || index === 12 || index === 13 || index === 14) return { rowSpan: 0 };
              if (index === 15) return { rowSpan: 2 };
              if (index === 16) return { rowSpan: 0 };
              return {};
            },
            render: (val: string) => {
              const color =
                val.includes("Fisika")
                  ? "blue"
                  : val.includes("Kimia")
                  ? "volcano"
                  : val.includes("Biologi")
                  ? "green"
                  : val.includes("Ergonomi")
                  ? "purple"
                  : "magenta";
              return (
                <Tag color={color} style={{ fontWeight: 700, fontSize: 12, padding: "3px 8px" }}>
                  {val}
                </Tag>
              );
            },
          },
          {
            title: "Jenis Bahaya (Hazard)",
            dataIndex: "type",
            width: 220,
            render: (val: string) => <strong>{val}</strong>,
          },
          {
            title: "Contoh Riil di Tempat Kerja / Lapangan",
            dataIndex: "example",
            render: (val: string) => <span style={{ fontSize: 12.5, color: "#334155" }}>{val}</span>,
          },
        ]}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} style={{ borderRadius: 6 }}>
          Tutup Panduan K3
        </Button>,
      ]}
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: "#0284c7", fontSize: 22 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
              Panduan Baku Penilaian Risiko K3 &amp; Matriks HIRADC
            </div>
            <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 400 }}>
              Standar Evaluasi Matriks 5×5 &amp; Klasifikasi 5 Faktor Bahaya Sesuai Dokumen K3
            </div>
          </div>
        </Space>
      }
      width={880}
      style={{ top: 20 }}
    >
      <Tabs
        defaultActiveKey="matrix"
        items={[
          {
            key: "matrix",
            label: (
              <span>
                <TableOutlined /> Matriks NFR (5×5)
              </span>
            ),
            children: matrixTab,
          },
          {
            key: "criteria",
            label: (
              <span>
                <FileTextOutlined /> Skala Peluang &amp; Keparahan
              </span>
            ),
            children: criteriaTab,
          },
          {
            key: "hazard",
            label: (
              <span>
                <WarningOutlined /> Referensi 5 Faktor Bahaya
              </span>
            ),
            children: hazardTab,
          },
        ]}
      />
    </Modal>
  );
};
