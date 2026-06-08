import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/origin-check';
import { sanitizeString } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`privacy:${ip}`, 15, 120000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await request.json();
    if (typeof body?.key !== 'string' || body.key.length < 1 || body.key.length > 128) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const key = sanitizeString(body.key, 128);
    if (!key) {
      return NextResponse.json({ error: 'Privacy key is required' }, { status: 400 });
    }

    const content = await getContent();

    if (!content.privacyKey) {
      content.privacyKey = await hashPassword(key);
      await saveContent(content);
      resetRateLimit(`privacy:${ip}`);
      return NextResponse.json({ success: true });
    }

    const valid = await verifyPassword(key, content.privacyKey);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid privacy key' }, { status: 401 });
    }

    resetRateLimit(`privacy:${ip}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
