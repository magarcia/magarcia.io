interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  ordered?: boolean;
}

export default function List({ ordered = false, ...props }: ListProps) {
  if (ordered) return <ol className="list-decimal my-6 ml-6 leading-relaxed text-[#333] dark:text-gray-300" {...props} />;
  return <ul className="list-disc my-6 ml-6 leading-relaxed text-[#333] dark:text-gray-300" {...props} />;
}
