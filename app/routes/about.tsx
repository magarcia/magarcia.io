import type { Route } from "./+types/about";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

type Lang = "en" | "es" | "ca";

const translations = {
  en: {
    title: "About",
    metaDescription:
      "About Martín García - Senior Software Engineer at Buffer, building web applications and frontend infrastructure.",
    intro: (
      <p>
        I&apos;m Martín García, a Senior Software Engineer at{" "}
        <a href="https://buffer.com">Buffer</a>, working remotely from
        Barcelona. I&apos;ve spent 15+ years building web applications, with the
        last several focused on frontend architecture, developer experience, and
        the kind of infrastructure work that makes other engineers&apos; lives
        easier.
      </p>
    ),
    workingOnTitle: "What I'm Working On",
    workingOn: (
      <>
        <p>
          At Buffer, I work on frontend architecture for a platform serving
          millions of users. That means things like design system migrations,
          building scalable UI infrastructure, and improving testing practices.
          The work I enjoy most is the kind that removes friction—better
          abstractions, clearer patterns, fewer footguns.
        </p>
        <p>
          I also run <a href="https://palabreja.com">Palabreja</a>, a daily
          Spanish word game I built in 2022. What started as a weekend project
          to bring a Catalan word game to Spanish speakers now has 15,000+
          monthly active users and generates sustainable revenue. Building
          something from zero to profitable has been the best education in
          product development I could ask for—frontend, backend, monetization,
          and all the messy bits in between.
        </p>
      </>
    ),
    backgroundTitle: "Background",
    background: (
      <>
        <p>
          Before Buffer, I was at New Relic (3+ years) building platform UI
          infrastructure and leading the company&apos;s transition to CI/CD. I
          also developed their E2E testing framework with Playwright, which
          became the standard across engineering teams.
        </p>
        <p>
          Earlier work includes consulting at ThoughtWorks on large-scale real
          estate platforms, growing from developer to senior at health tech
          startup Medtep, and contributing to openSUSE through Google Summer of
          Code. I started as a sysadmin at Universitat Politècnica de Catalunya,
          which gave me a useful appreciation for what happens below the
          application layer.
        </p>
      </>
    ),
    technicalTitle: "Technical Focus",
    technical: (
      <>
        <p>
          I work primarily in <strong>TypeScript</strong> and{" "}
          <strong>React</strong>, with <strong>Node.js</strong> on the backend.
          I care about code quality, comprehensive testing, and creating
          developer experiences that don&apos;t make people want to quit
          programming.
        </p>
        <p>
          Projects I&apos;ve built include custom routing systems, microfrontend
          architectures, E2E testing frameworks, and yes, a full game engine for
          word puzzles. I&apos;m comfortable across the stack, but frontend
          architecture is where I do my best work.
        </p>
      </>
    ),
    outsideTitle: "Outside Work",
    outside: (
      <p>
        I surf when I can get to the coast, maintain a regular meditation
        practice, and believe strongly that sustainable software careers require
        taking care of your body and mind. I&apos;m originally from Ibiza but
        have lived in Barcelona for 18 years.
      </p>
    ),
    connectTitle: "Connect",
  },
  es: {
    title: "Sobre mí",
    metaDescription:
      "Sobre Martín García - Ingeniero de Software Senior en Buffer, desarrollando aplicaciones web e infraestructura frontend.",
    intro: (
      <p>
        Soy Martín García, Ingeniero de Software Senior en{" "}
        <a href="https://buffer.com">Buffer</a>, trabajando en remoto desde
        Barcelona. He pasado más de 15 años desarrollando aplicaciones web, con
        los últimos varios enfocados en arquitectura frontend, experiencia de
        desarrollador, y el tipo de trabajo de infraestructura que hace la vida
        más fácil a otros ingenieros.
      </p>
    ),
    workingOnTitle: "En qué estoy trabajando",
    workingOn: (
      <>
        <p>
          En Buffer, trabajo en arquitectura frontend para una plataforma que
          sirve a millones de usuarios. Eso significa cosas como migraciones de
          sistemas de diseño, construcción de infraestructura UI escalable, y
          mejora de prácticas de testing. El trabajo que más disfruto es el que
          elimina fricción—mejores abstracciones, patrones más claros, menos
          trampas.
        </p>
        <p>
          También dirijo <a href="https://palabreja.com">Palabreja</a>, un juego
          de palabras diario en español que construí en 2022. Lo que empezó como
          un proyecto de fin de semana para traer un juego de palabras catalán a
          hispanohablantes ahora tiene más de 15.000 usuarios activos mensuales
          y genera ingresos sostenibles. Construir algo desde cero hasta ser
          rentable ha sido la mejor educación en desarrollo de producto que
          podría pedir—frontend, backend, monetización, y todo lo desordenado
          entre medias.
        </p>
      </>
    ),
    backgroundTitle: "Trayectoria",
    background: (
      <>
        <p>
          Antes de Buffer, estuve en New Relic (más de 3 años) construyendo
          infraestructura UI de plataforma y liderando la transición de la
          empresa a CI/CD. También desarrollé su framework de testing E2E con
          Playwright, que se convirtió en el estándar en todos los equipos de
          ingeniería.
        </p>
        <p>
          Trabajo anterior incluye consultoría en ThoughtWorks en plataformas
          inmobiliarias a gran escala, creciendo de desarrollador a senior en la
          startup de salud Medtep, y contribuyendo a openSUSE a través de Google
          Summer of Code. Empecé como administrador de sistemas en la
          Universitat Politècnica de Catalunya, lo que me dio una apreciación
          útil de lo que pasa por debajo de la capa de aplicación.
        </p>
      </>
    ),
    technicalTitle: "Enfoque técnico",
    technical: (
      <>
        <p>
          Trabajo principalmente en <strong>TypeScript</strong> y{" "}
          <strong>React</strong>, con <strong>Node.js</strong> en el backend. Me
          importa la calidad del código, el testing exhaustivo, y crear
          experiencias de desarrollador que no hagan que la gente quiera dejar
          de programar.
        </p>
        <p>
          Proyectos que he construido incluyen sistemas de routing
          personalizados, arquitecturas de microfrontends, frameworks de testing
          E2E, y sí, un motor de juego completo para puzzles de palabras. Me
          siento cómodo en todo el stack, pero la arquitectura frontend es donde
          hago mi mejor trabajo.
        </p>
      </>
    ),
    outsideTitle: "Fuera del trabajo",
    outside: (
      <p>
        Surfeo cuando puedo llegar a la costa, mantengo una práctica regular de
        meditación, y creo firmemente que las carreras sostenibles en software
        requieren cuidar tu cuerpo y mente. Soy originario de Ibiza pero he
        vivido en Barcelona durante 18 años.
      </p>
    ),
    connectTitle: "Conectar",
  },
  ca: {
    title: "Sobre mi",
    metaDescription:
      "Sobre Martín García - Enginyer de Software Sènior a Buffer, desenvolupant aplicacions web i infraestructura frontend.",
    intro: (
      <p>
        Soc Martín García, Enginyer de Software Sènior a{" "}
        <a href="https://buffer.com">Buffer</a>, treballant en remot des de
        Barcelona. He passat més de 15 anys desenvolupant aplicacions web, amb
        els últims diversos enfocats en arquitectura frontend, experiència de
        desenvolupador, i el tipus de treball d&apos;infraestructura que fa la
        vida més fàcil a altres enginyers.
      </p>
    ),
    workingOnTitle: "En què estic treballant",
    workingOn: (
      <>
        <p>
          A Buffer, treballo en arquitectura frontend per a una plataforma que
          serveix milions d&apos;usuaris. Això significa coses com migracions de
          sistemes de disseny, construcció d&apos;infraestructura UI escalable,
          i millora de pràctiques de testing. El treball que més gaudeixo és el
          que elimina fricció—millors abstraccions, patrons més clars, menys
          paranys.
        </p>
        <p>
          També dirigeixo <a href="https://palabreja.com">Palabreja</a>, un joc
          de paraules diari en espanyol que vaig construir el 2022. El que va
          començar com un projecte de cap de setmana per portar un joc de
          paraules català a hispanoparlants ara té més de 15.000 usuaris actius
          mensuals i genera ingressos sostenibles. Construir alguna cosa des de
          zero fins a ser rendible ha estat la millor educació en
          desenvolupament de producte que podria demanar—frontend, backend,
          monetització, i tot el desordenat entremig.
        </p>
      </>
    ),
    backgroundTitle: "Trajectòria",
    background: (
      <>
        <p>
          Abans de Buffer, vaig estar a New Relic (més de 3 anys) construint
          infraestructura UI de plataforma i liderant la transició de
          l&apos;empresa a CI/CD. També vaig desenvolupar el seu framework de
          testing E2E amb Playwright, que es va convertir en l&apos;estàndard en
          tots els equips d&apos;enginyeria.
        </p>
        <p>
          Treball anterior inclou consultoria a ThoughtWorks en plataformes
          immobiliàries a gran escala, creixent de desenvolupador a sènior a la
          startup de salut Medtep, i contribuint a openSUSE a través de Google
          Summer of Code. Vaig començar com a administrador de sistemes a la
          Universitat Politècnica de Catalunya, el que em va donar una
          apreciació útil del que passa per sota de la capa d&apos;aplicació.
        </p>
      </>
    ),
    technicalTitle: "Enfocament tècnic",
    technical: (
      <>
        <p>
          Treballo principalment en <strong>TypeScript</strong> i{" "}
          <strong>React</strong>, amb <strong>Node.js</strong> al backend.
          M&apos;importa la qualitat del codi, el testing exhaustiu, i crear
          experiències de desenvolupador que no facin que la gent vulgui deixar
          de programar.
        </p>
        <p>
          Projectes que he construït inclouen sistemes de routing
          personalitzats, arquitectures de microfrontends, frameworks de testing
          E2E, i sí, un motor de joc complet per a puzzles de paraules. Em sento
          còmode a tot l&apos;stack, però l&apos;arquitectura frontend és on
          faig el meu millor treball.
        </p>
      </>
    ),
    outsideTitle: "Fora de la feina",
    outside: (
      <p>
        Surfejo quan puc arribar a la costa, mantinc una pràctica regular de
        meditació, i crec fermament que les carreres sostenibles en software
        requereixen cuidar el teu cos i ment. Soc originari d&apos;Eivissa però
        he viscut a Barcelona durant 18 anys.
      </p>
    ),
    connectTitle: "Connectar",
  },
};

export function meta({ data }: Route.MetaArgs) {
  const lang = (data?.lang as Lang) || "en";
  const t = translations[lang];
  const url =
    lang === "en"
      ? "https://magarcia.io/about"
      : `https://magarcia.io/${lang}/about`;

  return [
    { title: `${t.title} — magarcia` },
    { name: "description", content: t.metaDescription },
    { property: "og:title", content: `${t.title} — magarcia` },
    { property: "og:description", content: t.metaDescription },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "magarcia" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@martinprins" },
    { name: "twitter:creator", content: "@martinprins" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;
  let lang: Lang = "en";
  if (pathname.startsWith("/es/")) lang = "es";
  else if (pathname.startsWith("/ca/")) lang = "ca";
  return { lang };
}

export default function About({ loaderData }: Route.ComponentProps) {
  const lang = (loaderData?.lang as Lang) || "en";
  const t = translations[lang];

  return (
    <>
      <Header lang={lang} />
      <main className="min-w-full">
        <article className="px-8 mx-auto max-w-prose md:px-0">
          <header className="mb-10 md:mb-16">
            <h1 className="mt-10 mb-3 text-5xl font-bold text-gray-800 md:text-5xl dark:text-gray-50">
              {t.title}
            </h1>
          </header>

          <div className="prose md:prose-lg dark:prose-dark">
            {t.intro}

            <h2>{t.workingOnTitle}</h2>
            {t.workingOn}

            <h2>{t.backgroundTitle}</h2>
            {t.background}

            <h2>{t.technicalTitle}</h2>
            {t.technical}

            <h2>{t.outsideTitle}</h2>
            {t.outside}

            <h2>{t.connectTitle}</h2>

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
