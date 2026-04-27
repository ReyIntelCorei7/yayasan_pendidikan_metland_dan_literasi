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
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    color: '#FDE68A',
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    level: 'Sekolah Dasar',
    tagline: 'Fondasi kokoh untuk masa depan cerah',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    color: '#BBF7D0',
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland School',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Profesional di industri pariwisata dan perhotelan',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    color: '#BFDBFE',
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Mencetak tenaga terampil siap industri',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
    color: '#FED7AA',
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    level: 'Perguruan Tinggi',
    tagline: 'Pendidikan tinggi vokasional berstandar global',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    color: '#E9D5FF',
  },
];

export default function OurSchool() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-lime text-sm tracking-widest uppercase mb-4">Unit Pendidikan</p>
          <WordReveal text="Our School" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Yayasan Pendidikan Metland mengelola 5 unit pendidikan berkualitas dari jenjang TK hingga perguruan tinggi.
          </motion.p>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, i) => (
              <ScrollReveal key={school.slug} delay={i * 0.1}>
                <Link to={`/our-school/${school.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5">
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

      {/* Stats */}
      <section className="bg-charcoal py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5', label: 'Unit Pendidikan', suffix: '' },
              { value: '2.860+', label: 'Siswa & Mahasiswa', suffix: '' },
              { value: '247', label: 'Tenaga Pendidik', suffix: '' },
              { value: '19+', label: 'Tahun Pengalaman', suffix: '' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-extralight text-white">{stat.value}</div>
                <p className="text-sm text-white/50 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
