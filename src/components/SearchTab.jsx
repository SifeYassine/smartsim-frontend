import { useState, useRef } from "react";
import SearchResults from "@/components/SearchResults";
import { FolderUp, Upload, Settings2, Search, ImagePlus, X, Loader2, Type } from "lucide-react";
import { useNotification } from "@/context/NotificationProvider";
import api from "@/lib/api";

export default function SearchTab() {
  const { showNotification } = useNotification();
  // Folder Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [isUploadingFolder, setIsUploadingFolder] = useState(false);
  const folderInputRef = useRef(null);

  // Search Params State
  const [topK, setTopK] = useState(5);
  const [threshold, setThreshold] = useState(0.12);

  // Text Search State
  const [textQuery, setTextQuery] = useState("");
  const [isSearchingText, setIsSearchingText] = useState(false);

  // Image Search State
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const imageInputRef = useRef(null);

  // Global Search Results State
  const [searchResults, setSearchResults] = useState(null);

  function handleFolderSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) {
      setSelectedFiles([]);
      setFolderName("");
      return;
    }

    const imageExtensions = /\.(jpg|jpeg|png|webp)$/i;
    const imageFiles = files.filter((file) => file.type.startsWith("image/") || imageExtensions.test(file.name));

    if (imageFiles.length === 0) {
      showNotification("No image files found in the selected folder", "error");
      return;
    }

    setSelectedFiles(imageFiles);
    showNotification(`Selected ${imageFiles.length} images`, "success");

    if (imageFiles[0].webkitRelativePath) {
      setFolderName(imageFiles[0].webkitRelativePath.split("/")[0] || "Selected Folder");
    } else {
      setFolderName(`Selected Folder (${imageFiles.length} images)`);
    }
  }

  async function handleUploadFolder() {
    if (selectedFiles.length === 0) {
      showNotification("Please select a folder with images", "error");
      return;
    }

    setIsUploadingFolder(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      const response = await api.post("images/upload-folder", formData);
      showNotification(response.data.message || "Folder uploaded successfully", "success");

      setSelectedFiles([]);
      setFolderName("");

      if (folderInputRef.current) {
        folderInputRef.current.value = "";
      }
    } catch (error) {
      showNotification(`Error uploading folder: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setIsUploadingFolder(false);
    }
  }

  async function handleTextSearch() {
    if (!textQuery.trim()) {
      showNotification("Please enter a search query", "error");
      return;
    }

    setIsSearchingText(true);

    try {
      const response = await api.post("/search/text", {
        query: textQuery,
        top_k: Number(topK),
        similarity_threshold: Number(threshold),
      });

      setSearchResults(response.data);

      showNotification(`Found ${response.data.count} similar images`, "success");
    } catch (error) {
      showNotification(`Error searching by text: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setIsSearchingText(false);
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("images/upload-image", formData);
      setUploadedImagePath(response.data.file_path);

      showNotification(response.data.message || "Image uploaded successfully", "success");
    } catch (error) {
      showNotification(`Error uploading file: ${error.response?.data?.detail || error.message}`, "error");
      handleRemoveImage();
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleRemoveImage() {
    setUploadedImagePath("");
    setImagePreview("");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  async function handleImageSearch() {
    if (!uploadedImagePath) {
      showNotification("Please upload an image first", "error");
      return;
    }

    setIsSearchingImage(true);

    try {
      const response = await api.post("/search/image", {
        image_path: uploadedImagePath,
        top_k: Number(topK),
        similarity_threshold: Number(threshold),
      });

      setSearchResults(response.data);

      showNotification(`Found ${response.data.count} similar images`, "success");
    } catch (error) {
      showNotification(`Error searching by image: ${error.response?.data?.detail || error.message}`, "error");
    } finally {
      setIsSearchingImage(false);
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto  space-y-6">
        {/* Upload Folder */}
        <div className="bg-card border-border rounded-lg border shadow-sm">
          <div className="p-6 pb-3">
            <h2 className="flex items-center gap-2 text-card-foreground font-semibold text-lg">
              <FolderUp className="h-6 w-6" /> Upload Image Folder
            </h2>
          </div>
          <div className="p-6 pt-3 space-y-4">
            <div className="flex gap-3">
              <input
                type="file"
                ref={folderInputRef}
                webkitdirectory="true"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFolderSelect}
              />

              <button
                onClick={() => folderInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                <FolderUp className="h-4 w-4" /> Select Image Folder
              </button>

              <button
                onClick={handleUploadFolder}
                disabled={selectedFiles.length === 0 || isUploadingFolder}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingFolder ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {isUploadingFolder ? "Uploading..." : "Upload Folder"}
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium text-foreground">Folder: {folderName}</p>
                <p className="text-sm font-medium text-muted-foreground">{selectedFiles.length} image files selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Parameters */}
        <div className="bg-card border-border rounded-lg border shadow-sm">
          <div className="p-6 pb-3">
            <h2 className="flex items-center gap-2 text-card-foreground font-semibold text-lg">
              <Settings2 className="h-6 w-6" /> Search Parameters
            </h2>
          </div>
          <div className="p-6 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Number of Results</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={topK}
                  onChange={(e) => setTopK(e.target.value)}
                  className="bg-background border-input text-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Similarity Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="bg-background border-input text-foreground w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Search */}
        <div className="bg-card border-border rounded-lg border shadow-sm">
          <div className="p-6 pb-3">
            <h2 className="flex items-center gap-2 text-card-foreground font-semibold text-lg">
              <Type className="h-6 w-6" /> Search by Text
            </h2>
          </div>
          <div className="p-6 pt-3">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Describe what you're looking for..."
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <button
                onClick={handleTextSearch}
                disabled={!textQuery.trim() || isSearchingText}
                className="flex items-center gap-2 justify-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearchingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Image Search */}
        <div className="bg-card border-border rounded-lg border shadow-sm">
          <div className="p-6 pb-3">
            <h2 className="flex items-center gap-2 text-card-foreground font-semibold text-lg">
              <ImagePlus className="h-6 w-6" /> Search by Image
            </h2>
          </div>
          <div className="p-6 pt-3 space-y-3 flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80 transition-colors"
            />

            {imagePreview && (
              <div className="relative inline-block w-32 h-32">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md border border-border"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <button
              onClick={handleImageSearch}
              disabled={!uploadedImagePath || isUploadingImage || isSearchingImage}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearchingImage || isUploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isUploadingImage ? "Uploading..." : isSearchingImage ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
      {searchResults && <SearchResults results={searchResults} />}
    </>
  );
}
