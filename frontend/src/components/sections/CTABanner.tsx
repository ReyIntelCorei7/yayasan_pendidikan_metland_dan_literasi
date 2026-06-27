import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CTABannerProps {
  link?: string;
  buttonText?: string;
  title?: string;
  subtitle?: string;
}

export default function CTABanner({ link = '/contact', buttonText, title, subtitle }: CTABannerProps) {
  const { t } = useTranslation();
  
  const isExternal = link.startsWith('http');
  const btnLabel = buttonText || t('cta_banner.btn');
  const displayTitle = title || t('cta_banner.title');
  const displaySubtitle = subtitle || t('cta_banner.subtitle');

  const ButtonContent = (
    <motion.span
      className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded text-sm font-semibold cursor-pointer shadow-lg shadow-black/10"
      whileHover={{ scale: 1.04, backgroundColor: '#FAFAF8' }}
      whileTap={{ scale: 0.97 }}
    >
      {btnLabel} <span className="ml-1 text-primary">→</span>
    </motion.span>
  );

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden bg-primary"
      style={{ background: 'linear-gradient(135deg, #3D8ABF 0%, #1B4567 100%)' }}
    >
      {/* Geometric Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'rgba(61, 138, 191, 0.08)' }}
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'rgba(61, 138, 191, 0.05)' }}
        animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 2 }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight">
          {displayTitle}
        </h2>

        <motion.p
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-gray-400 mt-4 mb-10"
        >
          {displaySubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isExternal ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {ButtonContent}
            </a>
          ) : (
            <Link to={link}>
              {ButtonContent}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
