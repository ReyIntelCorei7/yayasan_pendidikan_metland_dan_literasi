import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

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

export default function OurSchool() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="/src/assets/sekolahsmkmetland.png"
          alt="foto sekolah smk metland"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-[#3aabf0] text-lg font-bold tracking-widest uppercase mb-1">Unit Pendidikan</p>
          <WordReveal text="Our School" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-300 mt-1 max-w-2xl mx-auto"
          >
            Yayasan Pendidikan Metland mengelola 5 unit pendidikan berkualitas dari jenjang TK hingga perguruan tinggi.
          </motion.p>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, i) => (
              <ScrollReveal key={school.slug} delay={i * 0.1}>
                <Link to={`/our-school/${school.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden mb-5">
                    <img
                      src={school.image}
                      alt={school.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs px-3 py-1 rounded-full" style={{ background: school.color + '33', color: school.color }}>
                        {school.level}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-charcoal text-lg group-hover:text-lime transition-colors duration-300">{school.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{school.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-lime text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                    Selengkapnya <span>→</span>
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
