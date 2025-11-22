import type { Route } from "./+types/about";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "About — magarcia" },
    {
      name: "description",
      content:
        "About Martín García - Senior Software Engineer at Buffer, building web applications and frontend infrastructure.",
    },
    { property: "og:title", content: "About — magarcia" },
    {
      property: "og:description",
      content:
        "About Martín García - Senior Software Engineer at Buffer, building web applications and frontend infrastructure.",
    },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: "https://magarcia.io/about" },
    { property: "og:site_name", content: "magarcia" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@martinprins" },
    { name: "twitter:creator", content: "@martinprins" },
  ];
}

export default function About() {
  return (
    <>
      <Header lang="en" />
      <main className="min-w-full">
        <article className="px-8 mx-auto max-w-prose md:px-0">
          <header className="mb-10 md:mb-16">
            <h1 className="mt-10 mb-3 text-5xl font-bold text-gray-800 md:text-5xl dark:text-gray-50">
              About
            </h1>
          </header>

          <div className="prose md:prose-lg dark:prose-dark">
            <p>
              I&apos;m Martín García, a Senior Software Engineer at{" "}
              <a href="https://buffer.com">Buffer</a>, working remotely from
              Barcelona. I&apos;ve spent 15+ years building web applications, with
              the last several focused on frontend architecture, developer
              experience, and the kind of infrastructure work that makes other
              engineers&apos; lives easier.
            </p>

            <h2>What I&apos;m Working On</h2>

            <p>
              At Buffer, I work on frontend architecture for a platform serving
              millions of users. That means things like design system
              migrations, building scalable UI infrastructure, and improving
              testing practices. The work I enjoy most is the kind that removes
              friction—better abstractions, clearer patterns, fewer footguns.
            </p>

            <p>
              I also run <a href="https://palabreja.com">Palabreja</a>, a daily
              Spanish word game I built in 2022. What started as a weekend
              project to bring a Catalan word game to Spanish speakers now has
              15,000+ monthly active users and generates sustainable revenue.
              Building something from zero to profitable has been the best
              education in product development I could ask for—frontend,
              backend, monetization, and all the messy bits in between.
            </p>

            <h2>Background</h2>

            <p>
              Before Buffer, I was at New Relic (3+ years) building platform UI
              infrastructure and leading the company&apos;s transition to CI/CD. I
              also developed their E2E testing framework with Playwright, which
              became the standard across engineering teams.
            </p>

            <p>
              Earlier work includes consulting at ThoughtWorks on large-scale
              real estate platforms, growing from developer to senior at health
              tech startup Medtep, and contributing to openSUSE through Google
              Summer of Code. I started as a sysadmin at Universitat Politècnica
              de Catalunya, which gave me a useful appreciation for what happens
              below the application layer.
            </p>

            <h2>Technical Focus</h2>

            <p>
              I work primarily in <strong>TypeScript</strong> and{" "}
              <strong>React</strong>, with <strong>Node.js</strong> on the
              backend. I care about code quality, comprehensive testing, and
              creating developer experiences that don&apos;t make people want to quit
              programming.
            </p>

            <p>
              Projects I&apos;ve built include custom routing systems, microfrontend
              architectures, E2E testing frameworks, and yes, a full game engine
              for word puzzles. I&apos;m comfortable across the stack, but frontend
              architecture is where I do my best work.
            </p>

            <h2>Outside Work</h2>

            <p>
              I surf when I can get to the coast, maintain a regular meditation
              practice, and believe strongly that sustainable software careers
              require taking care of your body and mind. I&apos;m originally from
              Ibiza but have lived in Barcelona for 18 years.
            </p>

            <h2>Connect</h2>

            <ul>
              <li>
                <a href="https://github.com/magarcia">GitHub</a>
              </li>
              <li>
                <a href="https://bsky.app/profile/mgarcia.bsky.social">
                  Bluesky
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/martingarciamonterde">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
