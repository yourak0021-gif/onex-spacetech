export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  if (!host) return false;

  const allowed = [host, `localhost:${host.split(':')[1] || '3000'}`, 'localhost'];

  if (origin) {
    try {
      const o = new URL(origin);
      return allowed.some(a => o.host === a || o.host.endsWith(`.${a}`));
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const r = new URL(referer);
      return allowed.some(a => r.host === a || r.host.endsWith(`.${a}`));
    } catch {
      return false;
    }
  }

  return process.env.NODE_ENV !== 'production';
}
