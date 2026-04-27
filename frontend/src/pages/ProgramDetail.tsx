import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import CountUpTrigger from '../components/animations/CountUpTrigger';
import CTABanner from '../components/sections/CTABanner';
import { programs } from '../data/programs';

export default function ProgramDetail() {
  const { slug } = useParams();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Program Not Found</h1>
          <Link to="/programs" className="text-lime hover:underline">← Back to Programs</Link>
        </div>
      </div>
    );
  }

  const related = programs.filter((p) => p.category === program.category && p.id !== program.id).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end bg-charcoal overflow-hidden">
        <img src={program.image} alt={program.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 w-full">
          <span className="text-xs text-lime bg-lime/20 rounded-full px-3 py-1 uppercase">{program.category}</span>
          <WordReveal text={program.title} tag="h1" className="text-4xl lg:text-6xl font-light text-white mt-4" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/70 mt-3 text-lg">{program.tagline}</motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-3 gap-8">
          {program.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-light text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-gray-500 leading-relaxed text-lg">{program.description}</p>
            <p className="text-gray-500 leading-relaxed mt-6">
              Our approach combines direct service delivery with capacity building, ensuring that communities
              can sustain progress long after our direct involvement ends. We work closely with local
              governments, community leaders, and international partners to create lasting impact.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Programs */}
      {related.length > 0 && (
        <section className="bg-offwhite py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-12">Related Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/programs/${p.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-medium">{p.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{p.tagline}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CTABanner />
    </>
  );
}
