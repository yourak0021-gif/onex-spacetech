'use client';

import Particles from '@/components/Particles';
import Navbar from '@/components/Navbar';
import HorizontalScroll from '@/components/HorizontalScroll';
import Hero from '@/components/Hero';
import Partners from '@/components/Partners';
import Stats from '@/components/Stats';
import ProjectValue from '@/components/ProjectValue';
import TopMembers from '@/components/TopMembers';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import type { SiteContent } from '@/types/content';

interface SitePreviewProps {
  content: SiteContent;
  editMode?: boolean;
  onEditSection?: (section: string) => void;
}

export default function SitePreview({ content, editMode, onEditSection }: SitePreviewProps) {
  const sections = [
    { id: 'hero', label: 'Hero', node: (
      <Hero
        communityName={content.communityName}
        tagline={content.tagline}
        inspirational={content.inspirational}
      />
    )},
    { id: 'partners', label: 'Partners', node: <Partners partners={content.partners} /> },
    { id: 'stats', label: 'Stats', node: <Stats memberCount={content.memberCount} stats={content.stats} /> },
    { id: 'project-value', label: 'Value', node: <ProjectValue projectInfo={content.projectInfo} /> },
    { id: 'members', label: 'Members', node: <TopMembers members={content.topMembers} /> },
    { id: 'services', label: 'Services', node: <Services services={content.services} /> },
    { id: 'gallery', label: 'Gallery', node: <Gallery images={content.gallery} /> },
    { id: 'cta', label: 'CTA', node: <CallToAction /> },
    { id: 'footer', label: 'Footer', node: (
      <div className="min-h-screen flex flex-col justify-end">
        <Footer communityName={content.communityName} socialLinks={content.socialLinks} />
      </div>
    )},
  ];

  return (
    <div className="relative">
      <Particles />
      <Navbar />
      <HorizontalScroll sections={sections} />
    </div>
  );
}
