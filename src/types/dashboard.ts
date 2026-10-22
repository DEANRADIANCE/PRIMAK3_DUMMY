export interface IDashboardSummary {
  totalAccidents: number;
  totalEmployees: number;
  totalHazardReports: number;
  complianceScore: number;
  monthlyVisits: { month: string; count: number }[];
  diseaseTrends: { disease: string; count: number }[];
  accidentTypes: { type: string; count: number }[];
  monthlyAccidents: { month: string; count: number }[];
  healthStats: { label: string; value: number; total: number }[];
  employeeStats: { registered: number; total: number };
  psychologistVisits: { month: string; count: number }[];
  healthCheckup: { gender: string; completed: number; total: number }[];
  latestAnnouncements: {
    id: number;
    title: string;
    date: string;
    image?: string;
    description: string;
  }[];
}
