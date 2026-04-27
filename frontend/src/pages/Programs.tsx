import ProgramsGrid from '../components/sections/ProgramsGrid';
import CTABanner from '../components/sections/CTABanner';
import WordReveal from '../components/animations/WordReveal';
import { motion } from 'framer-motion';

export default function Programs() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-6">
          <WordReveal text="Our Programs" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Comprehensive programs spanning education, health, and livelihoods across Africa.
          </motion.p>
        </div>
      </section>
      <ProgramsGrid />
      <CTABanner />
    </>
  );
}
