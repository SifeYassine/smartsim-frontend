import { Sun, Moon } from "lucide-react";

export default function Header({ activeTab, onTabChange, theme, onThemeToggle }) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-foreground">Image Similarity & Clustering</h1>

          <div className="flex items-center space-x-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => onTabChange("search")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "search"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Search
              </button>
              <button
                onClick={() => onTabChange("cluster")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "cluster"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Cluster
              </button>
            </div>

            {/* Theme Toggle */}
            <button onClick={onThemeToggle} className="theme-toggle p-2 rounded-md hover:bg-accent transition-colors">
              {theme === "dark" ? (
                <Sun className="h-5 w-5 theme-toggle-icon" />
              ) : (
                <Moon className="h-5 w-5 theme-toggle-icon" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
