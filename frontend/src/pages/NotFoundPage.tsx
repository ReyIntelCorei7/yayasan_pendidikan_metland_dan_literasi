import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoYayasan from '../assets/logoyayasan.png';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <img src={logoYayasan} alt="Logo Yayasan" className="w-16 h-16 mb-8" />
        
        <h1 className="text-8xl md:text-9xl font-bold text-primary/10 tracking-tight mb-4 select-none">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-medium text-charcoal mb-4">
          {t('not_found.title')}
        </h2>
        
        <p className="text-gray-500 max-w-md mb-8">
          {t('not_found.subtitle')}
        </p>
        
        <Link to="/">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md font-medium shadow-lg shadow-primary/20 hover:bg-primary-600 transition-colors"
          >
            {t('not_found.back_home')}
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}
