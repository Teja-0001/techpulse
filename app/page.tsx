import { getTopHeadlines } from "@/lib/news";
import { getUserBookmarks } from "@/app/actions/bookmarks";
import ArticleCard from "@/components/ArticleCard";

export default async function HomePage() {
  const [{ articles }, bookmarks] = await Promise.all([
    getTopHeadlines(),
    getUserBookmarks(),
  ]);

  const bookmarkedUrls = new Set(bookmarks.map((b) => b.articleUrl));

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Top Tech News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.url}
            article={article}
            isBookmarked={bookmarkedUrls.has(article.url)}
          />
        ))}
      </div>
    </main>
  );
}
