import { IStatusHistory } from "./hazard";

export type EmploymentStatus = "ASN" | "PPPK";
export type SeverityLevel = "ringan" | "sedang" | "berat" | "meninggal";
export type TaspenStatus = "belum" | "diajukan" | "selesai";
export type AccidentStatus = "reported" | "verified" | "in_progress" | "resolved";

export interface IVictim {
  name: string;
  nip: string;
  employmentStatus: EmploymentStatus;
  unit: string;
  injuryType: string;
  medicalAction: string;
}

export interface IK3Team {
  name: string;
  position: string;
  handling: string;
}

export interface IAccidentReport {
  id: number;
  reportNumber: string;
  date: string;
  time: string;
  location: string;
  accidentType: string;
  chronology: string;
  severityLevel: SeverityLevel;
  victim: IVictim;
  k3Team: IK3Team;
  taspenStatus: TaspenStatus;
  taspenDeadline: string;
  status: AccidentStatus;
  statusHistory: IStatusHistory[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}
