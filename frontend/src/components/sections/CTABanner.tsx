import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../animations/WordReveal';

export default function CTABanner() {
  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0F0F1E 0%, #1A1A2E 50%, #16213E 100%)' }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'rgba(34, 139, 203, 0.08)' }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'rgba(34, 139, 203, 0.05)' }}
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <WordReveal
          text="Bergabung Bersama Kami"
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
          Jadilah bagian dari perjalanan membangun pendidikan berkualitas untuk masa depan Indonesia.
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
              className="inline-flex items-center gap-2 bg-[#228bcb] text-white px-8 py-4 rounded text-sm font-medium cursor-pointer"
              whileHover={{ scale: 1.04, backgroundColor: '#1b78b3' }}
              whileTap={{ scale: 0.97 }}
            >
              Hubungi Kami <span>→</span>
            </motion.span>
          </Link>
          <Link to="/profil">
            <motion.span
              className="inline-flex items-center border border-white/30 text-white px-8 py-4 rounded text-sm font-medium cursor-pointer"
              whileHover={{ borderColor: '#228bcb', color: '#228bcb' }}
              whileTap={{ scale: 0.97 }}
            >
              Pelajari Lebih Lanjut
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
