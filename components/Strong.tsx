import type React from "react";

export default function Strong(props: React.HTMLAttributes<HTMLElement>) {
  return <strong className="font-medium text-[#1A1A1A] dark:text-gray-100" {...props} />;
}
