import { NextResponse } from 'next/server';
import { getContent, saveContent, incrementProjectValue, incrementProjectsCount, incrementMemberCount, type SiteContent } from '@/lib/content';
import { isAuthenticated } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateOrigin } from '@/lib/origin-check';
import { sanitizeString, isValidObject, isValidNumber, sanitizeHtml, ALLOWED_CONTENT_FIELDS } from '@/lib/validation';

function stripContent(content: SiteContent) {
  const { adminPassword, memberLastUpdate, memberNextUpdate, ...publicContent } = content;
  if (publicContent.stats) {
    delete (publicContent.stats as any).projectsLastUpdate;
    delete (publicContent.stats as any).projectsNextUpdate;
  }
  return publicContent;
}

export async function GET() {
  try {
    let content = getContent();
    content = incrementProjectValue(content);
    content = incrementProjectsCount(content);
    content = incrementMemberCount(content);
    return NextResponse.json(stripContent(content));
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`patch:${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const current = getContent();
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const updates = body as Record<string, unknown>;
    const unknownFields = Object.keys(updates).filter(k => !ALLOWED_CONTENT_FIELDS.has(k));
    if (unknownFields.length > 0) {
      return NextResponse.json({ error: `Unknown fields: ${unknownFields.join(',')}` }, { status: 400 });
    }

    if (typeof updates.communityName === 'string') {
      current.communityName = sanitizeString(updates.communityName, 200);
    }
    if (typeof updates.tagline === 'string') {
      current.tagline = sanitizeString(updates.tagline, 500);
    }
    if (isValidNumber(updates.memberCount, 0, 1_000_000_000)) {
      current.memberCount = updates.memberCount;
      current.stats.members = updates.memberCount;
    }
    if (updates.about && isValidObject(updates.about)) {
      current.about = {
        title: sanitizeString(updates.about.title as string, 200) || current.about.title,
        description: sanitizeHtml(updates.about.description as string, 5000) || current.about.description,
        mission: sanitizeString(updates.about.mission as string, 2000) || current.about.mission,
        vision: sanitizeString(updates.about.vision as string, 2000) || current.about.vision,
      };
    }
    if (updates.projectInfo && isValidObject(updates.projectInfo)) {
      const p = updates.projectInfo;
      if (typeof p.title === 'string') current.projectInfo.title = sanitizeString(p.title, 200);
      if (typeof p.description === 'string') current.projectInfo.description = sanitizeString(p.description, 1000);
      if (isValidNumber(p.value, 0)) current.projectInfo.value = p.value;
    }
    if (updates.inspirational && isValidObject(updates.inspirational)) {
      const ins = updates.inspirational;
      if (typeof ins.quote === 'string') current.inspirational.quote = sanitizeString(ins.quote, 2000);
      if (typeof ins.author === 'string') current.inspirational.author = sanitizeString(ins.author, 200);
    }
    if (Array.isArray(updates.topMembers)) {
      current.topMembers = updates.topMembers.slice(0, 50).map((m: any) => ({
        name: sanitizeString(m.name, 100),
        role: sanitizeString(m.role, 100),
        description: sanitizeString(m.description, 500),
      }));
    }
    if (Array.isArray(updates.services)) {
      current.services = updates.services.slice(0, 1000).map((s: any) => ({
        id: isValidNumber(s.id, 0) ? s.id : 0,
        title: sanitizeString(s.title, 200),
        icon: sanitizeString(s.icon, 100),
        category: sanitizeString(s.category, 200),
        description: sanitizeString(s.description, 1000),
      }));
    }
    if (Array.isArray(updates.courses)) {
      current.courses = updates.courses.slice(0, 200).map((c: any) => ({
        id: isValidNumber(c.id, 0) ? c.id : 0,
        title: sanitizeString(c.title, 200),
        description: sanitizeString(c.description, 2000),
        duration: sanitizeString(c.duration, 50),
        level: sanitizeString(c.level, 50),
        category: sanitizeString(c.category, 100),
        certificate: typeof c.certificate === 'boolean' ? c.certificate : false,
        price: isValidNumber(c.price, 0) ? c.price : 0,
      }));
    }
    if (Array.isArray(updates.certificates)) {
      current.certificates = updates.certificates.slice(0, 200).map((c: any) => ({
        id: isValidNumber(c.id, 0) ? c.id : 0,
        name: sanitizeString(c.name, 200),
        description: sanitizeString(c.description, 2000),
        issuer: sanitizeString(c.issuer, 200),
        price: isValidNumber(c.price, 0) ? c.price : 0,
      }));
    }
    if (Array.isArray(updates.gallery)) {
      current.gallery = updates.gallery.slice(0, 200).map((g: any) => ({
        url: sanitizeString(g.url, 2000),
        description: sanitizeString(g.description, 500),
      }));
    }
    if (updates.socialLinks && isValidObject(updates.socialLinks)) {
      const s = updates.socialLinks;
      if (typeof s.discord === 'string') current.socialLinks.discord = sanitizeString(s.discord, 2000);
      if (typeof s.youtube === 'string') current.socialLinks.youtube = sanitizeString(s.youtube, 2000);
      if (typeof s.github === 'string') current.socialLinks.github = sanitizeString(s.github, 2000);
      if (typeof s.twitter === 'string') current.socialLinks.twitter = sanitizeString(s.twitter, 2000);
    }
    if (updates.stats && isValidObject(updates.stats)) {
      const s = updates.stats;
      if (isValidNumber(s.members, 0)) current.stats.members = s.members;
      if (isValidNumber(s.projects, 0)) current.stats.projects = s.projects;
      if (isValidNumber(s.services, 0)) current.stats.services = s.services;
      if (isValidNumber(s.events, 0)) current.stats.events = s.events;
    }
    if (Array.isArray(updates.partners)) {
      current.partners = updates.partners.slice(0, 500).map((p: any) => ({
        id: isValidNumber(p.id, 0) ? p.id : 0,
        name: sanitizeString(p.name, 200),
        logo: sanitizeString(p.logo, 2000),
        url: sanitizeString(p.url, 2000),
        category: sanitizeString(p.category, 200),
        description: sanitizeString(p.description, 1000),
        parentId: isValidNumber(p.parentId, 0) ? p.parentId : undefined,
      }));
    }

    saveContent(current);
    return NextResponse.json(stripContent(current));
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
