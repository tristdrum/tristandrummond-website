// I made this comment the first time I expected Vercel to successfully deploy this.

import { supabase } from "../supabase";

export async function getArticles({
  topics = [],
  page = 1,
  limit = 10,
  orderBy = "published_date",
  order = "desc",
}: {
  topics?: string[];
  page?: number;
  limit?: number;
  orderBy?: "published_date" | "title";
  order?: "asc" | "desc";
}) {
  let query = supabase.from("articles").select(
    `
      *,
      articles_topics!inner (
        topics (
          id,
          name
        )
      )
    `,
    { count: "exact" }
  );

  if (topics.length > 0) {
    query = query.in("articles_topics.topics.id", topics);
  }

  query = query.order(orderBy, { ascending: order === "asc" });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  // Transform the data to match the expected format
  const articles = data.map((article) => ({
    ...article,
    topics: article.articles_topics.map(
      (at: { topics: { name: string } }) => at.topics.name
    ),
  }));

  return {
    articles,
    total: count || 0,
    page,
    limit,
  };
}

export async function getTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Error fetching topics: ${error.message}`);
  }

  return data;
}
