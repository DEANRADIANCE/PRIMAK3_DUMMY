export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "rendah" | "sedang" | "tinggi";

export interface ITaskComment {
  id: string;
  senderId: number;
  senderName: string;
  senderRole: "dokter" | "pasien" | "admin" | "tim_k3";
  senderAvatar?: string;
  message: string;
  createdAt: string;
}

export interface IPsychologistTask {
  id: string;
  bookingId: number;
  patientId: number;
  patientName: string;
  doctorName?: string;
  title: string;
  description: string;
  category: string; // e.g. "Relaksasi & Napas" | "Journaling Emosi" | "Aktivitas Fisik" | "Manajemen Stres" | "Lainnya"
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  completedAt?: string;
  createdAt: string;
  comments: ITaskComment[];
}

export interface IPsychologistBooking {
  id: number;
  patientName: string;
  patientId: number;
  contactNumber: string;
  reason: string; // Hanya bisa dilihat oleh psikolog/Admin
  sessionDate: string;
  sessionTime: string; // "08:00" | "13:00"
  status: BookingStatus;
  notes?: string;
  // Fitur Tindak Lanjut & Penugasan Pasien
  needsFollowUp?: boolean; // true = perlu tindak lanjut, false = tidak perlu
  followUpNotes?: string; // Catatan rekomendasi / evaluasi tindak lanjut dari psikolog
  followUpDate?: string; // Tanggal rencana evaluasi lanjutan
  tasks?: IPsychologistTask[]; // Daftar penugasan terapi / self-care dari dokter psikologi
  createdAt: string;
  updatedAt: string;
}

export interface IAvailableSlot {
  date: string;
  time: string;
  available: boolean;
}
