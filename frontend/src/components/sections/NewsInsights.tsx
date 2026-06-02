import { useMemo, useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
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
          className="absolute inset-y-0 left-0 bg-[#3D8ABF] rounded-full"
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTOPLAY_MS = 5000;

  // Ensure currentPage stays within bounds when pages change to prevent temporary
  // renders of an undefined page (which caused the carousel glitch).
  useEffect(() => {
    setPage(([prev, dir]) => {
      if (pages.length === 0) return [0, 0];
      const idx = Math.min(prev, pages.length - 1);
      return [idx, idx > prev ? 1 : -1];
    });
  }, [pages.length]);

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

  // Autoplay: use a per-slide timeout tied to currentPage so it reliably
  // advances when the progress bar completes and resets cleanly on page change.
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isPlaying && !isHovered && pages.length > 1) {
      timeoutRef.current = setTimeout(() => paginate(1), AUTOPLAY_MS);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isHovered, paginate, pages.length, currentPage]);

  // Drag
  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (info.offset.x < -50 || info.velocity.x < -300) paginate(1);
      else if (info.offset.x > 50 || info.velocity.x > 300) paginate(-1);
    },
    [paginate],
  );

  // Keep track of last valid page index to avoid rendering empty content
  // when `pages` changes length during async loads (prevents blank area).
  const lastValidIndexRef = useRef(0);
  useEffect(() => {
    if (pages.length === 0) return;
    if (pages[currentPage]) {
      lastValidIndexRef.current = currentPage;
    } else {
      // clamp to nearest valid index
      lastValidIndexRef.current = Math.min(lastValidIndexRef.current, pages.length - 1);
    }
  }, [pages, currentPage]);

  // Determine the displayed index used for rendering (fallback to last valid)
  const displayedIndex = pages[currentPage] ? currentPage : lastValidIndexRef.current;

  // Measure the active slide height and keep wrapper min-height stable to
  // prevent layout jumps while slides animate or images load.
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    const el = slideRef.current;
    if (el) {
      const h = Math.ceil(el.getBoundingClientRect().height);
      setContainerHeight(h);
    }
  }, [displayedIndex, pages.length]);

  if (pages.length === 0) {
    return (
      <section className="relative bg-[#FCFCFC] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center py-24 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-blue-300/20 flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-[#3D8ABF]" />
            </div>
            <h3 className="text-2xl font-semibold text-charcoal mb-3 text-center">Belum Ada Artikel</h3>
            <p className="text-gray-500 text-center max-w-lg mb-6">Artikel terbaru sedang kami persiapkan. Kembali lagi nanti untuk membaca berita dan insight dari Yayasan.</p>
            <Link to="/artikel" className="inline-flex items-center gap-2 px-5 py-2 bg-[#3D8ABF] text-white rounded-md font-medium hover:bg-[#1a6fa3] transition-colors">Lihat Halaman Artikel →</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FCFCFC] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <ScrollReveal>
              <div className='flex items-center gap-3'>
                <div className="w-2 h-2 bg-[#3D8ABF] animate-pulse mb-4" />
                <p
                  className="text-sm text-[#3D8ABF] uppercase tracking-[0.2em] mb-4"
                  style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                >
                  Artikel
                </p>
              </div>
            </ScrollReveal>
            <WordReveal
              text="Berita & Artikel"
              tag="h2"
              className="text-4xl lg:text-6xl font-light text-charcoal"
            />
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Link
              to="/artikel"
              className="text-sm font-medium text-charcoal hover:text-[#3D8ABF] transition-colors group"
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
              <div
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30"
                style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none', transition: 'opacity .3s' }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(-1)}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 flex items-center justify-center text-charcoal hover:bg-[#3D8ABF] hover:text-white hover:border-[#3D8ABF] transition-colors duration-300"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              </div>
              <div
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30"
                style={{ opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none', transition: 'opacity .3s' }}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(1)}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg border border-gray-100 flex items-center justify-center text-charcoal hover:bg-[#3D8ABF] hover:text-white hover:border-[#3D8ABF] transition-colors duration-300"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </>
          )}

          <div className="overflow-hidden relative" style={{ minHeight: containerHeight ? `${containerHeight}px` : undefined }}>
            <AnimatePresence initial={false} custom={direction}>
              {/** Use a stable displayedIndex that falls back to the last valid page
               * to avoid a momentary empty render when pages[currentPage] is undefined. */}
              <motion.div
                ref={slideRef}
                key={displayedIndex}
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
                {(pages[displayedIndex] || []).map((post, i) => (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link to={`/artikel/${post.slug}`} className="group block h-full">
                      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow duration-300 card-glow border border-gray-100 group-hover:border-primary/20">
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
                      <span className="text-xs text-[#3D8ABF] font-medium rounded-full px-3 py-1 inline-block mb-3 mt-4 bg-[#3D8ABF]/5">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3
                        className="text-base font-medium leading-snug text-charcoal group-hover:text-[#3D8ABF] transition-colors duration-200 line-clamp-2"
                        style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                      >
                        {post.title}
                      </h3>

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
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#3D8ABF] hover:border-[#3D8ABF] transition-colors duration-200"
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
