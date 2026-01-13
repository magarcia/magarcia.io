type CodeInlineProps = React.ComponentPropsWithoutRef<"code">;

export default function CodeInline({ children, ...props }: CodeInlineProps) {
  return (
    <code
      className="font-mono bg-muted px-1.5 py-0.5 rounded text-[15px] text-foreground"
      {...props}
    >
      {children}
    </code>
  );
}
