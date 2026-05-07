import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';

/* ─── Team Data ─── */
const pengurus = [
  {
    category: 'Pembina',
    description: 'Memberikan arahan strategis dan pengawasan terhadap pengelolaan yayasan.',
    members: [
      { name: 'Dr. H. Budi Santoso, M.M.', title: 'Ketua Pembina', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
      { name: 'Ir. Siti Rahmawati, M.T.', title: 'Anggota Pembina', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
    ],
  },
  {
    category: 'Pengawas',
    description: 'Mengawasi pelaksanaan tugas pengurus sesuai visi dan misi yayasan.',
    members: [
      { name: 'Prof. Dr. Ahmad Fauzi', title: 'Ketua Pengawas', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { name: 'Dra. Rina Pertiwi, M.Pd.', title: 'Anggota Pengawas', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
    ],
  },
  {
    category: 'Pengurus',
    description: 'Menjalankan operasional harian dan mewujudkan program kerja yayasan.',
    members: [
      { name: 'H. Darmawan Susilo, S.E.', title: 'Ketua Umum', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
      { name: 'Dewi Puspitasari, M.Pd.', title: 'Sekretaris Umum', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80' },
      { name: 'Ir. Hendra Gunawan, M.M.', title: 'Bendahara Umum', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
      { name: 'Dr. Lestari Wahyuni, M.Pd.', title: 'Bidang Pendidikan', photo: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80' },
    ],
  },
];

/* ─── Org Chart Data ─── */
const orgChartData = {
  top: 'Rapat Pembina',
  secondLevel: ['Dewan Pengawas', 'Dewan Pembina'],
  pengurus: { title: 'Pengurus Yayasan', subtitle: 'Ketua Umum · Sekretaris · Bendahara' },
  bidang: ['Bidang Pendidikan', 'Bidang Keuangan', 'Bidang Humas & Kemitraan'],
  units: ['TK Tunas Metropolitan', 'SD Tunas Metropolitan', 'SMK Pariwisata Metland School', 'SMK Metland', 'Metland College'],
};

/* ─── Connector Component ─── */
function VerticalLine({ height = 32, color = '#228bcb' }: { height?: number; color?: string }) {
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
    accent: 'bg-[#228bcb] text-white shadow-lg shadow-[#228bcb]/20',
    default: 'bg-white border border-gray-200 hover:border-[#228bcb]/40 hover:shadow-md',
    muted: 'bg-gray-50 border border-gray-100 hover:border-[#228bcb]/30 hover:bg-white',
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}

export default function StrukturOrganisasi() {
  return (
    <>
      {/* ════════════ HERO ════════════ */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="/src/assets/sekolahsmkmetlandcibitung.jpg"
          alt="Sekolah SMK Metland Cibitung"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
        <div className="relative z-10 text-center px-6">
          <p className="text-[#228bcb] text-sm tracking-widest uppercase mb-4">Profil Yayasan</p>
          <WordReveal text="Struktur Organisasi" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Susunan pengurus Yayasan Pendidikan Metland yang berdedikasi membangun pendidikan berkualitas.
          </motion.p>
        </div>
      </section>

      {/* ════════════ ORG CHART ════════════ */}
      <section className="bg-[#FCFCFC] py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-12 h-[3px] bg-[#228bcb] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">Bagan Organisasi</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                Struktur tata kelola yang transparan dan akuntabel untuk memastikan pengelolaan pendidikan yang profesional.
              </p>
            </div>
          </ScrollReveal>

          {/* Org Chart */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-col items-center">
              {/* Level 1 — Rapat Pembina */}
              <ChartNode variant="white">
                <p className="text-[10px] text-[#228bcb] uppercase tracking-[0.15em] mb-0.5 font-medium">Yayasan Pendidikan Metland</p>
                <p className="font-semibold text-sm">{orgChartData.top}</p>
              </ChartNode>

              <VerticalLine />

              {/* Level 2 — Dewan Pengawas & Pembina */}
              <div className="relative w-full max-w-md">
                {/* Horizontal connector */}
                <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-[#228bcb]/20" />
                <div className="grid grid-cols-2 gap-6">
                  {orgChartData.secondLevel.map((d) => (
                    <div key={d} className="relative">
                      <div className="flex justify-center">
                        <div style={{ width: 2, height: 16, background: 'rgba(34,139,203,0.2)' }} />
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
              <ChartNode variant="white">
                <p className="font-semibold text-sm">{orgChartData.pengurus.title}</p>
                <p className="text-[11px] mt-0.5 text-black">{orgChartData.pengurus.subtitle}</p>
              </ChartNode>

              <VerticalLine color="rgba(34,139,203,0.25)" />

              {/* Level 4 — Bidang */}
              <div className="relative w-full max-w-2xl">
                <div className="absolute top-0 left-[16.67%] right-[16.67%] h-[2px] bg-gray-200" />
                <div className="grid grid-cols-3 gap-4">
                  {orgChartData.bidang.map((u) => (
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
                  {orgChartData.units.map((s) => (
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
              <div className="w-12 h-[3px] bg-[#228bcb] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">Tim Pengurus</h2>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                Para profesional yang berdedikasi tinggi dalam memajukan pendidikan berkualitas.
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
                    <span className="text-5xl font-extralight text-[#228bcb]/15 leading-none select-none">
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
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#228bcb]/25 hover:shadow-lg hover:shadow-[#228bcb]/5 transition-all duration-500">
                          {/* Photo */}
                          <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-[#228bcb]/30 transition-all duration-500">
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
                            <p className="text-[11px] text-[#228bcb] mt-1.5 font-medium tracking-wide uppercase">{member.title}</p>
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

      {/* ════════════ CTA / CLOSING ════════════ */}
      <section className="bg-charcoal py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="w-10 h-10 mx-auto mb-6 rounded-full border border-[#228bcb]/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#228bcb]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM6.75 9.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
              Bersama Membangun Pendidikan
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Seluruh jajaran pengurus berkomitmen penuh untuk menghadirkan pendidikan berkualitas yang membentuk generasi unggul dan berkarakter.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
