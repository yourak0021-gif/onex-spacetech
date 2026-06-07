import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  if (pathname.startsWith('/api/') && method !== 'GET') {
    const allowedMethods = new Map([
      ['/api/content', new Set(['GET', 'PATCH'])],
      ['/api/auth/login', new Set(['POST'])],
      ['/api/auth/logout', new Set(['POST'])],
      ['/api/auth/check', new Set(['GET'])],
    ]);

    let isAllowed = false;
    for (const [path, methods] of allowedMethods) {
      if (pathname === path && methods.has(method)) {
        isAllowed = true;
        break;
      }
    }
    if (!isAllowed) {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }
  }

  if (request.url.length > 4000) {
    return NextResponse.json({ error: 'URI too long' }, { status: 414 });
  }

  if (method === 'POST' || method === 'PATCH') {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
