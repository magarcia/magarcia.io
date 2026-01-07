export default function Blockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-2 italic border-[#DDD] dark:border-gray-600 bg-[#FAFAFA] dark:bg-gray-800 py-2 px-6 my-6 text-[#666] dark:text-gray-400"
      {...props}
    />
  );
}
