import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/globals.css';

const TechAIPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category', 'Tech & AI');
      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Tech & AI Articles</h1>
      <div className={styles.articles}>
        {articles.map((article, index) => (
          <div key={index} className={styles.article}>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechAIPage;
