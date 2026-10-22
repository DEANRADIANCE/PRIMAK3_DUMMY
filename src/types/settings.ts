export interface ISettings {
  id: number;
  // Batas hari TASPEN
  taspenDeadlineASN: number; // dalam hari kerja
  taspenDeadlinePPPK: number; // dalam hari kerja
  // Ambang batas risiko untuk alert
  riskThresholdLow: number; // default 4
  riskThresholdMedium: number; // default 9
  riskThresholdHigh: number; // default 16
  // Parameter lingkungan (disimpan terpisah, referensi via endpoint)
  clinicName: string;
  clinicAddress: string;
  emergencyNumbers: { label: string; number: string }[];
}

// TODO: Nilai default TASPEN ASN=5 hari kerja, PPPK=3 hari kerja.
// Verifikasi dengan aturan yang berlaku (PP Nomor 70 Tahun 2015 dan regulasi terkait).
