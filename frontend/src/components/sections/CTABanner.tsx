import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../animations/WordReveal';

export default function CTABanner() {
  return (
    <section className="bg-charcoal py-20 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <WordReveal
          text="Be Part of Africa's Transformation"
          tag="h2"
          className="text-4xl lg:text-5xl font-light text-white justify-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-gray-400 mt-4 mb-10"
        >
          Join thousands of supporters shaping a better future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/contact">
            <motion.span
              className="inline-flex items-center gap-2 bg-lime text-charcoal px-8 py-4 rounded text-sm font-medium cursor-pointer"
              whileHover={{ scale: 1.04, backgroundColor: '#007A82' }}
              whileTap={{ scale: 0.97 }}
            >
              Hubungi Kami <span>→</span>
            </motion.span>
          </Link>
          <a href="#">
            <motion.span
              className="inline-flex items-center border border-white/30 text-white px-8 py-4 rounded text-sm font-medium cursor-pointer"
              whileHover={{ borderColor: '#008C95', color: '#008C95' }}
              whileTap={{ scale: 0.97 }}
            >
              Donate Now
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
