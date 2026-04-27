import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, HeartPulse, Sprout } from 'lucide-react';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import { programs } from '../../data/programs';

const icons = [BookOpen, HeartPulse, Sprout];
const featured = programs.filter((p) => p.isFeatured).slice(0, 3);

export default function WhatWeDo() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs text-lime uppercase tracking-[0.2em] mb-4">Our Focus Areas</p>
        </ScrollReveal>
        <WordReveal
          text="What We Do"
          tag="h2"
          className="text-4xl lg:text-5xl font-light text-charcoal mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((program, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={program.id}
                whileHover={{ y: -6, boxShadow: '0 20px 60px -10px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 relative overflow-hidden group"
              >
                {/* Top border accent */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px] bg-lime origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Decorative number */}
                <span className="absolute top-4 right-6 text-8xl font-light text-gray-100 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <Icon className="w-8 h-8 text-lime mb-4 relative z-10" />

                {/* Content */}
                <h3 className="text-xl font-medium mb-3 relative z-10">{program.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10">{program.description}</p>

                {/* Learn More */}
                <Link to={`/programs/${program.slug}`} className="relative inline-block text-sm font-medium text-charcoal z-10">
                  <span>Learn More →</span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-charcoal origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
