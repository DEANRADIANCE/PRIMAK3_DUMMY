import { ISettings } from "../types/settings";

export const initialSettings: ISettings = {
  id: 1,
  taspenDeadlineASN: 5, // 5 hari kerja
  taspenDeadlinePPPK: 3, // 3 hari kerja
  riskThresholdLow: 4,
  riskThresholdMedium: 9,
  riskThresholdHigh: 16,
  clinicName: "Klinik Pratama ANRI",
  clinicAddress: "Gedung A Lantai 1, Jl. Ampera Raya No. 7, Cilandak Timur, Jakarta Selatan",
  emergencyNumbers: [
    { label: "Klinik Pratama ANRI (Internal Ext)", number: "Ext. 119 / 1122" },
    { label: "Posko Tim K3 & Tanggap Darurat", number: "0811-9988-7766" },
    { label: "Ambulans Gawat Darurat DKI", number: "118 / 119" },
    { label: "Dinas Pemadam Kebakaran (Damkar)", number: "113 / (021) 7690001" },
    { label: "Polsek Cilandak / Polres Jaksel", number: "110 / (021) 7501511" },
    { label: "Rumah Sakit Rujukan Terdekat (RSUD Pasar Minggu)", number: "(021) 29555555" },
  ],
};
