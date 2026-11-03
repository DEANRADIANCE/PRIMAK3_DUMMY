export interface IArticleCategory {
  id: number;
  name: string;
  slug: string;
}

export interface IArticle {
  id: number;
  title: string;
  category: IArticleCategory;
  categoryId: number;
  content: string;
  summary: string;
  image?: string;
  author: string;
  isPublished: boolean;
  status?: "Terbit" | "Draf" | "Dijadwalkan" | string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}
