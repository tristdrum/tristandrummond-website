export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  published_date: string;
  slug: string;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface LifeDomain {
  id: string;
  label: string;
  color: string;
  slug: string;
  created_at: string;
}

export interface ArticleTopic {
  article_id: string;
  topic_id: string;
  created_at: string;
}

export interface LifeDomainTopic {
  life_domain_id: string;
  topic_id: string;
  created_at: string;
}
