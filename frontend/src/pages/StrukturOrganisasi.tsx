import { motion } from 'framer-motion';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';

const pengurus = [
  {
    category: 'Pembina',
    members: [
      { name: 'Dr. H. Budi Santoso, M.M.', title: 'Ketua Pembina', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80' },
      { name: 'Ir. Siti Rahmawati, M.T.', title: 'Anggota Pembina', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
    ],
  },
  {
    category: 'Pengawas',
    members: [
      { name: 'Prof. Dr. Ahmad Fauzi', title: 'Ketua Pengawas', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
      { name: 'Dra. Rina Pertiwi, M.Pd.', title: 'Anggota Pengawas', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
    ],
  },
  {
    category: 'Pengurus',
    members: [
      { name: 'H. Darmawan Susilo, S.E.', title: 'Ketua Umum', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
      { name: 'Dewi Puspitasari, M.Pd.', title: 'Sekretaris Umum', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80' },
      { name: 'Ir. Hendra Gunawan, M.M.', title: 'Bendahara Umum', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
      { name: 'Dr. Lestari Wahyuni, M.Pd.', title: 'Bidang Pendidikan', photo: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80' },
    ],
  },
];

export default function StrukturOrganisasi() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-lime text-sm tracking-widest uppercase mb-4">Profil Yayasan</p>
          <WordReveal text="Struktur Organisasi" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 mt-4 max-w-2xl mx-auto"
          >
            Susunan pengurus Yayasan Pendidikan Metland yang berdedikasi membangun pendidikan berkualitas.
          </motion.p>
        </div>
      </section>

      {/* Org Chart Visual */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-0">
              {/* Top Level */}
              <div className="bg-charcoal text-white rounded-2xl px-8 py-4 text-center shadow-lg">
                <p className="text-xs text-lime uppercase tracking-widest mb-1">Yayasan Pendidikan Metland</p>
                <p className="font-semibold text-sm">Rapat Pembina</p>
              </div>
              <div className="w-px h-8 bg-lime" />
              {/* Second Level */}
              <div className="grid grid-cols-2 gap-16 relative w-full max-w-lg">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gray-200 -translate-y-0" style={{top: 0}}></div>
                {['Dewan Pengawas', 'Dewan Pembina'].map((d) => (
                  <div key={d} className="bg-lime/10 border border-lime/30 rounded-xl px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-charcoal">{d}</p>
                  </div>
                ))}
              </div>
              <div className="w-px h-8 bg-lime" />
              {/* Pengurus */}
              <div className="bg-lime text-charcoal rounded-2xl px-8 py-4 text-center shadow-lg">
                <p className="font-semibold text-sm">Pengurus Yayasan</p>
                <p className="text-xs mt-0.5">Ketua Umum · Sekretaris · Bendahara</p>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              {/* Units */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {['Bidang Pendidikan', 'Bidang Keuangan', 'Bidang Humas & Kemitraan'].map((u) => (
                  <div key={u} className="border border-gray-200 rounded-xl px-3 py-3 text-center hover:border-lime/40 transition-colors">
                    <p className="text-xs font-medium text-charcoal">{u}</p>
                  </div>
                ))}
              </div>
              <div className="w-px h-8 bg-gray-300" />
              {/* Schools */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
                {['TK Tunas Metropolitan', 'SD Tunas Metropolitan', 'SMK Pariwisata Metland School', 'SMK Metland', 'Metland College'].map((s) => (
                  <div key={s} className="border border-gray-100 bg-offwhite rounded-xl px-3 py-3 text-center hover:border-lime/30 hover:bg-lime/5 transition-colors">
                    <p className="text-xs text-gray-500 leading-tight">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Team per Category */}
      {pengurus.map((group, gi) => (
        <section key={group.category} className={`py-20 ${gi % 2 === 0 ? 'bg-offwhite' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-8 h-[2px] bg-lime" />
                <h2 className="text-3xl font-light text-charcoal">{group.category}</h2>
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {group.members.map((member) => (
                <motion.div key={member.name} variants={staggerItemVariants} className="text-center group">
                  <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-lime/30 transition-all duration-300">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h3 className="font-medium text-charcoal text-sm">{member.name}</h3>
                  <p className="text-xs text-lime mt-1">{member.title}</p>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>
        </section>
      ))}
    </>
  );
}
