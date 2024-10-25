import { use } from "react";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

async function getArticle(params: Promise<{ slug: string }>) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      articles_topics!inner (
        topics (
          id,
          name
        )
      )
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...data,
    topics: data.articles_topics.map((at) => at.topics.name),
  } as Article;
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = use(getArticle(params));

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <p>Article not found</p>
          <Link href="/articles" className="text-blue-500 hover:underline">
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/articles"
          className="text-gray-400 hover:text-white mb-6 block"
        >
          ← Back to articles
        </Link>

        {article.image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              priority
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex gap-2 mb-8">
          {article.topics.map((topic) => (
            <span
              key={topic}
              className="text-sm bg-gray-800 px-3 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">{article.content}</div>
      </div>
    </div>
  );
}
