export default function Blockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-2 italic border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-600 py-0.5 px-4"
      {...props}
    />
  );
}
