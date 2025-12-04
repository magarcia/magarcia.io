import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  describe("Social Links", () => {
    it("renders Twitter link with correct URL", () => {
      render(<Footer />);

      const twitterLink = screen.getByRole("link", { name: /twitter/i });
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute(
        "href",
        "https://twitter.com/martinprins"
      );
    });

    it("renders GitHub link with correct URL", () => {
      render(<Footer />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/magarcia");
    });

    it("renders Stack Overflow link with correct URL", () => {
      render(<Footer />);

      const stackOverflowLink = screen.getByRole("link", {
        name: /stack overflow/i,
      });
      expect(stackOverflowLink).toBeInTheDocument();
      expect(stackOverflowLink).toHaveAttribute(
        "href",
        "https://stackoverflow.com/users/458193/martin-prins"
      );
    });

    it("renders LinkedIn link with correct URL", () => {
      render(<Footer />);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/martingarciamonterde/"
      );
    });
  });

  describe("Link Security Attributes", () => {
    it("all social links open in new tab", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByRole("link", { name: /twitter/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /stack overflow/i }),
        screen.getByRole("link", { name: /linkedin/i }),
      ];

      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("all social links have rel attribute with noopener noreferrer me", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByRole("link", { name: /twitter/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /stack overflow/i }),
        screen.getByRole("link", { name: /linkedin/i }),
      ];

      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "me noopener noreferrer");
      });
    });
  });

  describe("RSS Link", () => {
    it("renders RSS link with correct href", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toBeInTheDocument();
      expect(rssLink).toHaveAttribute("href", "/rss.xml");
    });

    it("RSS link opens in new tab", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toHaveAttribute("target", "_blank");
    });

    it("RSS link has security attributes", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Styling", () => {
    it("all social links have underline class", () => {
      render(<Footer />);

      const allLinks = [
        screen.getByRole("link", { name: /twitter/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /stack overflow/i }),
        screen.getByRole("link", { name: /linkedin/i }),
        screen.getByRole("link", { name: /rss/i }),
      ];

      allLinks.forEach((link) => {
        expect(link).toHaveClass("underline");
      });
    });

    it("footer has correct layout classes", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer).toHaveClass(
        "flex",
        "items-center",
        "p-8",
        "mx-auto",
        "my-16",
        "md:p-0",
        "place-content-between",
        "max-w-prose"
      );
    });
  });

  describe("Content Structure", () => {
    it("renders all social links in order", () => {
      const { container } = render(<Footer />);

      const links = container.querySelectorAll("a");
      expect(links).toHaveLength(5);
      expect(links[0]).toHaveTextContent("twitter");
      expect(links[1]).toHaveTextContent("github");
      expect(links[2]).toHaveTextContent("stack overflow");
      expect(links[3]).toHaveTextContent("linkedin");
      expect(links[4]).toHaveTextContent("rss");
    });

    it("social links are separated by hyphens", () => {
      const { container } = render(<Footer />);

      const footerText = container.querySelector("footer")?.textContent;
      expect(footerText).toMatch(/twitter\s*[\u002D\u2010-\u2015]\s*github/);
      expect(footerText).toMatch(/github\s*[\u002D\u2010-\u2015]\s*stack overflow/);
      expect(footerText).toMatch(/stack overflow\s*[\u002D\u2010-\u2015]\s*linkedin/);
    });
  });
});
