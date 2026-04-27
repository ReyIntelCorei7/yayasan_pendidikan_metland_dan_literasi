import { motion } from 'framer-motion';
import CountUpTrigger from '../animations/CountUpTrigger';
import { impactStats } from '../../data/stats';

export default function StatsBar() {
  return (
    <section className="w-full bg-charcoal py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative"
            >
              {/* Vertical Divider (desktop only) */}
              {i > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-lime/30" />
              )}
              <div className="text-4xl lg:text-5xl font-light text-white">
                <CountUpTrigger end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-white/60 uppercase tracking-widest mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
