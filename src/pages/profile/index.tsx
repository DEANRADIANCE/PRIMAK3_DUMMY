import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Select,
  Radio,
  Tag,
  Tabs,
  Space,
  Divider,
  Modal,
  Alert,
  Switch,
  message,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  BankOutlined,
  LockOutlined,
  CameraOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  BellOutlined,
  KeyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useGetIdentity } from "@refinedev/core";
import { IUser } from "../../types/user";
import { getStoredUser, updateUserProfile } from "../../providers/authProvider";
import "./profile.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Koleksi preset avatar default berkualitas tinggi
const PRESET_AVATARS = [
  {
    id: "budi",
    label: "Dokter (Budi)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
  {
    id: "siti",
    label: "Petugas K3 (Siti)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
  },
  {
    id: "hendra",
    label: "Pimpinan (Hendra)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
  },
  {
    id: "fauzi",
    label: "Staf (Fauzi)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fauzi",
  },
  {
    id: "alex",
    label: "Officer Pria (Alex)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "sarah",
    label: "Officer Wanita (Sarah)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "marcus",
    label: "Dokter Pratama (Marcus)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    id: "aneka",
    label: "Staf Lab (Aneka)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
  {
    id: "christian",
    label: "Teknisi (Christian)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christian",
  },
  {
    id: "brian",
    label: "Arsiparis (Brian)",
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brian",
  },
];

export const ProfilePage: React.FC = () => {
  const { data: identityUser } = useGetIdentity<IUser>();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Current active user
  const [user, setUser] = useState<IUser>(() => {
    return getStoredUser() || (identityUser as IUser) || {
      id: 1,
      name: "Dr. Budi Santoso, M.K.K.",
      email: "admin@anri.go.id",
      role: "admin",
      unit: "Klinik Pratama ANRI",
      nip: "198005122005011002",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
      phone: "0812-3456-7890",
      position: "Dokter Penanggung Jawab Klinik / Admin K3",
      gender: "L",
      address: "Jl. Ampera Raya No. 7, Cilandak Timur, Pasar Minggu, Jakarta Selatan",
      bio: "Dokter Spesialis Okupasi & Penanggung Jawab K3 Lingkungan Kerja ANRI.",
      createdAt: "2024-01-01T08:00:00Z",
    };
  });

  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar || PRESET_AVATARS[0].url);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>(user.avatar || "");
  const [tempUploadedAvatar, setTempUploadedAvatar] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password strength meter state
  const [newPasswordVal, setNewPasswordVal] = useState("");

  // Sync state if identity changes
  useEffect(() => {
    const current = getStoredUser() || identityUser;
    if (current) {
      setUser(current);
      setAvatarUrl(current.avatar || PRESET_AVATARS[0].url);
      setSelectedPreset(current.avatar || PRESET_AVATARS[0].url);
      profileForm.setFieldsValue({
        name: current.name,
        nip: current.nip,
        email: current.email,
        phone: current.phone || "0812-3456-7890",
        unit: current.unit,
        position: current.position || "Staff ANRI",
        gender: current.gender || "L",
        address: current.address || "Gedung ANRI, Jl. Ampera Raya No. 7, Jakarta Selatan",
        bio: current.bio || "Pegawai Arsip Nasional Republik Indonesia.",
      });
    }
  }, [identityUser, profileForm]);

  // Role labels
  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: "Admin Prima K3 (Akses Penuh)", color: "purple" },
    tim_k3: { label: "Tim K3 / Tim Keselamatan", color: "blue" },
    kepala_unit: { label: "Kepala Unit Kerja", color: "gold" },
    pegawai: { label: "Pegawai ANRI", color: "cyan" },
  };

  // Hitung kekuatan password
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "#e2e8f0" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, text: "Lemah", color: "#f87171" };
    if (score <= 4) return { score: 66, text: "Sedang", color: "#fbbf24" };
    return { score: 100, text: "Kuat & Aman", color: "#34d399" };
  };

  const passwordStrength = getPasswordStrength(newPasswordVal);

  // Handle Upload Foto dari File Lokal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      message.error("File yang diunggah harus berupa gambar (JPG, PNG, atau WEBP)");
      return;
    }

    // Validasi ukuran < 3MB
    if (file.size > 3 * 1024 * 1024) {
      message.error("Ukuran foto maksimal adalah 3 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setTempUploadedAvatar(result);
      setSelectedPreset(result);
    };
    reader.readAsDataURL(file);
  };

  // Simpan Avatar Terpilih
  const handleSaveAvatar = () => {
    const finalAvatar = tempUploadedAvatar || selectedPreset || avatarUrl;
    setAvatarUrl(finalAvatar);
    setIsAvatarModalOpen(false);

    // Update langsung ke storage & broadcast
    const updated = updateUserProfile({ avatar: finalAvatar });
    if (updated) {
      setUser(updated);
      message.success("Foto profil berhasil diperbarui!");
    }
  };

  // Reset Foto Profil ke Default
  const handleResetAvatar = () => {
    const defaultAv = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.split(" ")[0] || "User"}`;
    setSelectedPreset(defaultAv);
    setTempUploadedAvatar(null);
  };

  // Submit Perubahan Data Profil
  const onFinishProfile = (values: any) => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedData: Partial<IUser> = {
        name: values.name,
        nip: values.nip,
        email: values.email,
        phone: values.phone,
        unit: values.unit,
        position: values.position,
        gender: values.gender,
        address: values.address,
        bio: values.bio,
        avatar: avatarUrl,
      };

      const updated = updateUserProfile(updatedData);
      if (updated) {
        setUser(updated);
        message.success("Data profil pegawai berhasil disimpan dan diperbarui!");
      } else {
        message.error("Gagal menyimpan perubahan profil.");
      }
      setIsSaving(false);
    }, 400);
  };

  // Submit Perubahan Kata Sandi
  const onFinishPassword = (values: any) => {
    setIsSavingPassword(true);
    setTimeout(() => {
      if (values.newPassword !== values.confirmPassword) {
        message.error("Konfirmasi kata sandi baru tidak cocok!");
        setIsSavingPassword(false);
        return;
      }

      // Simpan kata sandi baru
      updateUserProfile({ password: values.newPassword });
      message.success("Kata sandi berhasil diperbarui dengan aman!");
      passwordForm.resetFields();
      setNewPasswordVal("");
      setIsSavingPassword(false);
    }, 500);
  };

  return (
    <div className="profile-page-container">
      {/* Header Banner & Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-banner" />
        <div className="profile-hero-content">
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
            {/* Avatar dengan Tombol Kamera Ganti Foto */}
            <div className="profile-avatar-wrapper">
              <Tooltip title="Klik untuk mengubah foto profil">
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="profile-avatar-img"
                  onClick={() => {
                    setSelectedPreset(avatarUrl);
                    setIsAvatarModalOpen(true);
                  }}
                />
              </Tooltip>
              <button
                type="button"
                className="profile-avatar-badge-btn"
                title="Ubah Foto Profil"
                onClick={() => {
                  setSelectedPreset(avatarUrl);
                  setIsAvatarModalOpen(true);
                }}
              >
                <CameraOutlined style={{ fontSize: 15 }} />
              </button>
            </div>

            {/* Nama & Ringkasan Pengguna */}
            <div className="profile-user-summary">
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h1 className="profile-user-name">{user.name}</h1>
                <Tooltip title="Pegawai Resmi Terverifikasi ANRI">
                  <CheckCircleFilled style={{ color: "#0d9488", fontSize: 18 }} />
                </Tooltip>
                <Tag color={roleLabels[user.role]?.color || "blue"} style={{ fontWeight: 600 }}>
                  {roleLabels[user.role]?.label || user.role}
                </Tag>
              </div>

              <div className="profile-user-meta">
                <span className="profile-meta-item">
                  <IdcardOutlined style={{ color: "#0d9488" }} />
                  <strong>NIP:</strong> {user.nip || "-"}
                </span>
                <span>•</span>
                <span className="profile-meta-item">
                  <BankOutlined style={{ color: "#0d9488" }} />
                  {user.unit || "Klinik Pratama ANRI"}
                </span>
                <span>•</span>
                <span className="profile-meta-item">
                  <MailOutlined style={{ color: "#0d9488" }} />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="profile-hero-actions">
            <Button
              type="primary"
              icon={<CameraOutlined />}
              onClick={() => {
                setSelectedPreset(avatarUrl);
                setIsAvatarModalOpen(true);
              }}
              style={{
                background: "#0d9488",
                borderColor: "#0d9488",
                fontWeight: 500,
                borderRadius: 8,
              }}
            >
              Ubah Avatar / Foto
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Form Tabs, Right Column Information Sidebar */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="profile-content-card">
            <Tabs
              defaultActiveKey="biodata"
              items={[
                {
                  key: "biodata",
                  label: (
                    <span>
                      <UserOutlined /> Biodata & Kepegawaian
                    </span>
                  ),
                  children: (
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={onFinishProfile}
                      initialValues={{
                        name: user.name,
                        nip: user.nip,
                        email: user.email,
                        phone: user.phone || "0812-3456-7890",
                        unit: user.unit,
                        position: user.position || "Staff ANRI",
                        gender: user.gender || "L",
                        address: user.address || "Gedung ANRI, Jl. Ampera Raya No. 7, Jakarta Selatan",
                        bio: user.bio || "Pegawai Arsip Nasional Republik Indonesia.",
                      }}
                    >
                      <Alert
                        message="Informasi Akun Pegawai ANRI"
                        description="Perubahan informasi pada profil ini akan tersimpan ke sistem identitas PRIMA K3 Anda."
                        type="info"
                        showIcon
                        style={{ marginBottom: 20, borderRadius: 8 }}
                      />

                      <Row gutter={16}>
                        {/* Nama Lengkap */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="name"
                            label={<span style={{ fontWeight: 600 }}>Nama Lengkap & Gelar</span>}
                            rules={[{ required: true, message: "Nama lengkap wajib diisi!" }]}
                          >
                            <Input
                              prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
                              placeholder="Contoh: Dr. Budi Santoso, M.K.K."
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* NIP */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="nip"
                            label={<span style={{ fontWeight: 600 }}>NIP (Nomor Induk Pegawai)</span>}
                            rules={[
                              { required: true, message: "NIP wajib diisi!" },
                              { pattern: /^[0-9]+$/, message: "NIP harus berupa angka!" },
                            ]}
                          >
                            <Input
                              prefix={<IdcardOutlined style={{ color: "#94a3b8" }} />}
                              placeholder="Contoh: 198005122005011002"
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* Email */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="email"
                            label={<span style={{ fontWeight: 600 }}>Email Kedinasan ANRI</span>}
                            rules={[
                              { required: true, message: "Email wajib diisi!" },
                              { type: "email", message: "Format email tidak valid!" },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                              placeholder="nama@anri.go.id"
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* No Telepon / WA */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="phone"
                            label={<span style={{ fontWeight: 600 }}>Nomor Telepon / WhatsApp</span>}
                            rules={[{ required: true, message: "Nomor kontak wajib diisi!" }]}
                          >
                            <Input
                              prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />}
                              placeholder="0812-xxxx-xxxx"
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* Unit Kerja */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="unit"
                            label={<span style={{ fontWeight: 600 }}>Unit / Satuan Kerja ANRI</span>}
                            rules={[{ required: true, message: "Unit kerja wajib dipilih!" }]}
                          >
                            <Select size="large" placeholder="Pilih Unit Kerja">
                              <Option value="Klinik Pratama ANRI">Klinik Pratama ANRI</Option>
                              <Option value="Unit Keselamatan dan Kesehatan Kerja">
                                Unit Keselamatan dan Kesehatan Kerja (K3)
                              </Option>
                              <Option value="Direktorat Pengolahan Arsip">
                                Direktorat Pengolahan Arsip
                              </Option>
                              <Option value="Direktorat Preservasi Arsip">
                                Direktorat Preservasi Arsip
                              </Option>
                              <Option value="Subbagian Rumah Tangga dan Sarpras">
                                Subbagian Rumah Tangga dan Sarpras
                              </Option>
                              <Option value="Pusat Data dan Informasi (Pusdatin)">
                                Pusat Data dan Informasi (Pusdatin)
                              </Option>
                              <Option value="Biro Umum dan Keuangan">Biro Umum dan Keuangan</Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        {/* Jabatan */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="position"
                            label={<span style={{ fontWeight: 600 }}>Jabatan / Posisi Kerja</span>}
                            rules={[{ required: true, message: "Jabatan wajib diisi!" }]}
                          >
                            <Input
                              prefix={<BankOutlined style={{ color: "#94a3b8" }} />}
                              placeholder="Contoh: Dokter Penanggung Jawab / Ahli K3"
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* Jenis Kelamin */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            name="gender"
                            label={<span style={{ fontWeight: 600 }}>Jenis Kelamin</span>}
                          >
                            <Radio.Group size="large">
                              <Radio value="L">Laki-laki</Radio>
                              <Radio value="P">Perempuan</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col>

                        {/* Peran Sistem (Read Only) */}
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<span style={{ fontWeight: 600 }}>Hak Akses Sistem (Role)</span>}
                          >
                            <Input
                              disabled
                              value={roleLabels[user.role]?.label || user.role}
                              prefix={<SafetyCertificateOutlined style={{ color: "#0d9488" }} />}
                              size="large"
                              style={{ background: "#f8fafc", color: "#334155" }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Alamat Kantor / Domisili */}
                        <Col xs={24}>
                          <Form.Item
                            name="address"
                            label={<span style={{ fontWeight: 600 }}>Alamat / Lokasi Kerja</span>}
                          >
                            <Input
                              placeholder="Contoh: Gedung B Lantai 2, Ruang Poliklinik K3 ANRI"
                              size="large"
                            />
                          </Form.Item>
                        </Col>

                        {/* Catatan / Bio Singkat */}
                        <Col xs={24}>
                          <Form.Item
                            name="bio"
                            label={<span style={{ fontWeight: 600 }}>Catatan / Bio Singkat</span>}
                          >
                            <TextArea
                              rows={3}
                              placeholder="Deskripsi singkat mengenai peranan atau keahlian di lingkungan ANRI..."
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Divider style={{ margin: "16px 0 24px" }} />

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                        <Button
                          icon={<UndoOutlined />}
                          onClick={() => profileForm.resetFields()}
                          disabled={isSaving}
                        >
                          Reset Form
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          loading={isSaving}
                          style={{
                            background: "#0d9488",
                            borderColor: "#0d9488",
                            fontWeight: 600,
                            padding: "0 24px",
                          }}
                        >
                          Simpan Perubahan Profil
                        </Button>
                      </div>
                    </Form>
                  ),
                },
                {
                  key: "password",
                  label: (
                    <span>
                      <KeyOutlined /> Ubah Kata Sandi (Password)
                    </span>
                  ),
                  children: (
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={onFinishPassword}
                      style={{ maxWidth: 560 }}
                    >
                      <Alert
                        message="Keamanan Akun"
                        description="Gunakan kata sandi yang kuat dengan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk menjaga keamanan akun PRIMA K3 Anda."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 20, borderRadius: 8 }}
                      />

                      {/* Password Saat Ini */}
                      <Form.Item
                        name="currentPassword"
                        label={<span style={{ fontWeight: 600 }}>Kata Sandi Saat Ini</span>}
                        rules={[{ required: true, message: "Masukkan kata sandi saat ini!" }]}
                      >
                        <Input.Password
                          prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                          placeholder="Masukkan kata sandi lama"
                          size="large"
                        />
                      </Form.Item>

                      {/* Password Baru */}
                      <Form.Item
                        name="newPassword"
                        label={<span style={{ fontWeight: 600 }}>Kata Sandi Baru</span>}
                        rules={[
                          { required: true, message: "Masukkan kata sandi baru!" },
                          { min: 6, message: "Kata sandi minimal 6 karakter!" },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                          placeholder="Masukkan kata sandi baru"
                          size="large"
                          onChange={(e) => setNewPasswordVal(e.target.value)}
                        />
                      </Form.Item>

                      {/* Password Strength Indicator */}
                      {newPasswordVal && (
                        <div style={{ marginBottom: 16, marginTop: -8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <Text type="secondary">Kekuatan Kata Sandi:</Text>
                            <Text strong style={{ color: passwordStrength.color }}>
                              {passwordStrength.text}
                            </Text>
                          </div>
                          <div className="password-strength-bar">
                            <div
                              className="password-strength-fill"
                              style={{
                                width: `${passwordStrength.score}%`,
                                backgroundColor: passwordStrength.color,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Konfirmasi Password Baru */}
                      <Form.Item
                        name="confirmPassword"
                        label={<span style={{ fontWeight: 600 }}>Konfirmasi Kata Sandi Baru</span>}
                        dependencies={["newPassword"]}
                        rules={[
                          { required: true, message: "Konfirmasi kata sandi baru wajib diisi!" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("newPassword") === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error("Kata sandi konfirmasi tidak cocok!"));
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined style={{ color: "#94a3b8" }} />}
                          placeholder="Ulangi kata sandi baru"
                          size="large"
                        />
                      </Form.Item>

                      <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 20 }}>
                        <Text strong style={{ fontSize: 13, color: "#334155" }}>
                          Kriteria Kata Sandi yang Baik:
                        </Text>
                        <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 12, color: "#64748b" }}>
                          <li>Minimal 8 karakter untuk keamanan optimal</li>
                          <li>Mengandung kombinasi huruf besar dan kecil</li>
                          <li>Menyertakan angka dan karakter spesial (!@#$%^&*)</li>
                          <li>Tidak menggunakan tanggal lahir atau NIP sebagai kata sandi</li>
                        </ul>
                      </div>

                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={isSavingPassword}
                        style={{
                          background: "#0d9488",
                          borderColor: "#0d9488",
                          fontWeight: 600,
                          padding: "0 24px",
                        }}
                      >
                        Perbarui Kata Sandi
                      </Button>
                    </Form>
                  ),
                },
                {
                  key: "preferences",
                  label: (
                    <span>
                      <BellOutlined /> Notifikasi & Pengaturan
                    </span>
                  ),
                  children: (
                    <div>
                      <Title level={5} style={{ marginBottom: 8 }}>
                        Preferensi Notifikasi K3
                      </Title>
                      <Paragraph type="secondary" style={{ fontSize: 13 }}>
                        Atur saluran dan jenis peringatan darurat atau pengumuman yang ingin Anda terima.
                      </Paragraph>

                      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 20 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            background: "#f8fafc",
                            borderRadius: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: "#1e293b" }}>
                              Notifikasi Laporan Bahaya & Kecelakaan Kerja
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              Dapatkan notifikasi instan saat ada laporan insiden K3 baru di unit kerja Anda.
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            background: "#f8fafc",
                            borderRadius: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: "#1e293b" }}>
                              Pengingat Batas Waktu Pelaporan TASPEN
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              Peringatan countdown batas 5 hari kerja (ASN) untuk klaim jaminan kecelakaan kerja.
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            background: "#f8fafc",
                            borderRadius: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: "#1e293b" }}>
                              Pengingat Jadwal Konsultasi Psikolog
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>
                              Pengingat otomatis H-1 sebelum sesi konseling kesehatan mental dimulai.
                            </div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* Right Sidebar: Ringkasan Akun & Status Kepegawaian */}
        <Col xs={24} lg={8}>
          {/* Card Status Kepegawaian */}
          <Card className="profile-side-card" title={<span style={{ fontWeight: 700 }}>Ringkasan Akun ANRI</span>}>
            <div className="profile-stat-row">
              <span className="profile-stat-label">
                <IdcardOutlined /> ID Pegawai
              </span>
              <span className="profile-stat-value">EMP-00{user.id}</span>
            </div>

            <div className="profile-stat-row">
              <span className="profile-stat-label">
                <SafetyCertificateOutlined /> Status Keaktifan
              </span>
              <Tag color="success" icon={<CheckOutlined />} style={{ margin: 0, fontWeight: 600 }}>
                ASN AKTIF
              </Tag>
            </div>

            <div className="profile-stat-row">
              <span className="profile-stat-label">
                <BankOutlined /> Satuan Kerja
              </span>
              <span className="profile-stat-value" style={{ maxWidth: 170 }}>
                {user.unit}
              </span>
            </div>

            <div className="profile-stat-row">
              <span className="profile-stat-label">
                <UserOutlined /> Peran RBAC
              </span>
              <Tag color={roleLabels[user.role]?.color || "blue"} style={{ margin: 0 }}>
                {user.role.toUpperCase()}
              </Tag>
            </div>

            <div className="profile-stat-row">
              <span className="profile-stat-label">
                <MailOutlined /> Tanggal Terdaftar
              </span>
              <span className="profile-stat-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" }) : "Januari 2024"}
              </span>
            </div>

            <Divider style={{ margin: "14px 0" }} />

            <div style={{ background: "#f0fdfa", border: "1px solid #ccfbf1", padding: 12, borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f766e", fontWeight: 600, fontSize: 13 }}>
                <InfoCircleOutlined /> Role Switcher Demo
              </div>
              <div style={{ fontSize: 12, color: "#115e59", marginTop: 4 }}>
                Anda dapat mengganti peran demo (Admin, Tim K3, Kepala Unit, Pegawai) kapan saja melalui menu profil pojok kanan atas.
              </div>
            </div>
          </Card>

          {/* Quick Help Box */}
          <Card className="profile-side-card" style={{ background: "#fafafa" }}>
            <Title level={5} style={{ margin: 0, fontSize: 14 }}>
              Bantuan Akun & Pelayanan K3
            </Title>
            <Paragraph style={{ fontSize: 12, color: "#64748b", marginTop: 6, marginBottom: 12 }}>
              Jika terdapat kendala sinkronisasi NIP atau data kedinasan, silakan hubungi Tim Pengelola Kepegawaian & Klinik Pratama ANRI.
            </Paragraph>
            <div style={{ fontSize: 12, color: "#0d9488", fontWeight: 500 }}>
              📞 Hotline: Ext. 401 / (021) 7805851
            </div>
          </Card>
        </Col>
      </Row>

      {/* MODAL UBAH FOTO PROFIL / AVATAR */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CameraOutlined style={{ color: "#0d9488", fontSize: 18 }} />
            <span style={{ fontWeight: 700 }}>Ubah Foto Profil / Avatar</span>
          </div>
        }
        open={isAvatarModalOpen}
        onCancel={() => setIsAvatarModalOpen(false)}
        onOk={handleSaveAvatar}
        okText="Terapkan Foto"
        cancelText="Batal"
        okButtonProps={{
          style: { background: "#0d9488", borderColor: "#0d9488", fontWeight: 600 },
        }}
        width={580}
      >
        <div style={{ textAlign: "center", padding: "12px 0 20px" }}>
          {/* Avatar Preview */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={selectedPreset || avatarUrl}
              alt="Preview"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #0d9488",
                boxShadow: "0 4px 12px rgba(13, 148, 136, 0.25)",
                backgroundColor: "#f8fafc",
              }}
            />
          </div>
          <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: "#334155" }}>
            Pratinjau Foto Profil
          </div>
        </div>

        <Tabs
          defaultActiveKey="preset"
          items={[
            {
              key: "preset",
              label: "Pilih Karakter Avatar",
              children: (
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Pilih salah satu karakter avatar profesional yang sesuai dengan Anda:
                  </Text>
                  <div className="avatar-preset-grid">
                    {PRESET_AVATARS.map((item) => {
                      const isSelected = selectedPreset === item.url;
                      return (
                        <Tooltip key={item.id} title={item.label}>
                          <div
                            className={`avatar-preset-item ${isSelected ? "is-selected" : ""}`}
                            onClick={() => {
                              setSelectedPreset(item.url);
                              setTempUploadedAvatar(null);
                            }}
                          >
                            <img src={item.url} alt={item.label} />
                            {isSelected && (
                              <div className="avatar-selected-check">
                                <CheckOutlined />
                              </div>
                            )}
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              ),
            },
            {
              key: "upload",
              label: "Unggah Foto dari Perangkat",
              children: (
                <div style={{ padding: "12px 0" }}>
                  <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 14 }}>
                    Unggah foto pribadi resmi berformat PNG, JPG, atau WEBP (Maksimal 3 MB):
                  </Text>

                  {/* Hidden Input File */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />

                  <div
                    style={{
                      border: "2px dashed #cbd5e1",
                      borderRadius: 12,
                      padding: "24px 16px",
                      textAlign: "center",
                      background: "#f8fafc",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadOutlined style={{ fontSize: 32, color: "#0d9488", marginBottom: 10 }} />
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>
                      Klik untuk Memilih Foto dari Komputer / HP
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                      Mendukung format JPG, PNG, WEBP (Maks. 3 MB)
                    </div>
                  </div>

                  {tempUploadedAvatar && (
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "#f0fdfa",
                        borderRadius: 8,
                        border: "1px solid #ccfbf1",
                      }}
                    >
                      <Space>
                        <CheckCircleFilled style={{ color: "#0d9488" }} />
                        <Text style={{ fontSize: 13, color: "#0f766e", fontWeight: 500 }}>
                          Foto kustom berhasil dipilih dan siap diterapkan
                        </Text>
                      </Space>
                      <Button
                        size="small"
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempUploadedAvatar(null);
                          setSelectedPreset(user.avatar || PRESET_AVATARS[0].url);
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />

        <Divider style={{ margin: "16px 0 12px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            size="small"
            type="link"
            icon={<UndoOutlined />}
            onClick={handleResetAvatar}
            style={{ padding: 0, color: "#64748b" }}
          >
            Reset ke Karakter Default
          </Button>
        </div>
      </Modal>
    </div>
  );
};
