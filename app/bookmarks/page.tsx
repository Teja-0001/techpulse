import { getUserBookmarks } from "@/app/actions/bookmarks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const bookmarks = await getUserBookmarks();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Your Bookmarks</h1>
      <p className="text-gray-500 mb-8">{bookmarks.length} saved articles</p>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔖</div>
          <p className="text-xl font-medium">No bookmarks yet</p>
          <p className="text-sm mt-2">Save articles from the homepage!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {bookmark.imageUrl && (
                <img
                  src={bookmark.imageUrl}
                  alt={bookmark.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <p className="text-xs text-orange-500 font-semibold mb-2">
                  {bookmark.source}
                </p>
                <h2 className="font-bold text-gray-900 text-sm leading-snug mb-4 line-clamp-3">
                  {bookmark.title}
                </h2>

                <a
                  href={bookmark.articleUrl}
                  target="_blank"
                  className="text-xs text-orange-500 font-medium hover:underline"
                >
                  Read more →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
