import { IPsychologistBooking, IAvailableSlot } from "../types/psychologist";

export const initialPsychologistBookings: IPsychologistBooking[] = [
  {
    id: 1,
    patientName: "Ahmad Fauzi, A.Md.",
    patientId: 4,
    contactNumber: "081298765432",
    reason: "Sering merasa cemas dan kelelahan mental akibat target digitalisasi arsip akhir tahun dan beban kerja bertumpuk.",
    sessionDate: "2026-03-16",
    sessionTime: "08:00",
    status: "confirmed",
    notes: "Sesi konseling tatap muka di Ruang Konseling Klinik Pratama ANRI",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    patientName: "Rina Kusuma Dewi, S.Sos.",
    patientId: 5,
    contactNumber: "081387654321",
    reason: "Trauma pasca kecelakaan terpeleset di tangga dan sulit berkonsentrasi kembali saat berjalan di kantor.",
    sessionDate: "2026-03-18",
    sessionTime: "13:00",
    status: "confirmed",
    notes: "Pendampingan psikologis trauma ringan pasca insiden kerja",
    createdAt: "2026-03-05T11:00:00Z",
    updatedAt: "2026-03-05T12:00:00Z",
  },
  {
    id: 3,
    patientName: "Dewi Sartika, S.E.",
    patientId: 6,
    contactNumber: "081234567890",
    reason: "Manajemen stres kerja dan work-life balance.",
    sessionDate: "2026-02-20",
    sessionTime: "08:00",
    status: "completed",
    notes: "Konseling selesai, pasien diberikan teknik relaksasi pernapasan 4-7-8",
    createdAt: "2026-02-15T08:00:00Z",
    updatedAt: "2026-02-20T10:00:00Z",
  },
];

// Helper untuk mengecek ketersediaan slot sesi pada tanggal tertentu
export const mockSlots: IAvailableSlot[] = [
  { date: "2026-03-16", time: "08:00", available: false }, // Sudah dibooking Fauzi
  { date: "2026-03-16", time: "13:00", available: true },
  { date: "2026-03-17", time: "08:00", available: true },
  { date: "2026-03-17", time: "13:00", available: true },
  { date: "2026-03-18", time: "08:00", available: true },
  { date: "2026-03-18", time: "13:00", available: false }, // Sudah dibooking Rina
  { date: "2026-03-19", time: "08:00", available: true },
  { date: "2026-03-19", time: "13:00", available: true },
  { date: "2026-03-20", time: "08:00", available: true },
  { date: "2026-03-20", time: "13:00", available: true },
];
