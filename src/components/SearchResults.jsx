import ImageGrid from "@/components/ImageGrid";

export default function SearchResults({ results }) {
  if (!results || !results.results) {
    return null;
  }

  return (
    <div className="w-full pt-8 border-t border-border mt-8">
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Search Results ({results.count} found)</h2>
        <ImageGrid images={results.results} showSimilarity={true} />
      </div>
    </div>
  );
}
