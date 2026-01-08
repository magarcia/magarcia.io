import { Copy } from "lucide-react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Unable to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      {...props}
      className="group relative my-8 -mx-8 md:-mx-16 overflow-hidden bg-[#F7F7F7] dark:bg-gray-800 rounded"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 dark:focus:ring-purple-400 focus:ring-offset-2"
              aria-label="Copy code to clipboard"
              type="button"
            >
              <Copy
                className="w-4 h-4 text-[#666] dark:text-gray-400"
                aria-hidden="true"
              />
              <span className="sr-only">Copy code to clipboard</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="overflow-x-auto px-4 md:px-8 codeblock-scroll focus:outline-none focus:ring-2 focus:ring-yellow-600 dark:focus:ring-purple-400" tabIndex={0}>
        <Highlight {...defaultProps} code={code} language={lang as any}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className={`language-${lang} font-mono`}>
              {tokens.slice(0, -1).map((line, i) => {
                const { style, ...lineProps } = getLineProps({ line, key: i });
                let className = "";
                if (highlight && !highlight.includes(i + 1)) {
                  className = "opacity-50";
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
    </div>
  );
}
