import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import CountUpTrigger from '../components/animations/CountUpTrigger';
import ImpactNumbers from '../components/sections/ImpactNumbers';
import ScholarStories from '../components/sections/ScholarStories';
import CTABanner from '../components/sections/CTABanner';
import { impactStats } from '../data/stats';

export default function Impact() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-6">
          <WordReveal text="Our Impact" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Measuring the change we're creating across communities and countries.
          </motion.p>
        </div>
      </section>

      {/* Interactive Stats Overview */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, i) => (
              <ScrollReveal key={stat.id} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-gray-100 hover:border-lime/30 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-12 h-[2px] bg-lime mx-auto mb-6" />
                  <div className="text-5xl font-extralight text-charcoal">
                    <CountUpTrigger end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-charcoal mt-3">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">{stat.description}</p>
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

      <ImpactNumbers />
      <ScholarStories />

      {/* Annual Reports */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <WordReveal text="Annual Reports" tag="h2" className="text-4xl font-light text-charcoal mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[2024, 2023, 2022, 2021].map((year, i) => (
              <ScrollReveal key={year} delay={i * 0.1}>
                <motion.a
                  href="#"
                  whileHover={{ y: -4, boxShadow: '0 12px 40px -8px rgba(0,0,0,0.1)' }}
                  className="block p-6 rounded-2xl border border-gray-100 hover:border-lime/30 transition-colors"
                >
                  <div className="text-6xl font-extralight text-gray-200 mb-4">{year}</div>
                  <p className="text-sm font-medium text-charcoal">Annual Impact Report</p>
                  <p className="text-xs text-gray-400 mt-1">Download PDF →</p>
                </motion.a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
