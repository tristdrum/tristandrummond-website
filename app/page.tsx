"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import WheelNav from "./components/WheelNav";
import type { LifeDomain } from "@/lib/types";

const HomePage = () => {
  const [lifeDomains, setLifeDomains] = useState<LifeDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLifeDomains = async () => {
      try {
        const { data, error } = await supabase.from("life_domains").select("*");
        if (error) {
          setError(error.message);
        } else {
          setLifeDomains(data || []);
        }
      } catch (err: any) {
        console.error("Error fetching life domains:", err);
        return <div>Error loading life domains</div>;
      } finally {
        setIsLoading(false);
      }
    };

    fetchLifeDomains();
  }, []);

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">
        Welcome to Tristan Drummond's Website
      </h1>
      <WheelNav segments={lifeDomains} />
    </div>
  );
};

export default HomePage;
