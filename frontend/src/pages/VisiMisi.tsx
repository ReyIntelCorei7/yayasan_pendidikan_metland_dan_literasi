import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

const misiItems = [
  'Menyelenggarakan pendidikan berkualitas tinggi dari jenjang TK hingga perguruan tinggi yang berorientasi pada keunggulan akademik dan pembentukan karakter.',
  'Mengembangkan kurikulum inovatif yang responsif terhadap kebutuhan industri dan perkembangan teknologi global.',
  'Membangun lingkungan belajar yang inklusif, aman, nyaman, dan menginspirasi bagi seluruh peserta didik.',
  'Memberdayakan tenaga pendidik profesional yang berdedikasi dan terus berkembang dalam kompetensi keilmuan dan pedagogik.',
  'Menjalin kemitraan strategis dengan dunia usaha, industri, dan institusi pendidikan nasional maupun internasional.',
  'Menanamkan nilai-nilai kebangsaan, toleransi, dan kepedulian sosial dalam setiap proses pendidikan.',
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
          <p className="text-[#228bcb] text-sm tracking-widest uppercase mb-4">Profil Yayasan</p>
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

      {/* Visi Detail */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="w-12 h-[3px] bg-[#228bcb] mb-6" />
            <h2 className="text-4xl font-light text-charcoal mb-6">Visi Kami</h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Menjadi yayasan pendidikan terkemuka yang melahirkan generasi unggul, berkarakter, dan berdaya saing global demi kemajuan bangsa Indonesia.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="bg-offwhite rounded-2xl p-8 border border-gray-100">
              <p className="text-sm text-gray-400 leading-relaxed">
                "Generasi unggul bukan hanya cerdas secara akademik, tetapi juga memiliki karakter kuat, etika tinggi, dan kemampuan beradaptasi dengan perubahan zaman."
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Misi Detail */}
      <section className="bg-offwhite py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="w-12 h-[3px] bg-[#228bcb] mb-6" />
            <h2 className="text-4xl font-light text-charcoal mb-12">Misi Kami</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {misiItems.map((text, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="bg-[#FCFCFC] rounded-2xl p-6 border border-gray-100 hover:border-lime/30 hover:shadow-md transition-all duration-300 flex gap-6">
                  <span className="text-4xl font-extralight text-lime/40 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-gray-500 leading-relaxed text-sm pt-2">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
