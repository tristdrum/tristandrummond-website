"use client";

import Link from "next/link";
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
      } catch (err: unknown) {
        console.error("Error fetching life domains:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLifeDomains();
  }, []);

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Welcome to Tristan Drummond's Website</h1>
      <Link
        href="/jan-demo"
        className="mb-5 inline-block rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Open Jan Process Demo
      </Link>

      {isLoading && <div>Loading life domains...</div>}

      {!isLoading && error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Couldn&apos;t load life domains right now ({error}). The Jan demo route is still available.
        </div>
      )}

      {!isLoading && !error && <WheelNav segments={lifeDomains} />}
    </div>
  );
};

export default HomePage;
