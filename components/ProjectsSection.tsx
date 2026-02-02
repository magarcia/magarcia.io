import { Link } from "react-router";
import { projects } from "~/data/projects";
import { getSectionTitle, getMoreProjectsLabel } from "~/lib/i18n";
import SectionHeader from "./SectionHeader";
import ProjectItem from "./ProjectItem";

interface ProjectsSectionProps {
  lang: string;
}

export default function ProjectsSection({ lang }: ProjectsSectionProps) {
  const projectsPath = lang === "en" ? "/projects/" : `/${lang}/projects/`;
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section className="mb-10 md:mb-16">
      <SectionHeader>{getSectionTitle("projects", lang)}</SectionHeader>
      <div className="space-y-1">
        {featuredProjects.map((project) => (
          <ProjectItem
            key={project.name}
            name={project.name}
            url={project.url}
            description={project.description[lang] || project.description.en}
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          to={projectsPath}
          className="text-muted-foreground hover:text-yellow-600 dark:hover:text-purple-400 transition-colors text-sm"
        >
          {getMoreProjectsLabel(lang)} →
        </Link>
      </div>
    </section>
  );
}
