export default function ArticleLoading() {
  return (
    <div className="max-w-3xl mx-auto p-8 animate-pulse">
      <div className="bg-gray-200 rounded-xl h-64 mb-6" />
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
