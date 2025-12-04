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
 * Validates if a date string is in RFC 822 format
 * Format: "Sat, 07 Sep 2002 00:00:01 GMT" or with timezone offset like "+0000"
 */
export function isValidRfc822Date(dateStr: string): boolean {
  // RFC 822 date format patterns
  // Day, DD Mon YYYY HH:MM:SS timezone
  const rfc822Regex =
    /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} (GMT|UT|[A-Z]{3}|[+-]\d{4})$/;
  return rfc822Regex.test(dateStr);
}

/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Extracts email from RSS managingEditor format
 * Format can be "email (name)" or just "email"
 */
export function extractEmailFromEditor(editor: string): string | null {
  const match = editor.match(/^([^\s(]+)/);
  return match ? match[1] : null;
}

/**
 * Validates ISO 639-1 language code format
 * Format: "en" or "en-us"
 */
export function isValidLanguageCode(code: string): boolean {
  return /^[a-z]{2}(-[a-zA-Z]{2,})?$/.test(code);
}
