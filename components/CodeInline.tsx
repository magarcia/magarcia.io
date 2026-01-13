interface CodeInlineProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function CodeInline({ children, ...props }: CodeInlineProps) {
  return (
    <code
      className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[15px] text-foreground"
      {...props}
    >
      {children}
    </code>
  );
}
