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
      className={`p-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 ease-out text-muted-foreground hover:text-foreground ${color}`}
      onClick={toggleTheme}
    >
      <Icon size={18} />
    </button>
  );
}
