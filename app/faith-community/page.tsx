"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Reflection {
  title: string;
  content: string;
}

const FaithCommunityPage = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const { data, error } = await supabase
          .from("reflections")
          .select("*")
          .eq("category", "Faith & Community");
        if (error) {
          setError(error.message);
        } else {
          setReflections(data || []);
        }
      } catch (err) {
        setError("Failed to fetch reflections");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReflections();
  }, []);

  if (isLoading) {
    return (
      <div className="container">
        <h1>Faith & Community Reflections</h1>
        <div className="reflections">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Faith & Community Reflections</h1>
        <div className="reflections">
          <p>Temporarily unavailable. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Faith & Community Reflections</h1>
      <div className="reflections">
        {reflections.length === 0 ? (
          <p>No reflections available yet.</p>
        ) : (
          reflections.map((reflection, index) => (
            <div key={index} className="reflection">
              <h2>{reflection.title}</h2>
              <p>{reflection.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FaithCommunityPage;
