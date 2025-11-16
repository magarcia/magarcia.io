interface CodeInlineProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function CodeInline({ children, ...props }: CodeInlineProps) {
  return (
    <code
      className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded border-gray-200 dark:border-gray-800 border text-sm"
      {...props}
    >
      {children}
    </code>
  );
}
