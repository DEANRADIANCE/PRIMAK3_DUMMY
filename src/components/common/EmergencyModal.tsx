import React from "react";
import { Modal, Typography, List, Card, Space, Button, Alert } from "antd";
import {
  PhoneOutlined,
  AlertOutlined,
  MedicineBoxOutlined,
  FireOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { initialSettings } from "../../mocks/settings";

const { Title, Text, Paragraph } = Typography;

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ open, onClose }) => {
  const getIcon = (label: string) => {
    if (label.includes("Klinik")) return <MedicineBoxOutlined style={{ color: "#52c41a", fontSize: 20 }} />;
    if (label.includes("Damkar")) return <FireOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />;
    if (label.includes("Ambulans")) return <AlertOutlined style={{ color: "#fa8c16", fontSize: 20 }} />;
    if (label.includes("Polisi")) return <SafetyCertificateOutlined style={{ color: "#1890ff", fontSize: 20 }} />;
    return <CustomerServiceOutlined style={{ color: "#722ed1", fontSize: 20 }} />;
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Tutup
        </Button>,
      ]}
      title={
        <Space>
          <AlertOutlined style={{ color: "#ff4d4f", fontSize: 22 }} />
          <span>Nomor Kontak Darurat - {initialSettings.clinicName}</span>
        </Space>
      }
      width={600}
    >
      <Alert
        type="warning"
        showIcon
        message="Situasi Gawat Darurat"
        description="Dalam kondisi henti jantung, trauma berat akibat kecelakaan kerja, atau kebakaran, segera hubungi kontak prioritas di bawah ini dan teriakkan tanda bahaya."
        style={{ marginBottom: 16 }}
      />

      <Card size="small" style={{ marginBottom: 16, backgroundColor: "#fafafa" }}>
        <Paragraph style={{ margin: 0 }}>
          <strong>Lokasi Klinik:</strong> {initialSettings.clinicAddress}
        </Paragraph>
      </Card>

      <List
        dataSource={initialSettings.emergencyNumbers}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                danger={item.label.includes("Ambulans") || item.label.includes("Klinik")}
                icon={<PhoneOutlined />}
                href={`tel:${item.number.replace(/[^0-9+]/g, "")}`}
              >
                Panggil
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={getIcon(item.label)}
              title={<Text strong>{item.label}</Text>}
              description={
                <Text style={{ fontSize: 16, color: "#1890ff", fontWeight: 600 }}>
                  {item.number}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
