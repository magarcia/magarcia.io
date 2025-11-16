import Highlight, { defaultProps } from "prism-react-renderer";

interface CodeBlockProps {
  language?: string;
  children: string[];
  highlight?: number[];
  className?: string;
  "data-language"?: string;
}

export default function CodeBlock({
  language = "text",
  children,
  highlight,
  ...props
}: CodeBlockProps) {
  let lang = language;
  if (lang === "yumml") lang = "yaml";

  const code = Array.isArray(children) ? children[0] : children;

  return (
    <div
      {...props}
      className="relative text-sm font-mono py-6 my-4 -mx-8 md:-mx-4 bg-gray-900 dark:bg-gray-900 md:rounded text-gray-50 md:shadow-sm overflow-x-auto"
    >
      <Highlight {...defaultProps} code={code} language={lang as any}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={`language-${lang}`}>
            {tokens.slice(0, -1).map((line, i) => {
              const { style, ...lineProps } = getLineProps({ line, key: i });
              let className = "px-4";
              if (highlight && !highlight.includes(i + 1)) {
                className = "px-4 text-gray-50 opacity-30";
              }
              return (
                <div {...lineProps} className={className} key={i}>
                  {line.map((token, key) => {
                    const type = token.types[0];
                    if (type === "plain") return token.content;
                    const { style, ...tokenProps } = getTokenProps({
                      token,
                      key,
                    });
                    let tokenClassName = token.types.join(" ");
                    if (highlight && !highlight.includes(i + 1)) {
                      tokenClassName = "text-gray-50";
                    }
                    return (
                      <span
                        {...tokenProps}
                        className={`token ${tokenClassName}`}
                        key={key}
                      />
                    );
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
