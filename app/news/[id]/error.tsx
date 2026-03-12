"use client";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center p-16">
      <h2>Something went wrong loading this article.</h2>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 btn-primary">
        Try Again
      </button>
    </div>
  );
}
