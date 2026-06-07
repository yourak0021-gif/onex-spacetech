'use client';

import { motion } from 'framer-motion';
import { FaDiscord, FaYoutube, FaGithub, FaTwitter } from 'react-icons/fa';

interface SocialLinksData {
  discord: string;
  youtube: string;
  github: string;
  twitter: string;
}

const socials = [
  { key: 'discord', icon: <FaDiscord />, label: 'Discord', color: 'hover:text-[#5865F2]' },
  { key: 'youtube', icon: <FaYoutube />, label: 'YouTube', color: 'hover:text-[#FF0000]' },
  { key: 'github', icon: <FaGithub />, label: 'GitHub', color: 'hover:text-white' },
  { key: 'twitter', icon: <FaTwitter />, label: 'Twitter', color: 'hover:text-[#1DA1F2]' },
];

export default function SocialLinks({ links }: { links: SocialLinksData }) {
  const hasLinks = Object.values(links).some((v) => v && v.trim().length > 0);

  if (!hasLinks) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center gap-6 mt-8"
    >
      {socials.map(({ key, icon, label, color }) => {
        const url = links[key as keyof SocialLinksData];
        if (!url || !url.trim()) return null;
        return (
          <motion.a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className={`text-2xl text-white/40 ${color} transition-colors duration-300`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {icon}
          </motion.a>
        );
      })}
    </motion.div>
  );
}
