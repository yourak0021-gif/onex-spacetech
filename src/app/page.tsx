import { getContent, incrementProjectValue, incrementProjectsCount, incrementMemberCount } from '@/lib/content';
import SitePreview from '@/components/SitePreview';

export const revalidate = 60;

export default async function Home() {
  let content = await getContent();
  content = await incrementProjectValue(content);
  content = await incrementProjectsCount(content);
  content = await incrementMemberCount(content);

  const { adminPassword, memberLastUpdate, memberNextUpdate, ...publicContent } = content;
  const result = { ...publicContent } as any;
  if (result.stats) {
    const { projectsLastUpdate, projectsNextUpdate, ...publicStats } = result.stats;
    result.stats = publicStats;
  }

  return <SitePreview content={result} />;
}
