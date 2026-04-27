import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';
import CountUpTrigger from '../components/animations/CountUpTrigger';
import ScrollReveal from '../components/animations/ScrollReveal';
import useBooks from '../hooks/useBooks';
import type { Book } from '../hooks/useBooks';
import FlipbookReader from '../components/sections/FlipbookReader';

/* ─── Local Data ───────────────────────────────────────────────────── */

interface KoleksiItem {
  count: string;
  countNum: number;
  suffix: string;
  title: string;
  desc: string;
}

const koleksi: KoleksiItem[] = [
  {
    count: '1.200+',
    countNum: 1200,
    suffix: '+',
    title: 'Buku Teks & Referensi',
    desc: 'Koleksi buku teks pelajaran dan referensi akademik untuk semua jenjang pendidikan.',
  },
  {
    count: '450+',
    countNum: 450,
    suffix: '+',
    title: 'Jurnal & Majalah',
    desc: 'Jurnal ilmiah, majalah pendidikan, dan publikasi berkala nasional maupun internasional.',
  },
  {
    count: '5.000+',
    countNum: 5000,
    suffix: '+',
    title: 'E-Library',
    desc: 'Akses perpustakaan digital 24 jam dengan ribuan buku elektronik dan sumber daring.',
  },
  {
    count: '12',
    countNum: 12,
    suffix: '',
    title: 'Ruang Belajar Bersama',
    desc: 'Fasilitas ruang diskusi dan belajar kelompok yang nyaman dan kondusif.',
  },
];

interface ProgramItem {
  title: string;
  desc: string;
}

const programs: ProgramItem[] = [
  { title: 'Pojok Baca', desc: 'Program membaca buku gratis setiap hari Jumat untuk semua jenjang. Menyediakan akses bacaan berkualitas bagi seluruh siswa.' },
  { title: 'Klub Literasi', desc: 'Diskusi buku rutin bulanan dipandu mentor berpengalaman. Membangun komunitas pembaca yang aktif dan kritis.' },
  { title: 'Lomba Menulis', desc: 'Kompetisi karya tulis ilmiah dan fiksi tahunan antar sekolah. Mengasah kreativitas dan kemampuan berpikir.' },
  { title: 'Bedah Buku', desc: 'Acara interaktif mengupas isi dan makna buku pilihan. Memperdalam pemahaman literasi secara kolaboratif.' },
  { title: 'Story Telling', desc: 'Pengembangan kemampuan bercerita dan presentasi publik. Melatih percaya diri dan keterampilan komunikasi.' },
  { title: 'Kunjungan Perpustakaan', desc: 'Kunjungan edukatif ke perpustakaan nasional dan daerah. Menginspirasi semangat membaca sejak dini.' },
];

interface StatItem {
  num: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { num: 5000, suffix: '+', label: 'E-Book Tersedia' },
  { num: 1200, suffix: '+', label: 'Buku Fisik' },
  { num: 12, suffix: '', label: 'Ruang Baca' },
  { num: 5, suffix: '', label: 'Unit Sekolah' },
];

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

/* ─── Stagger Word Component ──────────────────────────────────────── */

function StaggerWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className ?? ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: 60, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.08,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── Main Literasi Page ──────────────────────────────────────────── */

const BOOK_COVER_PLACEHOLDER = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
const CATEGORIES = ['Semua', 'Pendidikan', 'Literasi', 'Sains', 'Fiksi', 'Agama', 'Umum'];

export default function Literasi() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const booksY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const { books, loading, activeCategory, setActiveCategory, filteredBooks } = useBooks();
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
            Program Literasi — Yayasan Pendidikan Metland
          </p>
        </motion.div>

        {/* Center headline */}
        <div className="flex-1 flex items-center px-8 lg:px-16">
          <h1
            className="font-sans font-black leading-[0.9] text-[#1C1C1C]"
            style={{
              fontSize: 'clamp(60px, 10vw, 130px)',
              letterSpacing: '-4px',
            }}
          >
            <StaggerWords text="Membangun" delay={0.3} />
            <br />
            <StaggerWords text="Budaya Membaca." delay={0.6} />
          </h1>
        </div>

        {/* Floating books — right side */}
        <motion.div
          style={{ y: booksY }}
          className="absolute right-8 lg:right-20 bottom-20 lg:bottom-16 flex items-end gap-[-20px] z-10 hidden md:flex"
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
                className="w-32 lg:w-40 h-44 lg:h-56 object-cover"
                style={{
                  boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA button — bottom left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pb-12 px-8 lg:px-16"
        >
          <a
            href="#program-literasi"
            className="inline-flex items-center gap-3 bg-[#1C1C1C] text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-lime hover:text-[#1C1C1C] transition-colors duration-300"
          >
            ↓ Jelajahi Program
          </a>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 2 — STRIP STATISTIK (hitam)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1C1C1C] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="text-center px-6 lg:px-8 py-4">
                  <div className="font-bold text-lime mb-1" style={{ fontSize: 'clamp(36px, 5vw, 60px)' }}>
                    <CountUpTrigger
                      end={stat.num}
                      suffix={stat.suffix}
                      duration={2.5}
                      separator="."
                      className="font-bold text-lime"
                    />
                  </div>
                  <p className="text-gray-400 text-xs lg:text-sm uppercase tracking-widest font-normal">
                    {stat.label}
                  </p>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden lg:block w-px h-16 bg-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 3 — TENTANG LITERASI (dua kolom, putih)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            {/* Left column — text */}
            <ScrollReveal direction="left">
              <div>
                <p className="text-lime text-xs font-semibold tracking-[3px] uppercase mb-6">
                  Mengapa Literasi Penting
                </p>
                <h2
                  className="font-bold text-[#1C1C1C] mb-8"
                  style={{
                    fontSize: 'clamp(32px, 5vw, 64px)',
                    letterSpacing: '-2px',
                    lineHeight: '1.05',
                  }}
                >
                  Lebih dari sekadar membaca.
                </h2>
                <p className="text-gray-500 text-lg leading-[1.7] mb-4">
                  Literasi bukan sekadar kemampuan membaca dan menulis. Di era digital ini, literasi mencakup kemampuan
                  berpikir kritis, memahami informasi secara mendalam, dan mengkomunikasikan ide secara efektif.
                </p>
                <p className="text-gray-500 text-lg leading-[1.7] mb-8">
                  Yayasan Pendidikan Metland berkomitmen menjadikan literasi sebagai fondasi seluruh proses pembelajaran,
                  memastikan setiap siswa dan mahasiswa tumbuh menjadi individu yang cerdas, kritis, dan berpengetahuan luas.
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
              <div className="relative" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80"
                  alt="Perpustakaan"
                  className="w-full h-full object-cover"
                />
                {/* Glassmorphism overlay card */}
                <div className="absolute bottom-6 left-6">
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 px-6 py-4">
                    <p className="text-white text-sm font-medium">Program aktif di</p>
                    <p className="text-white text-2xl font-black">5 Unit Sekolah</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 4 — KOLEKSI PERPUSTAKAAN (background krem)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-16">
              <p className="text-lime text-xs font-semibold tracking-[3px] uppercase mb-4">
                Koleksi Kami
              </p>
              <h2
                className="font-bold text-[#1C1C1C]"
                style={{
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  letterSpacing: '-2px',
                  lineHeight: '1.05',
                }}
              >
                Fasilitas Perpustakaan
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {koleksi.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <motion.div
                  className="bg-white p-8 group cursor-default"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <CountUpTrigger
                      end={item.countNum}
                      suffix={item.suffix}
                      duration={2}
                      separator="."
                      className="font-black text-lime"
                    />
                  </div>
                  <h3 className="font-semibold text-[#1C1C1C] text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="mt-6 h-0.5 w-0 bg-lime group-hover:w-full transition-all duration-500" />
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
              Program Literasi
            </h2>
          </ScrollReveal>

          <div>
            {programs.map((prog, i) => (
              <ScrollReveal key={prog.title} delay={i * 0.1}>
                <motion.div
                  className="group border-b border-gray-700 py-8 lg:py-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 cursor-pointer hover:bg-lime/5 px-4 -mx-4 transition-colors duration-300"
                  whileHover="hover"
                >
                  {/* Number */}
                  <span className="font-mono text-gray-600 text-sm lg:text-base shrink-0 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h3 className="font-semibold text-white text-xl lg:text-2xl group-hover:text-lime transition-colors duration-300 shrink-0 lg:w-56">
                    {prog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm lg:text-base flex-1 leading-relaxed">
                    {prog.desc}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    className="text-gray-600 group-hover:text-lime transition-colors duration-300 shrink-0"
                    variants={{
                      hover: { x: 8 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 6 — E-LIBRARY FEATURE (background lime)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-lime py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — text */}
            <ScrollReveal direction="left">
              <div>
                <p className="text-[#1C1C1C]/50 text-xs font-semibold tracking-[3px] uppercase mb-6">
                  Perpustakaan Digital
                </p>
                <h2
                  className="font-black text-[#1C1C1C] mb-6"
                  style={{
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    letterSpacing: '-3px',
                    lineHeight: '0.95',
                  }}
                >
                  5.000+ E-Book Tersedia
                </h2>
                <p className="text-[#1C1C1C]/70 text-lg leading-[1.7] mb-8 max-w-lg">
                  Akses perpustakaan digital kami kapan saja, di mana saja. Tersedia 24 jam penuh
                  dengan koleksi e-book yang terus bertambah untuk mendukung kebutuhan belajar siswa
                  dan guru.
                </p>
                <a
                  href="#koleksi-buku"
                  className="group inline-flex items-center gap-3 bg-[#1C1C1C] text-white px-10 py-5 text-sm font-medium tracking-wide hover:bg-[#333] transition-colors duration-300"
                >
                  Akses E-Library
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </ScrollReveal>

            {/* Right — 3 latest book cards from API */}
            <ScrollReveal direction="right">
              <div className="grid grid-cols-3 gap-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
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
                      className="group cursor-pointer"
                      onClick={() => setSelectedBook(book)}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={book.coverImage || BOOK_COVER_PLACEHOLDER}
                          alt={book.title}
                          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                        />
                      </div>
                      <h4 className="font-semibold text-[#1C1C1C] text-xs mt-2 line-clamp-2">{book.title}</h4>
                      <p className="text-[#1C1C1C]/50 text-[10px] mt-0.5">{book.author}</p>
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
                      className="overflow-hidden"
                    >
                      <img
                        src={cover}
                        alt={`E-Book ${i + 1}`}
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
      <section id="koleksi-buku" className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-10">
              <p className="text-lime text-xs font-semibold tracking-[3px] uppercase mb-4">
                Perpustakaan Digital
              </p>
              <h2
                className="font-bold text-[#1C1C1C]"
                style={{
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  letterSpacing: '-2px',
                  lineHeight: '1.05',
                }}
              >
                Koleksi Buku Digital
              </h2>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#1C1C1C] text-white'
                    : 'border border-gray-300 text-gray-500 hover:border-[#1C1C1C] hover:text-[#1C1C1C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book, i) => (
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                      />
                    </div>
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-lime text-[#1C1C1C]">
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
              <p className="text-gray-400 text-lg">Belum ada buku tersedia</p>
              <p className="text-gray-300 text-sm mt-1">Buku digital akan segera ditambahkan</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Section 7 — CTA PENUTUP (hitam)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1C1C1C] py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2
              className="font-black text-white mb-6"
              style={{
                fontSize: 'clamp(36px, 7vw, 80px)',
                letterSpacing: '-3px',
                lineHeight: '0.95',
              }}
            >
              Bergabung dalam{' '}
              <span className="font-serif italic">Gerakan Literasi</span>
            </h2>
          </ScrollReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto"
          >
            Daftarkan diri Anda atau anak Anda ke program literasi kami dan bangun kebiasaan membaca sejak dini.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <a href="/contact">
              <motion.span
                className="inline-flex items-center gap-3 bg-lime text-[#1C1C1C] px-12 py-5 text-sm font-bold tracking-wide cursor-pointer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Daftar Sekarang
                <ExternalLink className="w-4 h-4" />
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Flipbook Reader Modal ─── */}
      {selectedBook && (
        <FlipbookReader book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  );
}
