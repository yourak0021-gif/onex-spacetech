import { getContent, incrementProjectValue, incrementProjectsCount, incrementMemberCount } from '@/lib/content';
import SitePreview from '@/components/SitePreview';

export const dynamic = 'force-dynamic';

export default function Home() {
  let content = getContent();
  content = incrementProjectValue(content);
  content = incrementProjectsCount(content);
  content = incrementMemberCount(content);

  const { adminPassword, memberLastUpdate, memberNextUpdate, ...publicContent } = content;
  const result = { ...publicContent } as any;
  if (result.stats) {
    const { projectsLastUpdate, projectsNextUpdate, ...publicStats } = result.stats;
    result.stats = publicStats;
  }

  return <SitePreview content={result} />;
}
