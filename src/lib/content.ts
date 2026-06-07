import fs from 'fs';
import path from 'path';
import rawContent from '../../content.json';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const CACHE_TTL = 60_000;
const contentPath = path.resolve(process.cwd(), 'content.json');

let cached: SiteContent | null = null;
let lastCacheTime = 0;

export interface GalleryItem {
  url: string;
  description: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  certificate: boolean;
  price: number;
}

export interface Certificate {
  id: number;
  name: string;
  description: string;
  issuer: string;
  price: number;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string;
  category: string;
  description: string;
  parentId?: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export interface TopMember {
  name: string;
  role: string;
  description: string;
}

export interface SiteContent {
  communityName: string;
  tagline: string;
  memberCount: number;
  memberLastUpdate: number | null;
  memberNextUpdate: number | null;
  topMembers: TopMember[];
  about: { title: string; description: string; mission: string; vision: string };
  projectInfo: { title: string; description: string; value: number; lastUpdate: number | null; nextUpdate: number | null };
  inspirational: { quote: string; author: string };
  services: Service[];
  partners: Partner[];
  gallery: GalleryItem[];
  courses: Course[];
  certificates: Certificate[];
  socialLinks: { discord: string; youtube: string; github: string; twitter: string };
  stats: { members: number; services: number; projects: number; projectsLastUpdate: number | null; projectsNextUpdate: number | null; events: number };
  adminPassword: string;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export async function getContent(): Promise<SiteContent> {
  const now = Date.now();
  if (cached && now - lastCacheTime < CACHE_TTL) {
    return deepClone(cached);
  }
  try {
    if (fs.existsSync(contentPath)) {
      const stat = fs.statSync(contentPath);
      if (stat.size > MAX_FILE_SIZE) throw new Error('File too large');
      const raw = fs.readFileSync(contentPath, 'utf-8');
      cached = JSON.parse(raw);
      lastCacheTime = now;
      return deepClone(cached!);
    }
  } catch {}
  const fallback = JSON.parse(JSON.stringify(rawContent)) as unknown as SiteContent;
  cached = fallback;
  lastCacheTime = now;
  return fallback;
}

export async function saveContent(content: SiteContent): Promise<void> {
  try {
    const tmp = contentPath + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(content, null, 2), 'utf-8');
    fs.renameSync(tmp, contentPath);
    cached = content;
    lastCacheTime = Date.now();
  } catch {
    // Read-only filesystem — silently skip
  }
}

export async function incrementProjectValue(content: SiteContent): Promise<SiteContent> {
  const now = Date.now();
  if (!content.projectInfo.nextUpdate || now >= content.projectInfo.nextUpdate) {
    const increment = Math.floor(Math.random() * 9999001) + 10000;
    content.projectInfo.value = (content.projectInfo.value || 0) + increment;
    content.projectInfo.lastUpdate = now;
    content.projectInfo.nextUpdate = now + Math.floor(Math.random() * 3600001) + 3600000;
    await saveContent(content);
  }
  return content;
}

export async function incrementProjectsCount(content: SiteContent): Promise<SiteContent> {
  const now = Date.now();
  if (!content.stats.projectsNextUpdate || now >= content.stats.projectsNextUpdate) {
    const increment = Math.floor(Math.random() * 31) + 20;
    content.stats.projects = (content.stats.projects || 0) + increment;
    content.stats.projectsLastUpdate = now;
    content.stats.projectsNextUpdate = now + 60 * 60 * 1000;
    await saveContent(content);
  }
  return content;
}

export async function incrementMemberCount(content: SiteContent): Promise<SiteContent> {
  const now = Date.now();
  if (!content.memberNextUpdate || now >= content.memberNextUpdate) {
    const increment = Math.floor(Math.random() * 5) + 1;
    content.memberCount = (content.memberCount || 0) + increment;
    content.stats.members = content.memberCount;
    content.memberLastUpdate = now;
    content.memberNextUpdate = now + 24 * 60 * 60 * 1000;
    await saveContent(content);
  }
  return content;
}
