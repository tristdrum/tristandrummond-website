export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null | undefined;
  published_date: string;
  slug: string;
  created_at: string;
  topics: Topic[];
  articles_topics: {
    topics: {
      id: string;
      name: string;
      life_domain_topics: {
        life_domain_id: string;
      }[];
    };
  }[];
}

export interface Topic {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export type LifeDomain = {
  id: string | number;
  label: string;
  slug: string;
  colour?: string;
};

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
