import { useEffect, useState } from "react";
import { useTheme } from "~/hooks/useTheme";
import { SunIcon } from "./ui/sun";
import { MoonIcon } from "./ui/moon";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = theme === "dark" ? SunIcon : MoonIcon;
  const color =
    theme === "dark" ? "hover:text-yellow-300" : "hover:text-purple-500";

  return (
    <button
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      className={`p-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 ease-out text-muted-foreground hover:text-foreground ${color}`}
      onClick={toggleTheme}
    >
      {mounted && <Icon size={18} />}
    </button>
  );
}
