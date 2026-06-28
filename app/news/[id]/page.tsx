import { notFound } from "next/navigation";
import Image from "next/image";

interface Props {
  params: { id: string };
}

interface Article {
  title: string;
  content: string;
  urlToImage: string;
  url: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${decodeURIComponent(id)}&pageSize=1&apiKey=${process.env.NEWS_API_KEY}`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    return data.articles?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const article = await getArticle(params.id);
  return {
    title: article?.title ?? "Article Not Found",
    openGraph: { images: [article?.urlToImage] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.id);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto p-8">
      <Image
        src={article.urlToImage}
        alt={article.title}
        width={800}
        height={450}
        className="rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4 text-gray-600">{article.content}</p>
    </article>
  );
}
