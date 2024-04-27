import React from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header({ main }) {
  const Tag = main ? "h1" : "h3";
  const size = main ? "text-4xl" : "text-2xl";
  const colors = main
    ? "bg-yellow-300 dark:bg-purple-500"
    : "hover:bg-yellow-300 dark:hover:bg-purple-500";

  return (
    <header
      className={`${
        main ? "p-8 pt-16" : "p-6"
      } flex place-content-between items-center max-w-5xl mx-auto`}
    >
      <Link href="/">
        <Tag
          className={`${size} ${colors} text-gray-900 dark:text-gray-50 font-semibold py-2 px-4 transition-bg duration-300 ease-in-out motion-reduce:transition-none`}
        >
          magarcia
        </Tag>
      </Link>
      {typeof window !== "undefined" && <ThemeToggle />}
    </header>
  );
}
