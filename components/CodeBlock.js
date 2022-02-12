import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";

export default function CodeBlock({ language, children, highlight, ...props }) {
  if (language === "yumml") language = "yaml";
  return (
    <div
      {...props}
      className={`relative text-sm font-mono py-6 my-4 -mx-8 md:-mx-4 bg-gray-900 dark:bg-gray-900 md:rounded text-gray-50 md:shadow-sm overflow-x-auto`}
    >
      <Highlight {...defaultProps} code={children[0]} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className={`language-${language}`}>
            {tokens.slice(0, -1).map((line, i) => {
              const { style, ...props } = getLineProps({ line, key: i });
              let className = "px-4";
              if (highlight && !highlight?.includes(i + 1)) {
                className = "px-4 text-gray-50 opacity-30";
              }
              return (
                <div {...props} className={className} key={line}>
                  {line.map((token, key) => {
                    const type = token.types[0];
                    if (type === "plain") return token.content;
                    const { style, ...props } = getTokenProps({ token, key });
                    let className = token.types.join(" ");
                    if (highlight && !highlight?.includes(i + 1)) {
                      className = "text-gray-50";
                    }
                    return (
                      <span
                        {...props}
                        className={`token ${className}`}
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
