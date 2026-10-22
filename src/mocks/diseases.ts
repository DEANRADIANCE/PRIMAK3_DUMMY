import { IDisease, IDiseaseTrend } from "../types/disease";

export const initialDiseases: IDisease[] = [
  { id: 1, name: "Influenza / ISPA", count: 48, month: "Maret", year: 2026 },
  { id: 2, name: "Gastritis / Maag", count: 32, month: "Maret", year: 2026 },
  { id: 3, name: "Hipertensi Esensial", count: 24, month: "Maret", year: 2026 },
  { id: 4, name: "Muskuloskeletal (Low Back Pain)", count: 21, month: "Maret", year: 2026 },
  { id: 5, name: "Diare Akut", count: 14, month: "Maret", year: 2026 },
  { id: 6, name: "Demam Berdarah Dengue (DBD)", count: 5, month: "Maret", year: 2026 },
  { id: 7, name: "Faringitis / Radang Tenggorokan", count: 19, month: "Maret", year: 2026 },
];

export const initialDiseaseTrends: IDiseaseTrend[] = [
  // Januari 2026
  { month: "Jan", disease: "Flu / ISPA", count: 35 },
  { month: "Jan", disease: "Diare", count: 12 },
  { month: "Jan", disease: "DBD", count: 3 },
  { month: "Jan", disease: "Radang", count: 15 },
  // Februari 2026
  { month: "Feb", disease: "Flu / ISPA", count: 42 },
  { month: "Feb", disease: "Diare", count: 16 },
  { month: "Feb", disease: "DBD", count: 7 },
  { month: "Feb", disease: "Radang", count: 18 },
  // Maret 2026
  { month: "Mar", disease: "Flu / ISPA", count: 48 },
  { month: "Mar", disease: "Diare", count: 14 },
  { month: "Mar", disease: "DBD", count: 5 },
  { month: "Mar", disease: "Radang", count: 19 },
];
