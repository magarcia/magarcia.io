/**
 * SEO utilities for meta tag optimization.
 */

const MAX_DESCRIPTION_LENGTH = 155;

/**
 * Truncates a description to a maximum length for SEO purposes.
 * Truncates at word boundaries to avoid cutting words in half.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum length in characters (default: 155)
 * @returns Truncated text with "..." appended if shortened
 *
 * @example
 * truncateDescription("This is a very long description that exceeds the maximum", 50)
 * // Returns: "This is a very long description that..."
 *
 * truncateDescription("Short description", 50)
 * // Returns: "Short description"
 */
export function truncateDescription(
  text: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH,
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Reserve space for "..."
  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");

  // If we found a space in the last 30% of the string, truncate there
  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace) + "...";
  }

  // Otherwise, just truncate at max length
  return truncated + "...";
}
