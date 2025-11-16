export default function Footer() {
  return (
    <footer className="flex items-center p-8 mx-auto my-16 md:p-0 place-content-between max-w-prose">
      <div>
        <a
          className="underline"
          href="https://twitter.com/martinprins"
          target="_blank"
          rel="me noopener noreferrer"
        >
          twitter
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://github.com/magarcia"
          target="_blank"
          rel="me noopener noreferrer"
        >
          github
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://stackoverflow.com/users/458193/martin-prins"
          target="_blank"
          rel="me noopener noreferrer"
        >
          stack overflow
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://www.linkedin.com/in/martingarciamonterde/"
          target="_blank"
          rel="me noopener noreferrer"
        >
          linkedin
        </a>
      </div>

      <div>
        <a
          className="underline"
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
        >
          rss
        </a>
      </div>
    </footer>
  );
}
