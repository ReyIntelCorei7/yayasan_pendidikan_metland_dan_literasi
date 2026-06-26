import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';
import ketuaYayasanImg from '../../assets/MS_ketuayayasan.webp';

export default function ImpactSpotlight() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={sectionRef}>
      <div className="bg-[#FCFCFC] py-2 pb-0">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <div className="mb-4 h-2 w-2 animate-pulse bg-[#3D8ABF]" />
                  <p
                    className="mb-4 text-base font-bold uppercase tracking-[0.2em] text-[#3D8ABF] md:text-lg"
                    style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                  >
                    {t('impact_spotlight.subtitle')}
                  </p>
                </div>
              </ScrollReveal>

              <WordReveal text={t('impact_spotlight.title')} tag="h2" className="" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[520px] w-full flex-col lg:flex-row">
        <motion.div
          className="relative overflow-hidden lg:w-[58%]"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={ketuaYayasanImg}
            alt="Foto kepala yayasan metland"
            className="h-full min-h-[400px] w-full object-cover lg:min-h-[520px]"
            style={{ y: imageY }}
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 6, ease: 'easeOut' }}
            loading="lazy"
          />
        </motion.div>

        <div
          className="relative flex flex-col justify-center overflow-hidden p-12 lg:w-[42%] lg:p-16"
          style={{
            background: 'linear-gradient(135deg, #0F0F1E 0%, #1A1A2E 50%, #16213E 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full border border-white/5" />

          <div className="relative z-10">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 h-[2px] w-12 origin-left bg-[#3D8ABF]"
            />

            <ScrollReveal delay={0.2}>
              <p
                className="mb-1 text-2xl font-bold tracking-tight text-white lg:text-3xl"
                style={{ fontFamily: "'Geist', Inter, sans-serif" }}
              >
                {t('impact_spotlight.name')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p
                className="text-xs uppercase tracking-[0.2em] text-[#3D8ABF]"
                style={{ fontFamily: "'Geist', Inter, sans-serif" }}
              >
                {t('impact_spotlight.role')}
              </p>
            </ScrollReveal>

            <WordReveal text={t('impact_spotlight.heading')} tag="h2" className="" />

            <ScrollReveal delay={0.6}>
              <p className="text-sm leading-relaxed text-gray-400">
                {t('impact_spotlight.speech')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <Link to="/profil" className="mt-8 inline-block">
                <motion.span
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white"
                  whileHover={{
                    backgroundColor: '#3D8ABF',
                    borderColor: 'rgba(61,138,191,1)',
                    color: '#fff',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {t('impact_spotlight.read_more')}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </motion.span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
