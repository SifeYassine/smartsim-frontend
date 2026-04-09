import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchTab from "@/components/SearchTab";
import ClusterTab from "@/components/ClusterTab";
import { toggleTheme } from "@/lib/utils";

export default function App() {
  const [activeTab, setActiveTab] = useState("search");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("image-app-theme") || "light";
    setTheme(stored);
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function handleToggleTheme(event) {
    const newTheme = toggleTheme(event);
    setTheme(newTheme);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Header activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onThemeToggle={handleToggleTheme} />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">{activeTab === "search" ? <SearchTab /> : <ClusterTab />}</div>
      </div>
    </div>
  );
}
