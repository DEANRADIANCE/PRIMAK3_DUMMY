import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";
import { IHazardReport } from "../../../types/hazard";

const { Title, Text } = Typography;

export const HazardReportEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();

  const { query } = useOne<IHazardReport>({
    resource: "hazard-reports",
    id: id || "1",
  });

  const { mutate: updateReport, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const report = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (report) {
      form.setFieldsValue({
        date: dayjs(report.date),
        category: report.category,
        unit: report.unit,
        location: report.location,
        description: report.description,
        potentialImpact: report.potentialImpact,
        status: report.status,
      });
    }
  }, [report, form]);

  const onFinish = (values: any) => {
    if (!report) return;

    const newHistory = [...(report.statusHistory || [])];
    if (values.status !== report.status || values.notes) {
      newHistory.push({
        status: values.status,
        changedBy: user?.name || "Admin K3",
        changedAt: dayjs().format("YYYY-MM-DD HH:mm"),
        notes: values.notes || "Pembaruan data laporan",
      });
    }

    updateReport(
      {
        resource: "hazard-reports",
        id: report.id,
        values: {
          ...values,
          date: values.date.format("YYYY-MM-DD"),
          statusHistory: newHistory,
        },
        successNotification: {
          message: "Laporan Berhasil Diperbarui",
          description: `Perubahan data laporan ${report.reportNumber} berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/bahaya-resiko/show/${report.id}`);
        },
      }
    );
  };

  if (isLoading || !report) return <Card loading={true} />;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/bahaya-resiko")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Ubah Laporan Bahaya: {report.reportNumber}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Perbarui informasi atau status tindak lanjut penanganan
          </Text>
        </div>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          border: "1px solid #e8e8e8",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item label="Tanggal Kejadian" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Kategori Bahaya" name="category" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="near_miss">Near Miss (Hampir Celaka)</Select.Option>
                  <Select.Option value="unsafe_action">Unsafe Action (Tindakan Tidak Aman)</Select.Option>
                  <Select.Option value="unsafe_condition">Unsafe Condition (Kondisi Tidak Aman)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Unit Kerja" name="unit" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Lokasi Kejadian" name="location" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Deskripsi Temuan" name="description" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Potensi Dampak" name="potentialImpact" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Status Penanganan Saat Ini" name="status" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="reported">Dilaporkan</Select.Option>
                  <Select.Option value="verified">Diverifikasi</Select.Option>
                  <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
                  <Select.Option value="resolved">Selesai</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Catatan Perubahan / Tindakan Korektif" name="notes">
                <Input size="large" placeholder="Contoh: Barikade pengaman telah dipasang..." />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/keselamatan/bahaya-resiko")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Simpan Perubahan
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
