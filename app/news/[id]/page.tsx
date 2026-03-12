import { notFound } from "next/navigation";
import Image from "next/image"; // next/image

interface Props {
  params: { id: string };
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
  if (!article) notFound(); // triggers not-found.tsx

  return (
    <article className="max-w-3xl mx-auto p-8">
      <Image
        src={article.urlToImage}
        alt={article.title}
        width={800}
        height={450} // Optimized image
        className="rounded-xl mb-6"
      />
      <h1 className="text-3xl font-bold">{article.title}</h1>
      <p className="mt-4 text-gray-600">{article.content}</p>
    </article>
  );
}
