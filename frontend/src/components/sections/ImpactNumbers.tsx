import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CountUpTrigger from '../animations/CountUpTrigger';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';

const impactStats = [
  { value: 25, suffix: '+' },
  { value: 3000, suffix: '+' },
  { value: 150, suffix: '+' },
];

export default function ImpactNumbers() {
  const { t } = useTranslation();

  const impactRows = impactStats.map((stat, index) => ({
    stat: {
      ...stat,
      label: t(`impact_numbers.rows.${index}.label`),
    },
    heading: t(`impact_numbers.rows.${index}.heading`),
    description: t(`impact_numbers.rows.${index}.description`),
  }));

  return (
    <section className="bg-[#FCFCFC] py-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <div className="mb-4 h-2 w-2 animate-pulse bg-[#3D8ABF]" />
            <p
              className="mb-4 text-base font-bold uppercase tracking-[0.2em] text-[#3D8ABF] md:text-lg"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              {t('impact_numbers.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <WordReveal text={t('impact_numbers.title')} tag="h2" className="mb-8" />

        <div className="space-y-24">
          {impactRows.map((row, index) => {
            const isEvenRow = index % 2 === 0;

            return (
              <div
                key={row.heading}
                className={`flex flex-col items-center gap-12 lg:gap-16 ${
                  isEvenRow ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: isEvenRow ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:w-1/2"
                >
                  <div className="mb-6 h-[2px] w-12 bg-primary" />
                  <div className="text-6xl font-extralight text-charcoal lg:text-7xl xl:text-8xl">
                    <CountUpTrigger end={row.stat.value} suffix="" />
                    <span className="text-primary">{row.stat.suffix}</span>
                  </div>
                  <p className="mt-2 text-base text-gray-500">{row.stat.label}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: isEvenRow ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.15,
                  }}
                  className="lg:w-1/2"
                >
                  <h3 className="mb-4 text-2xl font-medium">{row.heading}</h3>
                  <p className="leading-relaxed text-gray-500">{row.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
