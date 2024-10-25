"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import WheelNav from "./components/WheelNav";
import type { LifeDomain } from "@/lib/types";

const HomePage = () => {
  const [lifeDomains, setLifeDomains] = useState<LifeDomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLifeDomains = async () => {
      try {
        const { data, error } = await supabase.from("life_domains").select("*");
        if (error) {
          setError(error.message);
        } else {
          setLifeDomains(data || []);
        }
      } catch (err) {
        setError("Failed to fetch life domains");
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
