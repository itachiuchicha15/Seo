
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl: string;
  content: string;
  metrics: {
    rank: number | string;
    clicks: number;
    impressions: number;
  };
  tags: string[];
}
