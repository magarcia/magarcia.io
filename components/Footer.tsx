export default function Footer() {
  return (
    <footer className="px-8 md:px-16 mx-auto my-12 md:my-24 max-w-[75ch]">
      <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
        <div className="flex flex-wrap gap-4">
          <a
            className="hover:text-foreground transition-colors"
            href="https://bsky.app/profile/mgarcia.bsky.social"
            target="_blank"
            rel="me noopener noreferrer"
          >
            bluesky
          </a>
          <span>—</span>
          <a
            className="hover:text-foreground transition-colors"
            href="https://github.com/magarcia"
            target="_blank"
            rel="me noopener noreferrer"
          >
            github
          </a>
          <span>—</span>
          <a
            className="hover:text-foreground transition-colors"
            href="https://www.linkedin.com/in/martingarciamonterde/"
            target="_blank"
            rel="me noopener noreferrer"
          >
            linkedin
          </a>
        </div>

        <div>
          <a
            className="hover:text-foreground transition-colors"
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
