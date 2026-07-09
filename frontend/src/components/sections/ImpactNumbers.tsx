import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import CountUpTrigger from '../animations/CountUpTrigger';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';
import api from '../../services/api';

interface ImpactNumber {
  id: string;
  value: number;
  suffix: string | null;
  label: string;
  heading: string;
  description: string;
}

export default function ImpactNumbers() {
  const { t, i18n } = useTranslation();
  const [impactRows, setImpactRows] = useState<ImpactNumber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.impactNumbers.list();
        setImpactRows(data);
      } catch (error) {
        console.error('Failed to fetch impact numbers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

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

        {!loading && (
          <div className="space-y-24">
            {impactRows.map((row, index) => {
              const isEvenRow = index % 2 === 0;

              const getLocalizedString = (field: any) => {
                if (typeof field === 'string') return field;
                const lang = i18n.language || 'id';
                return field[lang] || field['id'] || field['en'] || '';
              };

              return (
                <div
                  key={row.id}
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
                      <CountUpTrigger end={row.value} suffix="" />
                      <span className="text-primary">{row.suffix || ''}</span>
                    </div>
                    <p className="mt-2 text-base text-gray-500">{getLocalizedString(row.label)}</p>
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
                    <h3 className="mb-4 text-2xl font-medium">{getLocalizedString(row.heading)}</h3>
                    <p className="leading-relaxed text-gray-500">{getLocalizedString(row.description)}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
