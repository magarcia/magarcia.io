import { describe, it, expect } from "vitest";
import { cn } from "~/lib/utils";

describe("cn", () => {
  describe("basic class merging", () => {
    it("combines multiple class strings", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("returns empty string when no classes provided", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("handles single class", () => {
      const result = cn("single-class");
      expect(result).toBe("single-class");
    });
  });

  describe("conditional classes", () => {
    it("includes truthy conditional classes", () => {
      const result = cn("base", true && "included");
      expect(result).toBe("base included");
    });

    it("excludes falsy conditional classes", () => {
      const result = cn("base", false && "excluded");
      expect(result).toBe("base");
    });

    it("handles undefined values", () => {
      const result = cn("base", undefined, "end");
      expect(result).toBe("base end");
    });

    it("handles null values", () => {
      const result = cn("base", null, "end");
      expect(result).toBe("base end");
    });
  });

  describe("object syntax", () => {
    it("includes classes with truthy values", () => {
      const result = cn({ active: true, disabled: false });
      expect(result).toBe("active");
    });

    it("combines object and string syntax", () => {
      const result = cn("base", { active: true, hidden: false });
      expect(result).toBe("base active");
    });
  });

  describe("array syntax", () => {
    it("flattens array of classes", () => {
      const result = cn(["foo", "bar"]);
      expect(result).toBe("foo bar");
    });

    it("handles nested arrays", () => {
      const result = cn(["foo", ["bar", "baz"]]);
      expect(result).toBe("foo bar baz");
    });
  });

  describe("tailwind class merging", () => {
    it("merges conflicting padding classes (last wins)", () => {
      const result = cn("p-4", "p-8");
      expect(result).toBe("p-8");
    });

    it("merges conflicting margin classes", () => {
      const result = cn("m-2", "m-6");
      expect(result).toBe("m-6");
    });

    it("merges conflicting text color classes", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("merges conflicting background classes", () => {
      const result = cn("bg-white", "bg-black");
      expect(result).toBe("bg-black");
    });

    it("preserves non-conflicting classes", () => {
      const result = cn("p-4", "m-2", "text-red-500");
      expect(result).toBe("p-4 m-2 text-red-500");
    });

    it("merges directional padding correctly", () => {
      const result = cn("px-4", "px-8");
      expect(result).toBe("px-8");
    });

    it("keeps different directional classes separate", () => {
      const result = cn("px-4", "py-8");
      expect(result).toBe("px-4 py-8");
    });

    it("handles responsive prefixes", () => {
      const result = cn("md:p-4", "md:p-8");
      expect(result).toBe("md:p-8");
    });

    it("merges flex direction classes", () => {
      const result = cn("flex-row", "flex-col");
      expect(result).toBe("flex-col");
    });
  });

  describe("real-world usage patterns", () => {
    it("handles component variant pattern", () => {
      const baseClasses = "rounded-md font-medium";
      const sizeClasses = "px-4 py-2";
      const variantClasses = "bg-blue-500 text-white";

      const result = cn(baseClasses, sizeClasses, variantClasses);
      expect(result).toBe("rounded-md font-medium px-4 py-2 bg-blue-500 text-white");
    });

    it("handles override pattern for component props", () => {
      const defaultClasses = "p-4 bg-white text-black";
      const overrideClasses = "p-8 bg-gray-100";

      const result = cn(defaultClasses, overrideClasses);
      expect(result).toBe("text-black p-8 bg-gray-100");
    });

    it("handles conditional disabled state", () => {
      const isDisabled = true;
      const result = cn(
        "btn",
        isDisabled && "opacity-50 cursor-not-allowed"
      );
      expect(result).toBe("btn opacity-50 cursor-not-allowed");
    });

    it("handles conditional active state", () => {
      const isActive = false;
      const result = cn(
        "nav-item",
        isActive ? "bg-blue-500" : "bg-gray-200"
      );
      expect(result).toBe("nav-item bg-gray-200");
    });
  });
});
