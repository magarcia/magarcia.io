import Heading from "./Heading";
import Strong from "./Strong";
import Paragraph from "./Paragraph";
import Blockquote from "./Blockquote";
import Caption from "./Caption";
import CodeInline from "./CodeInline";
import CodeBlock from "./CodeBlock";
import Link from "./Link";
import List from "./List";
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "./Table";

// Component wrappers for react-markdown
const H1 = (props: any) => <Heading level={1} {...props} />;
const H2 = (props: any) => <Heading level={2} {...props} />;
const H3 = (props: any) => <Heading level={3} {...props} />;
const H4 = (props: any) => <Heading level={4} {...props} />;
const OrderedList = (props: any) => <List ordered={true} {...props} />;

const Pre = ({ children, ...props }: any) => {
  // Extract language and code from the pre > code structure
  const childProps = children?.props || {};
  const className = childProps.className || "";
  const language = className.replace("language-", "") || "text";
  const code = childProps.children || children;

  // Parse highlight syntax (e.g., "typescript:1,3-5")
  const [lang, lines] = language.split(":");
  let highlight: number[] | undefined;
  if (lines) {
    highlight = lines.split(",").flatMap((x: string) => {
      if (x.includes("-")) {
        const [start, end] = x.split("-").map((n: string) => parseInt(n, 10));
        return Array.from({ length: end - start + 1 }, (_, k) => k + start);
      }
      return [parseInt(x, 10)];
    });
  }

  return (
    <CodeBlock
      language={lang}
      highlight={highlight}
      data-language={lang}
      className={className}
      {...props}
    >
      {code}
    </CodeBlock>
  );
};

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  strong: Strong,
  a: Link,
  ul: List,
  ol: OrderedList,
  code: CodeInline,
  pre: Pre,
  p: Paragraph,
  blockquote: Blockquote,
  caption: Caption,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell,
  th: TableHeaderCell,
};
