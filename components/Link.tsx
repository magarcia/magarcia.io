import type React from "react";

export default function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className="text-foreground dark:text-gray-200 hover:text-yellow-600 dark:hover:text-purple-400 underline transition-colors"
      {...props}
    />
  );
}
