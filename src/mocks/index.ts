import { initialUsers } from "./users";
import { initialHazardReports, initialHazardCategories } from "./hazardReports";
import { initialHiradc } from "./hiradc";
import { initialAccidents } from "./accidents";
import { initialInvestigations } from "./investigations";
import { initialInspections } from "./inspections";
import { initialPsychologistBookings, mockSlots } from "./psychologist";
import { initialDiseases, initialDiseaseTrends } from "./diseases";
import { initialAnnouncements } from "./announcements";
import { initialArticles, initialArticleCategories } from "./articles";
import { initialPosters } from "./posters";
import { initialSettings } from "./settings";
import { initialDashboardSummary } from "./dashboard";
import { initialPublicArticles, initialPublicPosters } from "./publicData";

// In-memory data store yang mendukung mutasi (create/update/delete)
export const mockDb: Record<string, any[]> = {
  users: [...initialUsers],
  "hazard-reports": [...initialHazardReports],
  "hazard-categories": [...initialHazardCategories],
  hiradc: [...initialHiradc],
  "accident-reports": [...initialAccidents],
  investigations: [...initialInvestigations],
  inspections: [...initialInspections],
  "psychologist-bookings": [...initialPsychologistBookings],
  diseases: [...initialDiseases],
  "disease-trends": [...initialDiseaseTrends],
  announcements: [...initialAnnouncements],
  articles: [...initialArticles],
  "article-categories": [...initialArticleCategories],
  posters: [...initialPosters],
  settings: [{ ...initialSettings }],
  edukasi: [...initialPublicArticles],
  poster: [...initialPublicPosters],
};

export {
  initialUsers,
  initialHazardReports,
  initialHazardCategories,
  initialHiradc,
  initialAccidents,
  initialInvestigations,
  initialInspections,
  initialPsychologistBookings,
  mockSlots,
  initialDiseases,
  initialDiseaseTrends,
  initialAnnouncements,
  initialArticles,
  initialArticleCategories,
  initialPosters,
  initialSettings,
  initialDashboardSummary,
  initialPublicArticles,
  initialPublicPosters,
};
