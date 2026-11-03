import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreate, useUpdate, useGetIdentity } from "@refinedev/core";
import { IPoster } from "../../../../types/poster";
import { IUser } from "../../../../types/user";

interface PosterFormModalProps {
  open: boolean;
  onClose: () => void;
  record?: IPoster | null;
  onSuccess?: () => void;
}

const POSTER_CATEGORIES = [
  "Budaya K3",
  "Tanggap Darurat",
  "Alat Pelindung Diri",
  "Kesehatan Kerja",
  "Ergonomi",
  "Keselamatan Kerja",
];

export const PosterFormModal: React.FC<PosterFormModalProps> = ({
  open,
  onClose,
  record,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const { data: user } = useGetIdentity<IUser>();

  const { mutate: createPoster, mutation: createMutation } = useCreate();
  const { mutate: updatePoster, mutation: updateMutation } = useUpdate();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue({
          title: record.title,
          category: record.category || "Budaya K3",
          description: record.description,
          status: record.status || "Tayang",
          image: record.image,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          category: "Budaya K3",
          status: "Tayang",
        });
      }
      setIsDirty(false);
    }
  }, [open, record, form]);

  const handleCancel = () => {
    if (isDirty) {
      Modal.confirm({
        title: "Perubahan belum disimpan",
        icon: <ExclamationCircleOutlined />,
        content: "Ada perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?",
        okText: "Ya, Tinggalkan",
        cancelText: "Lanjutkan Mengedit",
        okButtonProps: { danger: true },
        onOk: () => {
          setIsDirty(false);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const onFinish = (values: any) => {
    const payload: Partial<IPoster> = {
      title: values.title,
      category: values.category,
      description: values.description,
      status: values.status,
      image:
        values.image ||
        record?.image ||
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      fileUrl:
        values.image ||
        record?.fileUrl ||
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      createdBy: record?.createdBy || user?.name || "Tim K3 ANRI",
    };

    if (record) {
      updatePoster(
        {
          resource: "posters",
          id: record.id,
          values: payload,
          successNotification: {
            message: "Poster Berhasil Diperbarui",
            description: `Poster "${values.title}" telah diperbarui.`,
            type: "success",
          },
        },
        {
          onSuccess: () => {
            setIsDirty(false);
            onClose();
            if (onSuccess) onSuccess();
          },
        }
      );
    } else {
      createPoster(
        {
          resource: "posters",
          values: {
            ...payload,
            createdAt: dayjs().toISOString(),
          },
          successNotification: {
            message: "Poster Berhasil Ditambahkan",
            description: `Poster "${values.title}" telah ditambahkan ke galeri.`,
            type: "success",
          },
        },
        {
          onSuccess: () => {
            setIsDirty(false);
            onClose();
            if (onSuccess) onSuccess();
          },
        }
      );
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 18,
              background: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            {record ? "Ubah Poster & Flayer K3" : "Unggah Poster & Flayer Baru"}
          </span>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={() => setIsDirty(true)}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="title"
          label={<span style={{ fontWeight: 600 }}>Judul Poster</span>}
          rules={[{ required: true, message: "Judul poster wajib diisi" }]}
        >
          <Input placeholder="Contoh: Poster 5R di Ruang Arsip dan Perkantoran" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="category"
              label={<span style={{ fontWeight: 600 }}>Kategori</span>}
              rules={[{ required: true, message: "Pilih kategori poster" }]}
            >
              <Select placeholder="Pilih Kategori">
                {POSTER_CATEGORIES.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label={<span style={{ fontWeight: 600 }}>Status Poster</span>}
              rules={[{ required: true, message: "Pilih status" }]}
            >
              <Select>
                <Select.Option value="Tayang">Tayang</Select.Option>
                <Select.Option value="Draf">Draf</Select.Option>
                <Select.Option value="Diarsipkan">Diarsipkan</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span style={{ fontWeight: 600 }}>Deskripsi Poster</span>}
          rules={[{ required: true, message: "Deskripsi wajib diisi" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Jelaskan pesan atau instruksi keselamatan dalam poster ini..."
          />
        </Form.Item>

        <Form.Item
          name="image"
          label={<span style={{ fontWeight: 600 }}>URL Berkas / Gambar Poster</span>}
        >
          <Input placeholder="https://images.unsplash.com/..." />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <Button onClick={handleCancel} style={{ borderRadius: 8 }}>Batal</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="btn-media-primary"
            style={{ borderRadius: 8, height: 38, padding: "0 22px" }}
          >
            {record ? "Simpan Perubahan" : "Simpan Poster"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
