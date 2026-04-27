import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import { scholars } from '../../data/scholars';

export default function ScholarStories() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = 340;
    trackRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="bg-charcoal py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <ScrollReveal>
              <p className="text-xs text-lime uppercase tracking-[0.2em] mb-4">Scholar Stories</p>
            </ScrollReveal>
            <WordReveal
              text="Voices of Change"
              tag="h2"
              className="text-4xl lg:text-5xl font-light text-white"
            />
          </div>
          <div className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="w-11 h-11 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime hover:bg-lime/20 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="w-11 h-11 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime hover:bg-lime/20 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-6 lg:px-8 overflow-x-auto scrollbar-hide pb-4 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {scholars.map((scholar, i) => (
          <motion.div
            key={scholar.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(168,213,46,0.4)' }}
            className="w-80 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-7 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <img
                src={scholar.photo}
                alt={scholar.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-lime"
                loading="lazy"
              />
              <div>
                <div className="text-white font-medium flex items-center gap-2">
                  {scholar.name} <span>{scholar.flag}</span>
                </div>
                <div className="text-white/50 text-sm">{scholar.country}</div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10 my-4" />

            {/* Quote */}
            <div>
              <span className="text-5xl font-serif leading-none text-lime/60">"</span>
              <p className="text-white/80 text-sm leading-relaxed italic -mt-4 ml-2">
                {scholar.quote}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5">
              <span className="bg-lime/10 text-lime text-xs rounded-full px-3 py-1">
                {scholar.program}
              </span>
              <span className="text-white/40 text-xs">Class of {scholar.graduationYear}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
