import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const tickerWords = [
  'PENDIDIKAN',
  'KARAKTER',
  'INOVASI',
  'MASA DEPAN',
  'INTEGRITAS',
  'KEUNGGULAN',
];

const separator = ' • ';
const fullText = tickerWords.join(separator) + separator;

export default function MarqueeStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-10 lg:py-14 bg-[#FCFCFC]"
    >
      {/* Top divider */}
      <div className="section-divider w-full absolute top-0" />

      {/* Main Ticker Row — stroke text using accent color */}
      <div className="fade-mask-x overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap animate-ticker"
          style={{ x }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-stroke text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight select-none shrink-0"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              {fullText}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="section-divider w-full absolute bottom-0" />
    </section>
  );
}
