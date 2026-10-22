import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Radio,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import dayjs from "dayjs";
import { IAccidentReport } from "../../../types/accident";

const { Title, Text } = Typography;

export const AccidentReportEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { query } = useOne<IAccidentReport>({
    resource: "accident-reports",
    id: id || "1",
  });

  const { mutate: updateAccident, mutation } = useUpdate();
  const isUpdating = mutation.isPending;
  const record = query.data?.data;
  const isLoading = query.isLoading;

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        date: dayjs(record.date),
        time: dayjs(record.time, "HH:mm"),
        location: record.location,
        accidentType: record.accidentType,
        severityLevel: record.severityLevel,
        chronology: record.chronology,
        victimName: record.victim.name,
        victimNip: record.victim.nip,
        employmentStatus: record.victim.employmentStatus,
        victimUnit: record.victim.unit,
        injuryType: record.victim.injuryType,
        medicalAction: record.victim.medicalAction,
        k3Name: record.k3Team.name,
        k3Position: record.k3Team.position,
        k3Handling: record.k3Team.handling,
        taspenStatus: record.taspenStatus,
        status: record.status,
      });
    }
  }, [record, form]);

  const onFinish = (values: any) => {
    if (!record) return;

    updateAccident(
      {
        resource: "accident-reports",
        id: record.id,
        values: {
          date: values.date.format("YYYY-MM-DD"),
          time: values.time.format("HH:mm"),
          location: values.location,
          accidentType: values.accidentType,
          severityLevel: values.severityLevel,
          chronology: values.chronology,
          victim: {
            name: values.victimName,
            nip: values.victimNip,
            employmentStatus: values.employmentStatus,
            unit: values.victimUnit,
            injuryType: values.injuryType,
            medicalAction: values.medicalAction,
          },
          k3Team: {
            name: values.k3Name,
            position: values.k3Position,
            handling: values.k3Handling,
          },
          taspenStatus: values.taspenStatus,
          status: values.status,
        },
        successNotification: {
          message: "Laporan Kecelakaan Berhasil Diperbarui",
          description: `Perubahan data laporan ${record.reportNumber} berhasil disimpan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate(`/keselamatan/kecelakaan/show/${record.id}`);
        },
      }
    );
  };

  if (isLoading || !record) return <Card loading={true} />;

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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/keselamatan/kecelakaan")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Ubah Laporan Kecelakaan: {record.reportNumber}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Perbarui data kecelakaan atau status klaim TASPEN
          </Text>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card
          title="Data Kejadian & Administrasi TASPEN"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 20,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Tanggal Kejadian" name="date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Jam Kejadian" name="time" rules={[{ required: true }]}>
                <TimePicker style={{ width: "100%" }} format="HH:mm" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Jenis Kecelakaan" name="accidentType" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="Terjatuh / Terpeleset">Terjatuh / Terpeleset</Select.Option>
                  <Select.Option value="Tertimpa Benda">Tertimpa Benda</Select.Option>
                  <Select.Option value="Tersengat Listrik">Tersengat Listrik</Select.Option>
                  <Select.Option value="Terhirup Gas / Kimia">Terhirup Gas / Kimia</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Status Pengajuan Klaim TASPEN" name="taspenStatus" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="belum">Belum Diajukan</Select.Option>
                  <Select.Option value="diajukan">Dalam Proses Pengajuan</Select.Option>
                  <Select.Option value="selesai">Klaim Selesai / Disetujui</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Status Laporan K3" name="status" rules={[{ required: true }]}>
                <Select size="large">
                  <Select.Option value="reported">Dilaporkan</Select.Option>
                  <Select.Option value="verified">Diverifikasi</Select.Option>
                  <Select.Option value="in_progress">Dalam Penanganan</Select.Option>
                  <Select.Option value="resolved">Selesai</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Kronologi Lengkap" name="chronology" rules={[{ required: true }]}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          title="Data Korban"
          bordered={false}
          style={{
            borderRadius: 12,
            border: "1px solid #e8e8e8",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            marginBottom: 24,
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Nama Korban" name="victimName" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="NIP Korban" name="victimNip" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Status Kepegawaian" name="employmentStatus" rules={[{ required: true }]}>
                <Radio.Group buttonStyle="solid" size="large">
                  <Radio.Button value="ASN">ASN</Radio.Button>
                  <Radio.Button value="PPPK">PPPK</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Jenis Cedera" name="injuryType" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Tindakan Medis" name="medicalAction" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button onClick={() => navigate("/keselamatan/kecelakaan")}>Batal</Button>
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
    </div>
  );
};
