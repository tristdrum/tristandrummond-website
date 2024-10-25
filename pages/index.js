import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/globals.css';

const HomePage = () => {
  const [wheelData, setWheelData] = useState([]);

  useEffect(() => {
    const fetchWheelData = async () => {
      const { data, error } = await supabase
        .from('wheel')
        .select('*');
      if (error) {
        console.error('Error fetching wheel data:', error);
      } else {
        setWheelData(data);
      }
    };

    fetchWheelData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Welcome to Tristan Drummond's Website</h1>
      <div className={styles.wheel}>
        {wheelData.map((segment, index) => (
          <div key={index} className={styles.segment}>
            {segment.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
