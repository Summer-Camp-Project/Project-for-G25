"use client";
import { useState, useEffect } from "react";
import { Toaster as Sonner } from "sonner";

const Toaster = (props) => {
  const [theme, setTheme] = useState("system");

  // Detect user's preferred color scheme and set theme accordingly
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const setMode = () => setTheme(darkModeMediaQuery.matches ? "dark" : "light");

    setMode();
    darkModeMediaQuery.addEventListener("change", setMode);

    return () => darkModeMediaQuery.removeEventListener("change", setMode);
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        border border-gray-300 dark:border-gray-700
      "
      {...props}
    />
  );
};

export { Toaster };

