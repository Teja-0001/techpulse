import Image from "next/image";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

interface Article {
  url: string;
  title: string;
  description: string | null;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
}

interface Props {
  article: Article;
  isBookmarked: boolean;
}

export default function ArticleCard({ article, isBookmarked }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      {article.urlToImage && (
        <div className="relative h-48 w-full">
          <Image
            src={article.urlToImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Source */}
        <p className="text-xs text-orange-500 font-semibold mb-2">
          {article.source.name}
        </p>

        {/* Title */}
        <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-3">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <a
            href={article.url}
            target="_blank"
            className="text-xs text-orange-500 font-medium hover:underline"
          >
            Read more &rarr;
          </a>
          <BookmarkButton article={article} isBookmarked={isBookmarked} />
        </div>
      </div>
    </div>
  );
}
