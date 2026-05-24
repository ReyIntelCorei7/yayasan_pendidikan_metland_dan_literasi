import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import { usePosts } from '../../hooks/usePosts';

/* ─── Seamless slide variants ───────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
  }),
  center: {
    x: '0%',
    position: 'relative' as const,
    top: 'auto',
    left: 'auto',
    width: '100%',
    transition: { x: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    transition: { x: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } },
  }),
};

/* ─── Staggered card entrance ───────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* ─── Progress bar ──────────────────────────────────────────── */
function ProgressBar({ active, onClick, isPlaying, duration }: {
  active: boolean; onClick: () => void; isPlaying: boolean; duration: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative h-1 flex-1 rounded-full overflow-hidden bg-gray-200 cursor-pointer transition-all duration-300 hover:h-1.5"
      aria-label="Go to slide"
    >
      {active && (
        <motion.div
          className="absolute inset-y-0 left-0 bg-[#228bcb] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={isPlaying ? { duration, ease: 'linear' } : { duration: 0.3 }}
          key={isPlaying ? 'playing' : 'static'}
        />
      )}
      {!active && (
        <div className="absolute inset-0 bg-gray-300/0 group-hover:bg-gray-300 rounded-full transition-colors duration-200" />
      )}
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function NewsInsights() {
  const { posts } = usePosts();
  const displayPosts = useMemo(() => posts.slice(0, 6), [posts]);

  const pages = useMemo(() => {
    const chunks: typeof displayPosts[] = [];
    for (let i = 0; i < displayPosts.length; i += 3) {
      chunks.push(displayPosts.slice(i, i + 3));
    }
    return chunks;
  }, [displayPosts]);

  const [[currentPage, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const AUTOPLAY_MS = 5000;

  const paginate = useCallback(
    (dir: number) => {
      setPage(([prev]) => [(prev + dir + pages.length) % pages.length, dir]);
    },
    [pages.length],
  );

  const goToPage = useCallback(
    (idx: number) => setPage(([prev]) => [idx, idx > prev ? 1 : -1]),
    [],
  );

  // Autoplay
  useEffect(() => {
    if (isPlaying && !isHovered && pages.length > 1) {
      intervalRef.current = setInterval(() => paginate(1), AUTOPLAY_MS);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, isHovered, paginate, pages.length]);

  // Drag
  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (info.offset.x < -50 || info.velocity.x < -300) paginate(1);
      else if (info.offset.x > 50 || info.velocity.x > 300) paginate(-1);
    },
    [paginate],
  );

  if (pages.length === 0) return null;

  return (
    <section className="bg-[#FCFCFC] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <ScrollReveal>
              <div className='flex items-center gap-3'>
                <div className="w-2 h-2 bg-[#228bcb] animate-pulse mb-4" />
                <p className="text-m text-[#228bcb] uppercase tracking-[0.2em] mb-4">Artikel</p>
              </div>
            </ScrollReveal>
            <WordReveal
              text="News & Insights"
              tag="h2"
              className="text-4xl lg:text-5xl font-light text-charcoal"
            />
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              to="/artikel"
              className="text-sm font-medium text-charcoal hover:text-[#228bcb] transition-colors group"
            >
              Lihat Semua
              <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ═══ Carousel ═══════════════════════════════════════════ */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Prev / Next arrows */}
          {pages.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(-1)}
                className="absolute -left-4 lg:-left-6 top-[28%] -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 flex items-center justify-center text-charcoal hover:bg-[#228bcb] hover:text-white hover:border-[#228bcb] transition-all duration-300"
                style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none', transition: 'opacity .3s' }}
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(1)}
                className="absolute -right-4 lg:-right-6 top-[28%] -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 flex items-center justify-center text-charcoal hover:bg-[#228bcb] hover:text-white hover:border-[#228bcb] transition-all duration-300"
                style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none', transition: 'opacity .3s' }}
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Slide viewport */}
          <div className="overflow-hidden relative">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag={pages.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={handleDragEnd}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 will-change-transform"
              >
                {pages[currentPage]?.map((post, i) => (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link to={`/artikel/${post.slug}`} className="group block">
                      {/* Image */}
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                        <motion.img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.06 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          loading="lazy"
                        />
                      </div>

                      {/* Category */}
                      <span className="text-xs text-[#228bcb] font-medium rounded-full px-3 py-1 inline-block mb-3 mt-4 bg-[#228bcb]/5">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="text-base font-medium leading-snug text-charcoal group-hover:text-[#228bcb] transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        {post.author.photo && (
                          <img
                            src={post.author.photo}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full object-cover"
                            loading="lazy"
                          />
                        )}
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {post.readingTime && (
                          <>
                            <span>·</span>
                            <span>{post.readingTime} mnt baca</span>
                          </>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ Controls ═══════════════════════════════════════════ */}
        {pages.length > 1 && (
          <ScrollReveal>
            <div className="flex items-center gap-3 mt-10">
              <div className="flex gap-2 flex-1 max-w-xs">
                {pages.map((_, i) => (
                  <ProgressBar
                    key={i}
                    active={i === currentPage}
                    onClick={() => goToPage(i)}
                    isPlaying={isPlaying && !isHovered}
                    duration={AUTOPLAY_MS / 1000}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying((v) => !v)}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#228bcb] hover:border-[#228bcb] transition-colors duration-200"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36A1 1 0 008 5.14z" />
                  </svg>
                )}
              </motion.button>

              <span className="text-xs font-medium text-gray-400 tabular-nums">
                {String(currentPage + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
              </span>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}