/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates if a priority value is within valid range (0.0-1.0)
 */
export function isValidPriority(priority: number): boolean {
  return priority >= 0.0 && priority <= 1.0;
}

/**
 * Validates if a changefreq value is valid according to sitemap spec
 * Valid values: always, hourly, daily, weekly, monthly, yearly, never
 */
export function isValidChangefreq(changefreq: string): boolean {
  const validValues = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ];
  return validValues.includes(changefreq.toLowerCase());
}

/**
 * Validates if a lastmod date is in valid ISO 8601 format
 * Accepts formats like: YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS+00:00
 */
export function isValidLastmod(dateStr: string): boolean {
  // ISO 8601 format patterns
  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

  if (!iso8601Regex.test(dateStr)) {
    return false;
  }

  // Verify it's a valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}
