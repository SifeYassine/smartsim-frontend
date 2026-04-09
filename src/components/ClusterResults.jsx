import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageGrid from "@/components/ImageGrid";

export default function ClusterResults({ clusterData }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [clusterData]);

  if (!clusterData?.clusters) {
    return null;
  }

  const clusters = Object.values(clusterData.clusters);

  if (clusters.length === 0) {
    return null;
  }

  const currentCluster = clusters[currentIndex];
  const isFirstCluster = currentIndex === 0;
  const isLastCluster = currentIndex === clusters.length - 1;

  function previous() {
    setCurrentIndex((index) => index - 1);
  }

  function next() {
    setCurrentIndex((index) => index + 1);
  }

  return (
    <div className="w-full pt-8 border-t border-border mt-8">
      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={previous}
            disabled={isFirstCluster}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-sm font-medium text-muted-foreground">
            Cluster {currentIndex + 1} of {clusters.length}
          </span>

          <button
            onClick={next}
            disabled={isLastCluster}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          Cluster {currentIndex + 1}/{clusters.length} ({currentCluster.length} images)
        </h2>

        <ImageGrid images={currentCluster} showSimilarity={false} />
      </div>
    </div>
  );
}
