import Heading from "./Heading";
import Strong from "./Strong";
import Paragraph from "./Paragraph";
import Blockquote from "./Blockquote";
import Caption from "./Caption";
import CodeInline from "./CodeInline";
import CodeBlock from "./CodeBlock";
import Link from "./Link";
import List from "./List";
import Table, { TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "./Table";

// Component wrappers for react-markdown
const H1 = (props: any) => <Heading level={1} {...props} />;
const H2 = (props: any) => <Heading level={2} {...props} />;
const H3 = (props: any) => <Heading level={3} {...props} />;
const H4 = (props: any) => <Heading level={4} {...props} />;
const OrderedList = (props: any) => <List ordered={true} {...props} />;

const Pre = ({ children, node, ...props }: any) => {
  // Extract language and code from the pre > code structure
  // Handle both React element children and raw content
  let className = "";
  let codeContent: string = "";

  // Check if children is a React element (has props)
  if (children && typeof children === "object" && children.props) {
    className = children.props.className || "";
    const childContent = children.props.children;
    // Ensure we get a string
    codeContent = typeof childContent === "string" ? childContent : "";
  } else if (Array.isArray(children) && children[0]?.props) {
    // Handle array of children
    className = children[0].props.className || "";
    const childContent = children[0].props.children;
    codeContent = typeof childContent === "string" ? childContent : "";
  } else if (typeof children === "string") {
    codeContent = children;
  }

  // If we couldn't extract code properly, fall back to simple pre
  if (!codeContent) {
    return <pre className="font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto my-8" {...props}>{children}</pre>;
  }

  const language = className.replace("language-", "") || "text";

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
    >
      {codeContent}
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
