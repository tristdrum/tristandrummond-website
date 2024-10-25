"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ArticleCard from "./ArticleCard";
import FilterModal from "./FilterModal";
import type { Article, Topic, LifeDomain } from "@/lib/types";

interface ArticlesLayoutProps {
  lifeDomainId?: string;
  showLifeDomainFilter?: boolean;
  title?: string;
}

export default function ArticlesLayout({
  lifeDomainId,
  showLifeDomainFilter = false,
  title = "Articles",
}: ArticlesLayoutProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lifeDomains, setLifeDomains] = useState<LifeDomain[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedLifeDomainId, setSelectedLifeDomainId] = useState<
    string | null
  >(lifeDomainId || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch articles and filter based on life domain
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let query = supabase.from("articles").select(`
          *,
          articles_topics (
            topics (
              id,
              name,
              life_domain_topics (
                life_domain_id
              )
            )
          )
        `);

        const { data, error } = await query;

        if (error) {
          setError(error.message);
        } else {
          const transformedArticles = data.map((article) => ({
            ...article,
            topics: article.articles_topics.map((at) => at.topics.name),
          }));
          setArticles(transformedArticles);
          setFilteredArticles(transformedArticles);
        }
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fetch topics for the current life domain
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        let query = supabase.from("topics").select(`
          *,
          life_domain_topics!inner (
            life_domain_id
          )
        `);

        if (selectedLifeDomainId) {
          query = query.eq(
            "life_domain_topics.life_domain_id",
            selectedLifeDomainId
          );
        }

        const { data, error } = await query.order("name");

        if (error) {
          throw error;
        }

        setTopics(data);
      } catch (err) {
        setError("Failed to fetch topics");
      }
    };

    fetchTopics();
  }, [selectedLifeDomainId]);

  // Fetch life domains if needed
  useEffect(() => {
    if (!showLifeDomainFilter) return;

    const fetchLifeDomains = async () => {
      const { data, error } = await supabase.from("life_domains").select("*");
      if (error) {
        setError(error.message);
      } else {
        setLifeDomains(data);
      }
    };

    fetchLifeDomains();
  }, [showLifeDomainFilter]);

  // Filter articles based on selected topics and life domain
  useEffect(() => {
    let filtered = articles;

    if (selectedLifeDomainId) {
      filtered = filtered.filter((article) =>
        article.articles_topics.some((at) =>
          at.topics.life_domain_topics.some(
            (ldt) => ldt.life_domain_id === selectedLifeDomainId
          )
        )
      );
    }

    if (selectedTopicIds.length > 0) {
      filtered = filtered.filter((article) =>
        article.articles_topics.some((at) =>
          selectedTopicIds.includes(at.topics.id)
        )
      );
    }

    setFilteredArticles(filtered);
  }, [selectedTopicIds, selectedLifeDomainId, articles]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
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
          {filteredArticles.map((article) => (
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
        lifeDomains={showLifeDomainFilter ? lifeDomains : []}
        selectedLifeDomainId={selectedLifeDomainId}
        onLifeDomainSelect={
          showLifeDomainFilter ? (id) => setSelectedLifeDomainId(id) : undefined
        }
      />
    </div>
  );
}
