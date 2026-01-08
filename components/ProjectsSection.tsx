import { projects } from "~/data/projects";
import { getSectionTitle } from "~/lib/i18n";
import SectionHeader from "./SectionHeader";
import ProjectItem from "./ProjectItem";

interface ProjectsSectionProps {
  lang: string;
}

export default function ProjectsSection({ lang }: ProjectsSectionProps) {
  return (
    <section className="mb-10 md:mb-16">
      <SectionHeader>{getSectionTitle("projects", lang)}</SectionHeader>
      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectItem
            key={project.name}
            name={project.name}
            url={project.url}
            description={project.description[lang] || project.description.en}
          />
        ))}
      </div>
    </section>
  );
}
