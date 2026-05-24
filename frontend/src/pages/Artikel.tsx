import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, Clock, Calendar, ArrowRight } from 'lucide-react';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import ScrollReveal from '../components/animations/ScrollReveal';
import { usePosts } from '../hooks/usePosts';

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 rounded-2xl mb-4 max-h-20" />
      <div className="h-4 w-20 bg-gray-200 rounded-full mb-3" />
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-100 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />
      <div className="flex gap-2 mt-3">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

/* ─── Article Card ──────────────────────────────────────────── */
function ArticleCard({ post }: { post: any }) {
  return (
    <motion.div variants={staggerItemVariants}>
      <Link to={`/artikel/${post.slug}`} className="group block">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-2xl mb-4 max-h-26">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </div>
        <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-lime bg-lime/10 rounded-full px-3 py-1 mb-3">
          {post.category}
        </span>
        <h3 className="text-base font-semibold leading-snug text-charcoal group-hover:text-lime transition-colors duration-300 mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {post.author.photo && (
            <img src={post.author.photo} alt={post.author.name} className="w-5 h-5 rounded-full object-cover" />
          )}
          <span className="font-medium text-gray-500">{post.author.name}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {post.readingTime && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} mnt
              </span>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function Artikel() {
  const { posts, loading, error } = usePosts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(13);

  // Reset pagination when category or search filters change
  useEffect(() => {
    setVisibleCount(13);
  }, [activeCategory, searchQuery]);

  const categories = useMemo(
    () => ['All', ...new Set(posts.map((p) => p.category))],
    [posts]
  );

  const filtered = useMemo(
    () =>
      posts
        .filter((p) => activeCategory === 'All' || p.category === activeCategory)
        .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [posts, activeCategory, searchQuery]
  );

  const displayed = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const featured = displayed[0];
  const rest = displayed.slice(1);

  return (
    <>
      {/* ═══ Hero ══════════════════════════════════════════════ */}
      <section className="relative h-[52vh] min-h-[360px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img
          src="/src/assets/sekolahsmkmetlandcibitung.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#3aabf0] text-lg font-bold tracking-[3px] uppercase text-lime mb-4"
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

      {/* ═══ Content ═══════════════════════════════════════════ */}
      <section className="bg-offwhite py-16 lg:py-24 min-h-[60vh]">
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

          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12"
          >
            {/* Category pills */}
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

            {/* Search */}
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

          {/* Loading Skeleton */}
          {loading && (
            <div>
              <div className="animate-pulse mb-14">
                <div className="aspect-[21/9] bg-gray-200 rounded-2xl mb-6" />
                <div className="h-4 w-24 bg-gray-200 rounded-full mb-3" />
                <div className="h-8 w-2/3 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}

          {/* Posts */}
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
                {filtered.length === 0 && (
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

                {/* Featured Card */}
                {featured && (
                  <ScrollReveal className="mb-14">
                    <Link to={`/artikel/${featured.slug}`} className="group block">
                      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500">
                        <div className="aspect-[4/3] lg:aspect-[16/10] min-h-[280px] overflow-hidden">
                          <img
                            src={featured.featuredImage}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-8 lg:p-10 flex flex-col justify-center">
                          <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-lime bg-lime/10 rounded-full px-3 py-1 mb-5 self-start">
                            {featured.category}
                          </span>
                          <h2 className="text-2xl lg:text-3xl font-bold text-charcoal leading-tight mb-4 group-hover:text-lime transition-colors duration-300">
                            {featured.title}
                          </h2>
                          <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {featured.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
                            {featured.author.photo && (
                              <img src={featured.author.photo} alt={featured.author.name} className="w-7 h-7 rounded-full object-cover" />
                            )}
                            <span className="font-medium text-gray-500">{featured.author.name}</span>
                            <span>·</span>
                            <span>{new Date(featured.publishedAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            {featured.readingTime && <><span>·</span><span>{featured.readingTime} mnt baca</span></>}
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-lime group-hover:gap-3 transition-all duration-300">
                            Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <>
                    {featured && (
                      <div className="flex items-center gap-4 mb-10">
                        <h2 className="text-lg font-bold text-charcoal shrink-0">Artikel Lainnya</h2>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}
                    <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {rest.map((post) => (
                        <ArticleCard key={post.id} post={post} />
                      ))}
                    </StaggerGrid>
                  </>
                )}

                {/* Only 1 article — no "rest" but featured shown */}
                {featured && rest.length === 0 && filtered.length === 1 && null}

                {/* Load More Button */}
                {filtered.length > displayed.length && (
                  <div className="flex justify-center mt-16">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8 py-3 bg-white text-charcoal hover:bg-lime hover:text-white border border-gray-200 hover:border-lime text-sm font-semibold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Muat Lebih Banyak
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
