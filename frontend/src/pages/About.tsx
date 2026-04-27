import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import { team } from '../data/team';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6">
          <WordReveal text="About Higher Life Foundation" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Two decades of transforming lives across Africa through education, health, and sustainable livelihoods.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          <ScrollReveal direction="left">
            <h2 className="text-3xl font-light mb-6">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">
              To invest in the transformation of Africa by empowering communities through education, health, and enterprise development. We believe every person has the potential to change their world — they just need the opportunity.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-light mb-6">Our Vision</h2>
            <p className="text-gray-500 leading-relaxed">
              An Africa where every individual has access to quality education, healthcare, and economic opportunity. A continent powered by its people, leading its own transformation on the global stage.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-offwhite py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <WordReveal text="Our Journey" tag="h2" className="text-4xl font-light text-charcoal mb-16 justify-center text-center" />
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            {[
              { year: '2000', text: 'Foundation established with a vision to transform Africa through education.' },
              { year: '2005', text: 'First 1,000 scholarships awarded across Zimbabwe.' },
              { year: '2010', text: 'Expanded to six African countries with health and livelihood programs.' },
              { year: '2015', text: 'Reached 20,000 beneficiaries with integrated community programs.' },
              { year: '2020', text: 'Launched digital literacy initiative, empowering youth with tech skills.' },
              { year: '2024', text: 'Over 45,000 lives transformed and growing.' },
            ].map((item, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className={`flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <span className="text-lime font-medium text-lg">{item.year}</span>
                    <p className="text-gray-500 text-sm mt-1">{item.text}</p>
                  </div>
                  <div className="w-4 h-4 bg-lime rounded-full border-4 border-offwhite relative z-10 shrink-0" />
                  <div className="w-1/2" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <WordReveal text="Our Leadership Team" tag="h2" className="text-4xl font-light text-charcoal mb-16" />
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <motion.div key={member.id} variants={staggerItemVariants} className="text-center group">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <h3 className="font-medium text-charcoal">{member.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{member.title}</p>
                <p className="text-xs text-lime mt-1">{member.department}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </>
  );
}
