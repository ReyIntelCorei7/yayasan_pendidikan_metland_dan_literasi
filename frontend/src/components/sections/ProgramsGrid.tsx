import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';

const schoolsData = [
  {
    slug: 'tk-tunas-metropolitan',
    name: 'TK Tunas Metropolitan',
    transKey: 'tk_tunas',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#10B981', // Accent green
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    transKey: 'sd_tunas',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#E5A320', // Secondary gold
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland School',
    transKey: 'smk_pariwisata',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#3D8ABF', // Primary blue
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    transKey: 'smk_metland',
    image: '/src/assets/sekolahsmkmetlandcibitung.webp',
    color: '#2E6F9E', // Darker blue
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    transKey: 'metland_college',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#8B5CF6', // Purple
  },
];

export default function ProgramsGrid() {
  const { t } = useTranslation();
  return (
    <section className="bg-offwhite py-16 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
                  <p
                    className="text-base md:text-lg text-[#3D8ABF] uppercase tracking-[0.2em] mb-4 font-bold"
                    style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                  >
                    {t('programs_grid.subtitle')}
                  </p>
                </div>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <WordReveal
            text={t('programs_grid.title')}
            tag="h2"
            className="text-4xl lg:text-6xl font-light text-charcoal"
          />
          <Link
            to="/our-school"
            className="text-sm font-medium text-charcoal hover:text-[#3D8ABF] transition-colors mt-4 md:mt-0 group"
          >
            {t('programs_grid.view_all')}
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Schools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {schoolsData.map((school, i) => (
            <ScrollReveal key={school.slug} delay={i * 0.08}>
              <Link to={`/our-school/${school.slug}`} className="group block h-full">
                <motion.div 
                  whileHover={{ y: -10, scale: 1.01 }}
                  className="relative overflow-hidden border border-gray-100 transition-all duration-500 h-full bg-white shadow-lg hover:shadow-2xl rounded-xl card-glow"
                  style={{ '--hover-color': school.color } as React.CSSProperties}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
                    <motion.img
                      src={school.image}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className="text-xs px-3 py-1.5 rounded-full text-white font-medium shadow-md"
                        style={{ background: school.color }}
                      >
                        {t(`schools.${school.transKey}.level`)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-7">
                    <h3
                      className="font-semibold text-charcoal text-xl transition-colors duration-300"
                      style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = school.color)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {school.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">{t(`schools.${school.transKey}.tagline`)}</p>
                    <span 
                      className="inline-flex items-center gap-1 text-xs font-semibold mt-5 group-hover:gap-2 transition-all uppercase tracking-wide"
                      style={{ color: school.color }}
                    >
                      {t('programs_grid.read_more')} <span>→</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
