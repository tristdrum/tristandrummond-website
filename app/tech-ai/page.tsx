"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Article {
  title: string;
  content: string;
}

const TechAIPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("category", "Tech & AI");
        if (error) {
          setError(error.message);
        } else {
          setArticles(data || []);
        }
      } catch (err) {
        setError("Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <h1>Tech & AI Articles</h1>
        <div className="articles">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Tech & AI Articles</h1>
        <div className="articles">
          <p>Temporarily unavailable. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Tech & AI Articles</h1>
      <div className="articles">
        {articles.length === 0 ? (
          <p>No articles available yet.</p>
        ) : (
          articles.map((article, index) => (
            <div key={index} className="article">
              <h2>{article.title}</h2>
              <p>{article.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TechAIPage;
