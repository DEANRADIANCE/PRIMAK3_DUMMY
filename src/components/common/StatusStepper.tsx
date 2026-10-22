import React from "react";
import { Steps, Timeline, Card, Typography, Tag } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { IStatusHistory } from "../../types/hazard";

const { Text } = Typography;

interface StatusStepperProps {
  status: string;
  history?: IStatusHistory[];
  showTimeline?: boolean;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  status,
  history = [],
  showTimeline = true,
}) => {
  const getStepCurrent = (st: string) => {
    switch (st?.toLowerCase()) {
      case "reported":
      case "dilaporkan":
      case "draft":
        return 0;
      case "verified":
      case "diverifikasi":
      case "reviewed":
        return 1;
      case "in_progress":
      case "dalam penanganan":
      case "approved":
        return 2;
      case "resolved":
      case "selesai":
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const current = getStepCurrent(status);

  const stepItems = [
    {
      title: "Dilaporkan",
      description: "Laporan masuk ke sistem",
      icon: <FileTextOutlined />,
    },
    {
      title: "Diverifikasi",
      description: "Ditinjau oleh Tim K3",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Dalam Penanganan",
      description: "Tindakan perbaikan",
      icon: <SyncOutlined spin={current === 2} />,
    },
    {
      title: "Selesai",
      description: "Bahaya/insiden tuntas",
      icon: <SafetyCertificateOutlined />,
    },
  ];

  return (
    <div>
      <Steps current={current} items={stepItems} style={{ marginBottom: 24 }} />

      {showTimeline && history && history.length > 0 && (
        <Card size="small" title="Riwayat Perubahan Status" style={{ background: "#fafafa" }}>
          <Timeline
            style={{ marginTop: 12 }}
            items={history.map((h) => ({
              color: h.status.toLowerCase().includes("selesai") ? "green" : "blue",
              children: (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Tag color="blue">{h.status}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {h.changedAt}
                    </Text>
                  </div>
                  <Text strong style={{ fontSize: 13, display: "block", marginTop: 4 }}>
                    Oleh: {h.changedBy}
                  </Text>
                  {h.notes && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Catatan: {h.notes}
                    </Text>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      )}
    </div>
  );
};
