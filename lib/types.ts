export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  published_date: string;
  slug: string;
  topics: string[];
}

export type Topic = string;
