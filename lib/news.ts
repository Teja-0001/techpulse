export interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function getTopHeadlines() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?category=technology&pageSize=12&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export async function searchArticles(query: string) {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 600 } },
  );
  if (!res.ok) throw new Error("Failed to search articles");
  return res.json();
}
