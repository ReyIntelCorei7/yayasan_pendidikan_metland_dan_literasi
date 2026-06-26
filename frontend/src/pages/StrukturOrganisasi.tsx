import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import heroImg from '../assets/sekolahsmkmetlandcibitung.webp';

/* ─── Connector Component ─── */
function VerticalLine({ height = 32, color = '#3D8ABF' }: { height?: number; color?: string }) {
  return (
    <div className="flex justify-center">
      <div style={{ width: 2, height, background: color, borderRadius: 1 }} />
    </div>
  );
}

/* ─── Org Chart Node ─── */
function ChartNode({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'default' | 'muted';
  className?: string;
}) {
  const base = 'rounded-xl px-6 py-3.5 text-center transition-all duration-300';
  const variants = {
    primary: 'bg-charcoal text-white shadow-lg shadow-charcoal/10',
    accent: 'bg-[#3D8ABF] text-white shadow-lg shadow-[#3D8ABF]/20',
    default: 'bg-white border border-gray-200 hover:border-[#3D8ABF]/40 hover:shadow-md',
    muted: 'bg-gray-50 border border-gray-100 hover:border-[#3D8ABF]/30 hover:bg-white',
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}

export default function StrukturOrganisasi() {
  const { t } = useTranslation();

  // Retrieve translation objects/arrays
  const orgChartText = t('strukturOrganisasi.org_chart', { returnObjects: true }) as any;
  const teamGroupsText = t('strukturOrganisasi.team_groups', { returnObjects: true }) as any[];
  const teamTitlesText = t('strukturOrganisasi.team_member_titles', { returnObjects: true }) as any;
  const orgChartBidang = orgChartText?.bidang || [];
  const orgChartSecond = orgChartText?.second_level || [];

  /* ─── Team Data ─── */
  const pengurus = [
    {
      category: teamGroupsText[0]?.category || 'Pembina',
      description: teamGroupsText[0]?.description || '',
      members: [
        { name: 'Bapak Ir. Pandu Gunandito', title: teamTitlesText?.ketua_pembina || 'Ketua Pembina', photo: '/src/assets/MS_ketuayayasan.jpg' },
      ],
    },
    {
      category: teamGroupsText[1]?.category || 'Pengawas',
      description: teamGroupsText[1]?.description || '',
      members: [
        { name: 'Prof. Dr. Ahmad Fauzi', title: teamTitlesText?.ketua_pengawas || 'Ketua Pengawas', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
        { name: 'Dra. Rina Pertiwi, M.Pd.', title: teamTitlesText?.anggota_pengawas || 'Anggota Pengawas', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
      ],
    },
    {
      category: teamGroupsText[2]?.category || 'Pengurus',
      description: teamGroupsText[2]?.description || '',
      members: [
        { name: 'H. Darmawan Susilo, S.E.', title: teamTitlesText?.ketua_umum || 'Ketua Umum', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
        { name: 'Dewi Puspitasari, M.Pd.', title: teamTitlesText?.sekretaris_umum || 'Sekretaris Umum', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80' },
        { name: 'Ir. Hendra Gunawan, M.M.', title: teamTitlesText?.bendahara_umum || 'Bendahara Umum', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
        { name: 'Dr. Lestari Wahyuni, M.Pd.', title: teamTitlesText?.bidang_pendidikan || 'Bidang Pendidikan', photo: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80' },
      ],
    },
  ];

  /* ─── Org Chart Data ─── */
  const orgChartData = {
    top: orgChartText?.top || 'Rapat Pembina',
    secondLevel: orgChartSecond.length > 0 ? orgChartSecond : ['Dewan Pengawas', 'Dewan Pembina'],
    pengurus: { 
      title: orgChartText?.pengurus_title || 'Pengurus Yayasan', 
      subtitle: orgChartText?.pengurus_subtitle || 'Ketua Umum · Sekretaris · Bendahara' 
    },
    bidang: orgChartBidang.length > 0 ? orgChartBidang : ['Bidang Pendidikan', 'Bidang Keuangan', 'Bidang Humas & Kemitraan'],
    units: ['TK Tunas Metropolitan', 'SD Tunas Metropolitan', 'SMK Pariwisata Metland School', 'SMK Metland', 'Metland College'],
  };

  return (
    <>
      {/* ════════════ HERO ════════════ */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-charcoal/80 z-10" />
        <img
          src={heroImg}
          alt="Sekolah SMK Metland Cibitung"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative z-20 text-center px-6 mt-16">
          <WordReveal
            text={t('strukturOrganisasi.hero_tag')}
            tag="h1"
            className="text-4xl lg:text-5xl font-light text-white mb-4"
          />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-gray-300 mt-2 max-w-2xl mx-auto">
            {t('strukturOrganisasi.hero_description')}
          </motion.p>
        </div>
      </section>

      {/* ════════════ ORG CHART ════════════ */}
      <section className="bg-[#FCFCFC] py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-12 h-[3px] bg-[#3D8ABF] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">{t('strukturOrganisasi.org_chart_title')}</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                {t('strukturOrganisasi.org_chart_desc')}
              </p>
            </div>
          </ScrollReveal>

          {/* Org Chart */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-col items-center">
              {/* Level 1 — Rapat Pembina */}
              <ChartNode variant="default">
                <p className="text-[10px] text-[#3D8ABF] uppercase tracking-[0.15em] mb-0.5 font-medium">
                  {orgChartText?.foundation_label || 'Yayasan Pendidikan Metland'}
                </p>
                <p className="font-semibold text-sm">{orgChartData.top}</p>
              </ChartNode>

              <VerticalLine />

              {/* Level 2 — Dewan Pengawas & Pembina */}
              <div className="relative w-full max-w-md">
                {/* Horizontal connector */}
                <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-[#3D8ABF]/20" />
                <div className="grid grid-cols-2 gap-6">
                  {orgChartData.secondLevel.map((d: string) => (
                    <div key={d} className="relative">
                      <div className="flex justify-center">
                        <div style={{ width: 2, height: 16, background: 'rgba(61,138,191,0.2)' }} />
                      </div>
                      <ChartNode variant="default">
                        <p className="text-xs font-semibold text-charcoal">{d}</p>
                      </ChartNode>
                    </div>
                  ))}
                </div>
              </div>

              <VerticalLine />

              {/* Level 3 — Pengurus Yayasan */}
              <ChartNode variant="default">
                <p className="font-semibold text-sm">{orgChartData.pengurus.title}</p>
                <p className="text-[11px] mt-0.5 text-black">{orgChartData.pengurus.subtitle}</p>
              </ChartNode>

              <VerticalLine color="rgba(61,138,191,0.25)" />

              {/* Level 4 — Bidang */}
              <div className="relative w-full max-w-2xl">
                <div className="absolute top-0 left-[16.67%] right-[16.67%] h-[2px] bg-gray-200" />
                <div className="grid grid-cols-3 gap-4">
                  {orgChartData.bidang.map((u: string) => (
                    <div key={u} className="relative">
                      <div className="flex justify-center">
                        <div style={{ width: 2, height: 16, background: '#e5e7eb' }} />
                      </div>
                      <ChartNode variant="default">
                        <p className="text-xs font-medium text-charcoal">{u}</p>
                      </ChartNode>
                    </div>
                  ))}
                </div>
              </div>

              <VerticalLine height={28} color="#e5e7eb" />

              {/* Level 5 — Unit Sekolah */}
              <div className="relative w-full">
                <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gray-100" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {orgChartData.units.map((s: string) => (
                    <div key={s} className="relative">
                      <div className="flex justify-center">
                        <div style={{ width: 2, height: 12, background: '#f3f4f6' }} />
                      </div>
                      <ChartNode variant="muted">
                        <p className="text-[11px] text-gray-500 leading-tight">{s}</p>
                      </ChartNode>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════ TEAM SECTIONS ════════════ */}
      <section className="bg-offwhite py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="w-12 h-[3px] bg-[#3D8ABF] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">{t('strukturOrganisasi.team_title')}</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                {t('strukturOrganisasi.team_desc')}
              </p>
            </div>
          </ScrollReveal>

          {/* Team Groups */}
          <div className="space-y-20">
            {pengurus.map((group, gi) => (
              <ScrollReveal key={group.category} delay={gi * 0.1}>
                <div>
                  {/* Group Label */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-5xl font-extralight text-[#3D8ABF]/15 leading-none select-none">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium text-charcoal">{group.category}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{group.description}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 mb-8" />

                  {/* Members Grid */}
                  <div className={`grid gap-6 ${group.members.length <= 2 ? 'sm:grid-cols-2 max-w-2xl' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                    {group.members.map((member, mi) => (
                      <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: mi * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="group"
                      >
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#3D8ABF]/25 hover:shadow-lg hover:shadow-[#3D8ABF]/5 transition-all duration-500">
                          {/* Photo */}
                          <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#3D8ABF]/30 transition-all duration-500">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          </div>
                          {/* Info */}
                          <div className="text-center">
                            <h4 className="font-medium text-charcoal text-sm leading-snug">{member.name}</h4>
                            <p className="text-[11px] text-[#3D8ABF] mt-1.5 font-medium tracking-wide uppercase">{member.title}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ MEMBERS LIST ════════════ */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-12 h-[3px] bg-[#228bcb] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">{t('strukturOrganisasi.members_title')}</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                {t('strukturOrganisasi.members_desc')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
