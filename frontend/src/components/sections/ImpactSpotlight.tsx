import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';

export default function ImpactSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={sectionRef}>
      {/* Section Header — like NewsInsights */}
      <div className="bg-[#FCFCFC] py-16 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <ScrollReveal>
                <p className="text-xs text-[#228bcb] uppercase tracking-[0.2em] mb-4">Sambutan Ketua Yayasan Pendidikan Metland</p>
              </ScrollReveal>
              <WordReveal
                text="Sambutan Ketua Yayasan"
                tag="h2"
                className="text-4xl lg:text-5xl font-light text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content: Image + Text */}
      <div className="w-full flex flex-col lg:flex-row min-h-[520px]">
        {/* Image Side */}
        <motion.div
          className="lg:w-[58%] relative overflow-hidden"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/src/assets/MS_ketuayayasan.jpg"
            alt="Foto kepala yayasan metland"
            className="w-full h-full object-cover min-h-[400px] lg:min-h-[520px]"
            style={{ y: imageY }}
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 6, ease: 'easeOut' }}
            loading="lazy"
          />
        </motion.div>

        {/* Text Side */}
        <div className="lg:w-[42%] bg-[#111] p-12 lg:p-16 flex flex-col justify-center">
          <ScrollReveal delay={0.2}>
            <p className="text-2xl lg:text-3xl font-bold text-white mb-2">Pandu Gunandito</p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-xs text-[#228bcb] tracking-[0.2em] uppercase mb-4">Ketua Yayasan Pendidikan Metland</p>
          </ScrollReveal>

          <WordReveal
            text="Membangun Masa Depan Melalui Pendidikan Berkualitas"
            tag="h2"
            className="text-3xl lg:text-4xl font-light text-white"
            delay={0.4}
          />

          <ScrollReveal delay={0.6}>
            <p className="text-gray-400 text-sm leading-relaxed mt-6">
              Assalamualaikum Warahmatullahi Wabarakatuh. Puji syukur kami panjatkan ke hadirat Allah SWT
              atas segala rahmat dan karunia-Nya. Yayasan Pendidikan Metland hadir dengan komitmen kuat
              untuk mencerdaskan kehidupan bangsa melalui pendidikan yang bermutu, berkarakter, dan
              berlandaskan nilai-nilai keislaman. Kami percaya bahwa setiap anak berhak mendapatkan
              pendidikan terbaik untuk meraih masa depan yang gemilang.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <Link to="/profil" className="inline-block mt-8">
              <motion.span
                className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded text-sm font-medium cursor-pointer"
                whileHover={{ backgroundColor: '#228bcb', color: '#fff', borderColor: 'rgba(34,139,203,1)' }}
                transition={{ duration: 0.25 }}
              >
                Selengkapnya →
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
