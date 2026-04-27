import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import Badge from '../ui/Badge';
import { programs } from '../../data/programs';

const categories = ['all', 'education', 'health', 'livelihoods'] as const;

export default function ProgramsGrid() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = activeTab === 'all'
    ? programs
    : programs.filter((p) => p.category === activeTab);

  return (
    <section className="bg-offwhite py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs text-lime uppercase tracking-[0.2em] mb-4">Our Programs</p>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <WordReveal
            text="Programs & Initiatives"
            tag="h2"
            className="text-4xl lg:text-5xl font-light text-charcoal"
          />

          {/* Tabs */}
          <div className="flex gap-1 mt-6 md:mt-0 relative">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 text-sm capitalize relative transition-colors ${
                  activeTab === cat ? 'text-charcoal' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((program) => (
              <Link key={program.id} to={`/programs/${program.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <motion.img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    loading="lazy"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge variant="lime" className="mb-3">{program.category}</Badge>
                    <h3 className="text-white font-medium text-lg">{program.title}</h3>
                    <p className="text-white/70 text-sm mt-1">{program.tagline}</p>

                    {/* Explore button on hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="inline-flex items-center bg-lime text-charcoal text-xs px-4 py-2 rounded font-medium">
                        Explore →
                      </span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
