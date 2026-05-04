import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(100deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="absolute top-1/2 left-[6%] -translate-y-1/2 max-w-[55%] text-left">
        <WordReveal
          text="Membangun Generasi Unggul Melalui Pendidikan dan Literasi"
          tag="h1"
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[1.08] tracking-tight"
          delay={0.3}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-georgia mx-14 mt-6 text-base md:text-xl font-bold text-white max-w-lg leading-relaxed drop-shadow-2xl"
        >
          Yayasan Pendidikan Metland berkomitmen menciptakan lingkungan belajar yang inovatif dan berkarakter untuk masa depan Indonesia.
        </motion.p>
      </div>

      {/* Welcome Label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="absolute bottom-10 left-8 flex items-center gap-3"
      >
        <div className="w-2 h-2 bg-white" />
        <span className="text-sm text-white/70">Selamat Datang</span>
      </motion.div>


    </section>
  );
}
