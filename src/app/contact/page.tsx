import { getContent } from '@/lib/content';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactContent from './ContactContent';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const content = getContent();

  return (
    <>
      <Navbar />
      <ContactContent communityName={content.communityName} socialLinks={content.socialLinks} tagline={content.tagline} />
      <Footer communityName={content.communityName} socialLinks={content.socialLinks} />
    </>
  );
}
