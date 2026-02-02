import { Archive, ExternalLink } from "react-feather";
import type { Route } from "./+types/projects";
import { projects, type Project } from "~/data/projects";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { buildCanonicalLink, buildProjectsHreflangLinks } from "~/lib/hreflang";

const pageTitles: Record<string, string> = {
  en: "All Projects",
  es: "Todos los Proyectos",
  ca: "Tots els Projectes",
};

const pageDescriptions: Record<string, string> = {
  en: "Open source projects, tools, and experiments",
  es: "Proyectos de código abierto, herramientas y experimentos",
  ca: "Projectes de codi obert, eines i experiments",
};

export function meta({ data, location }: Route.MetaArgs) {
  const lang = data?.lang || "en";
  const title = pageTitles[lang];
  const description = pageDescriptions[lang];

  return [
    { title: `${title} — magarcia` },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    buildCanonicalLink(location.pathname),
    ...buildProjectsHreflangLinks(),
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;
  const lang = pathname.startsWith("/es/")
    ? "es"
    : pathname.startsWith("/ca/")
      ? "ca"
      : "en";

  return { lang };
}

function ProjectCard({ project, lang }: { project: Project; lang: string }) {
  const description = project.description[lang] || project.description.en;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block py-4 border-b border-border last:border-b-0 hover:bg-muted/30 -mx-4 px-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading text-lg text-foreground group-hover:text-yellow-600 dark:group-hover:text-purple-400 transition-colors">
              {project.name}
            </span>
            {project.archived && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                <Archive size={12} />
                archived
              </span>
            )}
            {project.language && (
              <span className="text-xs text-muted-foreground">
                {project.language}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <ExternalLink
          size={16}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        />
      </div>
    </a>
  );
}

export default function ProjectsPage({ loaderData }: Route.ComponentProps) {
  const { lang } = loaderData;
  const title = pageTitles[lang];
  const description = pageDescriptions[lang];

  // Sort projects: featured first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <>
      <Header lang={lang} />
      <main className="max-w-[75ch] mx-auto px-8 md:px-16 mb-12 md:mb-24">
        <h1 className="text-3xl md:text-4xl font-heading text-foreground mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground mb-8 md:mb-12">{description}</p>

        <div className="border-t border-border">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.name} project={project} lang={lang} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
