import React from "react";
import { Hash } from "react-feather";
import slugify from "slugify";

const sizes = ["text-4xl", "text-3xl", "text-2xl", "text-xl"];

export default function Heading({ level, children, ...props }) {
  const Tag = `h${level}`;
  const size = sizes[Math.min(level, 4) - 1];
  const id = slugify(children.toString().toLowerCase());
  const anchorSize = 24;

  return (
    <Tag
      className={`heading font-semibold text-gray-900 dark:text-gray-50 ${size} mt-12`}
      id={id}
      {...props}
    >
      <a
        href={`#${id}`}
        className="anchor opacity-0 inline-block cursor-pointer transition-opacity duration-500 ease-in-out motion-reduce:transition-none"
        style={{ marginLeft: -1.5 * anchorSize, marginRight: anchorSize / 2 }}
      >
        <Hash size={anchorSize} />
      </a>
      {children}
    </Tag>
  );
}
