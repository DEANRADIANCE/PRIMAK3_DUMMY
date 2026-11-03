import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  message,
  Space,
  Row,
  Col,
} from "antd";
import { UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreate, useUpdate, useGetIdentity } from "@refinedev/core";
import { IArticle } from "../../../../types/article";
import { initialArticleCategories } from "../../../../mocks/articles";
import { IUser } from "../../../../types/user";

interface EdukasiFormModalProps {
  open: boolean;
  onClose: () => void;
  record?: IArticle | null;
  onSuccess?: () => void;
}

export const EdukasiFormModal: React.FC<EdukasiFormModalProps> = ({
  open,
  onClose,
  record,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);
  const statusValue = Form.useWatch("status", form);
  const { data: user } = useGetIdentity<IUser>();

  const { mutate: createArticle, mutation: createMutation } = useCreate();
  const { mutate: updateArticle, mutation: updateMutation } = useUpdate();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) {
      if (record) {
        form.setFieldsValue({
          title: record.title,
          categoryId: record.categoryId || (typeof record.category === "object" ? record.category.id : 1),
          summary: record.summary,
          content: record.content,
          status: record.status || (record.isPublished ? "Terbit" : "Draf"),
          scheduledAt: record.scheduledAt ? dayjs(record.scheduledAt) : null,
          image: record.image,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: "Terbit",
          categoryId: 1,
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
    const selectedCat =
      initialArticleCategories.find((c) => c.id === values.categoryId) ||
      initialArticleCategories[0];

    const payload: Partial<IArticle> = {
      title: values.title,
      categoryId: values.categoryId,
      category: selectedCat,
      summary: values.summary,
      content: values.content,
      status: values.status,
      scheduledAt:
        values.status === "Dijadwalkan" && values.scheduledAt
          ? values.scheduledAt.toISOString()
          : undefined,
      isPublished: values.status === "Terbit",
      image:
        values.image ||
        record?.image ||
        "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80",
      author: record?.author || user?.name || "Tim K3 ANRI",
    };

    if (record) {
      updateArticle(
        {
          resource: "articles",
          id: record.id,
          values: payload,
          successNotification: {
            message: "Artikel Berhasil Diperbarui",
            description: `Artikel "${values.title}" telah diperbarui.`,
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
      createArticle(
        {
          resource: "articles",
          values: {
            ...payload,
            createdAt: dayjs().toISOString(),
          },
          successNotification: {
            message: "Artikel Berhasil Ditambahkan",
            description: `Artikel "${values.title}" telah ditambahkan.`,
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
              background: "linear-gradient(135deg, #0d9488 0%, #0284c7 100%)",
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            {record ? "Ubah Artikel Edukasi" : "Tambah Artikel Edukasi Baru"}
          </span>
        </div>
      }
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={680}
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
          label={<span style={{ fontWeight: 600 }}>Judul Artikel</span>}
          rules={[{ required: true, message: "Judul artikel wajib diisi" }]}
        >
          <Input placeholder="Contoh: Mencegah Carpal Tunnel Syndrome di Meja Kerja" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="categoryId"
              label={<span style={{ fontWeight: 600 }}>Kategori</span>}
              rules={[{ required: true, message: "Pilih kategori artikel" }]}
            >
              <Select placeholder="Pilih Kategori">
                {initialArticleCategories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="status"
              label={<span style={{ fontWeight: 600 }}>Status Publikasi</span>}
              rules={[{ required: true, message: "Pilih status publikasi" }]}
            >
              <Select>
                <Select.Option value="Terbit">Terbit</Select.Option>
                <Select.Option value="Draf">Draf</Select.Option>
                <Select.Option value="Dijadwalkan">Dijadwalkan</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {statusValue === "Dijadwalkan" && (
          <Form.Item
            name="scheduledAt"
            label={<span style={{ fontWeight: 600 }}>Tanggal & Waktu Terbit</span>}
            rules={[{ required: true, message: "Tentukan jadwal publikasi" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: "100%" }}
              placeholder="Pilih tanggal dan waktu terbit"
            />
          </Form.Item>
        )}

        <Form.Item
          name="summary"
          label={<span style={{ fontWeight: 600 }}>Ringkasan Singkat</span>}
          rules={[{ required: true, message: "Ringkasan wajib diisi" }]}
        >
          <Input.TextArea
            rows={2}
            placeholder="Ringkasan singkat artikel (tampil di kartu dan preview)..."
          />
        </Form.Item>

        <Form.Item
          name="content"
          label={<span style={{ fontWeight: 600 }}>Konten Artikel</span>}
          rules={[{ required: true, message: "Isi konten artikel wajib diisi" }]}
        >
          <Input.TextArea
            rows={6}
            placeholder="Tulis materi artikel edukasi selengkapnya di sini..."
          />
        </Form.Item>

        <Form.Item
          name="image"
          label={<span style={{ fontWeight: 600 }}>URL Gambar Sampul</span>}
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
            {record ? "Simpan Perubahan" : "Terbitkan Artikel"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
