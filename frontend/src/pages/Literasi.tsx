import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import CountUpTrigger from '../components/animations/CountUpTrigger';
import ScrollReveal from '../components/animations/ScrollReveal';
import { useTranslation } from 'react-i18next';
import useBooks from '../hooks/useBooks';
import type { Book } from '../hooks/useBooks';
import { useImpactStats } from '../hooks/useImpactStats';
import { useCollectionStats } from '../hooks/useCollectionStats';
import FlipbookReader from '../components/sections/FlipbookReader';
import useLiterasiPrograms from '../hooks/useLiterasiPrograms';

function getText(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['id'] || Object.values(val)[0] || '';
  }
  return String(val);
}

/* ─── StaggerWords Component ─────────────────────────────────────── */

function StaggerWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ display: 'inline' }}
    >
      {text}
    </motion.span>
  );
}

/* ─── Local Data ───────────────────────────────────────────────────── */

interface KoleksiItem {
  count: string;
  countNum: number;
  suffix: string;
  title: string;
  desc: string;
}

interface ProgramItem {
  title: string;
  desc: string;
}

interface StatItem {
  num: number;
  suffix: string;
  label: string;
}

const STATS_NUMS: { num: number; suffix: string }[] = [];

const heroBooks = [
  { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', rotate: '-8deg', delay: 0 },
  { src: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80', rotate: '0deg', delay: 0.15 },
  { src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80', rotate: '6deg', delay: 0.3 },
];

const elibraryCovers = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
];

/* ─── Main Literasi Page ──────────────────────────────────────────── */

const BOOK_COVER_PLACEHOLDER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
const CATEGORIES = ['Semua', 'Pendidikan', 'Literasi', 'Sains', 'Fiksi', 'Agama', 'Umum'];

export default function Literasi() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const literasiData = t('literasi', { returnObjects: true }) as any;
  const koleksi: KoleksiItem[] = literasiData.koleksi ?? [];

  const { programs } = useLiterasiPrograms();

  const { stats } = useImpactStats();
  const { stats: collectionStatsData } = useCollectionStats();
  
  // Use collection stats from backend if available, otherwise fallback to local JSON.
  const displayCollectionStats = collectionStatsData.length > 0 
    ? collectionStatsData 
    : koleksi.map((item) => ({
        id: item.title,
        value: item.countNum,
        suffix: item.suffix,
        title: { id: item.title, en: item.title },
        description: { id: item.desc, en: item.desc }
      }));

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const booksY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const { 
    books, loading, loadingMore, 
    activeCategory, setActiveCategory, 
    searchQuery, setSearchQuery, 
    hasMore, loadMore 
  } = useBooks();
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          Section 1 — HERO (fullscreen, typographic)
          ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] bg-white flex flex-col justify-between overflow-hidden"
      >
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="pt-28 px-8 lg:px-16"
        >
          <p
            className="text-xs font-semibold tracking-[3px] uppercase text-[#1C1C1C]/50"
          >
            {t('literasi.hero_tag')}
          </p>
        </motion.div>

        {/* Hero body — 2 column grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_2fr] px-6 lg:px-16 gap-8 relative z-10">
          {/* Left — headline */}
          <h1
            className="font-sans font-black text-[#1C1C1C] self-center text-center md:text-left break-words"
            style={{
              fontSize: 'clamp(42px, 8vw, 110px)',
              letterSpacing: '-2px',
              lineHeight: '1.1',
            }}
          >
            <StaggerWords text={t('literasi.hero_title1')} delay={0.3} />
            <br className="hidden sm:block" />
            <StaggerWords text={t('literasi.hero_title2')} delay={0.6} />
          </h1>

          {/* Right — floating books */}
          <motion.div
            style={{ y: booksY }}
            className="hidden md:flex items-end justify-center self-end translate-y-16 lg:translate-y-24"
          >
            {heroBooks.map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: book.rotate }}
                transition={{
                  delay: 0.8 + book.delay,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative ${i === 0 ? 'animate-float' : i === 1 ? 'animate-float-slow' : 'animate-float-slower'}`}
                style={{
                  marginLeft: i === 0 ? '0' : '-30px',
                  zIndex: i === 1 ? 3 : i === 0 ? 1 : 2,
                }}
              >
                <img
                  src={book.src}
                  alt="Buku"
                  loading="eager"
                  className="w-32 lg:w-40 h-44 lg:h-56 object-cover"
                  style={{
                    boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA button — bottom left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pb-12 px-8 lg:px-16"
        >
          <a
            href="#program-literasi"
            className="inline-flex items-center gap-3 bg-[#1C1C1C] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-primary hover:text-[#1C1C1C] transition-colors duration-300"
          >
            {t('literasi.hero_btn')}
          </a>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 2 — STRIP STATISTIK (hitam)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1C1C1C] py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 lg:gap-0 items-center justify-between">
            {stats.map((stat, i) => (
              <div key={stat.id} className="flex items-center justify-center relative w-full">
                <div className="text-center px-2 lg:px-8">
                  <div className="font-bold text-primary mb-1" style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}>
                    <CountUpTrigger
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={2.5}
                      separator="."
                      className="font-bold text-primary"
                    />
                  </div>
                  <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm uppercase tracking-widest font-normal">
                    {getText(stat.label, i18n.language)}
                  </p>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden lg:block w-px h-16 bg-gray-700 absolute right-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 3 — TENTANG LITERASI (dua kolom, putih)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FCFCFC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            {/* Left column — text */}
            <ScrollReveal direction="left">
              <div>
                <p className="text-primary text-xs font-semibold tracking-[3px] uppercase mb-6">
                  {t('literasi.why_tag')}
                </p>
                <h2
                  className="font-bold text-[#1C1C1C] mb-8"
                  style={{
                    fontSize: 'clamp(32px, 5vw, 64px)',
                    letterSpacing: '-2px',
                    lineHeight: '1.05',
                  }}
                >
                  {t('literasi.why_title')}
                </h2>
                <p className="text-gray-500 text-lg leading-[1.7] mb-4">
                  {t('literasi.why_desc1')}
                </p>
                <p className="text-gray-500 text-lg leading-[1.7] mb-8">
                  {t('literasi.why_desc2')}
                </p>
                <a
                  href="/profil"
                  className="group inline-flex items-center gap-2 border border-[#1C1C1C] text-[#1C1C1C] px-8 py-4 text-sm font-medium tracking-wide hover:bg-[#1C1C1C] hover:text-white transition-all duration-300"
                >
                  Tentang Kami
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </ScrollReveal>

            {/* Right column — image */}
            <ScrollReveal direction="right">
              <div className="relative mx-auto w-full max-w-md md:max-w-none max-h-[600px] overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80"
                  alt="Perpustakaan"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {/* Glassmorphism overlay card */}
                <div className="absolute bottom-6 left-6">
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 px-6 py-4">
                    <p className="text-white text-sm font-medium">{t('literasi.active_in')}</p>
                    <p className="text-white text-2xl font-black">{t('literasi.schools_count')}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
{/* section 4 koleksi perpustakaan (background krem) */}  
      <section className="py-24 lg:py-32" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16">
              <p className="text-primary text-xs font-semibold tracking-[3px] uppercase mb-4">
                {t('literasi.collection_tag')}
              </p>
              <h2
                className="font-bold text-[#1C1C1C]"
                style={{
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  letterSpacing: '-2px',
                  lineHeight: '1.05',
                }}
              >
                {t('literasi.collection_title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCollectionStats.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.1}>
                <motion.div
                  className="bg-white p-8 group cursor-default"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <CountUpTrigger
                      end={item.value}
                      suffix={item.suffix || ''}
                      duration={2}
                      separator="."
                      className="font-black text-primary"
                    />
                  </div>
                  <h3 className="font-semibold text-[#1C1C1C] text-base mb-2">
                    {getText(item.title, i18n.language)}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {getText(item.description, i18n.language)}
                  </p>
                  <div className="mt-6 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 5 — PROGRAM LITERASI (hitam, editorial list)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="program-literasi" className="bg-[#1C1C1C] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2
              className="font-bold text-white mb-16"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                letterSpacing: '-2px',
                lineHeight: '1.05',
              }}
            >
              {t('literasi.programs_title')}
            </h2>
          </ScrollReveal>

          <div>
            {programs.map((prog, i) => (
              <ScrollReveal key={prog.title} delay={i * 0.1}>
                <motion.div
                  className="group border-b border-gray-700 py-8 lg:py-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 cursor-pointer hover:bg-primary/5 px-4 -mx-4 transition-colors duration-300"
                  whileHover="hover"
                >
                  {/* Number */}
                  <span className="font-mono text-gray-600 text-sm lg:text-base shrink-0 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-xl lg:text-2xl group-hover:text-primary transition-colors duration-300 shrink-0 lg:w-56">
                    {prog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm lg:text-base flex-1 leading-relaxed">
                    {prog.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* section 6 e-library feature */}
      <section className="bg-primary py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — text */}
            <ScrollReveal direction="left">
              <div>
                <p className="text-[#1C1C1C]/50 text-xs font-semibold tracking-[3px] uppercase mb-6">
                  {t('literasi.digital_tag')}
                </p>
                <h2
                  className="font-black text-[#1C1C1C] mb-6"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    letterSpacing: '-3px',
                    lineHeight: '0.95',
                  }}
                >
                  {t('literasi.digital_title')}
                </h2>
                <p className="text-[#1C1C1C]/70 text-lg leading-[1.7] mb-8 max-w-lg">
                  {t('literasi.digital_desc')}
                </p>
              </div>
            </ScrollReveal>

            {/* Right — 3 latest book cards from API */}
            <ScrollReveal direction="right">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-10 lg:mt-0">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`animate-pulse ${i === 2 ? 'hidden sm:block' : ''}`}>
                      <div className="w-full aspect-[3/4] bg-[#1C1C1C]/10 rounded" />
                      <div className="h-3 bg-[#1C1C1C]/10 rounded mt-2 w-3/4" />
                      <div className="h-2 bg-[#1C1C1C]/10 rounded mt-1 w-1/2" />
                    </div>
                  ))
                ) : books.length > 0 ? (
                  books.slice(0, 3).map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`group cursor-pointer ${i === 2 ? 'hidden sm:block' : ''}`}
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={book.coverImage || BOOK_COVER_PLACEHOLDER}
                          alt={book.title}
                          loading="lazy"
                          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                        />
                      </div>
                      <h4 className="font-semibold text-[#1C1C1C] text-xs sm:text-sm mt-2 line-clamp-2">{book.title}</h4>
                      <p className="text-[#1C1C1C]/50 text-[10px] mt-0.5 truncate">{book.author}</p>
                    </motion.div>
                  ))
                ) : (
                  elibraryCovers.slice(0, 3).map((cover, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className={`overflow-hidden ${i === 2 ? 'hidden sm:block' : ''}`}
                    >
                      <img
                        src={cover}
                        alt={`E-Book ${i + 1}`}
                        loading="lazy"
                        className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-500"
                        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 6.5 — KOLEKSI BUKU DIGITAL (background putih)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="koleksi-buku" className="bg-[#FCFCFC] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-primary text-xs font-semibold tracking-[3px] uppercase mb-4">
                {t('literasi.digital_tag')}
              </p>
              <h2
                className="font-bold text-[#1C1C1C]"
                style={{
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  letterSpacing: '-2px',
                  lineHeight: '1.05',
                }}
              >
                {t('literasi.digital_collection_title')}
              </h2>
            </div>
          </ScrollReveal>

          {/* Category Filter & Search Bar */}
          <div className="flex flex-col md:flex-row gap-5 justify-between items-start md:items-center mb-10 w-full">
            <input
              type="text"
              placeholder="Cari e-book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-[#1C1C1C] focus:ring-1 focus:ring-[#1C1C1C] md:order-2"
            />
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide md:order-1 -mx-6 px-6 md:mx-0 md:px-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap shrink-0 ${activeCategory === cat
                      ? 'bg-[#1C1C1C] text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full bg-gray-100" style={{ aspectRatio: '3/4' }} />
                  <div className="h-3 bg-gray-100 rounded mt-3 w-1/3" />
                  <div className="h-4 bg-gray-100 rounded mt-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded mt-1 w-1/2" />
                  <div className="h-8 bg-gray-100 rounded mt-3" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {books.map((book, i) => (
                <ScrollReveal key={book.id} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                  >
                    <div className="overflow-hidden mb-3" style={{ aspectRatio: '3/4' }}>
                      <img
                        src={book.coverImage || BOOK_COVER_PLACEHOLDER}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                      />
                    </div>
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-primary text-[#1C1C1C]">
                      {book.category}
                    </span>
                    <h3 className="font-semibold text-[#1C1C1C] text-sm mt-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">{book.author}</p>
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="mt-3 w-full flex items-center justify-center gap-2 border border-[#1C1C1C] text-[#1C1C1C] text-xs font-medium py-2 hover:bg-[#1C1C1C] hover:text-white transition-all duration-300"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Baca Sekarang
                    </button>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{t('literasi.empty_title')}</p>
              <p className="text-gray-300 text-sm mt-1">{t('literasi.empty_desc')}</p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-white text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white border border-[#1C1C1C] text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('literasi.load_more')}
              </button>
            </div>
          )}
        </div>
      </section>



      {/* ─── Flipbook Reader Modal ─── */}
      {selectedBook && (
        <FlipbookReader book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
}
