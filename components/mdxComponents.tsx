import React from "react";
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
type MarkdownHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode;
};
type MarkdownListProps = React.HTMLAttributes<HTMLUListElement> & {
  children?: React.ReactNode;
};

const H1 = ({ children, ...props }: MarkdownHeadingProps) => (
  <Heading level={1} {...props}>
    {children}
  </Heading>
);
const H2 = ({ children, ...props }: MarkdownHeadingProps) => (
  <Heading level={2} {...props}>
    {children}
  </Heading>
);
const H3 = ({ children, ...props }: MarkdownHeadingProps) => (
  <Heading level={3} {...props}>
    {children}
  </Heading>
);
const H4 = ({ children, ...props }: MarkdownHeadingProps) => (
  <Heading level={4} {...props}>
    {children}
  </Heading>
);
const OrderedList = ({ children, ...props }: MarkdownListProps) => (
  <List ordered={true} {...props}>
    {children}
  </List>
);

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
}

interface CodeChildProps {
  className?: string;
  children?: React.ReactNode;
}

function isCodeElement(
  child: React.ReactNode,
): child is React.ReactElement<CodeChildProps> {
  return React.isValidElement(child) && typeof child.props === "object";
}

const Pre = ({ children, ...props }: PreProps) => {
  // Extract language and code from the pre > code structure
  const childProps: CodeChildProps = isCodeElement(children)
    ? children.props
    : {};
  const className = childProps.className || "";
  const language = className.replace("language-", "") || "text";
  const rawCode = childProps.children || children;
  // Ensure code is a string for CodeBlock
  const code = typeof rawCode === "string" ? rawCode : String(rawCode ?? "");

  // Parse highlight syntax (e.g., "typescript:1,3-5")
  const parts = language.split(":");
  const lang = parts[0];
  const lines = parts[1];
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
