import "./style.css";
import api, { API_BASE_URL } from "./api.js";

// App State
const state = {
  selectedFiles: [],
  folderName: "",
  uploadedImagePath: "",
  currentClusterIndex: 0,
  clusterData: null,
  searchResults: null,
};

// DOM Elements
const elements = {
  // Tabs
  searchTab: document.getElementById("search-tab"),
  clusterTab: document.getElementById("cluster-tab"),
  searchSection: document.getElementById("search-section"),
  clusteringSection: document.getElementById("clustering-section"),

  // Theme
  themeToggle: document.getElementById("theme-toggle"),

  // Folder Upload
  folderInput: document.getElementById("folder-input"),
  selectFolderBtn: document.getElementById("select-folder-btn"),
  uploadFolderBtn: document.getElementById("upload-folder-btn"),
  folderInfo: document.getElementById("folder-info"),
  folderName: document.getElementById("folder-name"),
  fileCount: document.getElementById("file-count"),

  // Search Parameters
  topKInput: document.getElementById("top-k-input"),
  thresholdInput: document.getElementById("threshold-input"),

  // Text Search
  textQueryInput: document.getElementById("text-query-input"),
  textSearchBtn: document.getElementById("text-search-btn"),

  // Image Search
  imageUploadInput: document.getElementById("image-upload-input"),
  imagePreviewContainer: document.getElementById("image-preview-container"),
  imagePreview: document.getElementById("image-preview"),
  removeImageBtn: document.getElementById("remove-image-btn"),
  imageSearchBtn: document.getElementById("image-search-btn"),

  // Clustering
  maxClustersInput: document.getElementById("max-clusters-input"),
  clusterThresholdInput: document.getElementById("cluster-threshold-input"),
  minImagesInput: document.getElementById("min-images-input"),
  maxImagesInput: document.getElementById("max-images-input"),
  clusterBtn: document.getElementById("cluster-btn"),

  // Results
  resultsContainer: document.getElementById("results-container"),
  notificationContainer: document.getElementById("notification-container"),
};

// Theme
function initTheme() {
  const stored = localStorage.getItem("image-app-theme");
  const theme = stored || "light";

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    updateThemeIcon("dark");
  } else {
    updateThemeIcon("light");
  }
}

function updateThemeIcon(theme) {
  const icon =
    theme === "dark"
      ? '<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 1 0 0-10z"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

  elements.themeToggle.querySelector("svg").innerHTML = icon;
}

function toggleTheme(event) {
  const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const newTheme = current === "dark" ? "light" : "dark";

  // Update CSS properties for radial animation
  const rect = event.target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  document.documentElement.style.setProperty("--toggle-x", `${x}px`);
  document.documentElement.style.setProperty("--toggle-y", `${y}px`);

  // Use View Transition API if supported
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("image-app-theme", newTheme);
      updateThemeIcon(newTheme);
    });
  } else {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("image-app-theme", newTheme);
    updateThemeIcon(newTheme);
  }
}

// Tab Switching
function switchTab(tab) {
  if (tab === "search") {
    elements.searchTab.className =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-background text-foreground shadow-sm";
    elements.clusterTab.className =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50";
    elements.searchSection.classList.remove("hidden");
    elements.clusteringSection.classList.add("hidden");
  } else {
    elements.clusterTab.className =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-background text-foreground shadow-sm";
    elements.searchTab.className =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-background/50";
    elements.clusteringSection.classList.remove("hidden");
    elements.searchSection.classList.add("hidden");
  }
}

// Notifications
function showNotification(message, type = "info") {
  const notification = document.createElement("div");

  const errorStyle = "bg-destructive/15 border-destructive/20 text-destructive";
  const successStyle = "bg-green-500/10 border-green-500 text-green-800 dark:text-green-400";
  const infoStyle = "bg-primary/15 border-primary/20 text-primary";

  notification.className = `rounded-lg p-4 shadow-lg border transition-colors notification-enter pointer-events-auto ${
    type === "error" ? errorStyle : type === "success" ? successStyle : infoStyle
  }`;

  const iconSvg =
    type === "error"
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-shrink-0">${iconSvg}</div>
      <div class="ml-3 flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="flex-shrink-0 ml-4 opacity-70 hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  `;

  const closeBtn = notification.querySelector("button");
  closeBtn.addEventListener("click", () => notification.remove());

  elements.notificationContainer.innerHTML = "";
  elements.notificationContainer.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
}

// Folder Upload
function updateFolderInfo() {
  if (state.selectedFiles.length === 0) {
    elements.folderInfo.classList.add("hidden");
    elements.uploadFolderBtn.disabled = true;
    return;
  }

  elements.folderInfo.classList.remove("hidden");
  elements.folderName.textContent = `Folder: ${state.folderName}`;
  elements.fileCount.textContent = `${state.selectedFiles.length} image files selected`;
  elements.uploadFolderBtn.disabled = false;
}

function handleFolderSelect(event) {
  const files = Array.from(event.target.files);

  if (files.length === 0) {
    state.selectedFiles = [];
    state.folderName = "";
    updateFolderInfo();
    return;
  }

  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  const imageFiles = files.filter((file) => file.type.startsWith("image/") || imageExtensions.test(file.name));
  if (imageFiles.length === 0) {
    showNotification("No image files found in the selected folder", "error");
    return;
  }

  state.selectedFiles = imageFiles;

  if (imageFiles.length > 0 && imageFiles[0].webkitRelativePath) {
    const pathParts = imageFiles[0].webkitRelativePath.split("/");
    state.folderName = pathParts[0] || "Selected Folder";
  } else {
    state.folderName = `Selected Folder (${imageFiles.length} images)`;
  }

  updateFolderInfo();
}

async function handleUploadFolder() {
  if (state.selectedFiles.length === 0) {
    showNotification("Please select a folder with images", "error");
    return;
  }

  const originalHTML = elements.uploadFolderBtn.innerHTML;

  elements.uploadFolderBtn.disabled = true;
  elements.uploadFolderBtn.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    Uploading...
  `;

  try {
    const formData = new FormData();

    state.selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("images/upload-folder", formData);
    showNotification(response.data.message || "Folder uploaded successfully", "success");

    state.selectedFiles = [];
    state.folderName = "";
    elements.folderInput.value = "";
    updateFolderInfo();
  } catch (error) {
    showNotification(`Error uploading folder: ${error.response?.data?.detail || error.message}`, "error");
  } finally {
    elements.uploadFolderBtn.disabled = false;
    elements.uploadFolderBtn.innerHTML = originalHTML;
  }
}

// Image Upload
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    elements.imagePreview.src = reader.result;
    elements.imagePreviewContainer.classList.remove("hidden");
  };

  reader.readAsDataURL(file);

  const originalHTML = elements.imageSearchBtn.innerHTML;

  elements.imageSearchBtn.disabled = true;
  elements.imageSearchBtn.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    Uploading...
  `;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("images/upload-image", formData);

    state.uploadedImagePath = response.data.file_path;
  } catch (error) {
    showNotification(`Error uploading file: ${error.response?.data?.detail || error.message}`, "error");
    elements.imagePreviewContainer.classList.add("hidden");
  } finally {
    elements.imageSearchBtn.disabled = false;
    elements.imageSearchBtn.innerHTML = originalHTML;
  }
}

function handleRemoveImage() {
  state.uploadedImagePath = "";
  elements.imagePreview.src = "";
  elements.imagePreviewContainer.classList.add("hidden");
  elements.imageUploadInput.value = "";
  elements.imageSearchBtn.disabled = true;
}

// Text Search
async function handleTextSearch() {
  const query = elements.textQueryInput.value.trim();

  if (!query) {
    showNotification("Please enter a search query", "error");
    return;
  }

  const originalHTML = elements.textSearchBtn.innerHTML;

  elements.textSearchBtn.disabled = true;
  elements.textSearchBtn.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    Searching...
  `;

  try {
    const params = {
      query,
      top_k: Number(elements.topKInput.value),
      similarity_threshold: Number(elements.thresholdInput.value),
    };

    const response = await api.post("/search/text", params);

    state.searchResults = response.data;
    displaySearchResults(response.data);

    showNotification(`Found ${response.data.count} similar images`, "success");
  } catch (error) {
    showNotification(`Error searching by text: ${error.response?.data?.detail || error.message}`, "error");
  } finally {
    elements.textSearchBtn.disabled = false;
    elements.textSearchBtn.innerHTML = originalHTML;
  }
}

// Image Search
async function handleImageSearch() {
  if (!state.uploadedImagePath) {
    showNotification("Please upload an image first", "error");
    return;
  }

  const originalHTML = elements.imageSearchBtn.innerHTML;

  elements.imageSearchBtn.disabled = true;
  elements.imageSearchBtn.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    Searching...
  `;

  try {
    const params = {
      image_path: state.uploadedImagePath,
      top_k: Number(elements.topKInput.value),
      similarity_threshold: Number(elements.thresholdInput.value),
    };

    const response = await api.post("/search/image", params);

    state.searchResults = response.data;
    displaySearchResults(response.data);

    showNotification(`Found ${response.data.count} similar images`, "success");
  } catch (error) {
    showNotification(`Error searching by image: ${error.response?.data?.detail || error.message}`, "error");
  } finally {
    elements.imageSearchBtn.disabled = false;
    elements.imageSearchBtn.innerHTML = originalHTML;
  }
}

// Clustering
async function handleCluster() {
  const originalHTML = elements.clusterBtn.innerHTML;

  elements.clusterBtn.disabled = true;
  elements.clusterBtn.innerHTML = `
    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
    Clustering...
  `;

  try {
    const params = {
      maxNumClusters: Number(elements.maxClustersInput.value),
      similarityThreshold: Number(elements.clusterThresholdInput.value),
      minImagesPerCluster: Number(elements.minImagesInput.value),
      maxImagesPerCluster: Number(elements.maxImagesInput.value),
    };

    const response = await api.post("search/cluster", params);

    state.clusterData = response.data;
    state.searchResults = null;
    state.currentClusterIndex = 0;
    displayClusterResults(response.data);

    showNotification(`${response.data.cluster_count} clusters with ${response.data.total_images} images`, "success");
  } catch (error) {
    showNotification(`Error clustering images: ${error.response?.data?.detail || error.message}`, "error");
  } finally {
    elements.clusterBtn.disabled = false;
    elements.clusterBtn.innerHTML = originalHTML;
  }
}

// Display Search Results
function displaySearchResults(results) {
  elements.resultsContainer.classList.remove("hidden");

  const html = `
    <div class="w-full max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6 text-center text-foreground">Search Results (${results.count} found)</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${results.results
          .map(
            (item) => `
          <div class="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-border">
            <div class="aspect-square relative overflow-hidden bg-muted">
              <img
                src="${API_BASE_URL}/static/${item.filename}"
                alt="${item.filename}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div class="p-3">
              <p class="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Similarity: ${(item.similarity * 100).toFixed(1)}%</p>
              <p class="text-xs text-muted-foreground truncate" title="${item.filename}">${truncateText(item.filename, 25)}</p>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `;

  elements.resultsContainer.innerHTML = html;
}

// Display Cluster Results
function displayClusterResults(results) {
  elements.resultsContainer.classList.remove("hidden");

  const clusterKeys = Object.keys(results.clusters);
  const totalClusters = clusterKeys.length;
  const currentClusterKey = clusterKeys[state.currentClusterIndex];
  const currentClusterImages = results.clusters[currentClusterKey] || [];

  const html = `
    <div class="w-full max-w-6xl mx-auto">
      <!-- Navigation Controls -->
      <div class="flex justify-center items-center gap-4 mb-6">
        <button 
          id="prev-cluster-btn"
          class="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          ${state.currentClusterIndex === 0 ? "disabled" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Previous
        </button>

        <span class="text-sm font-medium text-muted-foreground">
          Cluster ${state.currentClusterIndex + 1} of ${totalClusters}
        </span>

        <button 
          id="next-cluster-btn"
          class="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          ${state.currentClusterIndex === totalClusters - 1 ? "disabled" : ""}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>

      <!-- Cluster Images -->
      <div class="w-full max-w-6xl mx-auto p-6">
        <h2 class="text-2xl font-bold mb-6 text-center text-foreground">Cluster ${state.currentClusterIndex + 1}/${totalClusters} (${currentClusterImages.length} images)</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${currentClusterImages
            .map(
              (filename) => `
            <div class="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-border">
              <div class="aspect-square relative overflow-hidden bg-muted">
                <img
                  src="${API_BASE_URL}/static/${filename}"
                  alt="${filename}"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div class="p-3">
                <p class="text-xs text-muted-foreground truncate" title="${filename}">${truncateText(filename, 25)}</p>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  elements.resultsContainer.innerHTML = html;

  // Add cluster navigation listeners
  const prevBtn = document.getElementById("prev-cluster-btn");
  const nextBtn = document.getElementById("next-cluster-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (state.currentClusterIndex > 0) {
        state.currentClusterIndex--;
        displayClusterResults(state.clusterData);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (state.currentClusterIndex < totalClusters - 1) {
        state.currentClusterIndex++;
        displayClusterResults(state.clusterData);
      }
    });
  }
}

function truncateText(text, maxLength = 25) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

// Event Listeners
function initEventListeners() {
  // Theme
  elements.themeToggle.addEventListener("click", toggleTheme);

  // Tabs
  elements.searchTab.addEventListener("click", () => switchTab("search"));
  elements.clusterTab.addEventListener("click", () => switchTab("cluster"));

  // Folder Upload
  elements.folderInput.addEventListener("change", handleFolderSelect);
  elements.selectFolderBtn.addEventListener("click", () => elements.folderInput.click());
  elements.uploadFolderBtn.addEventListener("click", handleUploadFolder);

  // Image Upload
  elements.imageUploadInput.addEventListener("change", handleImageUpload);
  elements.removeImageBtn.addEventListener("click", handleRemoveImage);

  // Text Search
  elements.textQueryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleTextSearch();
  });
  elements.textSearchBtn.addEventListener("click", handleTextSearch);

  // Image Search
  elements.imageSearchBtn.addEventListener("click", handleImageSearch);

  // Clustering
  elements.clusterBtn.addEventListener("click", handleCluster);
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initEventListeners();
});
