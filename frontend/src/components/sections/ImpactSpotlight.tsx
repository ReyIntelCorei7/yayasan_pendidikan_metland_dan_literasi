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
    <section ref={sectionRef} className="w-full flex flex-col lg:flex-row min-h-[520px]">
      {/* Image Side */}
      <motion.div
        className="lg:w-[58%] relative overflow-hidden"
        initial={{ x: -60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&q=80"
          alt="Students learning together in a bright classroom"
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
        <ScrollReveal delay={0.3}>
          <p className="text-xs text-lime tracking-[0.2em] uppercase mb-4">Impact Spotlight</p>
        </ScrollReveal>

        <WordReveal
          text="Transforming communities through the power of education"
          tag="h2"
          className="text-3xl lg:text-4xl font-light text-white"
          delay={0.4}
        />

        <ScrollReveal delay={0.6}>
          <p className="text-gray-400 text-sm leading-relaxed mt-6">
            In rural Zimbabwe, our scholarship program has enabled over 5,000 students to access quality
            education, breaking cycles of poverty and creating new pathways to prosperity. Meet the
            students whose lives have been transformed.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <Link to="/impact" className="inline-block mt-8">
            <motion.span
              className="inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded text-sm font-medium cursor-pointer"
              whileHover={{ backgroundColor: '#008C95', color: '#fff', borderColor: 'rgba(0,140,149,1)' }}
              transition={{ duration: 0.25 }}
            >
              Read Full Story →
            </motion.span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
