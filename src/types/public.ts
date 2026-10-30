export interface Article {
  id: number | string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail_url: string;
  published_at: string;
}

export interface Poster {
  id: number | string;
  title: string;
  description: string;
  category: string;
  color: string;
  file_url: string;
  thumbnail_url?: string;
}
