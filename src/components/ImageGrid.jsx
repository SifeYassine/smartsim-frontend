import { API_BASE_URL } from "@/lib/api";
import { truncateText } from "@/lib/utils";

export default function ImageGrid({ images, showSimilarity = false }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((item, idx) => {
        const filename = typeof item === "string" ? item : item.filename;
        const similarity = item.similarity;

        return (
          <div
            key={idx}
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-border"
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img
                src={`${API_BASE_URL}/static/${filename}`}
                alt={filename}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-3">
              {showSimilarity && similarity !== undefined && (
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                  Similarity: {(similarity * 100).toFixed(1)}%
                </p>
              )}
              <p className="text-xs text-muted-foreground truncate" title={filename}>
                {truncateText(filename, 25)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
