import { getContent } from '@/lib/content';
import CoursesContent from './CoursesContent';

export const dynamic = 'force-dynamic';

export default function CoursesPage() {
  const content = getContent();

  return (
    <CoursesContent
      courses={content.courses}
      certificates={content.certificates}
      communityName={content.communityName}
      socialLinks={content.socialLinks}
    />
  );
}
