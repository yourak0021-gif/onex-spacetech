import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';
import { hashPassword, verifyPassword, setAuthCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/origin-check';
import { sanitizeString } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    if (!validateOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`login:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await request.json();
    if (typeof body?.password !== 'string' || body.password.length < 1 || body.password.length > 128) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const password = sanitizeString(body.password, 128);
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const content = await getContent();

    if (!content.adminPassword) {
      content.adminPassword = await hashPassword(password);
      await saveContent(content);
      await setAuthCookie();
      return NextResponse.json({ success: true });
    }

    const valid = await verifyPassword(password, content.adminPassword);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    await setAuthCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
