export function sanitizeString(value: unknown, maxLen = 5000): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>\u2028\u2029]/g, '').trim().slice(0, maxLen);
}

export function sanitizeHtml(value: unknown, maxLen = 10000): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, maxLen);
}

export function isValidUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isValidNumber(value: unknown, min = -Infinity, max = Infinity): value is number {
  return typeof value === 'number' && !Number.isNaN(value) && value >= min && value <= max;
}

export function isValidObject(value: unknown | null): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

export function isValidStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(v => typeof v === 'string');
}

export function stripScriptTags(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*on\w+\s*=\s*['"][^'"]*['"][^>]*>/gi, '')
    .replace(/<[^>]*on\w+\s*=\s*[^\s>]+[^>]*>/gi, '');
}

export const ALLOWED_CONTENT_FIELDS = new Set([
  'communityName', 'tagline', 'memberCount', 'about', 'projectInfo',
  'inspirational', 'topMembers', 'services', 'gallery', 'socialLinks',
  'stats', 'courses', 'certificates', 'partners',
]);
