import Image from "next-image-export-optimizer";
import Heading from "./Heading";
import Strong from "./Strong";
import Paragraph from "./Paragraph";
import Blockquote from "./Blockquote";
import Caption from "./Caption";
import CodeInline from "./CodeInline";
import CodeBlock from "./CodeBlock";
import Link from "./Link";
import List from "./List";
import Table from "./Table";

const components = {
  h1: ({ node, ...props }) => <Heading {...props} />,
  h2: ({ node, ...props }) => <Heading {...props} />,
  h3: ({ node, ...props }) => <Heading {...props} />,
  h4: ({ node, ...props }) => <Heading {...props} />,
  strong: ({ node, ...props }) => <Strong {...props} />,
  a: ({ node, ...props }) => <Link {...props} />,
  ul: ({ node, ...props }) => <List {...props} />,
  ol: ({ node, ...props }) => <List ordered={true} {...props} />,
  code: ({ node, ...props }) => <CodeInline {...props} />,
  pre: ({ node, children, ...props }) => {
    let language;
    let className;

    if (node.tagName === "pre") {
      className = children[0]?.props.className;
      language = className?.replace("language-", "") ?? "";
      children = children[0]?.props.children;
    }

    const [lang, lines] = language.split(":");
    let highlight;
    if (lines) {
      highlight = lines?.split(",").flatMap((x) => {
        if (x.includes("-")) {
          const [start, end] = x.split("-").map((x) => parseInt(x, 10));
          return Array.from({ length: end - start + 1 }, (v, k) => k + start);
        }
        return [parseInt(x, 10)];
      });
    }

    return (
      <CodeBlock
        {...props}
        language={lang}
        highlight={highlight}
        data-language={lang}
        className={className}
      >
        {children}
      </CodeBlock>
    );
  },
  p: ({ node, ...props }) => {
    // if (node.children[0].type === "image") {
    //   const image = node.children[0];
    //   return <Image src={image.url} alt={image.alt} fill sizes="100vw" />;
    // }
    if (node.children[0].tagName === "img") {
      const image = node.children[0];
      const metaString = image.properties.alt;
      const alt = metaString?.replace(/ *\{[^)]*\} */g, "");
      const metaWidth = metaString.match(/{([^}]+)x/);
      const metaHeight = metaString.match(/x([^}]+)}/);
      const width = metaWidth ? metaWidth[1] : "768";
      const height = metaHeight ? metaHeight[1] : "432";
      const isPriority = metaString?.toLowerCase().match("{priority}");
      const hasCaption = metaString?.toLowerCase().includes("{caption:");
      const caption = metaString?.match(/{caption: (.*?)}/)?.pop();

      return (
        <div className="postImgWrapper">
          <Image
            src={image.properties.src}
            width={width}
            height={height}
            className="postImg"
            alt={alt}
            priority={isPriority}
          />
          {hasCaption ? (
            <div className="caption" aria-label={caption}>
              {caption}
            </div>
          ) : null}
        </div>
      );
    }

    return <Paragraph {...props} />;
  },
  blockquote: ({ node, ...props }) => <Blockquote {...props} />,
  caption: ({ node, ...props }) => <Caption {...props} />,
  table: ({ node, ...props }) => <Table {...props} />,
  thead: ({ node, ...props }) => <Table.Head {...props} />,
  tbody: ({ node, ...props }) => <Table.Body {...props} />,
  tr: ({ node, ...props }) => <Table.Row {...props} />,
  td: ({ node, ...props }) => <Table.Cell {...props} />,
  th: ({ node, ...props }) => <Table.Cell {...props} />,
};

export default components;
