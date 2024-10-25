import { supabase } from "../supabase";
import type { Article } from "../types";

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
  let query = supabase.from("articles").select("*", { count: "exact" });

  if (topics.length > 0) {
    query = query.contains("topics", topics);
  }

  query = query.order(orderBy, { ascending: order === "asc" });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }

  return {
    articles: data as Article[],
    total: count || 0,
    page,
    limit,
  };
}

export async function getTopics() {
  const { data, error } = await supabase.from("articles").select("topics");

  if (error) {
    throw new Error(`Error fetching topics: ${error.message}`);
  }

  const allTopics = data.flatMap((article) => article.topics);
  const uniqueTopics = [...new Set(allTopics)].sort();

  return uniqueTopics;
}
