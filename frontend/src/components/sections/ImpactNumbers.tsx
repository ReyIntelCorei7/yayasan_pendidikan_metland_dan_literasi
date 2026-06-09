import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CountUpTrigger from '../animations/CountUpTrigger';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';

export default function ImpactNumbers() {
  const { t } = useTranslation();

  const impactRows = [
    {
      stat: { value: 25, suffix: '+', label: t('impact_numbers.rows.0.label') },
      heading: t('impact_numbers.rows.0.heading'),
      description: t('impact_numbers.rows.0.description'),
    },
    {
      stat: { value: 3000, suffix: '+', label: t('impact_numbers.rows.1.label') },
      heading: t('impact_numbers.rows.1.heading'),
      description: t('impact_numbers.rows.1.description'),
    },
    {
      stat: { value: 150, suffix: '+', label: t('impact_numbers.rows.2.label') },
      heading: t('impact_numbers.rows.2.heading'),
      description: t('impact_numbers.rows.2.description'),
    },
  ];

  return (
    <section className="bg-[#FCFCFC] py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
                  <p
                    className="text-base md:text-lg text-[#3D8ABF] uppercase tracking-[0.2em] mb-4 font-bold"
                    style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                  >
                    {t('impact_numbers.subtitle')}
                  </p>
                </div>
        </ScrollReveal>
        <WordReveal
          text={t('impact_numbers.title')}
          tag="h2"
          className="mb-8"
        />

        <div className="space-y-24">
          {impactRows.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col gap-12 lg:gap-16 ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center`}
            >
              {/* Stat block */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:w-1/2"
              >
                <div className="w-12 h-[2px] bg-primary mb-6" />
                <div className="text-6xl lg:text-7xl xl:text-8xl font-extralight text-charcoal">
                  <CountUpTrigger end={row.stat.value} suffix="" />
                  <span className="text-primary">{row.stat.suffix}</span>
                </div>
                <p className="text-base text-gray-500 mt-2">{row.stat.label}</p>
              </motion.div>

              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="lg:w-1/2"
              >
                <h3 className="text-2xl font-medium mb-4">{row.heading}</h3>
                <p className="text-gray-500 leading-relaxed">{row.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
