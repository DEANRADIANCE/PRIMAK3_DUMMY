import React from "react";
import { Modal, Table, Tabs, Typography, Button, Space, Alert } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

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
  // Matriks 5x5: Severity (Sumbu X: 1-5), Likelihood (Sumbu Y: 5 down to 1)
  const likelihoods = [
    { level: 5, label: "5 - Sangat Sering (Hampir pasti terjadi tiap minggu/bulan)" },
    { level: 4, label: "4 - Sering (Kemungkinan besar terjadi beberapa kali setahun)" },
    { level: 3, label: "3 - Sedang (Bisa terjadi sewaktu-waktu)" },
    { level: 2, label: "2 - Jarang (Kecil kemungkinan, pernah terjadi dalam beberapa tahun)" },
    { level: 1, label: "1 - Sangat Jarang (Hampir mustahil terjadi)" },
  ];

  const severities = [
    { level: 1, label: "1 - Tidak Signifikan (P3K ringan, tidak ada hari kerja hilang)" },
    { level: 2, label: "2 - Ringan (Cedera ringan, istirahat kerja < 3 hari)" },
    { level: 3, label: "3 - Sedang (Cedera memerlukan tindakan medis, hilang hari kerja > 3 hari)" },
    { level: 4, label: "4 - Berat (Cacat permanen parsial/total, kerusakan aset parah)" },
    { level: 5, label: "5 - Katastropik (Kematian/fatality, kehancuran aset total)" },
  ];

  const getScoreInfo = (l: number, s: number) => {
    const score = l * s;
    if (score <= 4) return { score, level: "low", color: "#d9f7be", text: "Rendah" };
    if (score <= 9) return { score, level: "medium", color: "#fffb8f", text: "Sedang" };
    if (score <= 16) return { score, level: "high", color: "#ffd591", text: "Tinggi" };
    return { score, level: "extreme", color: "#ffa39e", text: "Ekstrem" };
  };

  const matrixTab = (
    <div>
      <Paragraph>
        Nilai Risiko dihitung dari perkalian <strong>Likelihood (Peluang)</strong> × <strong>Severity (Keparahan)</strong>:
      </Paragraph>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            textAlign: "center",
            borderCollapse: "collapse",
            marginBottom: 16,
          }}
        >
          <thead>
            <tr>
              <th
                rowSpan={2}
                style={{
                  border: "1px solid #d9d9d9",
                  padding: 8,
                  background: "#fafafa",
                  width: 140,
                }}
              >
                Peluang (Likelihood)
              </th>
              <th
                colSpan={5}
                style={{
                  border: "1px solid #d9d9d9",
                  padding: 8,
                  background: "#fafafa",
                }}
              >
                Keparahan (Severity)
              </th>
            </tr>
            <tr>
              {[1, 2, 3, 4, 5].map((s) => (
                <th
                  key={s}
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: 8,
                    background: "#f0f0f0",
                  }}
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[5, 4, 3, 2, 1].map((l) => (
              <tr key={l}>
                <td
                  style={{
                    border: "1px solid #d9d9d9",
                    padding: 8,
                    fontWeight: 600,
                    background: "#fafafa",
                    textAlign: "left",
                  }}
                >
                  L {l}
                </td>
                {[1, 2, 3, 4, 5].map((s) => {
                  const info = getScoreInfo(l, s);
                  const isSelected = selectedLikelihood === l && selectedSeverity === s;
                  return (
                    <td
                      key={s}
                      style={{
                        border: "1px solid #d9d9d9",
                        padding: 12,
                        backgroundColor: info.color,
                        fontWeight: 700,
                        outline: isSelected ? "3px solid #1890ff" : "none",
                        outlineOffset: -2,
                      }}
                    >
                      <div>{info.score}</div>
                      <div style={{ fontSize: 11, fontWeight: "normal" }}>{info.text}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, backgroundColor: "#d9f7be", borderRadius: 4 }} />
          <Text style={{ fontSize: 12 }}>1–4: Rendah (Dapat Diterima)</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, backgroundColor: "#fffb8f", borderRadius: 4 }} />
          <Text style={{ fontSize: 12 }}>5–9: Sedang (Perlu Pengendalian Rutin)</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, backgroundColor: "#ffd591", borderRadius: 4 }} />
          <Text style={{ fontSize: 12 }}>10–16: Tinggi (Tindakan Perbaikan Segera)</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 16, height: 16, backgroundColor: "#ffa39e", borderRadius: 4 }} />
          <Text style={{ fontSize: 12 }}>17–25: Ekstrem (Hentikan Pekerjaan / Darurat)</Text>
        </div>
      </div>
    </div>
  );

  const guideTab = (
    <div>
      <Title level={5}>Skala Peluang (Likelihood 1 - 5)</Title>
      <Table
        size="small"
        pagination={false}
        dataSource={likelihoods}
        rowKey="level"
        columns={[
          { title: "Nilai", dataIndex: "level", width: 80, align: "center" },
          { title: "Kriteria Peluang", dataIndex: "label" },
        ]}
        style={{ marginBottom: 16 }}
      />

      <Title level={5}>Skala Keparahan Dampak (Severity 1 - 5)</Title>
      <Table
        size="small"
        pagination={false}
        dataSource={severities}
        rowKey="level"
        columns={[
          { title: "Nilai", dataIndex: "level", width: 80, align: "center" },
          { title: "Kriteria Dampak", dataIndex: "label" },
        ]}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Tutup Panduan
        </Button>,
      ]}
      title={
        <Space>
          <InfoCircleOutlined style={{ color: "#1890ff", fontSize: 20 }} />
          <span>Panduan Pengisian Penilaian Risiko HIRADC</span>
        </Space>
      }
      width={720}
    >
      <Tabs
        defaultActiveKey="matrix"
        items={[
          { key: "matrix", label: "Matriks Risiko 5×5", children: matrixTab },
          { key: "guide", label: "Kriteria Skala 1–5", children: guideTab },
        ]}
      />
    </Modal>
  );
};
