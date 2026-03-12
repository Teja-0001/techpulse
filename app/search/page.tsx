import { searchArticles } from "@/lib/news";
import { getUserBookmarks } from "@/app/actions/bookmarks";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || "";

  if (!query) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-xl font-medium">Enter a search term</p>
        </div>
      </main>
    );
  }

  const [{ articles }, bookmarks] = await Promise.all([
    searchArticles(query),
    getUserBookmarks(),
  ]);

  const bookmarkedUrls = new Set(bookmarks.map((b) => b.articleUrl));

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Search results for <span className="text-orange-500">"{query}"</span>
        </h1>
        <p className="text-gray-500 mt-1">
          {articles?.length ?? 0} articles found
        </p>
        <Link
          href="/"
          className="text-orange-500 text-sm hover:underline mt-1 inline-block"
        >
          ← Back to Home
        </Link>
      </div>

      {articles?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-xl font-medium">No articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
            <ArticleCard
              key={article.url}
              article={article}
              isBookmarked={bookmarkedUrls.has(article.url)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
