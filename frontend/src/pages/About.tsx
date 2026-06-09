import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import { team } from '../data/team';

export default function About() {
  const { t, i18n } = useTranslation();
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
          <WordReveal text={t('about.hero_title')} tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-300 mt-1 max-w-2xl mx-auto">
            {t('about.hero_subtitle')}
          </motion.p>
        </div>
      </section>


      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          <ScrollReveal direction="left">
            <h2 className="text-3xl font-light mb-6">{t('about.mission_title')}</h2>
            <p className="text-gray-500 leading-relaxed">
              {t('about.mission_desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-light mb-6">{t('about.vision_title')}</h2>
            <p className="text-gray-500 leading-relaxed">
              {t('about.vision_desc')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-offwhite py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <WordReveal text={t('about.journey_title')} tag="h2" className="text-4xl font-light text-charcoal mb-16 justify-center text-center" />
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            {(t('about.journey', { returnObjects: true }) as Array<{ year: string, text: string }>).map((item, i) => (
              <ScrollReveal key={i} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                <div className={`flex items-center mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <span className="text-primary font-medium text-lg">{item.year}</span>
                    <p className="text-gray-500 text-sm mt-1">{item.text}</p>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-offwhite relative z-10 shrink-0" />
                  <div className="w-1/2" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#FCFCFC] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <WordReveal text={t('about.team_title')} tag="h2" className="text-4xl font-light text-charcoal mb-16" />
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <motion.div key={member.id} variants={staggerItemVariants} className="text-center group">
                <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <h3 className="font-medium text-charcoal">{member.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{typeof member.title === 'string' ? member.title : member.title[i18n.language === 'en' ? 'en' : 'id']}</p>
                <p className="text-xs text-primary mt-1">{typeof member.department === 'string' ? member.department : member.department[i18n.language === 'en' ? 'en' : 'id']}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </>
  );
}
