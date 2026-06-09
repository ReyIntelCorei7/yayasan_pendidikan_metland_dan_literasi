import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Share2, Clock, Calendar, Copy, Check, BookOpen } from 'lucide-react';
import { usePost, usePosts } from '../hooks/usePosts';
import { useMemo, useRef, useState } from 'react';
import ScrollReveal from '../components/animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import { getTrans } from '../i18n';
import { useTranslation } from 'react-i18next';

/* ─── Share icons ───────────────────────────────────────────── */
const shareTargets = [
  {
    label: 'X',
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: (url: string, _title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: (url: string, title: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

/* ─── Helper Functions ──────────────────────────────────────── */
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ─── Loading Skeleton ──────────────────────────────────────── */
function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[58vh] bg-gray-200 animate-pulse" />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="h-4 w-24 bg-gray-200 rounded-full mb-8 animate-pulse" />
        <div className="h-10 w-full bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-10 animate-pulse" />
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div>
            <div className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded mb-3 animate-pulse" style={{ width: `${80 + (i % 3) * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function ArtikelDetail() {
  const { slug } = useParams();
  const { post, loading } = usePost(slug);
  const { posts: allPosts } = usePosts();
  const { i18n } = useTranslation();
  const [copied, setCopied] = useState(false);
  /* Scroll progress bar */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const related = useMemo(
    () => (post ? allPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3) : []),
    [post, allPosts]
  );

  const suggestions = useMemo(
    () => {
      if (!post) return [];
      const relatedIds = new Set(related.map((r) => r.id));
      relatedIds.add(post.id);
      return allPosts
        .filter((p) => !relatedIds.has(p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    },
    [post, related, allPosts]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const bodyIsHtml = post ? /\<[a-z][\s\S]*>/i.test(post.body) : false;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  /* States */
  if (loading) return <ArticleDetailSkeleton />;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center px-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-3">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-400 mb-8 text-sm">Artikel yang kamu cari mungkin telah dihapus atau tidak tersedia.</p>
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Artikel
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Reading Progress Bar ─────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* ─── Header Section ───────────────────────────────── */}
      <section className="bg-white pt-28 pb-10">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/artikel"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Artikel
            </Link>
          </div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-3 py-1 mb-4"
          >
            {post.category}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-5xl font-bold text-charcoal leading-tight mb-8"
            style={{ letterSpacing: '-0.5px' }}
          >
            {getTrans(post.title, i18n.language)}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-6 border-b border-gray-100"
          >
            {post.author.photo && (
              <img
                src={post.author.photo}
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
              />
            )}
            <div>
              <p className="text-charcoal font-semibold text-sm leading-none">{post.author.name}</p>
              {post.author.title && <p className="text-gray-400 text-xs mt-0.5">{post.author.title}</p>}
            </div>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {post.readingTime && (
              <>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} mnt baca
                </span>
              </>
            )}
          </motion.div>
        </div>
      </section>

  
      {post.featuredImage && (
        <section className="bg-white pb-8">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Article Body ─────────────────────────────────── */}
      <section className="bg-[#FCFCFC] py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">


          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-10 border-l-4 border-primary pl-5"
            >
              {getTrans(post.excerpt, i18n.language)}
            </motion.p>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            {bodyIsHtml ? (
              <div
                className="prose prose-lg max-w-none prose-headings:text-charcoal prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-charcoal prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: getTrans(post.body, i18n.language) }}
              />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">{getTrans(post.body, i18n.language)}</p>
              </div>
            )}
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <ScrollReveal className="mt-14 pt-10 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05, backgroundColor: '#3D8ABF', color: '#fff' }}
                    className="text-xs font-medium bg-gray-100 text-gray-500 rounded-full px-4 py-1.5 cursor-default transition-colors duration-200"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Share Bar */}
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-4 mt-10 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Share2 className="w-4 h-4" />
                <span>Bagikan</span>
              </div>
              <div className="flex gap-2">
                {shareTargets.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href(currentUrl, post.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors duration-200"
                    title={item.label}
                  >
                    {item.svg}
                  </motion.a>
                ))}
                {/* Copy link */}
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors duration-200"
                  title="Salin tautan"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </motion.button>
              </div>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-500 font-medium"
                >
                  Tautan disalin!
                </motion.span>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Suggestion Articles ──────────────────────────── */}
      {suggestions.length > 0 && (
        <section className="bg-charcoal py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-2xl font-bold text-white shrink-0">Artikel Lainnya</h2>
                <div className="flex-1 h-px bg-gray-700" />
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.map((p) => (
                <motion.div key={p.id} variants={staggerItemVariants}>
                  <Link to={`/artikel/${p.slug}`} className="group block h-full">
                    <div className="aspect-[16/10] overflow-hidden bg-gray-700 rounded-xl mb-3">
                      <img
                        src={p.featuredImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    </div>
                    <span className="inline-block text-xs font-bold tracking-[1px] uppercase text-primary bg-primary/10 rounded px-2 py-0.5 mb-2">
                      {p.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                      {getTrans(p.title, i18n.language)}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{fmtDate(p.publishedAt)}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* ─── Related Articles ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-offwhite py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-2xl font-bold text-charcoal shrink-0">Artikel Terkait</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </ScrollReveal>
            <StaggerGrid className="grid md:grid-cols-3 gap-8">
              {related.map((p) => (
                <motion.div key={p.id} variants={staggerItemVariants}>
                  <Link to={`/artikel/${p.slug}`} className="group block">
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100 rounded-2xl mb-4">
                      <img
                        src={p.featuredImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    </div>
                    <span className="inline-block text-xs font-bold tracking-[2px] uppercase text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                      {p.category}
                    </span>
                    <h3 className="text-base font-semibold text-charcoal group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                      {getTrans(p.title, i18n.language)}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(p.publishedAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* ─── Newsletter CTA ───────────────────────────────── */}
      <section className="bg-charcoal py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="inline-block text-xs font-bold tracking-[3px] uppercase text-primary mb-4">
              Newsletter
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-1px' }}>
              Tetap terhubung dengan kami
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Dapatkan berita dan informasi terbaru dari Yayasan Pendidikan Metland langsung ke email Anda.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors shrink-0"
              >
                Berlangganan
              </motion.button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
