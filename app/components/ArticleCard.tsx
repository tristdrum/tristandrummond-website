"use client";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="article border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition">
        {article.image_url && (
          <div className="relative w-full h-48 mb-4">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <div className="flex gap-2 mb-2">
          {article.topics.map((topic) => (
            <span
              key={topic.id}
              className="text-sm bg-gray-700 px-2 py-1 rounded"
            >
              {String(topic)}
            </span>
          ))}
        </div>
        <p className="text-gray-400">{article.content}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
