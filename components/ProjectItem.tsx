interface ProjectItemProps {
  name: string;
  url: string;
  description: string;
}

export default function ProjectItem({
  name,
  url,
  description,
}: ProjectItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-3"
    >
      <div className="flex items-center gap-4">
        <span className="font-heading text-lg text-[#1A1A1A] dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-purple-400 transition-colors whitespace-nowrap">
          {name}
        </span>
        <span className="flex-1 border-b border-dotted border-[#DDD] dark:border-gray-600 group-hover:border-solid transition-all" />
      </div>
      <p className="text-[#666] dark:text-gray-400 text-sm mt-1">
        {description}
      </p>
    </a>
  );
}
