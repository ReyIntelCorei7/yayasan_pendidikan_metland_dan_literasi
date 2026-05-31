import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Star, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/animations/ScrollReveal';
import CTABanner from '../components/sections/CTABanner';

function FloatingShapes() {
  return (
    <>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-5 w-12 h-12 rounded-full bg-lime/10 blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-10 w-16 h-16 rounded-full bg-blue-200/20 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full border-2 border-lime/20"
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

const schools = [
  {
    slug: 'tk-tunas-metropolitan',
    name: 'TK Tunas Metropolitan',
    level: 'Taman Kanak-Kanak',
    tagline: 'Menanamkan cinta belajar sejak dini',
    description: 'TK Tunas Metropolitan adalah jenjang pendidikan anak usia dini yang berfokus pada pengembangan karakter, kreativitas, dan kecerdasan emosional. Dengan pendekatan bermain sambil belajar, kami memastikan setiap anak tumbuh dengan bahagia dan siap memasuki jenjang berikutnya.',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#FDE68A',
    features: ['Kurikulum Merdeka Belajar', 'Stimulasi Motorik Terpadu', 'Pendidikan Karakter', 'Lingkungan Bermain Aman'],
    stats: [{ value: '120+', label: 'Siswa Aktif' }, { value: '15', label: 'Tenaga Pengajar' }, { value: '2005', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'sd-tunas-metropolitan',
    name: 'SD Tunas Metropolitan',
    level: 'Sekolah Dasar',
    tagline: 'Fondasi kokoh untuk masa depan cerah',
    description: 'SD Tunas Metropolitan memberikan pendidikan dasar yang komprehensif dengan memadukan akademik, seni, olahraga, dan teknologi. Kami percaya setiap anak memiliki potensi unik yang perlu dikembangkan secara optimal.',
    image: '/src/assets/tk_sdmetropolitan.jpeg',
    color: '#BBF7D0',
    features: ['Kurikulum Nasional + Internasional', 'Program Bilingual', 'Ekstra Kurikuler Beragam', 'Literasi Digital'],
    stats: [{ value: '480+', label: 'Siswa Aktif' }, { value: '42', label: 'Tenaga Pengajar' }, { value: '2008', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'smk-pariwisata-metland-school',
    name: 'SMK Pariwisata Metland School',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Profesional di industri pariwisata dan perhotelan',
    description: 'SMK Pariwisata Metland School mempersiapkan siswa menjadi tenaga profesional di bidang pariwisata, perhotelan, dan kuliner. Dengan fasilitas praktik bertaraf industri dan kemitraan dengan hotel berbintang, lulusan kami siap bersaing di tingkat nasional dan internasional.',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#BFDBFE',
    features: ['Jurusan Perhotelan', 'Jurusan Kuliner', 'Jurusan Akuntansi', 'Jurusan DKV', 'Jurusan PPLG'],
    stats: [{ value: '650+', label: 'Siswa Aktif' }, { value: '55', label: 'Tenaga Pengajar' }, { value: '2012', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Mencetak tenaga terampil siap industri',
    description: 'SMK Metland berfokus pada jurusan-jurusan teknik dan bisnis yang relevan dengan kebutuhan industri modern. Program magang di perusahaan mitra memastikan siswa mendapatkan pengalaman kerja nyata sebelum lulus.',
    image: '/src/assets/sekolahsmkmetlandcibitung.webp',
    color: '#FED7AA',
    features: ['Jurusan Perhotelan', 'Jurusan Kuliner', 'Jurusan Akuntansi', 'Jurusan DKV', 'Jurusan PPLG'],
    stats: [{ value: '720+', label: 'Siswa Aktif' }, { value: '60', label: 'Tenaga Pengajar' }, { value: '2015', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    level: 'Perguruan Tinggi',
    tagline: 'Pendidikan tinggi vokasional berstandar global',
    description: 'Metland College adalah perguruan tinggi vokasional yang menawarkan program D3 dan D4 di bidang bisnis, teknologi, dan pariwisata. Dengan kurikulum yang dikembangkan bersama industri, lulusan Metland College memiliki kompetensi tinggi dan siap memasuki dunia kerja.',
    image: '/src/assets/sekolahsmkmetland.webp',
    color: '#E9D5FF',
    features: ['Program D3 & D4', 'Kerjasama Industri', 'Beasiswa Berprestasi', 'Career Development Center'],
    stats: [{ value: '890+', label: 'Mahasiswa Aktif' }, { value: '75', label: 'Dosen & Staf' }, { value: '2018', label: 'Tahun Berdiri' }],
  },
];

export default function SchoolDetail() {
  const { slug } = useParams();
  const school = schools.find((s) => s.slug === slug);

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Sekolah Tidak Ditemukan</h1>
          <Link to="/our-school" className="text-lime hover:underline">← Kembali ke Our School</Link>
        </div>
      </div>
    );
  }

  const others = schools.filter((s) => s.slug !== school.slug);

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
            className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-[#228bcb] mb-2 tracking-wide"
          >
            {school.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lime text-sm md:text-base font-semibold"
          >
            {school.tagline}
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
              className="w-12 h-[2px] bg-lime mb-6 origin-left"
            />
            <h2 className="text-3xl font-light text-charcoal mb-6">Tentang {school.name}</h2>
            <p className="text-gray-500 leading-relaxed text-base">{school.description}</p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <h3 className="text-xl font-medium text-charcoal mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime" />
              Program Unggulan
            </h3>
            <div className="space-y-3">
              {school.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-lime/20 hover:border-lime/50 cursor-pointer transition-all group"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center shrink-0 group-hover:bg-lime/30"
                  >
                    <Star className="w-4 h-4 text-lime" />
                  </motion.div>
                  <span className="text-sm text-charcoal font-medium">{f}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative bg-gradient-to-br from-charcoal via-charcoal to-blue-900 py-24 overflow-hidden">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-white mb-4 text-center">Fakta &amp; Angka</h2>
            <p className="text-center text-gray-400 mb-16">Pencapaian dan pertumbuhan {school.name}</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {school.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ scale: 1.08, rotateY: 10 }}
                className="relative group"
              >
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center hover:border-lime/30 transition-all">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="mb-4"
                  >
                    <Zap className="w-8 h-8 text-lime mx-auto" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
                    className="text-4xl font-black bg-gradient-to-r from-lime to-blue-400 bg-clip-text text-transparent mb-2"
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-gray-300 font-medium text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Schools */}
      <section className="relative bg-offwhite py-24 overflow-hidden">
        <FloatingShapes />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl font-light text-charcoal mb-12 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-lime" />
              Sekolah Lainnya
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
                      <p className="text-white text-xs font-bold bg-lime/80 inline-block px-3 py-1 rounded-full">{s.level}</p>
                    </motion.div>
                  </motion.div>
                  <motion.h3
                    whileHover={{ color: '#228bcb' }}
                    className="text-sm font-semibold text-charcoal transition-colors group-hover:text-lime"
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
      <section className="relative bg-gradient-to-r from-lime via-blue-400 to-lime py-12 overflow-hidden">
        <FloatingShapes />
        <div className="relative z-10">
          <CTABanner />
        </div>
      </section>
    </>
  );
}
