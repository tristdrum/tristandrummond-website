"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ArticleCard from "../components/ArticleCard";
import FilterModal from "../components/FilterModal";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  topics: string[];
  slug: string;
}

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let query = supabase.from("articles").select("*");

        // Apply topic filters if any are selected
        if (selectedTopics.length > 0) {
          query = query.contains("topics", selectedTopics);
        }

        const { data, error } = await query;

        if (error) {
          setError(error.message);
        } else {
          setArticles(data || []);

          // Extract unique topics from all articles
          const allTopics = data?.flatMap((article) => article.topics) || [];
          const uniqueTopics = [...new Set(allTopics)].sort();
          setTopics(uniqueTopics);
        }
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [selectedTopics]); // Re-fetch when selected topics change

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="articles">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Articles</h1>
        <div className="articles">
          <p>Temporarily unavailable. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{articles.length} articles</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 border rounded-full hover:bg-gray-800"
        >
          Filter
        </button>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        topics={topics}
        selectedTopics={selectedTopics}
        onApply={setSelectedTopics}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 ? (
          <p className="col-span-full text-center py-12 text-gray-400">
            No articles available with the selected filters.
          </p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
