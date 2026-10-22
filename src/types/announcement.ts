export interface IAnnouncement {
  id: number;
  title: string;
  date: string;
  eventDate: string;
  location: string;
  description: string;
  content: string;
  attachments: string[];
  image?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
