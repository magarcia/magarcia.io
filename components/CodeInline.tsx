interface CodeInlineProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export default function CodeInline({ children, ...props }: CodeInlineProps) {
  return (
    <code
      className="font-mono bg-[#F7F7F7] dark:bg-gray-800 px-1.5 py-0.5 rounded text-[15px] text-[#333] dark:text-gray-300"
      {...props}
    >
      {children}
    </code>
  );
}
