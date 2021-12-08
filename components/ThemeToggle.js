import { useTheme } from "next-themes";
import React, { useCallback, useEffect } from "react";
import { Moon, Sun } from "react-feather";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;
  const color =
    theme === "dark" ? "hover:text-yellow-300" : "hover:text-purple-500";

  return (
    <Icon
      className={`${color} cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-300 ease-out`}
      size={24}
      onClick={setTheme.bind(this, theme === "light" ? "dark" : "light")}
    />
  );
}
