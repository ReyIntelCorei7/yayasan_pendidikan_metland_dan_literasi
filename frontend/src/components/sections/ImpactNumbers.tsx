import { motion } from 'framer-motion';
import CountUpTrigger from '../animations/CountUpTrigger';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';

const impactRows = [
  {
    stat: { value: 45000, suffix: '+', label: 'Lives Transformed' },
    heading: 'Changing lives across the continent',
    description: 'Through our education, health, and livelihoods programs, we have directly impacted over 45,000 individuals across six African countries, creating lasting change that ripples through communities.',
  },
  {
    stat: { value: 120, suffix: '', label: 'Schools Supported' },
    heading: 'Building infrastructure for learning',
    description: 'We have built, renovated, and supported 120 schools across Africa, providing safe and conducive learning environments that inspire students to dream bigger.',
  },
  {
    stat: { value: 1000000, suffix: '+', label: 'Meals Served' },
    heading: 'Nourishing bodies and minds',
    description: 'Our feeding programs ensure that no student goes hungry. With over one million meals served, we are removing one of the biggest barriers to education in Africa.',
  },
];

export default function ImpactNumbers() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-xs text-lime uppercase tracking-[0.2em] mb-4">By The Numbers</p>
        </ScrollReveal>
        <WordReveal
          text="Our Impact in Numbers"
          tag="h2"
          className="text-4xl lg:text-5xl font-light text-charcoal mb-20"
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
                <div className="w-12 h-[2px] bg-lime mb-6" />
                <div className="text-6xl lg:text-7xl xl:text-8xl font-extralight text-charcoal">
                  <CountUpTrigger end={row.stat.value} suffix="" />
                  <span className="text-lime">{row.stat.suffix}</span>
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
