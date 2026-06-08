import { motion } from 'framer-motion';
import CountUpTrigger from '../animations/CountUpTrigger';
import ScrollReveal from '../animations/ScrollReveal';
import WordReveal from '../animations/WordReveal';

const impactRows = [
  {
    stat: { value: 25, suffix: '+', label: 'Tahun Pengalaman' },
    heading: 'Mengabdi untuk Pendidikan Indonesia',
    description: 'Sejak didirikan, Yayasan Pendidikan Metland terus berkomitmen memberikan layanan pendidikan terbaik dengan mengedepankan pembentukan karakter dan kompetensi akademik siswa.',
  },
  {
    stat: { value: 3000, suffix: '+', label: 'Siswa Terdidik' },
    heading: 'Membangun Generasi Unggul',
    description: 'Kami telah mendidik ribuan siswa dari jenjang Taman Kanak-Kanak hingga Perguruan Tinggi, membekali mereka dengan keterampilan yang relevan dengan kebutuhan industri masa depan.',
  },
  {
    stat: { value: 150, suffix: '+', label: 'Penghargaan' },
    heading: 'Prestasi dan Pengakuan',
    description: 'Dedikasi kami dalam dunia pendidikan telah diakui melalui berbagai penghargaan tingkat regional maupun nasional, membuktikan kualitas pendidikan yang konsisten.',
  },
];

export default function ImpactNumbers() {
  return (
    <section className="bg-[#FCFCFC] py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
                  <p
                    className="text-base md:text-lg text-[#3D8ABF] uppercase tracking-[0.2em] mb-4 font-bold"
                    style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                  >
                    Dalam Rangka
                  </p>
                </div>
        </ScrollReveal>
        <WordReveal
          text="Dampak Kami"
          tag="h2"
          className="mb-8"
        />

        <div className="space-y-24">
          {impactRows.map((row, i) => (
            <div
              key={i}
              className={`flex flex-col gap-12 lg:gap-16 ${
                i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center`}
            >
              {/* Stat block */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:w-1/2"
              >
                <div className="w-12 h-[2px] bg-primary mb-6" />
                <div className="text-6xl lg:text-7xl xl:text-8xl font-extralight text-charcoal">
                  <CountUpTrigger end={row.stat.value} suffix="" />
                  <span className="text-primary">{row.stat.suffix}</span>
                </div>
                <p className="text-base text-gray-500 mt-2">{row.stat.label}</p>
              </motion.div>

              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="lg:w-1/2"
              >
                <h3 className="text-2xl font-medium mb-4">{row.heading}</h3>
                <p className="text-gray-500 leading-relaxed">{row.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
