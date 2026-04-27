import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import CTABanner from '../components/sections/CTABanner';

const schools = [
  {
    slug: 'tk-tunas-metropolitan',
    name: 'TK Tunas Metropolitan',
    level: 'Taman Kanak-Kanak',
    tagline: 'Menanamkan cinta belajar sejak dini',
    description: 'TK Tunas Metropolitan adalah jenjang pendidikan anak usia dini yang berfokus pada pengembangan karakter, kreativitas, dan kecerdasan emosional. Dengan pendekatan bermain sambil belajar, kami memastikan setiap anak tumbuh dengan bahagia dan siap memasuki jenjang berikutnya.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80',
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
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=80',
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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80',
    color: '#BFDBFE',
    features: ['Jurusan Perhotelan', 'Jurusan Tata Boga', 'Jurusan Wisata & Tour', 'Prakerin di Hotel Bintang 5'],
    stats: [{ value: '650+', label: 'Siswa Aktif' }, { value: '55', label: 'Tenaga Pengajar' }, { value: '2012', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'smk-metland',
    name: 'SMK Metland',
    level: 'Sekolah Menengah Kejuruan',
    tagline: 'Mencetak tenaga terampil siap industri',
    description: 'SMK Metland berfokus pada jurusan-jurusan teknik dan bisnis yang relevan dengan kebutuhan industri modern. Program magang di perusahaan mitra memastikan siswa mendapatkan pengalaman kerja nyata sebelum lulus.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80',
    color: '#FED7AA',
    features: ['Teknik Komputer & Jaringan', 'Akuntansi & Keuangan', 'Teknik Otomotif', 'Program Magang Industri'],
    stats: [{ value: '720+', label: 'Siswa Aktif' }, { value: '60', label: 'Tenaga Pengajar' }, { value: '2015', label: 'Tahun Berdiri' }],
  },
  {
    slug: 'metland-college',
    name: 'Metland College',
    level: 'Perguruan Tinggi',
    tagline: 'Pendidikan tinggi vokasional berstandar global',
    description: 'Metland College adalah perguruan tinggi vokasional yang menawarkan program D3 dan D4 di bidang bisnis, teknologi, dan pariwisata. Dengan kurikulum yang dikembangkan bersama industri, lulusan Metland College memiliki kompetensi tinggi dan siap memasuki dunia kerja.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80',
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
      <section className="relative h-[65vh] min-h-[450px] flex items-end bg-charcoal overflow-hidden">
        <img src={school.image} alt={school.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
          <span className="text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-4" style={{ background: school.color + '33', color: school.color }}>
            {school.level}
          </span>
          <WordReveal text={school.name} tag="h1" className="text-4xl lg:text-6xl font-light text-white mt-2" delay={0.2} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/70 mt-3 text-lg"
          >
            {school.tagline}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-3 gap-8">
          {school.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-light text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Description & Features */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal direction="left">
            <div className="w-12 h-[2px] bg-lime mb-6" />
            <h2 className="text-3xl font-light text-charcoal mb-6">Tentang {school.name}</h2>
            <p className="text-gray-500 leading-relaxed text-base">{school.description}</p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <h3 className="text-xl font-medium text-charcoal mb-6">Program Unggulan</h3>
            <div className="space-y-3">
              {school.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-offwhite rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-lime shrink-0" />
                  <span className="text-sm text-charcoal font-medium">{f}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Other Schools */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-light text-charcoal mb-12">Sekolah Lainnya</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {others.slice(0, 4).map((s) => (
              <Link key={s.slug} to={`/our-school/${s.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl relative mb-4">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-xs font-medium">{s.level}</p>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-charcoal group-hover:text-lime transition-colors">{s.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
