import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import WordReveal from '../components/animations/WordReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import heroImg from '../assets/sekolahsmkmetlandcibitung.webp';
import { useOrgChart, type OrgChartNode, type OrgChartMember } from '../hooks/useOrgChart';
import { usePageContent } from '../hooks/usePageContent';
import { useTeam } from '../hooks/useTeam';

/* ─── Connector Components ─── */
function VerticalLine({ height = 32, color = '#3D8ABF' }: { height?: number; color?: string }) {
  return (
    <div className="flex justify-center">
      <div style={{ width: 2, height, background: color, borderRadius: 1 }} />
    </div>
  );
}

/* ─── Mini Member Badge (name only) ─── */
function MemberBadge({ member }: { member: OrgChartMember }) {
  return (
    <div className="flex justify-center items-center gap-1 mt-1 px-1.5 py-1 rounded-md bg-gray-50/80 border border-gray-100 text-center">
        <p className="text-[10px] sm:text-xs font-medium text-charcoal leading-tight text-center break-words">{member.name}</p>
    </div>
  );
}

/* ─── Org Chart Node Box ─── */
function ChartNode({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'default' | 'muted';
  className?: string;
}) {
  const base = 'rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-center transition-all duration-300';
  const variants = {
    primary: 'bg-charcoal text-white shadow-sm shadow-charcoal/10',
    accent: 'bg-[#3D8ABF] text-white shadow-sm shadow-[#3D8ABF]/20',
    default: 'bg-white border border-gray-200 hover:border-[#3D8ABF]/40 hover:shadow-sm',
    muted: 'bg-gray-50 border border-gray-100 hover:border-[#3D8ABF]/30 hover:bg-white',
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}

/* ─── Helper: build tree from flat array ─── */
function buildTree(nodes: OrgChartNode[]): OrgChartNode & { children_nodes: (OrgChartNode & { children_nodes: any[] })[] } | null {
  const map = new Map<string, OrgChartNode & { children_nodes: any[] }>();
  nodes.forEach(n => map.set(n.id, { ...n, children_nodes: [] }));

  let root: (OrgChartNode & { children_nodes: any[] }) | null = null;

  nodes.forEach(n => {
    const node = map.get(n.id)!;
    if (n.parent_id && map.has(n.parent_id)) {
      map.get(n.parent_id)!.children_nodes.push(node);
    } else if (!n.parent_id) {
      root = node;
    }
  });

  // Sort children by order
  map.forEach(node => {
    node.children_nodes.sort((a: any, b: any) => a.order - b.order);
  });

  return root;
}

function TreeNode({ node, isFirst, isLast, hasSiblings }: { node: any, isFirst?: boolean, isLast?: boolean, hasSiblings?: boolean }) {
  return (
    <div className="flex flex-col items-center relative px-[2px] sm:px-1">
      {/* Top vertical connector from horizontal line to this node */}
      {hasSiblings && (
        <div className="absolute top-0 left-1/2 w-[2px] h-3 bg-[#3D8ABF]/30 -translate-x-1/2" />
      )}
      
      {/* Horizontal lines */}
      {hasSiblings && (
        <>
          {!isFirst && <div className="absolute top-0 right-1/2 w-1/2 h-[2px] bg-[#3D8ABF]/30" />}
          {!isLast && <div className="absolute top-0 left-1/2 w-1/2 h-[2px] bg-[#3D8ABF]/30" />}
        </>
      )}

      {/* The node card itself */}
      <div className={`z-10 ${hasSiblings ? 'mt-3' : 'mt-0'}`}>
        <ChartNode variant={node.level === 1 ? 'primary' : node.level >= 5 ? 'muted' : 'default'} className={node.level >= 5 ? "w-32 sm:w-44" : "w-40 sm:w-56"}>
           {node.level === 1 && (
             <p className="text-[9px] sm:text-[10px] text-[#8AC1E5] uppercase tracking-[0.15em] mb-1 font-medium">
                Yayasan Metland
             </p>
           )}
           <p className={`${node.level === 1 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-semibold ${node.level === 1 ? 'text-white' : 'text-charcoal'} leading-[1.2]`}>{node.label}</p>
           {node.subtitle && <p className={`text-[9px] sm:text-[10px] mt-1 leading-[1.2] ${node.level === 1 ? 'text-gray-300' : 'text-gray-500'}`}>{node.subtitle}</p>}
           {node.members?.length > 0 && (
             <div className="mt-2 space-y-1">
               {node.members.map((m: any) => <MemberBadge key={m.id} member={m} />)}
             </div>
           )}
        </ChartNode>
      </div>

      {/* Children */}
      {node.children_nodes?.length > 0 && (
        <>
          {/* Vertical line going down from this node */}
          <div className="w-[2px] h-3 bg-[#3D8ABF]/30" />
          
          <div className="flex flex-row justify-center items-start w-full">
            {node.children_nodes.map((child: any, idx: number) => (
              <TreeNode 
                key={child.id} 
                node={child} 
                isFirst={idx === 0} 
                isLast={idx === node.children_nodes.length - 1} 
                hasSiblings={node.children_nodes.length > 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function StrukturOrganisasi() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data: orgNodes } = useOrgChart();
  const { getContent } = usePageContent('struktur-organisasi', lang);
  const { data: teamMembers } = useTeam();

  // Build tree from flat data
  const tree = buildTree(orgNodes);
  const l2Nodes = tree ? tree.children_nodes.filter(n => n.level === 2) : [];
  const l3Node = tree ? tree.children_nodes.find(n => n.level === 3) : null;

  // Group Team Members for the team section (those NOT assigned to org chart)
  const pengurusGroups = teamMembers.reduce((acc, member) => {
    const group = member.group || 'Lainnya';
    if (!acc[group]) acc[group] = [];
    acc[group].push(member);
    return acc;
  }, {} as Record<string, typeof teamMembers>);

  const groupOrder = ['Pembina', 'Pengawas', 'Pengurus', 'Lainnya'];
  const teamGroups = groupOrder
    .map(g => ({ category: g, members: pengurusGroups[g] || [] }))
    .filter(g => g.members.length > 0);

  const heroTitle = getContent('hero_title') || 'Struktur Organisasi Yayasan';
  const heroSubtitle = getContent('hero_subtitle') || 'Bersama mewujudkan pendidikan berkualitas melalui tata kelola yang profesional, transparan, dan akuntabel.';
  const chartTitle = getContent('chart_title') || 'Bagan Struktur Yayasan';
  const teamTitle = getContent('team_title') || 'Tim Pengurus';

  return (
    <>
      {/* ════════════ HERO ════════════ */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src={heroImg}
          alt="Sekolah SMK Metland Cibitung"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
        <div className="relative z-10 text-center px-6 mt-4">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-lg font-bold tracking-[3px] uppercase block"
          >
            Profil
          </motion.span>
          <WordReveal
            text={heroTitle}
            tag="h1"
            className="text-4xl lg:text-5xl font-light text-white"
          />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-gray-300 max-w-2xl mx-auto">
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* ════════════ TEAM SECTIONS ════════════ */}
      <section className="bg-offwhite py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="w-12 h-[3px] bg-[#3D8ABF] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">{teamTitle}</h2>
            </div>
          </ScrollReveal>

          {/* Team Groups */}
          <div className="space-y-20">
            {teamGroups.map((group, gi) => (
              <ScrollReveal key={group.category} delay={gi * 0.1}>
                <div>
                  {/* Group Label */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-5xl font-extralight text-[#3D8ABF]/15 leading-none select-none">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium text-charcoal">{group.category}</h3>
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
                              src={member.photo || 'https://via.placeholder.com/150'}
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

      {/* ════════════ ORG CHART ════════════ */}
      <section className="bg-[#FCFCFC] py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-12 h-[3px] bg-[#3D8ABF] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light text-charcoal mb-3">{chartTitle}</h2>
            </div>
          </ScrollReveal>

          {/* Org Chart - Custom Layout for Root -> L2/L3 -> Recursive */}
          <ScrollReveal delay={0.15}>
            {tree ? (
              <div className="w-full overflow-x-auto pb-12 pt-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="min-w-max flex justify-center px-12">
                  <div className="flex flex-col items-center">
                    {/* LEVEL 1: ROOT */}
                    <div className="z-10">
                      <ChartNode variant="primary" className="w-36 sm:w-48">
                         <p className="text-[9px] sm:text-[10px] text-[#8AC1E5] uppercase tracking-[0.15em] mb-1 font-medium">Yayasan Metland</p>
                         <p className="text-sm sm:text-base font-semibold text-white leading-[1.2]">{tree.label}</p>
                         {tree.subtitle && <p className="text-[9px] sm:text-[10px] mt-1 leading-[1.2] text-gray-300">{tree.subtitle}</p>}
                         {tree.members?.length > 0 && (
                           <div className="mt-2 space-y-1">
                             {tree.members.map((m: any) => <MemberBadge key={m.id} member={m} />)}
                           </div>
                         )}
                      </ChartNode>
                    </div>

                    {/* Main vertical line from Root (Top Half) */}
                    <div className="w-[2px] h-5 bg-[#3D8ABF]/30" />

                    {/* Level 2 Nodes Container */}
                    <div className="relative w-full flex justify-center z-0">
                      {/* L2 Nodes wrappers with integrated line */}
                      {l2Nodes.length > 0 && (
                        <div className="absolute top-0 w-[700px] lg:w-[850px] flex justify-between -translate-x-1/2 left-1/2">
                          
                          {/* Absolute connecting line perfectly spanning the centers of the two nodes */}
                          <div className="absolute top-0 left-[90px] right-[90px] h-[2px] bg-[#3D8ABF]/30 z-0" />

                          {l2Nodes.map((d: any) => (
                            <div key={d.id} className="flex flex-col items-center w-[180px] z-10">
                              <div className="w-[2px] h-4 bg-[#3D8ABF]/30" />
                              <TreeNode node={d} hasSiblings={false} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Main vertical line from Root (Bottom Half) */}
                    <div className="w-[2px] h-6 bg-[#3D8ABF]/30" />

                    {/* Level 3 Node (Pengurus Yayasan) */}
                    {l3Node && (
                      <div className="z-10">
                        <TreeNode node={l3Node} hasSiblings={false} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">Memuat bagan organisasi...</div>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
