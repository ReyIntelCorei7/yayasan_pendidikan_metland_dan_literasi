import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WordReveal from '../animations/WordReveal';

import hero1 from '../../assets/sekolahsmkmetland.png';
import hero2 from '../../assets/sekolahsmkmetlandcibitung.jpg';
import hero3 from '../../assets/kepalasekolahsmkmetland.jpeg';

const heroImages = [hero1, hero2, hero3];

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
      className="relative h-screen min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={heroImages[currentIndex]}
          alt=""
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      </AnimatePresence>

      {/* Gradient Overlay — responsive: centered on mobile, left-aligned on desktop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Additional side gradient for desktop only */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
        }}
      />

      {/* Content — center on mobile, left-aligned on desktop */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto md:mx-0">
            {/* Heading */}
            <WordReveal
              text="Membangun Generasi Unggul Melalui Pendidikan dan Literasi"
              tag="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[1.12] tracking-tight"
              delay={0.3}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg text-white/80 max-w-md lg:max-w-lg leading-relaxed"
            >
              <span className="font-georgia font-bold">Yayasan Pendidikan Metland</span> berkomitmen menciptakan lingkungan belajar yang inovatif dan berkarakter untuk masa depan Indonesia.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.7 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <a
                href="/profil"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#228bcb] text-white text-sm font-medium rounded-lg hover:bg-[#1b78b3] transition-colors duration-300"
              >
                Tentang Kami
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="/our-school"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                Unit Pendidikan
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-10 flex items-center gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentIndex
                ? 'w-8 bg-[#228bcb]'
                : 'w-4 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Welcome Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.7 }}
        className="absolute bottom-8 left-6 sm:left-10 md:left-12 lg:left-16 xl:left-20 hidden md:flex items-center gap-3"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#228bcb]" />
        <span className="text-xs text-white/50 tracking-widest uppercase">Selamat Datang</span>
      </motion.div>
    </section>
  );
}
