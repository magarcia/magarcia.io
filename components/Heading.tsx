import { Hash } from "react-feather";
import slugify from "slugify";

interface HeadingProps {
  level?: number;
  children: React.ReactNode;
  [key: string]: any;
}

const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg"];

export default function Heading({ level = 2, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const size = sizes[Math.min(level, 4) - 1];
  const id = slugify(children?.toString().toLowerCase() || "");
  const anchorSize = 20;

  return (
    <Tag
      className={`heading font-heading font-normal text-[#1A1A1A] dark:text-gray-100 ${size} mt-12 mb-4`}
      id={id}
      {...props}
    >
      <a
        href={`#${id}`}
        className="anchor opacity-0 inline-block cursor-pointer transition-opacity duration-500 ease-in-out motion-reduce:transition-none hover:opacity-100"
        style={{ marginLeft: -1.5 * anchorSize, marginRight: anchorSize / 2 }}
      >
        <Hash size={anchorSize} className="text-[#999] dark:text-gray-500" />
      </a>
      {children}
    </Tag>
  );
}
