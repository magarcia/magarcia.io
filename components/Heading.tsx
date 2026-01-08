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
      className={`heading font-heading font-normal text-foreground ${size} mt-10 md:mt-16 mb-4`}
      id={id}
      {...props}
    >
      <a
        href={`#${id}`}
        className="anchor opacity-0 inline-block cursor-pointer transition-opacity duration-500 ease-in-out motion-reduce:transition-none hover:opacity-100 -ml-7 mr-2"
      >
        <Hash size={anchorSize} className="text-muted-foreground" />
      </a>
      {children}
    </Tag>
  );
}
