import React from "react";
import CodeBlock from "./CodeBlock";

export default function CodeInline({ inline, ...props }) {
  if (!inline) return <CodeBlock {...props} />;
  return (
    <code
      className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded border-gray-200 dark:border-gray-800 border text-sm"
      {...props}
    />
  );
}
