export default function Footer() {
  return (
    <footer className="px-8 md:px-16 mx-auto my-12 md:my-24 max-w-[75ch]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 text-sm text-muted-foreground font-mono text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
          <a
            className="hover:text-foreground transition-colors py-2 md:py-0"
            href="https://bsky.app/profile/mgarcia.bsky.social"
            target="_blank"
            rel="me noopener noreferrer"
          >
            bluesky
          </a>
          <span className="hidden md:inline">—</span>
          <a
            className="hover:text-foreground transition-colors py-2 md:py-0"
            href="https://github.com/magarcia"
            target="_blank"
            rel="me noopener noreferrer"
          >
            github
          </a>
          <span className="hidden md:inline">—</span>
          <a
            className="hover:text-foreground transition-colors py-2 md:py-0"
            href="https://www.linkedin.com/in/martingarciamonterde/"
            target="_blank"
            rel="me noopener noreferrer"
          >
            linkedin
          </a>
        </div>

        <div>
          <a
            className="hover:text-foreground transition-colors inline-block py-2 md:py-0"
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
          >
            rss
          </a>
        </div>
      </div>
    </footer>
  );
}
