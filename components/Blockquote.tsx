export default function Blockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-2 italic border-border bg-gray-50 dark:bg-gray-800 py-2 px-6 my-6 text-muted-foreground"
      {...props}
    />
  );
}
