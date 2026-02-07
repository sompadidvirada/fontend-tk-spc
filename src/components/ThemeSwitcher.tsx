"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- THE SKELETON PLACEHOLDER ---
  if (!mounted) {
    return (
      <div
        /* Match the exact padding and border size of your button */
        className="p-2 w-25 h-10.5 rounded-md border border-gray-200 bg-gray-100 animate-pulse"
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className="md:px-2 md:py-2 px-1 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
      ) : (
        <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
      )}
    </button>
  );
}
