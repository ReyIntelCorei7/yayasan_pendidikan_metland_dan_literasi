import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/animations/ScrollReveal';
import CTABanner from '../components/sections/CTABanner';

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
    image: '/src/assets/sekolahsmkmetland.png',
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
    image: '/src/assets/sekolahsmkmetlandcibitung.jpg',
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
    image: '/src/assets/sekolahsmkmetland.png',
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
        </div>
      </section>

      {/* Description & Features */}
      <section className="bg-[#FCFCFC] py-24">
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
                <div className="aspect-[4/3] overflow-hidden relative mb-4">
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
    </>
  );
}
