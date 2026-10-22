import { IDashboardSummary } from "../types/dashboard";

export const initialDashboardSummary: IDashboardSummary = {
  totalAccidents: 3,
  totalEmployees: 485,
  totalHazardReports: 14,
  complianceScore: 88, // Persentase %
  monthlyVisits: [
    { month: "Okt 25", count: 42 },
    { month: "Nov 25", count: 56 },
    { month: "Des 25", count: 38 },
    { month: "Jan 26", count: 65 },
    { month: "Feb 26", count: 72 },
    { month: "Mar 26", count: 54 },
  ],
  diseaseTrends: [
    { disease: "Flu / ISPA", count: 48 },
    { disease: "Gastritis / Diare", count: 32 },
    { disease: "Radang Tenggorokan", count: 24 },
    { disease: "Demam Berdarah (DBD)", count: 5 },
  ],
  accidentTypes: [
    { type: "Terjatuh / Terpeleset", count: 5 },
    { type: "Tertimpa Benda", count: 3 },
    { type: "Tersengat Listrik", count: 2 },
    { type: "Terhirup Gas / Kimia", count: 1 },
  ],
  monthlyAccidents: [
    { month: "Okt 25", count: 1 },
    { month: "Nov 25", count: 0 },
    { month: "Des 25", count: 2 },
    { month: "Jan 26", count: 1 },
    { month: "Feb 26", count: 1 },
    { month: "Mar 26", count: 2 },
  ],
  healthStats: [
    { label: "Pegawai Bebas Risiko PAK", value: 412, total: 485 },
    { label: "Kebugaran Fisik Prima", value: 380, total: 485 },
    { label: "Status Imunisasi Lengkap", value: 450, total: 485 },
  ],
  employeeStats: {
    registered: 462,
    total: 485,
  },
  psychologistVisits: [
    { month: "Okt 25", count: 6 },
    { month: "Nov 25", count: 8 },
    { month: "Des 25", count: 12 },
    { month: "Jan 26", count: 9 },
    { month: "Feb 26", count: 14 },
    { month: "Mar 26", count: 11 },
  ],
  healthCheckup: [
    { gender: "Laki-laki", completed: 215, total: 240 },
    { gender: "Perempuan", completed: 220, total: 245 },
  ],
  latestAnnouncements: [
    {
      id: 1,
      title: "Pemeriksaan Kesehatan Berkala (MCU) Pegawai ANRI 2026",
      date: "24-26 Maret 2026",
      description: "MCU berkala meliputi laboratorium darah, rontgen dada, EKG, dan konsultasi dokter bagi ASN & PPPK.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Simulasi Evakuasi Kebakaran & Gempa Bumi",
      date: "28 Maret 2026",
      description: "Gladi simulasi kesiapsiagaan bencana bersama Sudin Gulkarmat Jakarta Selatan.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Vaksinasi Influenza Tahunan Pegawai",
      date: "25-27 Februari 2026",
      description: "Pemberian vaksin kuadrivalen untuk mencegah penularan influenza di lingkungan kantor.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    },
  ],
};
