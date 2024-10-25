"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ArticleCard from "../components/ArticleCard";
import FilterModal from "../components/FilterModal";
import type { Article, Topic } from "@/lib/types";

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let query = supabase.from("articles").select(`
            *,
            articles_topics!inner (
              topics (
                id,
                name
              )
            )
          `);

        if (selectedTopicIds.length > 0) {
          query = query.in("articles_topics.topic_id", selectedTopicIds);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message);
        } else {
          const transformedArticles = data.map((article) => ({
            ...article,
            topics: article.articles_topics.map((at) => at.topics.name),
          }));
          setArticles(transformedArticles);
        }
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }

        setTopics(data);
      } catch (err) {
        setError("Failed to fetch topics");
      }
    };

    fetchArticles();
    fetchTopics();
  }, [selectedTopicIds]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          Filter
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        topics={topics}
        selectedTopicIds={selectedTopicIds}
        onTopicSelect={(topicId) => {
          setSelectedTopicIds((prev) =>
            prev.includes(topicId)
              ? prev.filter((id) => id !== topicId)
              : [...prev, topicId]
          );
        }}
      />
    </div>
  );
};

export default ArticlesPage;
