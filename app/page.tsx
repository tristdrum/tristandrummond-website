"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import WheelNav from "./components/WheelNav";

interface WheelSegment {
  label: string;
  color: string;
  link: string;
}

const HomePage = () => {
  const [wheelData, setWheelData] = useState<WheelSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWheelData = async () => {
      try {
        const { data, error } = await supabase.from("wheel").select("*");
        if (error) {
          setError(error.message);
        } else {
          setWheelData(data || []);
        }
      } catch (err) {
        setError("Failed to fetch wheel data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWheelData();
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Tristan Drummond's Website
      </h1>
      <WheelNav segments={wheelData} />
    </div>
  );
};

export default HomePage;
