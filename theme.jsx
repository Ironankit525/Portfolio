"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "framer-motion"; // Adapted from motion/react for broader standard compatibility
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility Functions ---
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// --- Mocked next-themes Provider ---
// This simulates next-themes behavior for the standalone preview
const ThemeContext = createContext({
  theme: "system",
  setTheme: () => null,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --- Theme Option Component ---
function ThemeOption({ icon, value, isActive, onClick }) {
  return (
    <button
      className={cn(
        "relative flex size-8 cursor-default items-center justify-center rounded-full transition-[color] [&_svg]:size-4",
        isActive
          ? "text-zinc-950 dark:text-zinc-50"
          : "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {/* Icon */}
      <span className="relative z-10">{icon}</span>

      {/* Animated Background */}
      {isActive && (
        <motion.div
          layoutId="theme-option"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
        />
      )}
    </button>
  );
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: "system",
  },
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonStarIcon />,
    value: "dark",
  },
];

// --- Main ThemeSwitcher Component ---
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // Prevents hydration mismatch
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) {
    return <div className="flex h-8 w-24" />;
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-800"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  );
}

// --- Demo Wrapper ---
export default function App() {
  return (
    <ThemeProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans text-zinc-950 transition-colors duration-500 dark:bg-zinc-900 dark:text-zinc-50">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-zinc-200 bg-white p-10 shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/50">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Theme Settings
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Try switching between light and dark modes.
            </p>
          </div>
          
          <div className="pt-2">
            <ThemeSwitcher />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}