export type InvestigationStatus = "draft" | "in_progress" | "completed" | "closed";

export interface IWitness {
  name: string;
  position: string;
  unit: string;
  statement: string;
}

export interface IInvestigation {
  id: number;
  relatedReportId: number;
  relatedReportType: "hazard" | "accident";
  relatedReportNumber: string;
  // Data Kejadian
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  chronology: string;
  // Saksi
  witnesses: IWitness[];
  // Analisis Penyebab
  directCauses: string[];
  indirectCauses: string[];
  rootCauses: string[];
  // Rekomendasi & Tindakan
  recommendations: string[];
  correctiveActions: { action: string; responsiblePerson: string; targetDate: string; status: string }[];
  // Tanda Tangan
  k3TeamSignature: { name: string; position: string; date: string; signed: boolean };
  unitHeadSignature: { name: string; position: string; date: string; signed: boolean };
  status: InvestigationStatus;
  investigatorId: number;
  investigatorName: string;
  createdAt: string;
  updatedAt: string;
}
// TODO: Field investigasi ini berdasarkan standar umum. Sesuaikan dengan dokumen acuan
// https://docs.google.com/document/d/1rNUR9pUWrm2ZINazOkyObvDoDK2eQnPM/edit
