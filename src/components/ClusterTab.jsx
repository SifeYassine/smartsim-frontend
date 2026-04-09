import { useState, useEffect } from "react";
import ClusterResults from "@/components/ClusterResults";
import { Layers, Loader2 } from "lucide-react";
import { useNotification } from "@/context/NotificationProvider";
import api from "@/lib/api";
import { use } from "react";

export default function ClusterTab() {
  const { showNotification } = useNotification();
  const [maxClusters, setMaxClusters] = useState("");
  const [threshold, setThreshold] = useState("");
  const [minImages, setMinImages] = useState("");
  const [maxImages, setMaxImages] = useState("");
  const [isClustering, setIsClustering] = useState(false);
  const [clusterData, setClusterData] = useState(null);

  async function handleCluster() {
    setIsClustering(true);

    try {
      const params = {};

      if (maxClusters) params.maxNumClusters = Number(maxClusters);
      if (threshold) params.similarityThreshold = Number(threshold);
      if (minImages) params.minImagesPerCluster = Number(minImages);
      if (maxImages) params.maxImagesPerCluster = Number(maxImages);

      const response = await api.post("search/cluster", params);
      setClusterData(response.data);

      showNotification(`${response.data.cluster_count} clusters with ${response.data.total_images} images`, "success");
    } catch (error) {
      showNotification(`Error clustering images: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setIsClustering(false);
    }
  }

  return (
    <>
      {/* Clustering Parameters */}
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow-sm">
        <div className="p-6 pb-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <Layers className="h-6 w-6" /> Image Clustering
          </h2>
        </div>

        <div className="p-6 pt-3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Max Number of Clusters</label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 10"
                value={maxClusters}
                onChange={(e) => setMaxClusters(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Similarity Threshold</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="e.g., 0.7"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Min Images per Cluster</label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 2"
                value={minImages}
                onChange={(e) => setMinImages(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Max Images per Cluster</label>
              <input
                type="number"
                min="1"
                placeholder="e.g., 20"
                value={maxImages}
                onChange={(e) => setMaxImages(e.target.value)}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Leave fields empty to use default clustering behavior</p>
            <p>• Use either "Max Clusters" OR "Similarity Threshold", not both</p>
            <p>• Min/Max images per cluster are optional filters</p>
          </div>

          <button
            onClick={handleCluster}
            disabled={isClustering}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClustering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
            {isClustering ? "Clustering..." : "Cluster"}
          </button>
        </div>
      </div>

      {clusterData && <ClusterResults clusterData={clusterData} />}
    </>
  );
}
