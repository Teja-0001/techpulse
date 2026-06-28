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

interface NewsApiResponse {
  articles: Article[];
  totalResults: number;
  status: string;
}

export async function getTopHeadlines(): Promise<NewsApiResponse> {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?category=technology&pageSize=12&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json() as Promise<NewsApiResponse>;
}

export async function searchArticles(query: string): Promise<NewsApiResponse> {
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 600 } },
  );
  if (!res.ok) throw new Error("Failed to search articles");
  return res.json() as Promise<NewsApiResponse>;
}
