import { useTheme } from "~/hooks/useTheme";
import { Moon, Sun } from "react-feather";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;
  const color =
    theme === "dark" ? "hover:text-yellow-300" : "hover:text-purple-500";

  return (
    <button
      aria-label="Toggle theme"
      data-testid="theme-toggle"
      className={`p-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 ease-out text-[#666] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-gray-200 ${color}`}
      onClick={toggleTheme}
    >
      <Icon size={18} />
    </button>
  );
}
