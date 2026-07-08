import { motion } from 'framer-motion';
import { BookOpen, HeartPulse, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';
import { usePrograms } from '../../hooks/usePrograms';

const icons = [BookOpen, HeartPulse, Sprout];

export default function WhatWeDo() {
  const { i18n, t } = useTranslation();
  const { programs, loading } = usePrograms();

  const featuredPrograms = programs.filter((program) => program.isFeatured).slice(0, 3);

  return (
    <section className="bg-[#FCFCFC] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <div className="mb-4 h-2 w-2 animate-pulse bg-[#3D8ABF]" />
            <p
              className="mb-4 text-base font-bold uppercase tracking-[0.2em] text-[#3D8ABF] md:text-lg"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              {t('what_we_do.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <WordReveal text={t('what_we_do.title')} tag="h2" className="" />

        <div className="grid gap-8 md:grid-cols-3">
          {featuredPrograms.map((program, index) => {
            const Icon = icons[index];

            return (
              <motion.div
                key={program.id}
                whileHover={{ y: -6, boxShadow: '0 20px 60px -10px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-[#FCFCFC] p-8"
              >
                <motion.div
                  className="absolute left-0 right-0 top-0 h-[3px] origin-left bg-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <span className="absolute right-6 top-4 select-none text-8xl font-light text-gray-100">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <Icon className="relative z-10 mb-4 h-8 w-8 text-primary" />

                <h3 className="relative z-10 mb-3 text-xl font-medium">
                  {program.title?.[i18n.language] || program.title?.id || program.title}
                </h3>
                <p className="relative z-10 mb-6 text-sm leading-relaxed text-gray-500 line-clamp-4">
                  {program.description?.[i18n.language] || program.description?.id || program.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
