import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import ketuaYayasanImg from '../../assets/MS_ketuayayasan.webp';

export default function ImpactSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={sectionRef}>
      {/* Section Header */}
      <div className="bg-[#FCFCFC] py-2 pb-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
                  <p
                    className="text-base md:text-lg text-[#3D8ABF] uppercase tracking-[0.2em] mb-4 font-bold"
                    style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                  >
                    Sambutan Ketua Yayasan Pendidikan
                  </p>
                </div>
              </ScrollReveal>
              <WordReveal
                text="Sambutan Ketua Yayasan"
                tag="h2"
                className=""
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
            src={ketuaYayasanImg}
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

        {/* Text Side — dark section matching footer palette */}
        <div
          className="lg:w-[42%] p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F0F1E 0%, #1A1A2E 50%, #16213E 100%)' }}
        >
          {/* Geometric Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {/* Decorative accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-12 h-[2px] bg-[#3D8ABF] origin-left mb-8"
          />

          <ScrollReveal delay={0.2}>
            <p
              className="text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              Bapak Ir. Pandu Gunandito
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p
              className="text-xs text-[#3D8ABF] tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Geist', Inter, sans-serif" }}
            >
              Ketua Yayasan Pendidikan Metland
            </p>
          </ScrollReveal>

          <WordReveal
            text="Membangun Masa Depan Melalui Pendidikan Berkualitas"
            tag="h2"
            className=""
          />

          <ScrollReveal delay={0.6}>
            <p className="text-gray-400 text-sm leading-relaxed">
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
                className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium cursor-pointer"
                whileHover={{ backgroundColor: '#3D8ABF', color: '#fff', borderColor: 'rgba(61,138,191,1)' }}
                transition={{ duration: 0.25 }}
              >
                Selengkapnya
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </motion.span>
            </Link>
          </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
