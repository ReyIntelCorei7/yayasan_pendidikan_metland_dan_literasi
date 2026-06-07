import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';

const schools = [
  {
    slug: 'tk-tunas-metropolitan',
    name: 'TK Tunas Metropolitan',
    level: 'Taman Kanak-Kanak',
    tagline: 'Menanamkan cinta belajar sejak dini',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#10B981', // Accent green
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    level: 'Sekolah Dasar',
    tagline: 'Fondasi kokoh untuk masa depan cerah',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#E5A320', // Secondary gold
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland School',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Profesional di industri pariwisata dan perhotelan',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#3D8ABF', // Primary blue
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Mencetak tenaga terampil siap industri',
    image: '/src/assets/sekolahsmkmetlandcibitung.webp',
    color: '#2E6F9E', // Darker blue
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    level: 'Perguruan Tinggi',
    tagline: 'Pendidikan tinggi vokasional berstandar global',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#8B5CF6', // Purple
  },
];

export default function ProgramsGrid() {
  return (
    <section className="bg-offwhite py-24 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className='flex items-center gap-3'>
            <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
            <p
              className="text-sm text-[#3D8ABF] uppercase tracking-[0.2em] mb-4"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              Unit Pendidikan
            </p>
          </div>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
          <WordReveal
            text="Sekolah Kami"
            tag="h2"
            className="text-4xl lg:text-6xl font-light text-charcoal"
          />
          <Link
            to="/our-school"
            className="text-sm font-medium text-charcoal hover:text-[#3D8ABF] transition-colors mt-4 md:mt-0 group"
          >
            Lihat Semua
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Schools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {schools.map((school, i) => (
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
                        {school.level}
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
                    <p className="text-sm text-gray-400 mt-2">{school.tagline}</p>
                    <span 
                      className="inline-flex items-center gap-1 text-xs font-semibold mt-5 group-hover:gap-2 transition-all uppercase tracking-wide"
                      style={{ color: school.color }}
                    >
                      Selengkapnya <span>→</span>
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
