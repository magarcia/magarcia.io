import { Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  children: React.ReactNode;
  highlight?: number[];
  className?: string;
  "data-language"?: string;
}

// Helper to extract text content from React elements for copy functionality
function extractTextContent(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node;
  }
  if (typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return extractTextContent((node as any).props?.children);
  }
  return "";
}

export default function CodeBlock({
  language = "text",
  children,
  ...props
}: CodeBlockProps) {
  const lang = language === "yumml" ? "yaml" : language;
  // Extract plain text for copy functionality
  const codeText = extractTextContent(children);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codeText).catch(() => {
        // Silently fail on SSR or when clipboard is unavailable
      });
    }
  };

  return (
    <div
      {...props}
      className="group relative my-8 -mx-8 md:-mx-16 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded"
    >
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Copy code to clipboard"
        title="Copy code"
        type="button"
      >
        <Copy
          className="w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
      </button>
      <div
        className="overflow-x-auto px-4 md:px-8 codeblock-scroll focus:outline-none focus:ring-2 focus:ring-ring"
        tabIndex={0}
        aria-label="Scrollable code block, use arrow keys to scroll"
      >
        <pre className={`language-${lang} font-mono`}>
          <code className={`language-${lang}`}>{children}</code>
        </pre>
      </div>
    </div>
  );
}
