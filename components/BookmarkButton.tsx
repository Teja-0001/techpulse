"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addBookmark, removeBookmark } from "@/app/actions/bookmarks";

interface Props {
  article: {
    url: string;
    title: string;
    description: string | null;
    urlToImage: string | null;
    source: { name: string };
  };
  isBookmarked: boolean;
}

export default function BookmarkButton({ article, isBookmarked }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    if (bookmarked) {
      await removeBookmark(article.url);
      setBookmarked(false);
    } else {
      await addBookmark(article);
      setBookmarked(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-xl transition-all duration-200 hover:scale-125 ${loading ? "opacity-50" : ""}`}
      title={bookmarked ? "Remove bookmark" : "Save bookmark"}
    >
      {bookmarked ? "🔖" : "🏷️"}
    </button>
  );
}
