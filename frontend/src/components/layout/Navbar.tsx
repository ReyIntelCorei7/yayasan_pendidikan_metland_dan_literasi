import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useNavScroll } from '../../hooks/useNavScroll';
import type { NavItem } from '../../types';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Profil',
    href: '/profil',
    children: [
      { label: 'Visi & Misi', href: '/profil/visi-misi', description: 'Visi, misi, dan nilai-nilai yayasan' },
      { label: 'Struktur Organisasi', href: '/profil/struktur-organisasi', description: 'Susunan pengurus dan pengelola' },
    ],
  },
  {
    label: 'Our School',
    href: '/our-school',
    children: [
      { label: 'TK Tunas Metropolitan', href: '/our-school/tk-tunas-metropolitan', description: 'Taman Kanak-Kanak Tunas Metropolitan' },
      { label: 'SD Tunas Metropolitan', href: '/our-school/sd-tunas-metropolitan', description: 'Sekolah Dasar Tunas Metropolitan' },
      { label: 'SMK Pariwisata Metland School', href: '/our-school/smk-pariwisata-metland-school', description: 'SMK Pariwisata Metland School' },
      { label: 'SMK Metland', href: '/our-school/smk-metland', description: 'SMK Metland' },
      { label: 'Metland College', href: '/our-school/metland-college', description: 'Perguruan Tinggi Metland College' },
    ],
  },
  { label: 'Artikel', href: '/artikel' },
  { label: 'Literasi', href: '/literasi' },
];

export default function Navbar() {
  const { isScrolled } = useNavScroll();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const location = useLocation();

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-50"
        animate={{
          backgroundColor: isScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(0,0,0,0)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
               <div className="img">
                <img src="/src/assets/logoyayasan.png" alt="Logo YPM Putih" width={30} height={30} style={{paddingBottom: "5px"}}/>
               </div>
              </motion.div>
              <motion.span
                className="font-semibold text-lg tracking-tight"
                animate={{ color: isScrolled ? '#111111' : '#ffffff' }}
                transition={{ duration: 0.4 }}
              >
                Yayasan Pendidikan Metland
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to={item.href}>
                    <motion.span
                      className="px-4 py-2 text-sm font-medium inline-flex items-center gap-1 cursor-pointer"
                      animate={{ color: isScrolled ? '#111111' : '#ffffff' }}
                      whileHover={{ opacity: 0.7 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.label}
                      {item.children && (
                        <motion.span
                          animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                    </motion.span>
                  </Link>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-[300px] bg-white rounded-xl shadow-lg p-3 border border-gray-100"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium text-charcoal">{child.label}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{child.description}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link to="/contact" className="hidden lg:block">
              <motion.span
                className="inline-flex items-center gap-2 text-charcoal px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer bg-[#008C95]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span whileHover={{ x: 4 }} className="inline-block text-white">→</motion.span>
                <span className="text-white">Contact</span>
              </motion.span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden z-10 p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <X className="w-6 h-6" style={{ color: '#111' }} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-6 h-6" style={{ color: isScrolled ? '#111' : '#fff' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sheet */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="pt-24 px-6 pb-8 flex flex-col h-full">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                  className="flex-1"
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                      {item.children ? (
                        <div>
                          <button
                            onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                            className={`w-full flex items-center justify-between py-3 text-lg font-medium border-b border-gray-100 ${
                              location.pathname.startsWith(item.href) ? 'text-lime-dark' : 'text-charcoal'
                            }`}
                          >
                            {item.label}
                            <motion.span
                              animate={{ rotate: mobileExpanded === item.label ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.span>
                          </button>
                          <AnimatePresence>
                            {mobileExpanded === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pb-2">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.label}
                                      to={child.href}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="block py-2 text-sm text-gray-500 hover:text-charcoal"
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block py-3 text-lg font-medium border-b border-gray-100 ${
                            location.pathname === item.href ? 'text-lime-dark' : 'text-charcoal'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  className="block w-full bg-lime text-charcoal text-center py-4 rounded-md font-medium text-sm mt-6"
                >
                  → Contact
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
