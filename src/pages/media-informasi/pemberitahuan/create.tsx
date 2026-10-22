import React from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Upload,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useCreate, useGetIdentity } from "@refinedev/core";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const AnnouncementCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const [form] = Form.useForm();
  const { mutate: createAnnouncement, mutation } = useCreate();
  const isLoading = mutation.isPending;

  const onFinish = (values: any) => {
    const formatted = {
      ...values,
      date: dayjs().format("YYYY-MM-DD"),
      attachments: ["Brosur_Kegiatan_K3.pdf"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
      isActive: true,
      createdBy: user?.name || "Tim K3 ANRI",
    };

    createAnnouncement(
      {
        resource: "announcements",
        values: formatted,
        successNotification: {
          message: "Pemberitahuan Berhasil Dipublikasikan",
          description: `Agenda kegiatan "${values.title}" telah ditambahkan.`,
          type: "success",
        },
      },
      {
        onSuccess: () => {
          navigate("/media/pemberitahuan");
        },
      }
    );
  };

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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/media/pemberitahuan")} />
        <div>
          <Title level={4} style={{ margin: 0, color: "#262626" }}>
            Buat Pemberitahuan / Informasi Kegiatan Baru
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Informasikan agenda kegiatan K3, sosialisasi, atau simulasi evakuasi darurat
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
            <Col xs={24}>
              <Form.Item
                label="Judul Pemberitahuan / Kegiatan"
                name="title"
                rules={[{ required: true, message: "Judul kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Sosialisasi Pencegahan Kebakaran Gedung Arsip" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Jadwal Pelaksanaan Kegiatan"
                name="eventDate"
                rules={[{ required: true, message: "Jadwal kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: 28 Maret 2026, Pukul 09.00 WIB" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Lokasi Kegiatan"
                name="location"
                rules={[{ required: true, message: "Lokasi kegiatan wajib diisi!" }]}
              >
                <Input placeholder="Contoh: Auditorium Noerhadi Magetsari Gedung A Lantai 2" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Ringkasan Singkat"
                name="description"
                rules={[{ required: true, message: "Ringkasan wajib diisi!" }]}
              >
                <Input.TextArea rows={2} placeholder="Keterangan singkat yang tampil pada kartu pengumuman..." />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Isi Pengumuman Lengkap / Surat Edaran"
                name="content"
                rules={[{ required: true, message: "Isi pengumuman wajib diisi!" }]}
              >
                <Input.TextArea rows={6} placeholder="Tuliskan isi surat edaran atau instruksi lengkap kegiatan..." />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Lampiran Dokumen (Surat / Brosur / Denah)">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Unggah Berkas PDF / Gambar</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <Button onClick={() => navigate("/media/pemberitahuan")}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              style={{ background: "#595959", borderColor: "#595959" }}
            >
              Publikasikan Pengumuman
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
