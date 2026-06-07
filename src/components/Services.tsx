'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import type { Service } from '@/types/content';
import { useContent } from '@/hooks/useContent';

import {
  FaGamepad, FaCode, FaImage, FaVideo, FaPaintBrush, FaTrophy,
  FaServer, FaGlobe, FaNetworkWired, FaRocket, FaCube, FaDatabase, FaCog,
  FaMobileAlt, FaAndroid, FaApple, FaDesktop, FaLayerGroup, FaPalette, FaPlug, FaCogs,
  FaBuilding, FaWordpress, FaShoppingCart, FaCloud, FaRobot, FaWrench, FaTools,
  FaTachometerAlt, FaBug, FaComments, FaBrain, FaProjectDiagram, FaShareAlt, FaKeyboard,
  FaGraduationCap, FaClipboardCheck, FaCommentDots, FaPuzzlePiece, FaEye, FaLanguage,
  FaFileAlt, FaStream, FaBriefcase, FaShieldAlt, FaClipboardList, FaBalanceScale,
  FaExclamationTriangle, FaSearch, FaHandshake, FaBook, FaGavel, FaCheckCircle,
  FaFlask, FaUsers, FaChartLine, FaUniversalAccess, FaSmile, FaSitemap, FaUpload,
  FaSyncAlt, FaChartBar, FaHardHat, FaThList, FaMicrochip, FaTruck,
  FaGlobeAmericas, FaPassport, FaStar, FaTrademark, FaBullhorn, FaHashtag,
  FaPlayCircle, FaFilePowerpoint, FaFolderOpen, FaPenNib, FaLightbulb, FaMagic,
  FaHistory, FaEraser, FaInstagram, FaYoutube, FaMusic, FaFilm, FaPlay,
  FaHeadphones, FaMicrophone, FaMicrophoneAlt, FaBroadcastTower, FaBox, FaUser,
  FaTree, FaBone, FaSun, FaPaintRoller, FaPenAlt, FaNewspaper, FaBlog, FaScroll,
  FaUserSecret, FaEnvelopeOpenText, FaCheckDouble, FaFileAudio, FaFacebook, FaTwitter,
  FaLinkedin, FaTelegram, FaDiscord, FaCalendarAlt, FaShareSquare, FaAd, FaMousePointer,
  FaEnvelope, FaTasks, FaFlag, FaUserTie, FaUserCircle, FaLink, FaPeopleArrows,
  FaHandHoldingHeart, FaSearchDollar, FaBinoculars, FaChess, FaExpandArrowsAlt,
  FaHeadset, FaTicketAlt, FaChartPie, FaCalculator, FaMoneyBillWave, FaFileContract,
  FaUserPlus, FaHandsHelping, FaChalkboardTeacher, FaUserGraduate, FaLaptop, FaCalendarCheck,
  FaLaptopCode, FaUsersCog, FaCodeBranch, FaPlane, FaMoon,
   FaInfinity, FaSatellite, FaDrawPolygon, FaSatelliteDish,
  FaFire, FaFireAlt, FaMapMarkedAlt, FaMeteor, FaUserAstronaut
} from 'react-icons/fa';

const iconMap: Record<string, React.ReactNode> = {
  FaGamepad: <FaGamepad />, FaCode: <FaCode />, FaImage: <FaImage />, FaVideo: <FaVideo />,
  FaPaintBrush: <FaPaintBrush />, FaTrophy: <FaTrophy />, FaServer: <FaServer />,
  FaGlobe: <FaGlobe />, FaNetworkWired: <FaNetworkWired />, FaRocket: <FaRocket />,
  FaCube: <FaCube />, FaDatabase: <FaDatabase />, FaCog: <FaCog />,
  FaMobileAlt: <FaMobileAlt />, FaAndroid: <FaAndroid />, FaApple: <FaApple />,
  FaDesktop: <FaDesktop />, FaLayerGroup: <FaLayerGroup />, FaPalette: <FaPalette />,
  FaPlug: <FaPlug />, FaCogs: <FaCogs />, FaBuilding: <FaBuilding />,
  FaWordpress: <FaWordpress />, FaShoppingCart: <FaShoppingCart />, FaCloud: <FaCloud />,
  FaRobot: <FaRobot />, FaWrench: <FaWrench />, FaTools: <FaTools />,
  FaTachometerAlt: <FaTachometerAlt />, FaBug: <FaBug />, FaComments: <FaComments />,
  FaBrain: <FaBrain />, FaProjectDiagram: <FaProjectDiagram />, FaShareAlt: <FaShareAlt />,
  FaKeyboard: <FaKeyboard />, FaGraduationCap: <FaGraduationCap />,
  FaClipboardCheck: <FaClipboardCheck />, FaCommentDots: <FaCommentDots />,
  FaPuzzlePiece: <FaPuzzlePiece />, FaEye: <FaEye />, FaLanguage: <FaLanguage />,
  FaFileAlt: <FaFileAlt />, FaStream: <FaStream />, FaBriefcase: <FaBriefcase />,
  FaShieldAlt: <FaShieldAlt />, FaClipboardList: <FaClipboardList />,
  FaBalanceScale: <FaBalanceScale />, FaExclamationTriangle: <FaExclamationTriangle />,
  FaSearch: <FaSearch />, FaHandshake: <FaHandshake />, FaBook: <FaBook />,
  FaGavel: <FaGavel />, FaCheckCircle: <FaCheckCircle />, FaFlask: <FaFlask />,
  FaUsers: <FaUsers />, FaChartLine: <FaChartLine />, FaUniversalAccess: <FaUniversalAccess />,
  FaSmile: <FaSmile />, FaSitemap: <FaSitemap />, FaUpload: <FaUpload />,
  FaSyncAlt: <FaSyncAlt />, FaChartBar: <FaChartBar />, FaHardHat: <FaHardHat />,
  FaThList: <FaThList />, FaMicrochip: <FaMicrochip />, FaTruck: <FaTruck />,
  FaGlobeAmericas: <FaGlobeAmericas />, FaPassport: <FaPassport />, FaStar: <FaStar />,
  FaTrademark: <FaTrademark />, FaBullhorn: <FaBullhorn />, FaHashtag: <FaHashtag />,
  FaPlayCircle: <FaPlayCircle />, FaFilePowerpoint: <FaFilePowerpoint />,
  FaFolderOpen: <FaFolderOpen />, FaPenNib: <FaPenNib />, FaLightbulb: <FaLightbulb />,
  FaMagic: <FaMagic />, FaHistory: <FaHistory />, FaEraser: <FaEraser />,
  FaInstagram: <FaInstagram />, FaYoutube: <FaYoutube />, FaMusic: <FaMusic />,
  FaFilm: <FaFilm />, FaPlay: <FaPlay />, FaHeadphones: <FaHeadphones />,
  FaMicrophone: <FaMicrophone />, FaMicrophoneAlt: <FaMicrophoneAlt />,
  FaBroadcastTower: <FaBroadcastTower />, FaBox: <FaBox />, FaUser: <FaUser />,
  FaTree: <FaTree />, FaBone: <FaBone />, FaSun: <FaSun />,
  FaPaintRoller: <FaPaintRoller />, FaPenAlt: <FaPenAlt />, FaNewspaper: <FaNewspaper />,
  FaBlog: <FaBlog />, FaScroll: <FaScroll />, FaUserSecret: <FaUserSecret />,
  FaEnvelopeOpenText: <FaEnvelopeOpenText />, FaCheckDouble: <FaCheckDouble />,
  FaFileAudio: <FaFileAudio />, FaFacebook: <FaFacebook />, FaTwitter: <FaTwitter />,
  FaLinkedin: <FaLinkedin />, FaTelegram: <FaTelegram />, FaDiscord: <FaDiscord />,
  FaCalendarAlt: <FaCalendarAlt />, FaShareSquare: <FaShareSquare />, FaAd: <FaAd />,
  FaMousePointer: <FaMousePointer />, FaEnvelope: <FaEnvelope />, FaTasks: <FaTasks />,
  FaFlag: <FaFlag />, FaUserTie: <FaUserTie />, FaUserCircle: <FaUserCircle />,
  FaLink: <FaLink />, FaPeopleArrows: <FaPeopleArrows />,
  FaHandHoldingHeart: <FaHandHoldingHeart />, FaSearchDollar: <FaSearchDollar />,
  FaBinoculars: <FaBinoculars />,   FaChess: <FaChess />,
  FaExpandArrowsAlt: <FaExpandArrowsAlt />, FaHeadset: <FaHeadset />,
  FaTicketAlt: <FaTicketAlt />, FaChartPie: <FaChartPie />,
  FaCalculator: <FaCalculator />, FaMoneyBillWave: <FaMoneyBillWave />,
  FaFileContract: <FaFileContract />, FaUserPlus: <FaUserPlus />,
  FaHandsHelping: <FaHandsHelping />, FaChalkboardTeacher: <FaChalkboardTeacher />,
  FaUserGraduate: <FaUserGraduate />, FaLaptop: <FaLaptop />,
  FaCalendarCheck: <FaCalendarCheck />, FaLaptopCode: <FaLaptopCode />,
  FaUsersCog: <FaUsersCog />, FaCodeBranch: <FaCodeBranch />, FaPlane: <FaPlane />,
  FaMoon: <FaMoon />, FaInfinity: <FaInfinity />,
  FaSatellite: <FaSatellite />, FaDrawPolygon: <FaDrawPolygon />,
  FaSatelliteDish: <FaSatelliteDish />,
  FaFire: <FaFire />, FaFireAlt: <FaFireAlt />, FaMapMarkedAlt: <FaMapMarkedAlt />,
  FaMeteor: <FaMeteor />, FaUserAstronaut: <FaUserAstronaut />,
};

interface GroupedServices {
  [category: string]: Service[];
}

export default function Services({ services: propServices }: { services?: Service[] }) {
  const fetchedServices = useContent((d: any) => d.services as Service[] | undefined);
  const services: Service[] = propServices || fetchedServices || [];
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => {
    const map: GroupedServices = {};
    services.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [services]);

  const categories = useMemo(() => {
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [grouped]);

  const toggleCategory = (cat: string) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  if (!services || services.length === 0) return null;

  const getCategoryIcon = (category: string): string => {
    const cat = category.toLowerCase();
    if (cat.includes('software') || cat.includes('technology')) return 'FaLayerGroup';
    if (cat.includes('ai') || cat.includes('artificial') || cat.includes('automation')) return 'FaBrain';
    if (cat.includes('cyber') || cat.includes('security')) return 'FaShieldAlt';
    if (cat.includes('test') || cat.includes('qa') || cat.includes('quality')) return 'FaCheckCircle';
    if (cat.includes('host') || cat.includes('infrastructure')) return 'FaServer';
    if (cat.includes('datacenter') || cat.includes('physical')) return 'FaHardHat';
    if (cat.includes('design') || cat.includes('creative')) return 'FaPalette';
    if (cat.includes('photo') || cat.includes('video') || cat.includes('media')) return 'FaVideo';
    if (cat.includes('3d') || cat.includes('cgi') || cat.includes('render')) return 'FaCube';
    if (cat.includes('content') || cat.includes('document')) return 'FaFileAlt';
    if (cat.includes('social')) return 'FaShareAlt';
    if (cat.includes('market') || cat.includes('digital market')) return 'FaBullhorn';
    if (cat.includes('creator') || cat.includes('influencer')) return 'FaUserTie';
    if (cat.includes('business') || cat.includes('consult')) return 'FaBriefcase';
    if (cat.includes('customer') || cat.includes('support')) return 'FaHeadset';
    if (cat.includes('data') || cat.includes('research')) return 'FaChartBar';
    if (cat.includes('finance') || cat.includes('legal') || cat.includes('compliance')) return 'FaBalanceScale';
    if (cat.includes('human') || cat.includes('hr')) return 'FaUsers';
    if (cat.includes('education') || cat.includes('train')) return 'FaGraduationCap';
    if (cat.includes('event') || cat.includes('community')) return 'FaCalendarCheck';
    if (cat.includes('gaming') || cat.includes('esport')) return 'FaGamepad';
    if (cat.includes('open source')) return 'FaCodeBranch';
    if (cat.includes('global')) return 'FaGlobeAmericas';
    if (cat.includes('space') || cat.includes('aero') || cat.includes('astro')) return 'FaRocket';
    return 'FaCog';
  };

  return (
    <section id="services" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/25 uppercase tracking-[0.3em] font-light mb-5">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Services <span className="text-gradient">&amp; Operations</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm font-light">
            {services.length}+ services across {categories.length} disciplines. Every digital and scientific capability, under one community.
          </p>
        </motion.div>

        <div className="space-y-2">
          {categories.map(([category, items], catIdx) => {
            const isOpen = openCategory === category;
            const catIcon = getCategoryIcon(category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: catIdx * 0.02 }}
                className="glass rounded-xl border border-white/[0.04] overflow-hidden card-glow"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-4 md:px-5 py-3.5 md:py-4 text-left hover:bg-white/[0.015] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-base text-primary/50">
                      {iconMap[catIcon] || <FaCog />}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/80">{category}</h3>
                      <p className="text-[11px] text-white/20 mt-0.5">{items.length} services</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/15"
                  >
                    <HiChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 md:px-5 pb-4">
                        <div className="border-t border-white/[0.03] pt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                            {items.map((service) => (
                              <div
                                key={service.id}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
                              >
                                <div className="text-xs text-primary/30 group-hover:text-primary/50 transition-colors shrink-0">
                                  {iconMap[service.icon] || <FaCog />}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                                    {service.title}
                                  </div>
                                  {service.description && (
                                    <div className="text-[11px] text-white/20 truncate">{service.description}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
