"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ArticlesLayout from "../components/ArticlesLayout";
import type { LifeDomain } from "@/lib/types";

export default function LifeDomainPage() {
  const params = useParams();
  const lifeDomainSlug = params.lifeDomainSlug as string;
  const [lifeDomain, setLifeDomain] = useState<LifeDomain | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLifeDomain = async () => {
      const { data, error } = await supabase
        .from("life_domains")
        .select("*")
        .eq("slug", lifeDomainSlug)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setLifeDomain(data);
      }
    };

    if (lifeDomainSlug) {
      fetchLifeDomain();
    }
  }, [lifeDomainSlug]);

  if (error) return <div>Error: {error}</div>;
  if (!lifeDomain) return <div>Loading...</div>;

  return (
    <ArticlesLayout
      lifeDomainId={lifeDomain.id}
      title={lifeDomain.label}
      showLifeDomainFilter={false}
    />
  );
}
