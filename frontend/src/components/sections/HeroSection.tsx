import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import WordReveal from '../animations/WordReveal';

import hero1 from '../../assets/sekolahsmkmetland.png';
import hero2 from '../../assets/sekolahsmkmetlandcibitung.jpg';
import hero3 from '../../assets/kepalasekolahsmkmetland.jpeg';

const heroImages = [hero1, hero2, hero3];

/* ──────────────── Animated Counter ──────────────── */
function AnimatedCounter({
  end,
  suffix = '',
  duration = 2000,
  separator = '.',
}: {
  end: number;
  suffix?: string;
  duration?: number;
  separator?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  const formatted =
    value >= 1000
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      : value.toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

/* ──────────────── Icon Components ──────────────── */
const TrophyIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const GraduationIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
  </svg>
);

const SchoolIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
  </svg>
);

const AwardIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

/* ──────────────── Stats Data ──────────────── */
const statsData = [
  {
    value: 25,
    suffix: '+',
    label: 'Tahun Pengalaman',
    description: 'Berkomitmen dalam dunia pendidikan sejak 1998.',
    icon: <TrophyIcon />,
  },
  {
    value: 3000,
    suffix: '+',
    label: 'Siswa',
    description: 'Membina generasi berkarakter dan berprestasi.',
    icon: <GraduationIcon />,
  },
  {
    value: 5,
    suffix: '',
    label: 'Unit Pendidikan',
    description: 'Tersebar di berbagai wilayah dengan fasilitas terbaik.',
    icon: <SchoolIcon />,
  },
  {
    value: 0,
    suffix: '',
    label: 'Prestasi',
    description: 'Mencapai prestasi gemilang dalam berbagai bidang.',
    icon: <AwardIcon />,
    isLetter: true,
    letter: '150+',
  },
];

/* ──────────────── Main Component ──────────────── */
export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Slideshow ── */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={heroImages[currentIndex]}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      </AnimatePresence>

      {/* ── Dark Overlays ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(2,12,27,0.70) 0%, rgba(2,12,27,0.50) 40%, rgba(2,12,27,0.75) 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(2,12,27,0.65) 0%, rgba(2,12,27,0.25) 50%, rgba(2,12,27,0.45) 100%)',
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Spacer for navbar */}
        <div className="h-20 lg:h-24" />

        {/* Hero Text Content */}
        <div className="flex-1 flex items-end pb-6 lg:pb-8">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
              {/* ─── Text Content (full width) ─── */}
              <div className="max-w-2xl">
                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="block"
                  >
                    Yayasan Pendidikan Metland
                  </motion.span>
                </h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                  className="mt-4 text-sm sm:text-base md:text-[0.95rem] text-white/75 max-w-md lg:max-w-lg leading-relaxed"
                >
                  berkomitmen menciptakan lingkungan belajar yang inovatif dan
                  berkarakter untuk masa depan Indonesia.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.7 }}
                  className="flex flex-wrap gap-3 sm:gap-4 mt-8"
                >
                  <a
                    href="/profil"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[#228bcb] text-white text-sm font-semibold rounded-xl hover:bg-[#1b78b3] transition-all duration-300 shadow-lg shadow-[#228bcb]/25 hover:shadow-[#228bcb]/40"
                  >
                    Tentang Kami
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                  <a
                    href="/our-school"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  >
                    Unit Pendidikan
                  </a>
                </motion.div>
              </div>
          </div>
        </div>

        {/* ─── Stats Cards Grid ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: 'easeOut' }}
          className="w-full max-w-7xl mx-auto px-6 lg:px-8 pb-4 mb-10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                className="relative group"
              >
                {/* Glow on hover */}
                <div
                  className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34,139,203,0.4) 0%, rgba(79,195,247,0.2) 50%, rgba(34,139,203,0.4) 100%)',
                  }}
                />
                <div className="relative bg-[#0a1929]/40 backdrop-blur-md rounded-2xl border border-white/[0.08] p-3 sm:p-4 h-full hover:border-white/20 transition-colors duration-300">
                  {/* Icon */}
                  <div className="flex justify-end mb-1 sm:mb-2">
                    <div className="text-[#228bcb] scale-90">{stat.icon}</div>
                  </div>

                  {/* Value */}
                  <div className="text-xl sm:text-2xl xl:text-3xl font-bold text-white mb-0.5">
                    {stat.isLetter ? (
                      <span>{stat.letter}</span>
                    ) : (
                      <AnimatedCounter
                        end={stat.value}
                        suffix={stat.suffix}
                        separator="."
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-[0.7rem] sm:text-xs font-semibold text-white/90 mb-0.5">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-[0.65rem] sm:text-xs text-white/50 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <div className="pb-8 flex items-center justify-between max-w-7xl mx-auto w-full px-6 lg:px-8">
          {/* Welcome Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.7 }}
            className="hidden md:flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#228bcb] animate-pulse" />
            <span className="text-xs text-white/50 tracking-[0.2em] uppercase font-medium">
              Selamat Datang
            </span>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2 ml-auto">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? 'w-8 bg-[#228bcb]'
                    : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
