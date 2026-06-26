import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Users, Award, Calendar, BookOpen, Globe, Palette, Code, GraduationCap, UtensilsCrossed, Building2, Briefcase, Heart, Shield, TreePine, Monitor } from 'lucide-react';
import ScrollReveal from '../components/animations/ScrollReveal';
import CTABanner from '../components/sections/CTABanner';

function FloatingShapes() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-5 w-12 h-12 rounded-full bg-primary/10 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-10 w-16 h-16 rounded-full bg-blue-200/20 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full border-2 border-primary/20"
      />
      
      <motion.div
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/2 right-5 w-8 h-8 bg-yellow-300/10 rounded-lg"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-1/4 w-10 h-10 border-2 border-blue-300/30 rounded-lg"
      />
    </>
  );
}

// Keep base non-translatable fields here
const schools = [
  {
    slug: 'tk-tunas-metropolitan',
    keyName: 'tk_tunas',
    name: 'TK Tunas Metropolitan',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#FDE68A',
  },
  {
    slug: 'sd-tunas-metropolitan',
    keyName: 'sd_tunas',
    name: 'SD Tunas Metropolitan',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#BBF7D0',
  },
  {
    slug: 'smk-pariwisata-metland-school',
    keyName: 'smk_pariwisata',
    name: 'SMK Pariwisata Metland School',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#BFDBFE',
  },
  {
    slug: 'smk-metland',
    keyName: 'smk_metland',
    name: 'SMK Metland',
    image: '/src/assets/sekolahsmkmetlandcibitung.webp',
    color: '#FED7AA',
  },
  {
    slug: 'metland-college',
    keyName: 'metland_college',
    name: 'Metland College',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#E9D5FF',
  },
];

export default function SchoolDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  
  const school = schools.find((s) => s.slug === slug);

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">{t('schoolDetail.not_found_title')}</h1>
          <Link to="/our-school" className="text-primary hover:underline">{t('schoolDetail.not_found_back')}</Link>
        </div>
      </div>
    );
  }

  const others = schools.filter((s) => s.slug !== school.slug);

  // Retrieve translatable fields dynamically
  const levelText = t(`schools.${school.keyName}.level`);
  const taglineText = t(`schools.${school.keyName}.tagline`);
  const schoolData = t(`schoolDetail.schools.${school.slug}`, { returnObjects: true }) as any;
  
  const description = schoolData?.description || '';
  const features = (schoolData?.features || []) as string[];
  const stats = (schoolData?.stats || []) as { value: string, label: string }[];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <FloatingShapes />
        <img src={school.image} alt={school.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-[#3D8ABF] mb-2 tracking-wide"
          >
            {school.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary text-sm md:text-base font-semibold"
          >
            {taglineText}
          </motion.p>
        </div>
      </section>

      {/* Description & Features */}
      <section className="relative bg-[#FCFCFC] py-24 overflow-hidden">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start relative z-10">
          <ScrollReveal direction="left">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="w-12 h-[2px] bg-primary mb-6 origin-left"
            />
            <h2 className="text-3xl font-light text-charcoal mb-6">{t('schoolDetail.about_prefix')} {school.name}</h2>
            <p className="text-gray-500 leading-relaxed text-base">{description}</p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <h3 className="text-lg font-semibold text-charcoal mb-8 tracking-tight">{t('schoolDetail.featured_programs')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => {
                // Pick a contextual icon based on keywords
                const iconMap: Record<string, typeof BookOpen> = {
                  'Kurikulum': BookOpen, 'Bilingual': Globe, 'DKV': Palette,
                  'PPLG': Code, 'D3': GraduationCap, 'D4': GraduationCap,
                  'Kuliner': UtensilsCrossed, 'Perhotelan': Building2,
                  'Akuntansi': Briefcase, 'Karakter': Heart, 'Aman': Shield,
                  'Motorik': TreePine, 'Digital': Monitor, 'Career': Briefcase,
                  'Beasiswa': Award, 'Kerjasama': Globe, 'Ekstra': Sparkles,
                  'Stimulasi': Heart, 'Lingkungan': TreePine,
                  'Curriculum': BookOpen, 'Hospitality': Building2, 'Culinary': UtensilsCrossed,
                  'Accounting': Briefcase, 'Visual': Palette, 'Software': Code,
                  'Safe': Shield, 'Play': Heart, 'Environment': TreePine,
                };
                const matchedKey = Object.keys(iconMap).find(k => f.includes(k));
                const Icon = matchedKey ? iconMap[matchedKey] : BookOpen;
                
                // Rotating accent colors
                const accents = [
                  { bg: 'bg-blue-50', border: 'border-l-[#3D8ABF]', text: 'text-[#3D8ABF]' },
                  { bg: 'bg-amber-50', border: 'border-l-amber-400', text: 'text-amber-500' },
                  { bg: 'bg-emerald-50', border: 'border-l-emerald-400', text: 'text-emerald-500' },
                  { bg: 'bg-violet-50', border: 'border-l-violet-400', text: 'text-violet-500' },
                  { bg: 'bg-rose-50', border: 'border-l-rose-400', text: 'text-rose-500' },
                ];
                const accent = accents[i % accents.length];
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-4 p-4 rounded-xl ${accent.bg} border-l-[3px] ${accent.border} cursor-default transition-all duration-300 group`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0`}>
                      <Icon className={`w-[18px] h-[18px] ${accent.text}`} strokeWidth={1.8} />
                    </div>
                    <span className="text-sm text-charcoal/80 font-medium leading-snug">{f}</span>
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative bg-gradient-to-br from-charcoal to-[#1A2530] py-24 overflow-hidden">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-white mb-3 text-center">{t('schoolDetail.facts_title')}</h2>
            <p className="text-center text-gray-400 mb-14 max-w-2xl mx-auto text-sm md:text-base">{t('schoolDetail.facts_desc_prefix')} {school.name}</p>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = i === 0 ? Users : i === 1 ? Award : Calendar;
              
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm group-hover:bg-white/[0.05] group-hover:border-primary/40 transition-all duration-300 shadow-lg">
                    {/* Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-primary group-hover:text-blue-300 transition-colors" strokeWidth={1.5} />
                    </div>
                    
                    {/* Text Container */}
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-sm group-hover:text-primary transition-colors duration-300"
                        style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                      >
                        {stat.value}
                      </h3>
                      <p className="text-gray-400 font-medium text-xs md:text-sm uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Schools */}
      <section className="relative bg-offwhite py-24 overflow-hidden">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-charcoal mb-12 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              {t('schoolDetail.other_schools')}
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.slice(0, 4).map((s, idx) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link to={`/our-school/${s.slug}`} className="group block h-full">
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="aspect-[4/3] overflow-hidden relative mb-4 rounded-2xl"
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <motion.div>
                      <p className="text-white text-xs font-bold bg-primary/80 inline-block px-3 py-1 rounded-full">{t(`schools.${s.keyName}.level`)}</p>
                    </motion.div>
                  </motion.div>
                  <motion.h3
                    whileHover={{ color: '#3D8ABF' }}
                    className="text-sm font-semibold text-charcoal transition-colors group-hover:text-primary"
                  >
                    {s.name}
                  </motion.h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative bg-gradient-to-r from-primary via-blue-400 to-primary py-12 overflow-hidden">
        <FloatingShapes />
        <div className="relative z-10">
          <CTABanner />
        </div>
      </section>
    </>
  );
}
