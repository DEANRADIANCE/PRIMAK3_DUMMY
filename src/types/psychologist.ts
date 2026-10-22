export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

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
  createdAt: string;
  updatedAt: string;
}

export interface IAvailableSlot {
  date: string;
  time: string;
  available: boolean;
}
