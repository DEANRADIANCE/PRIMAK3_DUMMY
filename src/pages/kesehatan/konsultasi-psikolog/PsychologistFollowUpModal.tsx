import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Radio,
  Input,
  DatePicker,
  Progress,
  Divider,
  Card,
  Avatar,
  Empty,
  Form,
  Select,
  message,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  SendOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  IPsychologistBooking,
  IPsychologistTask,
  ITaskComment,
  TaskStatus,
  TaskPriority,
} from "../../../types/psychologist";
import { IUser } from "../../../types/user";
import "../kesehatan.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
  booking: IPsychologistBooking | null;
  currentUser?: IUser;
  onSaveBooking: (updatedBooking: IPsychologistBooking) => void;
}

export const PsychologistFollowUpModal: React.FC<Props> = ({
  open,
  onClose,
  booking,
  currentUser,
  onSaveBooking,
}) => {
  const [currentBooking, setCurrentBooking] = useState<IPsychologistBooking | null>(booking);
  const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);
  const [followUpDecision, setFollowUpDecision] = useState<boolean>(true);
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState<string>("");

  // New task form state
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskForm] = Form.useForm();

  // Active task comment input: map of taskId -> message
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  // Filter task
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (booking) {
      setCurrentBooking(booking);
      setFollowUpDecision(booking.needsFollowUp ?? true);
      setFollowUpNotes(booking.followUpNotes || "");
      setFollowUpDate(booking.followUpDate || "");
      setIsEditingFollowUp(false);
      setIsCreatingTask(false);
    }
  }, [booking]);

  if (!currentBooking) return null;

  const isDoctor =
    currentUser?.role === "admin" ||
    currentUser?.role === "tim_k3" ||
    currentUser?.email === "admin@anri.go.id";

  const isPatient =
    currentUser?.id === currentBooking.patientId ||
    currentUser?.role === "pegawai";

  const tasks = currentBooking.tasks || [];
  const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (taskStatusFilter === "all") return true;
    return t.status === taskStatusFilter;
  });

  // Handler: Save Follow-up Decision (Doctor only)
  const handleSaveFollowUpDecision = () => {
    const updated: IPsychologistBooking = {
      ...currentBooking,
      needsFollowUp: followUpDecision,
      followUpNotes: followUpNotes,
      followUpDate: followUpDate,
      status: "completed", // biasanya selesai konsul saat menentukan tindak lanjut
      updatedAt: new Date().toISOString(),
    };

    setCurrentBooking(updated);
    onSaveBooking(updated);
    setIsEditingFollowUp(false);
    message.success("Keputusan tindak lanjut konsultasi berhasil diperbarui!");
  };

  // Handler: Create New Task (Doctor only)
  const handleCreateTask = (values: any) => {
    const newTask: IPsychologistTask = {
      id: `task-${Date.now()}`,
      bookingId: currentBooking.id,
      patientId: currentBooking.patientId,
      patientName: currentBooking.patientName,
      doctorName: currentUser?.name || "Dr. Budi Santoso, M.K.K.",
      title: values.title,
      description: values.description,
      category: values.category || "Relaksasi & Napas",
      dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : dayjs().add(7, "day").format("YYYY-MM-DD"),
      priority: values.priority || "sedang",
      status: "pending",
      createdAt: new Date().toISOString(),
      comments: [
        {
          id: `comm-${Date.now()}`,
          senderId: currentUser?.id || 1,
          senderName: currentUser?.name || "Dr. Budi Santoso, M.K.K.",
          senderRole: "dokter",
          message: `Penugasan "${values.title}" telah dibuat oleh dokter psikolog. Silakan kerjakan dan laporkan perkembangannya melalui komentar ini.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const updatedTasks = [...(currentBooking.tasks || []), newTask];
    const updatedBooking: IPsychologistBooking = {
      ...currentBooking,
      tasks: updatedTasks,
      needsFollowUp: true,
      updatedAt: new Date().toISOString(),
    };

    setCurrentBooking(updatedBooking);
    onSaveBooking(updatedBooking);
    setIsCreatingTask(false);
    taskForm.resetFields();
    message.success(`Penugasan "${newTask.title}" berhasil ditambahkan untuk pasien!`);
  };

  // Handler: Toggle Task Status (Patient or Doctor)
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = (currentBooking.tasks || []).map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    const updatedBooking: IPsychologistBooking = {
      ...currentBooking,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };

    setCurrentBooking(updatedBooking);
    onSaveBooking(updatedBooking);

    const statusLabel =
      newStatus === "completed"
        ? "Telah Diselesaikan"
        : newStatus === "in_progress"
        ? "Sedang Dikerjakan"
        : "Belum Dikerjakan";
    message.success(`Status penugasan diperbarui: ${statusLabel}`);
  };

  // Handler: Add Feedback / Comment to Task
  const handleSendComment = (taskId: string) => {
    const text = commentInputs[taskId]?.trim();
    if (!text) {
      message.warning("Ketik pesan feedback terlebih dahulu!");
      return;
    }

    const senderRole = isDoctor ? "dokter" : "pasien";
    const newComment: ITaskComment = {
      id: `comm-${Date.now()}`,
      senderId: currentUser?.id || (isDoctor ? 1 : currentBooking.patientId),
      senderName: currentUser?.name || (isDoctor ? "Dr. Budi Santoso, M.K.K." : currentBooking.patientName),
      senderRole: senderRole,
      message: text,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = (currentBooking.tasks || []).map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
      }
      return t;
    });

    const updatedBooking: IPsychologistBooking = {
      ...currentBooking,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    };

    setCurrentBooking(updatedBooking);
    onSaveBooking(updatedBooking);
    setCommentInputs((prev) => ({ ...prev, [taskId]: "" }));
    message.success("Feedback berhasil dikirim!");
  };

  const handleUseQuickSuggestion = (taskId: string, suggestion: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [taskId]: suggestion,
    }));
  };

  const doctorSuggestions = [
    "Progres sangat baik, lanjutkan latihan ini secara konsisten.",
    "Perhatikan ritme napas, jangan ragu beristirahat jika lelah.",
    "Bagus sekali, silakan catat pemicu stres lain yang dirasakan.",
    "Mari evaluasi hasil latihan ini pada sesi kontrol berikutnya.",
  ];

  const patientSuggestions = [
    "Latihan sudah saya laksanakan hari ini, merasa jauh lebih tenang.",
    "Saya masih merasakan sedikit cemas saat memulai tugas arsip.",
    "Tugas telah saya selesaikan dengan baik hari ini Dok.",
    "Mohon saran Dok jika detak jantung masih terasa berdebar.",
  ];

  const currentSuggestions = isDoctor ? doctorSuggestions : patientSuggestions;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" type="primary" onClick={onClose} style={{ borderRadius: 8 }}>
          Tutup & Kembali
        </Button>,
      ]}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#ccfbf1",
              color: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            <MedicineBoxOutlined />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Tindak Lanjut & Penugasan Konsultasi Psikolog
            </div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
              Sesi Pasien: <strong style={{ color: "#0f172a" }}>{currentBooking.patientName}</strong> (Tgl:{" "}
              {currentBooking.sessionDate} Pukul {currentBooking.sessionTime} WIB)
            </div>
          </div>
        </div>
      }
      destroyOnClose
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: "calc(85vh - 120px)", overflowY: "auto", paddingRight: 6 }}>
        {/* Sesi info ringkas */}
        <div className="psych-followup-header">
          <Row gutter={[16, 12]} align="middle">
            <Col xs={24} sm={16}>
              <Space direction="vertical" size={2}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Text strong style={{ fontSize: 14, color: "#0f766e" }}>
                    Keluhan / Alasan Konsultasi:
                  </Text>
                  <Tag color="cyan" style={{ borderRadius: 6 }}>
                    Kerahasiaan Medis ANRI
                  </Tag>
                </div>
                <Paragraph style={{ margin: 0, fontSize: 13, color: "#1e293b", fontStyle: "italic" }}>
                  "{currentBooking.reason}"
                </Paragraph>
              </Space>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: "right" }}>
              <Space direction="vertical" size={4} style={{ width: "100%", alignItems: "flex-end" }}>
                <Tag
                  color={currentBooking.status === "completed" ? "green" : "blue"}
                  style={{ borderRadius: 6, fontWeight: 600, padding: "2px 10px" }}
                >
                  {currentBooking.status === "completed" ? "✔ Sesi Selesai" : "⏳ Terkonfirmasi"}
                </Tag>
                <div style={{ fontSize: 11.5, color: "#64748b" }}>
                  Psikolog: <strong>Dr. Budi Santoso, M.K.K.</strong>
                </div>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 1. KEPUTUSAN TINDAK LANJUT KONSULTASI */}
        <Card
          size="small"
          bordered
          style={{
            borderRadius: 12,
            marginBottom: 20,
            borderColor: currentBooking.needsFollowUp ? "#99f6e4" : "#e2e8f0",
            background: currentBooking.needsFollowUp ? "#f0fdfa" : "#ffffff",
          }}
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Space>
                <FileDoneOutlined style={{ color: "#0d9488" }} />
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  Keputusan & Status Tindak Lanjut Pasca Konseling
                </span>
              </Space>
              {isDoctor && !isEditingFollowUp && (
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditingFollowUp(true)}
                  style={{ borderRadius: 6, borderColor: "#0d9488", color: "#0d9488" }}
                >
                  Ubah Keputusan
                </Button>
              )}
            </div>
          }
        >
          {isEditingFollowUp ? (
            /* Mode Edit Keputusan Tindak Lanjut (Dokter) */
            <div style={{ padding: "8px 0" }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block", marginBottom: 6 }}>
                  Apakah Pasien Memerlukan Tindak Lanjut?
                </Text>
                <Radio.Group
                  value={followUpDecision}
                  onChange={(e) => setFollowUpDecision(e.target.value)}
                  buttonStyle="solid"
                  size="middle"
                >
                  <Radio.Button value={true} style={{ borderRadius: "8px 0 0 8px" }}>
                    <CheckCircleOutlined style={{ marginRight: 6, color: "#059669" }} />
                    Perlu Tindak Lanjut (Penugasan & Monitoring)
                  </Radio.Button>
                  <Radio.Button value={false} style={{ borderRadius: "0 8px 8px 0" }}>
                    <InfoCircleOutlined style={{ marginRight: 6, color: "#64748b" }} />
                    Tidak Perlu Tindak Lanjut (Konseling Selesai)
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ display: "block", marginBottom: 6 }}>
                  Catatan Evaluasi Klinis & Rekomendasi Dokter:
                </Text>
                <TextArea
                  rows={3}
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Tuliskan catatan evaluasi, diagnosa ringkas, dan arahan latihan untuk pasien..."
                  style={{ borderRadius: 8 }}
                />
              </div>

              {followUpDecision && (
                <div style={{ marginBottom: 14 }}>
                  <Text strong style={{ display: "block", marginBottom: 6 }}>
                    Target Jadwal Evaluasi / Kontrol Lanjutan (Opsional):
                  </Text>
                  <DatePicker
                    value={followUpDate ? dayjs(followUpDate) : null}
                    onChange={(_, dateStr) => setFollowUpDate(dateStr as string)}
                    placeholder="Pilih tanggal evaluasi lanjutan"
                    style={{ width: "100%", maxWidth: 300, borderRadius: 8 }}
                  />
                </div>
              )}

              <Space>
                <Button
                  type="primary"
                  onClick={handleSaveFollowUpDecision}
                  style={{ borderRadius: 8, background: "#0d9488" }}
                >
                  Simpan Keputusan Tindak Lanjut
                </Button>
                <Button onClick={() => setIsEditingFollowUp(false)} style={{ borderRadius: 8 }}>
                  Batal
                </Button>
              </Space>
            </div>
          ) : (
            /* Mode Tampil Keputusan Tindak Lanjut */
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Text strong style={{ fontSize: 13.5, color: "#334155" }}>
                  Status Evaluasi:
                </Text>
                {currentBooking.needsFollowUp ? (
                  <Tag color="purple" style={{ borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12.5 }}>
                    ● Perlu Tindak Lanjut Aktif
                  </Tag>
                ) : (
                  <Tag color="green" style={{ borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 12.5 }}>
                    ✔ Tidak Perlu Tindak Lanjut (Konseling Mandiri Tuntas)
                  </Tag>
                )}

                {currentBooking.followUpDate && currentBooking.needsFollowUp && (
                  <Tag icon={<CalendarOutlined />} color="cyan" style={{ borderRadius: 6 }}>
                    Jadwal Evaluasi: {currentBooking.followUpDate}
                  </Tag>
                )}
              </div>

              {currentBooking.followUpNotes ? (
                <div
                  style={{
                    background: "#ffffff",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                    color: "#334155",
                    lineHeight: 1.6,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", marginBottom: 2 }}>
                    Catatan Rekomendasi Psikolog Klinis:
                  </div>
                  {currentBooking.followUpNotes}
                </div>
              ) : (
                <Text type="secondary" italic style={{ fontSize: 12.5 }}>
                  Belum ada catatan evaluasi khusus dari psikolog.
                </Text>
              )}
            </div>
          )}
        </Card>

        {/* 2. BAGIAN PENUGASAN / TASK DARI DOKTER KEPADA PASIEN */}
        {currentBooking.needsFollowUp ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div>
                <Title level={5} style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>
                  📋 Program Penugasan & Latihan Pemulihan Pasien
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tugas mandiri yang diresepkan Dr. Psikolog untuk dijalankan pegawai.
                </Text>
              </div>

              {isDoctor && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreatingTask(!isCreatingTask)}
                  style={{ borderRadius: 8, background: "#0d9488" }}
                >
                  {isCreatingTask ? "Tutup Form Tugas" : "Tambah Penugasan Pasien"}
                </Button>
              )}
            </div>

            {/* Progress Bar Penyelesaian Task */}
            {tasks.length > 0 && (
              <Card
                size="small"
                style={{
                  borderRadius: 10,
                  marginBottom: 16,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Row align="middle" justify="space-between" gutter={[16, 8]}>
                  <Col xs={24} sm={16}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Text strong style={{ fontSize: 13, color: "#1e293b" }}>
                        Progres Tugas:
                      </Text>
                      <Progress
                        percent={progressPercent}
                        strokeColor={{ "0%": "#0d9488", "100%": "#10b981" }}
                        style={{ width: 220, margin: 0 }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#0f766e" }}>
                        {completedTasksCount} dari {tasks.length} Selesai
                      </span>
                    </div>
                  </Col>

                  <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                    <Radio.Group
                      size="small"
                      value={taskStatusFilter}
                      onChange={(e) => setTaskStatusFilter(e.target.value)}
                    >
                      <Radio.Button value="all">Semua ({tasks.length})</Radio.Button>
                      <Radio.Button value="in_progress">Berjalan</Radio.Button>
                      <Radio.Button value="completed">Selesai</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Card>
            )}

            {/* FORM TAMBAH TASK BARU (Dokter) */}
            {isCreatingTask && (
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  marginBottom: 20,
                  border: "1.5px dashed #0d9488",
                  background: "#f0fdfa",
                }}
                title={
                  <Space>
                    <PlusOutlined style={{ color: "#0d9488" }} />
                    <span style={{ fontWeight: 700, color: "#0f766e" }}>
                      Form Penugasan Latihan / Self-Care Baru
                    </span>
                  </Space>
                }
              >
                <Form
                  form={taskForm}
                  layout="vertical"
                  onFinish={handleCreateTask}
                  initialValues={{
                    category: "Relaksasi & Napas",
                    priority: "sedang",
                    dueDate: dayjs().add(7, "day"),
                  }}
                >
                  <Row gutter={12}>
                    <Col xs={24} sm={14}>
                      <Form.Item
                        name="title"
                        label="Judul Penugasan"
                        rules={[{ required: true, message: "Judul penugasan wajib diisi!" }]}
                      >
                        <Input
                          placeholder="Contoh: Latihan Pernapasan Ritmis 4-7-8 Setiap Pagi"
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={10}>
                      <Form.Item name="category" label="Kategori Latihan">
                        <Select
                          options={[
                            { label: "Relaksasi & Napas", value: "Relaksasi & Napas" },
                            { label: "Journaling Emosi", value: "Journaling Emosi" },
                            { label: "Aktivitas Fisik", value: "Aktivitas Fisik" },
                            { label: "Manajemen Beban Kerja", value: "Manajemen Beban Kerja" },
                            { label: "Pola Tidur & Rest", value: "Pola Tidur & Rest" },
                            { label: "Lainnya", value: "Lainnya" },
                          ]}
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Instruksi & Petunjuk Pelaksanaan untuk Pasien"
                    rules={[{ required: true, message: "Petunjuk tugas wajib diisi!" }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Jelaskan langkah-langkah praktis, durasi, dan hal yang perlu diperhatikan oleh pasien saat menjalankan tugas ini..."
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Row gutter={12}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="dueDate" label="Tenggat Waktu / Target Pelaksanaan">
                        <DatePicker style={{ width: "100%", borderRadius: 8 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item name="priority" label="Prioritas Penugasan">
                        <Select
                          options={[
                            { label: "Tinggi (Segera Dijalankan)", value: "tinggi" },
                            { label: "Sedang (Rutin Mingguan)", value: "sedang" },
                            { label: "Rendah (Pilihan / Opsional)", value: "rendah" },
                          ]}
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ borderRadius: 8, background: "#0d9488" }}
                    >
                      Kirimkan Penugasan ke Pasien
                    </Button>
                    <Button onClick={() => setIsCreatingTask(false)} style={{ borderRadius: 8 }}>
                      Batal
                    </Button>
                  </Space>
                </Form>
              </Card>
            )}

            {/* DAFTAR TASK CARDS */}
            {filteredTasks.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    Belum ada penugasan terdaftar pada sesi ini.{" "}
                    {isDoctor && "Klik 'Tambah Penugasan Pasien' untuk memberikan latihan terapi."}
                  </span>
                }
              />
            ) : (
              filteredTasks.map((task) => {
                const isTaskCompleted = task.status === "completed";
                const isTaskInProgress = task.status === "in_progress";

                return (
                  <div key={task.id} className={`psych-task-card status-${task.status}`}>
                    {/* Header Task */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                            {task.title}
                          </span>
                          <Tag color="cyan" style={{ borderRadius: 6, fontSize: 11 }}>
                            {task.category}
                          </Tag>
                          <Tag
                            color={
                              task.priority === "tinggi"
                                ? "volcano"
                                : task.priority === "sedang"
                                ? "orange"
                                : "blue"
                            }
                            style={{ borderRadius: 6, fontSize: 11 }}
                          >
                            Prioritas: {task.priority.toUpperCase()}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>
                          Diberikan oleh: <strong>{task.doctorName || "Dr. Budi Santoso"}</strong> |
                          Target Selesai: <strong>{task.dueDate}</strong>
                        </div>
                      </div>

                      {/* Status & Action Button */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {task.status === "completed" ? (
                          <Tag color="green" style={{ borderRadius: 6, fontWeight: 700, padding: "3px 10px" }}>
                            ✔ Selesai Dikerjakan
                          </Tag>
                        ) : task.status === "in_progress" ? (
                          <Tag color="blue" style={{ borderRadius: 6, fontWeight: 700, padding: "3px 10px" }}>
                            ⏳ Sedang Dikerjakan
                          </Tag>
                        ) : (
                          <Tag color="gold" style={{ borderRadius: 6, fontWeight: 700, padding: "3px 10px" }}>
                            Belum Dikerjakan
                          </Tag>
                        )}

                        {/* Tombol perubahan status (pasien / dokter) */}
                        {isTaskCompleted ? (
                          <Button
                            size="small"
                            onClick={() => handleUpdateTaskStatus(task.id, "in_progress")}
                            style={{ borderRadius: 6, fontSize: 11 }}
                          >
                            Buka Kembali
                          </Button>
                        ) : (
                          <Space size={4}>
                            {!isTaskInProgress && (
                              <Button
                                size="small"
                                onClick={() => handleUpdateTaskStatus(task.id, "in_progress")}
                                style={{ borderRadius: 6, fontSize: 11, borderColor: "#0284c7", color: "#0284c7" }}
                              >
                                Mulai Kerjakan
                              </Button>
                            )}
                            <Button
                              size="small"
                              type="primary"
                              icon={<CheckCircleOutlined />}
                              onClick={() => handleUpdateTaskStatus(task.id, "completed")}
                              style={{ borderRadius: 6, fontSize: 11, background: "#059669" }}
                            >
                              Tandai Selesai
                            </Button>
                          </Space>
                        )}
                      </div>
                    </div>

                    {/* Deskripsi Instruksi Tugas */}
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #edf2f7",
                        fontSize: 13,
                        color: "#334155",
                        lineHeight: 1.6,
                        marginBottom: 14,
                      }}
                    >
                      <strong style={{ color: "#0f766e" }}>Instruksi Dokter: </strong>
                      {task.description}
                    </div>

                    {/* SECTION FEEDBACK & DISKUSI INTERAKTIF */}
                    <Divider orientation="left" style={{ margin: "14px 0 10px", fontSize: 12, color: "#64748b" }}>
                      💬 Diskusi Feedback & Refleksi Terapi ({task.comments?.length || 0})
                    </Divider>

                    {/* Comment Thread Box */}
                    <div className="psych-comment-thread">
                      {(!task.comments || task.comments.length === 0) ? (
                        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: "10px 0" }}>
                          Belum ada pesan feedback pada tugas ini. Pasien dan Dokter dapat saling berdiskusi di sini.
                        </div>
                      ) : (
                        task.comments.map((cm) => {
                          const isDoctorComment = cm.senderRole === "dokter";
                          return (
                            <div key={cm.id} className="psych-comment-item">
                              <Avatar
                                size={32}
                                style={{
                                  backgroundColor: isDoctorComment ? "#0d9488" : "#3b82f6",
                                  flexShrink: 0,
                                }}
                                icon={isDoctorComment ? <MedicineBoxOutlined /> : <UserOutlined />}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>
                                    {cm.senderName}
                                  </span>
                                  <Tag
                                    color={isDoctorComment ? "teal" : "blue"}
                                    style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
                                  >
                                    {isDoctorComment ? "Dokter Psikolog" : "Pasien / Pegawai"}
                                  </Tag>
                                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                    {dayjs(cm.createdAt).format("DD MMM HH:mm")} WIB
                                  </span>
                                </div>
                                <div className={`psych-comment-bubble ${isDoctorComment ? "doctor" : "patient"}`}>
                                  {cm.message}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick suggestion prompt chips */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: "#64748b", alignSelf: "center" }}>
                        Inspirasi Cepat:
                      </span>
                      {currentSuggestions.slice(0, 3).map((sug, idx) => (
                        <span
                          key={idx}
                          className="psych-quick-chip"
                          onClick={() => handleUseQuickSuggestion(task.id, sug)}
                        >
                          "{sug.substring(0, 32)}..."
                        </span>
                      ))}
                    </div>

                    {/* Input Feedback Bar */}
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 4 }}>
                      <TextArea
                        rows={2}
                        value={commentInputs[task.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [task.id]: e.target.value }))
                        }
                        placeholder={
                          isDoctor
                            ? "Tulis evaluasi klinis, apresiasi, atau arahan tambahan untuk pasien..."
                            : "Tulis hasil latihan, kendala yang dihadapi, atau respon untuk Dokter Psikolog..."
                        }
                        style={{ borderRadius: 8, fontSize: 12.5 }}
                        onPressEnter={(e) => {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            handleSendComment(task.id);
                          }
                        }}
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={() => handleSendComment(task.id)}
                        style={{ height: 54, borderRadius: 8, background: "#0d9488", padding: "0 18px" }}
                      >
                        Kirim
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Jika tidak perlu tindak lanjut */
          <Card
            style={{
              borderRadius: 12,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              textAlign: "center",
              padding: "24px 16px",
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 42, color: "#16a34a", marginBottom: 12 }} />
            <Title level={4} style={{ color: "#166534", margin: "0 0 8px" }}>
              Konsultasi Telah Selesai Tanpa Tindak Lanjut Khusus
            </Title>
            <Paragraph style={{ color: "#15803d", maxWidth: 600, margin: "0 auto", fontSize: 13.5 }}>
              Dokter psikolog telah mengevaluasi bahwa kondisi mental pegawai dalam taraf adaptif dan stabil.
              Pegawai dapat melanjutkan aktivitas kerja secara mandiri dengan teknik self-care yang telah dibahas saat sesi.
            </Paragraph>
            {isDoctor && (
              <Button
                type="dashed"
                onClick={() => {
                  setFollowUpDecision(true);
                  setIsEditingFollowUp(true);
                }}
                style={{ marginTop: 16, borderRadius: 8, borderColor: "#0d9488", color: "#0d9488" }}
              >
                Ubah Menjadi Perlu Tindak Lanjut
              </Button>
            )}
          </Card>
        )}
      </div>
    </Modal>
  );
};
