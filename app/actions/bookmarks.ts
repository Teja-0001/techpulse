"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function addBookmark(article: {
  url: string;
  title: string;
  description: string | null;
  urlToImage: string | null;
  source: { name: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.bookmark.upsert({
    where: {
      userId_articleUrl: {
        userId: session.user.id,
        articleUrl: article.url,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      articleUrl: article.url,
      title: article.title,
      description: article.description,
      imageUrl: article.urlToImage,
      source: article.source.name,
    },
  });

  revalidatePath("/bookmarks");
}

export async function removeBookmark(articleUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.bookmark.deleteMany({
    where: {
      userId: session.user.id,
      articleUrl: articleUrl,
    },
  });

  revalidatePath("/bookmarks");
}

export async function getUserBookmarks() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return db.bookmark.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
