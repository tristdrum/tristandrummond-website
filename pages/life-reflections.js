import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/globals.css';

const LifeReflectionsPage = () => {
  const [reflections, setReflections] = useState([]);

  useEffect(() => {
    const fetchReflections = async () => {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('category', 'Life & Reflections');
      if (error) {
        console.error('Error fetching reflections:', error);
      } else {
        setReflections(data);
      }
    };

    fetchReflections();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Life & Reflections</h1>
      <div className={styles.reflections}>
        {reflections.map((reflection, index) => (
          <div key={index} className={styles.reflection}>
            <h2>{reflection.title}</h2>
            <p>{reflection.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifeReflectionsPage;
