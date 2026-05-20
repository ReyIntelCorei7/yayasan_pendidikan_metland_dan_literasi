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
    color: '#228bcb',
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    level: 'Sekolah Dasar',
    tagline: 'Fondasi kokoh untuk masa depan cerah',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#228bcb',
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland School',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Profesional di industri pariwisata dan perhotelan',
    image: '/src/assets/sekolahsmkmetland.png',
    color: '#228bcb',
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Mencetak tenaga terampil siap industri',
    image: '/src/assets/sekolahsmkmetlandcibitung.jpg',
    color: '#228bcb',
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    level: 'Perguruan Tinggi',
    tagline: 'Pendidikan tinggi vokasional berstandar global',
    image: '/src/assets/sekolahsmkmetland.png',
    color: '#228bcb',
  },
];

export default function ProgramsGrid() {
  return (
    <section className="bg-offwhite py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <p className="text-m text-[#228bcb] uppercase tracking-[0.2em] mb-4">Unit Pendidikan</p>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <WordReveal
            text="Our School"
            tag="h2"
            className="text-4xl lg:text-5xl font-light text-charcoal"
          />
          <Link
            to="/our-school"
            className="text-sm font-medium text-charcoal hover:text-[#228bcb] transition-colors mt-4 md:mt-0 group"
          >
            Lihat Semua
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Schools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school, i) => (
            <ScrollReveal key={school.slug} delay={i * 0.1}>
              <Link to={`/our-school/${school.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden mb-5">
                  <motion.img
                    src={school.image}
                    alt={school.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ background: school.color + '33', color: school.color }}
                    >
                      {school.level}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-charcoal text-lg group-hover:text-[#228bcb] transition-colors duration-300">
                  {school.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">{school.tagline}</p>
                <span className="inline-flex items-center gap-1 text-[#228bcb] text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                  Selengkapnya <span>→</span>
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
