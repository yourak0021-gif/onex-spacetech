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

export interface SiteContent {
  communityName: string;
  tagline: string;
  memberCount: number;
  memberLastUpdate: number | null;
  memberNextUpdate: number | null;
  topMembers: TopMember[];
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
  projectInfo: {
    title: string;
    description: string;
    value: number;
    lastUpdate: number | null;
    nextUpdate: number | null;
  };
  inspirational: {
    quote: string;
    author: string;
  };
  services: Service[];
  partners: Partner[];
  gallery: GalleryItem[];
  courses: Course[];
  certificates: Certificate[];
  socialLinks: {
    discord: string;
    youtube: string;
    github: string;
    twitter: string;
  };
  contactInfo: {
    email: string;
    location: string;
    website: string;
  };
  stats: {
    members: number;
    services: number;
    projects: number;
    projectsLastUpdate: number | null;
    projectsNextUpdate: number | null;
    events: number;
  };
}
