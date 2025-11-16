import { Link } from "react-router";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  main?: boolean;
}

export default function Header({ main }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const Tag = main ? "h1" : "h3";
  const size = main ? "text-4xl" : "text-2xl";
  const colors = main
    ? "bg-yellow-300 dark:bg-purple-500"
    : "hover:bg-yellow-300 dark:hover:bg-purple-500";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={`${
        main ? "p-8 pt-16" : "p-6"
      } flex place-content-between items-center max-w-5xl mx-auto`}
    >
      <Link to="/">
        <Tag
          className={`${size} ${colors} text-gray-900 dark:text-gray-50 font-semibold py-2 px-4 transition-bg duration-300 ease-in-out motion-reduce:transition-none`}
        >
          magarcia
        </Tag>
      </Link>
      {mounted && <ThemeToggle />}
    </header>
  );
}
