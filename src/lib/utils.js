import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateText(text, maxLength = 25) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export function toggleTheme(event) {
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";

  // Get click coordinates from the event
  const rect = event.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Set CSS custom properties for the radial effect
  document.documentElement.style.setProperty("--toggle-x", `${x}px`);
  document.documentElement.style.setProperty("--toggle-y", `${y}px`);

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("image-app-theme", newTheme);
    });
  } else {
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("image-app-theme", newTheme);
  }

  return newTheme;
}
