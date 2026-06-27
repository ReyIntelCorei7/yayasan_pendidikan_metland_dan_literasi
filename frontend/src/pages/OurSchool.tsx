import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import { useTranslation } from 'react-i18next';

import heroImg from '../assets/sekolahsmkmetland.webp';
import tkSdImg from '../assets/tk_sdmetropolitan.jpeg';
import smkPariwisataImg from '../assets/sekolahsmkmetland.webp';
import smkMetlandImg from '../assets/sekolahsmkmetlandcibitung.webp';

const schools = [
  {
    slug: 'tk-tunas-metropolitan',
    name: 'TK Tunas Metropolitan',
    levelKey: 'tk_tunas',
    taglineKey: 'tk_tunas',
    image: tkSdImg,
    color: '#10B981',
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    levelKey: 'sd_tunas',
    taglineKey: 'sd_tunas',
    image: tkSdImg,
    color: '#E5A320',
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland Cileungsi',
    levelKey: 'smk_pariwisata',
    taglineKey: 'smk_pariwisata',
    image: smkPariwisataImg,
    color: '#3D8ABF',
  },
  {
    slug: 'smk-metland',
    name: 'SMK Pariwisata Metland Cibitung',
    levelKey: 'smk_metland',
    taglineKey: 'smk_metland',
    image: smkMetlandImg,
    color: '#2E6F9E',
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    levelKey: 'metland_college',
    taglineKey: 'metland_college',
    image: smkPariwisataImg,
    color: '#8B5CF6',
  },
];

export default function OurSchool() {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src={heroImg}
          alt="foto sekolah smk metland"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
        <div className="relative z-10 text-center px-6 mt-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-lg font-bold tracking-[3px] uppercase block"
          >
            Unit Pendidikan
          </motion.span>
          <WordReveal
            text={t('ourSchool.hero_tag')}
            tag="h1"
            className="text-4xl lg:text-5xl font-light text-white"
          />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-gray-300 max-w-2xl mx-auto">
            {t('ourSchool.hero_description')}
          </motion.p>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, i) => (
              <ScrollReveal key={school.slug} delay={i * 0.1}>
                <Link to={`/our-school/${school.slug}`} className="group block h-full">
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative overflow-hidden border border-gray-100 transition-all duration-500 h-full bg-white shadow-md hover:shadow-xl rounded-2xl"
                    style={{ '--hover-color': school.color } as React.CSSProperties}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={school.image}
                        alt={school.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-xs px-3 py-1.5 rounded-full font-medium text-white shadow-sm" style={{ background: school.color }}>
                          {t(`schools.${school.levelKey}.level`)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 
                        className="font-semibold text-charcoal text-xl transition-colors duration-300"
                        onMouseEnter={(e) => (e.currentTarget.style.color = school.color)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                      >
                        {school.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">{t(`schools.${school.taglineKey}.tagline`)}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold mt-4 group-hover:gap-2 transition-all uppercase tracking-wide" style={{ color: school.color }}>
                        {t('common.read_more')} <span>→</span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
