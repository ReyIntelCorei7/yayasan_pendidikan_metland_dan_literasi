import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import ScrollReveal from '../components/animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import { usePosts } from '../hooks/usePosts';

/* ─── Helpers ────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}
function fmtDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

/* ─── Author Badge ───────────────────────────────────────────── */
function AuthorBadge({ post, light = false }: { post: any; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${light ? 'text-white/80' : 'text-gray-400'}`}>
      {post.author?.photo
        ? <img src={post.author.photo} alt={post.author.name} className="w-5 h-5 rounded-full object-cover" />
        : <User className="w-4 h-4" />}
      <span className={`font-semibold uppercase tracking-wide ${light ? 'text-white' : 'text-gray-600'}`}>
        {post.author?.name}
      </span>
      <span>·</span>
      <span>{fmtDate(post.publishedAt)}</span>
      {post.readingTime && <><span>·</span><Clock className="w-3 h-3" /><span>{post.readingTime} mnt</span></>}
    </div>
  );
}

/* ─── Category Badge ──────────────────────────────────────────── */
function CatBadge({ cat, light = false }: { cat: string; light?: boolean }) {
  return (
    <span className={`inline-block text-[10px] font-bold tracking-[2px] uppercase px-2 py-0.5 rounded mb-2
      ${light ? 'bg-lime text-white' : 'bg-lime/10 text-lime'}`}>
      {cat}
    </span>
  );
}

/* ─── HERO Card (full-width, overlay text) ───────────────────── */
function HeroCard({ post }: { post: any }) {
  return (
    <Link to={`/artikel/${post.slug}`} className="group relative block w-full overflow-hidden rounded-xl">
      <div className="aspect-[21/9] min-h-[320px] overflow-hidden bg-gray-200">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-xl" />
      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <AuthorBadge post={post} light />
        <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2 group-hover:text-lime transition-colors duration-300">
          {post.title}
        </h2>
      </div>
    </Link>
  );
}

/* ─── SUB-HERO Card (medium, overlay text) ───────────────────── */
function SubHeroCard({ post }: { post: any }) {
  return (
    <Link to={`/artikel/${post.slug}`} className="group relative block overflow-hidden rounded-xl flex-1">
      <div className="aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <AuthorBadge post={post} light />
        <h3 className="mt-1.5 text-base md:text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-lime transition-colors duration-300">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

/* ─── EDITOR'S PICK — large left card ───────────────────────── */
function RecommendedCard({ post }: { post: any }) {
  return (
    <Link to={`/artikel/${post.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-200 mb-4">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>
      <CatBadge cat={post.category} />
      <h3 className="text-xl font-bold text-charcoal leading-snug mb-2 group-hover:text-lime transition-colors duration-300 line-clamp-2">
        {post.title}
      </h3>
      <AuthorBadge post={post} />
      <p className="text-sm text-gray-400 leading-relaxed mt-3 line-clamp-3">{post.excerpt}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[1.5px] text-lime mt-4 group-hover:gap-2.5 transition-all duration-300">
        Read More <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

/* ─── MIDDLE LIST — horizontal mini card ────────────────────── */
function ListCard({ post, index }: { post: any; index: number }) {
  return (
    <motion.div variants={staggerItemVariants}>
      <Link to={`/artikel/${post.slug}`} className="group flex gap-4 items-start">
        {/* Number */}
        <span className="text-4xl font-black text-gray-100 leading-none select-none w-8 shrink-0 mt-1">
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* Thumbnail */}
        <div className="w-20 h-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <CatBadge cat={post.category} />
          <h4 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-lime transition-colors duration-300 mb-1">
            {post.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{fmtDate(post.publishedAt)}</span>
            {post.readingTime && <><span>·</span><Clock className="w-3 h-3" /><span>{post.readingTime} mnt</span></>}
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── SPOTLIGHT sidebar card ─────────────────────────────────── */
function SpotlightCard({ post }: { post: any }) {
  return (
    <Link to={`/artikel/${post.slug}`} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-200 mb-2">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
        <User className="w-3 h-3" />
        <span className="font-semibold uppercase text-gray-500">{post.author?.name}</span>
        <span>·</span>
        <Calendar className="w-3 h-3" />
        <span>{fmtDate(post.publishedAt)}</span>
      </div>
      <h4 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 group-hover:text-lime transition-colors duration-300">
        {post.title}
      </h4>
    </Link>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
function SkeletonHero() {
  return (
    <div className="animate-pulse mb-6">
      <div className="aspect-[21/9] bg-gray-200 rounded-xl mb-4" />
      <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/3 bg-gray-100 rounded" />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function Artikel() {
  const { 
    posts, loading, loadingMore, error,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    hasMore, loadMore 
  } = usePosts();

  // Use a static list of categories for filter bar because server pagination might hide some categories
  const categories = ['All', 'Berita', 'Artikel', 'Event', 'Pengumuman', 'Prestasi'];

  const displayed = posts;

  // Layout slots
  const hero        = displayed[0];        // 1 hero
  const subHeroes   = displayed.slice(1, 3); // 2 sub-hero
  const Recommended  = displayed[3];        // editor's pick large left
  const listCards   = displayed.slice(4, 7); // 3 middle list cards
  const spotlights  = displayed.slice(7, 10); // 3 sidebar spotlight
  const rest        = displayed.slice(10);   // remaining grid

  return (
    <>
      {/* ═══ Page Hero ══════════════════════════════════════════ */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="/src/assets/sekolahsmkmetlandcibitung.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lime text-lg font-bold tracking-[3px] uppercase mb-4 block"
          >
            Berita &amp; Informasi
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed"
          >
            Berita, cerita, dan informasi terkini dari Yayasan Pendidikan Metland.
          </motion.p>
        </div>
      </section>

      {/* ═══ Content ════════════════════════════════════════════ */}
      <section className="bg-offwhite py-12 lg:py-16 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Error Banner */}
          <AnimatePresence>
            {error && posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-8 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Filter Bar ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
          >
            <div className="flex gap-2 flex-wrap">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
                  ))
                : categories.map((cat) => (
                    <motion.button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        activeCategory === cat
                          ? 'bg-lime text-white shadow-md shadow-lime/20'
                          : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-lime/50 focus:ring-2 focus:ring-lime/10 w-full md:w-64 transition-all duration-200"
              />
            </div>
          </motion.div>

          {/* ── Skeleton ──────────────────────────────────────── */}
          {loading && (
            <div>
              <SkeletonHero />
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse aspect-[4/3] bg-gray-200 rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {/* ── Posts ─────────────────────────────────────────── */}
          {!loading && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Empty State */}
                {displayed.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-24"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Tidak ada artikel ditemukan</h3>
                    <p className="text-gray-400 text-sm">Coba ubah kata kunci atau pilih kategori lain.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                      className="mt-6 inline-flex items-center gap-2 text-sm text-lime font-medium hover:underline"
                    >
                      Reset filter
                    </button>
                  </motion.div>
                )}

                {/* ══ ZONE 1: HERO ════════════════════════════ */}
                {hero && (
                  <ScrollReveal className="mb-4">
                    <HeroCard post={hero} />
                  </ScrollReveal>
                )}

                {/* ══ ZONE 2: SUB-HERO ROW (2 cards) ═════════ */}
                {subHeroes.length > 0 && (
                  <ScrollReveal className="mb-12">
                    <div className="flex gap-4">
                      {subHeroes.map((post) => (
                        <SubHeroCard key={post.id} post={post} />
                      ))}
                    </div>
                  </ScrollReveal>
                )}

   
                {(Recommended || listCards.length > 0 || spotlights.length > 0) && (
                  <ScrollReveal className="mb-16">
                    {/* Section label */}
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-[10px] font-bold tracking-[3px] uppercase text-gray-400">
                        Jelajahi Beberapa Artikel Favorit Kami
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="grid lg:grid-cols-[2fr_2fr_1fr] gap-8">
                      <div>
                        {Recommended && (
                          <>
                            <h2 className="text-3xl font-black text-charcoal mb-6 leading-tight">
                              Editor's <span className="text-lime">Picks</span>
                            </h2>
                            <RecommendedCard post={Recommended} />
                          </>
                        )}
                      </div>

                      {/* MIDDLE — 3 list cards */}
                      <div className="flex flex-col gap-6 divide-y divide-gray-100">
                        {listCards.map((post, i) => (
                          <div key={post.id} className={i > 0 ? 'pt-6' : ''}>
                            <ListCard post={post} index={i} />
                          </div>
                        ))}
                      </div>

                      {/* RIGHT — spotlight sidebar */}
                      <div>
                        <h3 className="text-xs font-black tracking-[3px] uppercase text-charcoal border-b-2 border-lime pb-2 mb-5">
                          Spotlight
                        </h3>
                        <div className="flex flex-col gap-6">
                          {spotlights.map((post) => (
                            <SpotlightCard key={post.id} post={post} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* ══ ZONE 4: REMAINING GRID ══════════════════ */}
                {rest.length > 0 && (
                  <ScrollReveal>
                    <div className="flex items-center gap-4 mb-10">
                      <h2 className="text-lg font-bold text-charcoal shrink-0">Artikel Lainnya</h2>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {rest.map((post) => (
                        <motion.div key={post.id} variants={staggerItemVariants}>
                          <Link to={`/artikel/${post.slug}`} className="group block">
                            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-gray-200 mb-3">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                loading="lazy"
                              />
                            </div>
                            <CatBadge cat={post.category} />
                            <h3 className="text-base font-semibold text-charcoal leading-snug group-hover:text-lime transition-colors duration-300 mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>
                            <AuthorBadge post={post} />
                          </Link>
                        </motion.div>
                      ))}
                    </StaggerGrid>
                  </ScrollReveal>
                )}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center mt-16">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-white text-charcoal hover:bg-lime hover:text-white border border-gray-200 hover:border-lime text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak'}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
