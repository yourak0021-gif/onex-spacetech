import { isAuthenticated } from '@/lib/auth';
import { getContent } from '@/lib/content';
import AdminPanel from './AdminPanel';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  const content = authenticated ? getContent() : null;

  return <AdminPanel initialContent={content} initialAuthed={authenticated} />;
}
