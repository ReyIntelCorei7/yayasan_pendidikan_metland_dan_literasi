import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import CountUpTrigger from '../components/animations/CountUpTrigger';
import ExperienceNumbers from '../components/sections/ImpactNumbers';
import { useImpactStats } from '../hooks/useImpactStats';
import { useTranslation } from 'react-i18next';

function getText(val: any, lang: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['id'] || Object.values(val)[0] || '';
  }
  return String(val);
}
import CTABanner from '../components/sections/CTABanner';

export default function Impact() {
  const { stats } = useImpactStats();
  const { i18n } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
        <div className="relative z-10 text-center px-6 mt-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-lg font-bold tracking-[3px] uppercase block"
          >
            Profil
          </motion.span>
          <WordReveal text="Our Impact" tag="h1" className="text-4xl lg:text-5xl font-light text-white" delay={0.2} />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-gray-300 max-w-2xl mx-auto">
            Measuring the change we're creating across communities and countries.
          </motion.p>
        </div>
      </section>

      {/* Interactive Stats Overview */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.id} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-12 h-[2px] bg-primary mx-auto mb-6" />
                  <div className="text-5xl font-extralight text-charcoal">
                    <CountUpTrigger end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-charcoal mt-3">{getText(stat.label, i18n.language)}</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{getText(stat.description, i18n.language)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <WordReveal text="Where We Work" tag="h2" className="text-4xl font-light text-charcoal mb-12" />
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden bg-charcoal-soft aspect-[21/9] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1400&q=80"
                alt="Map of Africa showing our operational regions"
                className="w-full h-full object-cover opacity-60"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8 text-center">
                  {['Zimbabwe', 'Nigeria', 'Ghana', 'South Africa', 'Rwanda', 'Senegal'].map((country, i) => (
                    <motion.div
                      key={country}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10"
                    >
                      <p className="text-white font-medium text-sm">{country}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ExperienceNumbers />
      <CTABanner />
    </>
  );
}
