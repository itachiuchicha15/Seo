
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string; // publish date
  author: string;
  excerpt: string;
  image: {
    url: string;
    alt_text: string;
  };
  content: string;
  metrics: {
    rank: number | string;
    clicks: number;
    impressions: number;
  };
  tags: string[];
  categories: string[];
  created_at?: string;
  updated_at?: string | null;
  seo: {
    title: string | null;
    meta_description: string | null;
  };
}

export interface ContactMessage {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}