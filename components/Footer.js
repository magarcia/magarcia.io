import React from "react";

export default function Footer() {
  return (
    <footer className="p-8 md:p-0 my-16 flex place-content-between items-center max-w-prose mx-auto">
      <div>
        <a
          className="underline"
          href="https://twitter.com/martinprins"
          target="_blank"
          rel="me noopener"
        >
          twitter
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://github.com/magarcia"
          target="_blank"
          rel="me noopener"
        >
          github
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://stackoverflow.com/users/458193/martin-prins"
          target="_blank"
          rel="me noopener"
        >
          stack overflow
        </a>{" "}
        &#8208;{" "}
        <a
          className="underline"
          href="https://www.linkedin.com/in/martingarciamonterde/"
          target="_blank"
          rel="me noopener"
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
