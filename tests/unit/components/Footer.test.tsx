import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  describe("Social Links", () => {
    it("renders Bluesky link with correct URL", () => {
      render(<Footer />);

      const blueskyLink = screen.getByRole("link", { name: /bluesky/i });
      expect(blueskyLink).toBeInTheDocument();
      expect(blueskyLink).toHaveAttribute(
        "href",
        "https://bsky.app/profile/mgarcia.bsky.social",
      );
    });

    it("renders GitHub link with correct URL", () => {
      render(<Footer />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute("href", "https://github.com/magarcia");
    });

    it("renders LinkedIn link with correct URL", () => {
      render(<Footer />);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/martingarciamonterde/",
      );
    });
  });

  describe("Link Security Attributes", () => {
    it("all social links open in new tab", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByRole("link", { name: /bluesky/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /linkedin/i }),
      ];

      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("all social links have rel attribute with noopener noreferrer me", () => {
      render(<Footer />);

      const socialLinks = [
        screen.getByRole("link", { name: /bluesky/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /linkedin/i }),
      ];

      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "me noopener noreferrer");
      });
    });
  });

  describe("Accessibility", () => {
    it("Bluesky link has descriptive aria-label", () => {
      render(<Footer />);

      const blueskyLink = screen.getByRole("link", { name: /bluesky/i });
      expect(blueskyLink).toHaveAttribute(
        "aria-label",
        "Visit Martin Garcia on Bluesky (opens in new tab)",
      );
    });

    it("GitHub link has descriptive aria-label", () => {
      render(<Footer />);

      const githubLink = screen.getByRole("link", { name: /github/i });
      expect(githubLink).toHaveAttribute(
        "aria-label",
        "Visit Martin Garcia on GitHub (opens in new tab)",
      );
    });

    it("LinkedIn link has descriptive aria-label", () => {
      render(<Footer />);

      const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
      expect(linkedinLink).toHaveAttribute(
        "aria-label",
        "Visit Martin Garcia on LinkedIn (opens in new tab)",
      );
    });

    it("RSS link has descriptive aria-label", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toHaveAttribute("aria-label", "Subscribe to RSS feed");
    });
  });

  describe("RSS Link", () => {
    it("renders RSS link with correct href", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).toBeInTheDocument();
      expect(rssLink).toHaveAttribute("href", "/rss.xml");
    });

    it("RSS link opens in same tab (internal resource)", () => {
      render(<Footer />);

      const rssLink = screen.getByRole("link", { name: /rss/i });
      expect(rssLink).not.toHaveAttribute("target");
    });
  });

  describe("Styling", () => {
    it("all links have hover transition class", () => {
      render(<Footer />);

      const allLinks = [
        screen.getByRole("link", { name: /bluesky/i }),
        screen.getByRole("link", { name: /github/i }),
        screen.getByRole("link", { name: /linkedin/i }),
        screen.getByRole("link", { name: /rss/i }),
      ];

      allLinks.forEach((link) => {
        expect(link).toHaveClass("transition-colors");
      });
    });

    it("footer has correct layout classes", () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector("footer");
      expect(footer).toHaveClass(
        "px-8",
        "md:px-16",
        "mx-auto",
        "my-12",
        "md:my-24",
        "max-w-[75ch]",
      );
    });
  });

  describe("Content Structure", () => {
    it("renders all social links in order", () => {
      const { container } = render(<Footer />);

      const links = container.querySelectorAll("a");
      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent("bluesky");
      expect(links[1]).toHaveTextContent("github");
      expect(links[2]).toHaveTextContent("linkedin");
      expect(links[3]).toHaveTextContent("rss");
    });

    it("social links are separated by em-dashes", () => {
      const { container } = render(<Footer />);

      const spans = container.querySelectorAll("span");
      expect(spans.length).toBeGreaterThanOrEqual(2);
      spans.forEach((span) => {
        expect(span.textContent).toBe("—");
      });
    });
  });
});
