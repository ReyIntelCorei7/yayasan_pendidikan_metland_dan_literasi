import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

const values = [
  { title: 'Integritas', desc: 'Kami menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan dan keputusan.' },
  { title: 'Inovasi', desc: 'Kami mendorong pemikiran kreatif untuk menciptakan solusi pendidikan yang relevan dan berdampak.' },
  { title: 'Keunggulan', desc: 'Kami berkomitmen memberikan standar kualitas tertinggi dalam setiap aspek pendidikan.' },
  { title: 'Kolaborasi', desc: 'Kami percaya pada kekuatan kemitraan antara yayasan, sekolah, orang tua, dan komunitas.' },
];

export default function VisiMisi() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-lime text-sm tracking-widest uppercase mb-4">Profil Yayasan</p>
          <WordReveal text="Visi & Misi" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Landasan nilai dan arah perjuangan Yayasan Pendidikan Metland dalam memajukan generasi bangsa.
          </motion.p>
        </div>
      </section>

      {/* Visi */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="w-12 h-[3px] bg-lime mb-6" />
            <h2 className="text-4xl font-light text-charcoal mb-6">Visi</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Menjadi yayasan pendidikan terkemuka yang melahirkan generasi unggul, berkarakter, dan berdaya saing global demi kemajuan bangsa Indonesia.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="bg-offwhite rounded-2xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-lime/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                "Generasi unggul bukan hanya cerdas secara akademik, tetapi juga memiliki karakter kuat, etika tinggi, dan kemampuan beradaptasi dengan perubahan zaman."
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Misi */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="w-12 h-[3px] bg-lime mb-6" />
            <h2 className="text-4xl font-light text-charcoal mb-12">Misi</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: '01', text: 'Menyelenggarakan pendidikan berkualitas tinggi dari jenjang TK hingga perguruan tinggi yang berorientasi pada keunggulan akademik dan pembentukan karakter.' },
              { num: '02', text: 'Mengembangkan kurikulum inovatif yang responsif terhadap kebutuhan industri dan perkembangan teknologi global.' },
              { num: '03', text: 'Membangun lingkungan belajar yang inklusif, aman, nyaman, dan menginspirasi bagi seluruh peserta didik.' },
              { num: '04', text: 'Memberdayakan tenaga pendidik profesional yang berdedikasi dan terus berkembang dalam kompetensi keilmuan dan pedagogik.' },
              { num: '05', text: 'Menjalin kemitraan strategis dengan dunia usaha, industri, dan institusi pendidikan nasional maupun internasional.' },
              { num: '06', text: 'Menanamkan nilai-nilai kebangsaan, toleransi, dan kepedulian sosial dalam setiap proses pendidikan.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-lime/30 hover:shadow-md transition-all duration-300 flex gap-6">
                  <span className="text-4xl font-extralight text-lime/40 shrink-0">{item.num}</span>
                  <p className="text-gray-500 leading-relaxed text-sm pt-2">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai-Nilai */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <WordReveal text="Nilai-Nilai Kami" tag="h2" className="text-4xl font-light text-charcoal mb-12 justify-center text-center" />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl border border-gray-100 hover:border-lime/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-[2px] bg-lime mx-auto mb-6" />
                  <h3 className="font-semibold text-charcoal text-lg mb-3">{v.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
