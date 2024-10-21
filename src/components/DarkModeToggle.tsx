import { useEffect, useState } from "react";
import Icon from "./Icon";
import { cn } from "~/utils";

const DARK_MODE_KEY = "dark-mode"; // for local storage
const DARK_MODE_CLASS = "dark"; // for class name

export default function DarkModeToggle() {
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = JSON.parse(localStorage.getItem(DARK_MODE_KEY));
    setDarkMode(isDarkMode ?? false);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add(DARK_MODE_CLASS);
      localStorage.setItem(DARK_MODE_KEY, "true");
    } else {
      document.documentElement.classList.remove(DARK_MODE_CLASS);
      localStorage.setItem(DARK_MODE_KEY, "false");
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 h-full -mx-2">
      <button
        onClick={() => setDarkMode(false)}
        className={cn(
          "w-1/2 lg:w-full flex-1 flex items-center space-x-4 rounded-2xl p-4 justify-center",
          {
            "border shadow": !isDarkMode,
            "hover:bg-zinc-900/20": isDarkMode,
          },
        )}
      >
        <Icon name="sun" />
      </button>
      <button
        onClick={() => setDarkMode(true)}
        className={cn(
          "w-1/2 lg:w-full flex-1 flex items-center space-x-4 rounded-2xl p-4 justify-center",
          {
            "border dark:border-0 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 shadow":
              isDarkMode,
            "hover:bg-zinc-200/20": !isDarkMode,
          },
        )}
      >
        <Icon name="moon" />
      </button>
    </div>
  );
}
