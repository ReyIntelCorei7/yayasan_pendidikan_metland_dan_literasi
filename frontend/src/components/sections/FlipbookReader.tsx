import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import type { Book } from '../../hooks/useBooks';
import * as pdfjsLib from 'pdfjs-dist';
import '../../styles/book-animation.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props { book: Book; onClose: () => void; }

type FlipState = 'idle' | 'animating' | 'dragging';

// Easing: ease-in-out cubic
function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Component to display offscreen PDF render canvases in the DOM
const PageCanvasWrapper = ({ canvas }: { canvas: HTMLCanvasElement | null }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.objectFit = 'fill';
      ref.current.appendChild(canvas);
    }
  }, [canvas]);
  return <div ref={ref} className="w-full h-full block overflow-hidden" />;
};

export default function FlipbookReader({ book, onClose }: Props) {
  const [spread, setSpread]     = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [isDouble, setDouble]   = useState(window.innerWidth >= 900);
  const [scale, setScale]       = useState(1);

  // ── Cover opening animation state ──
  const [showCover, setShowCover]   = useState(true);
  const [coverOpen, setCoverOpen]   = useState(false);
  const coverTouchX = useRef(0);
  const coverRef = useRef<HTMLDivElement>(null);

  // ── 3D Page flip animation state ──
  interface FlipAnimation {
    dir: 'next' | 'prev';
    frontPage: number;
    backPage: number;
    underPage: number;
    stayPage: number | null;
  }
  const [flipAnim, setFlipAnim] = useState<FlipAnimation | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const pdfRef       = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pre-rendered page cache: pageNum → offscreen canvas
  const pageCache = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderingPages = useRef<Set<number>>(new Set());

  const spreadRef = useRef(1);
  const npRef     = useRef(0);
  const dblRef    = useRef(isDouble);

  // Page dimensions
  const [dims, setDims] = useState({ w: 380, h: 537 });
  const dimsRef = useRef(dims);

  // Sync refs
  useEffect(() => { spreadRef.current = spread; }, [spread]);
  useEffect(() => { npRef.current = numPages; }, [numPages]);
  useEffect(() => { dblRef.current = isDouble; }, [isDouble]);
  useEffect(() => { dimsRef.current = dims; }, [dims]);

  // Responsive
  useEffect(() => {
    const fn = () => setDouble(window.innerWidth >= 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Compute page dimensions
  const computeDims = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth - 48;
    const ch = containerRef.current.clientHeight - 24;
    const ratio = 0.707;
    let pH = ch * 0.88, pW = pH * ratio;
    if (dblRef.current) {
      const mx = (cw - 20) / 2;
      if (pW > mx) { pW = mx; pH = pW / ratio; }
    } else {
      if (pW > cw) { pW = cw; pH = pW / ratio; }
    }
    const w = Math.max(Math.floor(pW * scale), 160);
    const h = Math.max(Math.floor(pH * scale), 226);
    setDims({ w, h }); dimsRef.current = { w, h };
  }, [scale]);

  useEffect(() => {
    computeDims();
    const ro = new ResizeObserver(computeDims);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeDims, isDouble]);

  // Load PDF
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    pdfRef.current = null; pageCache.current.clear();
    const path = book.pdfUrl.replace(/^https?:\/\/[^/]+/, '');
    pdfjsLib.getDocument({
      url: path,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    }).promise.then(doc => {
      if (cancelled) return;
      pdfRef.current = doc; npRef.current = doc.numPages;
      setNumPages(doc.numPages); setSpread(1); spreadRef.current = 1;
      setLoading(false);
    }).catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [book.pdfUrl]);

  // Render a PDF page to an offscreen canvas
  const renderPageToCache = useCallback(async (pageNum: number) => {
    if (!pdfRef.current || pageNum < 1 || pageNum > pdfRef.current.numPages) return;
    if (pageCache.current.has(pageNum) || renderingPages.current.has(pageNum)) return;
    renderingPages.current.add(pageNum);
    try {
      const { w, h } = dimsRef.current;
      const page = await pdfRef.current.getPage(pageNum);
      const vp = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rs = Math.min((w * dpr) / vp.width, (h * dpr) / vp.height);
      const sv = page.getViewport({ scale: rs });
      const c = document.createElement('canvas');
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0, 0, c.width, c.height);
      const ox = Math.round((c.width - sv.width) / 2);
      const oy = Math.round((c.height - sv.height) / 2);
      await page.render({ canvasContext: ctx, viewport: sv, transform: [1, 0, 0, 1, ox, oy] }).promise;
      pageCache.current.set(pageNum, c);
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') console.error(e);
    }
    renderingPages.current.delete(pageNum);
  }, []);

  // Pre-render current spread pages (awaited) + nearby pages (fire-and-forget)
  const prerender = useCallback(async () => {
    const sp = spreadRef.current;
    const np = npRef.current;
    // Must await current spread pages
    const critical = [sp];
    if (dblRef.current && sp + 1 <= np) critical.push(sp + 1);
    await Promise.all(critical.map(p => renderPageToCache(p)));
    // Pre-fetch nearby pages in background (don't await)
    const nearby = [sp - 1, sp - 2, sp + 2, sp + 3];
    nearby.forEach(p => { if (p >= 1 && p <= np) renderPageToCache(p); });
  }, [renderPageToCache]);

  // Track previous dims to know when to clear cache
  const prevDimsRef = useRef(dims);

  // Re-render when spread/dims change
  useEffect(() => {
    if (loading || numPages === 0) return;
    // Only clear cache when dimensions change (zoom/resize)
    if (prevDimsRef.current.w !== dims.w || prevDimsRef.current.h !== dims.h) {
      pageCache.current.clear();
      renderingPages.current.clear();
      prevDimsRef.current = dims;
    }
    prerender();
  }, [spread, numPages, loading, isDouble, dims, prerender]);

  // Get cached page canvas
  const getPage = (n: number) => pageCache.current.get(n) ?? null;

  // --- 3D PAGE FLIP ANIMATION ---
  const startPageFlip = useCallback((dir: 'next' | 'prev') => {
    if (flipAnim) return; // Wait for current flip to finish
    const sp = spreadRef.current;
    const np = npRef.current;
    const step = dblRef.current ? 2 : 1;

    if (dir === 'next') {
      if (sp + step > np) return;
      const front = dblRef.current ? sp + 1 : sp;
      const back = dblRef.current ? sp + 2 : sp + 1;
      const under = dblRef.current ? sp + 3 : sp + 2;
      const stay = dblRef.current ? sp : null;
      
      // Pre-render target pages
      [back, under].forEach(p => {
        if (p >= 1 && p <= np) renderPageToCache(p);
      });

      setFlipAnim({ dir: 'next', frontPage: front, backPage: back, underPage: under, stayPage: stay });
      setIsFlipped(false);
      setTimeout(() => {
        setIsFlipped(true);
      }, 30);
    } else {
      if (sp <= 1) return;
      const front = dblRef.current ? sp : sp;
      const back = dblRef.current ? sp - 1 : sp - 1;
      const under = dblRef.current ? sp - 2 : sp - 2;
      const stay = dblRef.current ? sp + 1 : null;

      // Pre-render target pages
      [back, under].forEach(p => {
        if (p >= 1 && p <= np) renderPageToCache(p);
      });

      setFlipAnim({ dir: 'prev', frontPage: front, backPage: back, underPage: under, stayPage: stay });
      setIsFlipped(false);
      setTimeout(() => {
        setIsFlipped(true);
      }, 30);
    }
  }, [flipAnim, renderPageToCache]);

  const handleFlipEnd = useCallback(() => {
    if (!flipAnim) return;
    const sp = spreadRef.current;
    const step = dblRef.current ? 2 : 1;
    const nextSp = flipAnim.dir === 'next' ? sp + step : sp - step;
    
    setSpread(nextSp);
    spreadRef.current = nextSp;
    setFlipAnim(null);
    setIsFlipped(false);
    prerender();
  }, [flipAnim, prerender]);

  // Touch swipe
  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (flipAnim) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) {
      dx < 0 ? startPageFlip('next') : startPageFlip('prev');
    }
  };

  // Keyboard
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') startPageFlip('next');
      else if (e.key === 'ArrowLeft') startPageFlip('prev');
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [startPageFlip, onClose]);

  // Zoom
  const zoomIn    = () => setScale(s => Math.min(+(s + 0.15).toFixed(2), 2.0));
  const zoomOut   = () => setScale(s => Math.max(+(s - 0.15).toFixed(2), 0.5));
  const zoomReset = () => setScale(1);

  // Derived
  const canNext = isDouble ? spread + 2 <= numPages : spread < numPages;
  const canPrev = spread > 1;
  const label = isDouble && spread + 1 <= numPages ? `${spread}–${spread + 1}` : String(spread);
  const totalW = isDouble ? dims.w * 2 : dims.w;

  return (
    <AnimatePresence>
      <motion.div key="fb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex flex-col select-none"
        style={{ background: 'linear-gradient(160deg,#0d0d14 0%,#181828 55%,#0d1520 100%)' }}>

        {/* HEADER */}
        <header className="shrink-0 flex items-center justify-between px-4 md:px-6 py-3
          bg-black/50 backdrop-blur-md border-b border-white/[0.07]">
          <a href={book.pdfUrl} download target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 text-sm transition-colors">
            <Download className="w-4 h-4" /><span className="hidden sm:inline">Download</span>
          </a>
          <h2 className="text-white/80 text-sm md:text-base font-medium truncate max-w-[40vw] text-center">
            {book.title}
          </h2>
          <div className="flex items-center gap-0.5">
            <button onClick={zoomOut} className="p-1.5 text-gray-500 hover:text-white rounded transition-colors"><ZoomOut className="w-3.5 h-3.5"/></button>
            <button onClick={zoomReset} className="px-1.5 py-0.5 text-gray-500 hover:text-white text-[11px] font-mono min-w-[38px] text-center transition-colors">{Math.round(scale*100)}%</button>
            <button onClick={zoomIn} className="p-1.5 text-gray-500 hover:text-white rounded transition-colors"><ZoomIn className="w-3.5 h-3.5"/></button>
            <div className="w-px h-5 bg-white/10 mx-2"/>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"><X className="w-5 h-5"/></button>
          </div>
        </header>

        {/* BOOK AREA */}
        <div ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          {/* ERROR STATE */}
          {error && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xs z-50">
              <X className="w-10 h-10 text-red-400 mx-auto mb-4"/>
              <p className="text-red-400 font-medium mb-1">Gagal Memuat PDF</p>
              <p className="text-gray-500 text-sm mb-5">Coba unduh langsung</p>
              <a href={book.pdfUrl} download
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4"/> Download
              </a>
            </motion.div>
          )}

          {/* 3D BOOK COVER INTRO ANIMATION */}
          {!error && showCover && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
              style={{ perspective: 2500 }}
            >
              {/* Top Label */}
              <div className="absolute top-[8vh] sm:top-[12vh] text-center pointer-events-none px-4">
                <p className="text-[10px] sm:text-xs font-semibold tracking-[3px] uppercase text-white/40">
                  Membuka E-Book Digital
                </p>
              </div>

              {/* 3D Book Wrapper */}
              <div 
                className="book-wrapper"
                style={{
                  transform: `rotateX(10deg) rotateY(-5deg) scale(${isDouble ? 1 : 0.7})`,
                  transition: 'transform 0.5s ease-out',
                }}
              >
                <div 
                  ref={coverRef}
                  className="book cursor-pointer"
                  style={{
                    width: dims.w * 2,
                    height: dims.h,
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => {
                    if (!loading) {
                      setCoverOpen(true);
                    }
                  }}
                  onTouchStart={(e) => {
                    coverTouchX.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    const dx = e.changedTouches[0].clientX - coverTouchX.current;
                    if (dx < -45 && !loading) {
                      setCoverOpen(true); // Swipe left to open
                    }
                  }}
                >
                  {/* Spine */}
                  <div className="book-spine" />

                  {/* Pages (always visible behind the cover) */}
                  <div className="book-pages">
                    {/* Left page inside */}
                    <div className="book-page book-page-left">
                      <div className="page-content flex flex-col justify-center items-center h-full text-center p-4">
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-emerald-600 font-bold mb-2">Penerbit</span>
                        <h3 className="font-bold text-gray-800 text-xs sm:text-sm md:text-base mb-1 truncate w-full max-w-[150px]">{book.title}</h3>
                        <p className="text-[10px] text-gray-500 truncate w-full max-w-[120px]">{book.author}</p>
                        <div className="h-[2px] w-6 bg-emerald-500 mt-3 rounded-full" />
                      </div>
                    </div>

                    {/* Right page inside */}
                    <div className="book-page book-page-right">
                      <div className="page-content flex flex-col justify-between h-full p-4">
                        <div className="flex-1 flex flex-col justify-center items-center text-center">
                          <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-emerald-600 font-bold mb-1.5">Selamat Membaca</span>
                          <p className="text-[10px] text-gray-600 leading-relaxed max-w-[140px] line-clamp-4">
                            {book.description || "Selamat datang di lembaran ilmu baru. Mari tingkatkan budaya literasi bersama Metland."}
                          </p>
                        </div>
                        <div className="text-[8px] sm:text-[9px] text-gray-400 text-center font-mono">
                          Halaman 1 dari {numPages || '...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Cover (static, left side) */}
                  <div className="book-cover-back" style={{ width: 'calc(50% - 6px)' }} />

                  {/* Front Cover (animated, right side) */}
                  <div 
                    className="book-cover-front"
                    style={{
                      width: 'calc(50% - 6px)',
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                      transform: coverOpen ? 'rotateY(-178deg)' : 'rotateY(0deg)',
                      transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                      zIndex: coverOpen ? 5 : 20,
                    }}
                    onTransitionEnd={() => {
                      if (coverOpen) {
                        setTimeout(() => {
                          setShowCover(false);
                        }, 300);
                      }
                    }}
                  >
                    {/* Outside face (with Cover Image or styling) */}
                    <div 
                      className="cover-outside flex flex-col items-center justify-between p-5 rounded-r-md overflow-hidden relative"
                      style={{
                        background: book.coverImage
                          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${book.coverImage.replace(/^https?:\/\/[^/]+/, '')}) center/cover no-repeat`
                          : 'linear-gradient(145deg, #1e1e1e 0%, #1C1C1C 50%, #141414 100%)',
                      }}
                    >
                      {/* Realistic book shadow overlay */}
                      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />

                      <div className="w-full flex flex-col items-center gap-0.5 z-10 text-center mt-1">
                        <span className="text-[8px] uppercase tracking-[3px] text-emerald-400 font-bold">METLAND LITERASI</span>
                        <div className="h-[1px] w-6 bg-emerald-400/40 my-1" />
                      </div>

                      <div className="w-full text-center z-10 px-2 my-auto">
                        <h1 
                          className="text-white font-bold leading-tight font-serif drop-shadow-lg line-clamp-3"
                          style={{
                            fontSize: 'clamp(14px, 2vw, 24px)',
                            fontFamily: 'Playfair Display, Georgia, serif',
                          }}
                        >
                          {book.title}
                        </h1>
                        <p className="text-[9px] sm:text-[10px] text-white/60 tracking-wider mt-1.5 truncate">
                          {book.author}
                        </p>
                      </div>

                      <div className="w-full text-center z-10 mb-1">
                        <span className="text-[7px] tracking-[2px] text-white/30 uppercase">E-BOOK DIGITAL</span>
                      </div>
                    </div>

                    {/* Inside face (revealed when cover opens) */}
                    <div className="cover-inside flex flex-col items-center justify-center p-5 rounded-l-md bg-[#faf6ed]">
                      <div className="text-center opacity-40">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" className="mx-auto mb-2 opacity-50">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <p className="text-[8px] font-semibold tracking-wider text-gray-700 uppercase">YAYASAN PENDIDIKAN</p>
                        <p className="text-[7px] tracking-widest text-gray-500 uppercase mt-0.5">METLAND</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Shadow */}
                <div className="book-shadow" style={{ width: '85%', opacity: coverOpen ? 0.8 : 0.4 }} />
              </div>

              {/* Action Hint */}
              <div className="absolute bottom-[6vh] sm:bottom-[10vh] flex flex-col items-center gap-2 pointer-events-none">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                    <span className="text-xs text-gray-400 animate-pulse">Menyiapkan halaman...</span>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span className="text-xs text-emerald-400 font-medium tracking-[2px] uppercase animate-pulse">
                      Usap ke Kiri atau Klik untuk Membaca
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* FLIPBOOK 3D DOM READER */}
          {!error && numPages > 0 && (() => {
            const leftPageNum = isDouble
              ? (flipAnim
                  ? (flipAnim.dir === 'next' ? flipAnim.stayPage : flipAnim.underPage)
                  : spread)
              : null;

            const rightPageNum = isDouble
              ? (flipAnim
                  ? (flipAnim.dir === 'next' ? flipAnim.underPage : flipAnim.stayPage)
                  : (spread + 1))
              : (flipAnim
                  ? flipAnim.backPage
                  : spread);

            return (
              <>
                {/* Click zones for flip */}
                <div className="absolute left-0 top-0 bottom-0 w-[15%] z-40 cursor-w-resize"
                  style={{ display: showCover ? 'none' : 'block' }}
                  onClick={() => startPageFlip('prev')} />
                <div className="absolute right-0 top-0 bottom-0 w-[15%] z-40 cursor-e-resize"
                  style={{ display: showCover ? 'none' : 'block' }}
                  onClick={() => startPageFlip('next')} />

                {/* Book container with shadow */}
                <div 
                  className="book relative"
                  style={{
                    width: totalW, height: dims.h,
                    boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.5)',
                    borderRadius: 4,
                    opacity: showCover ? 0 : 1,
                    pointerEvents: showCover ? 'none' : 'auto',
                    transition: 'opacity 0.6s ease-in-out',
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(5deg)',
                  }}
                >
                  {/* Spine */}
                  {isDouble && <div className="book-spine" />}

                  {/* Left Page (Static) */}
                  {isDouble && (
                    <div 
                      className="book-page book-page-left" 
                      style={{ 
                        width: '50%', 
                        height: '100%', 
                        left: 0, 
                        position: 'absolute',
                        padding: 0,
                        margin: 0,
                        display: 'block',
                        overflow: 'hidden'
                      }}
                    >
                      {leftPageNum && leftPageNum >= 1 && leftPageNum <= numPages ? (
                        <PageCanvasWrapper canvas={getPage(leftPageNum)} />
                      ) : (
                        <div className="w-full h-full bg-[#faf6ed]" />
                      )}
                    </div>
                  )}

                  {/* Right Page (Static) */}
                  <div 
                    className={isDouble ? "book-page book-page-right" : "book-page"} 
                    style={{ 
                      width: isDouble ? '50%' : '100%', 
                      height: '100%', 
                      right: 0, 
                      position: 'absolute',
                      padding: 0,
                      margin: 0,
                      display: 'block',
                      overflow: 'hidden'
                    }}
                  >
                    {rightPageNum && rightPageNum >= 1 && rightPageNum <= numPages ? (
                      <PageCanvasWrapper canvas={getPage(rightPageNum)} />
                    ) : (
                      <div className="w-full h-full bg-[#faf6ed]" />
                    )}
                  </div>

                  {/* Flipping Page */}
                  {flipAnim && (
                    <div 
                      className="book-cover-front"
                      style={{
                        width: isDouble ? '50%' : '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: flipAnim.dir === 'prev' ? 0 : 'auto',
                        right: flipAnim.dir === 'next' ? 0 : 'auto',
                        transformOrigin: flipAnim.dir === 'next' ? 'left center' : 'right center',
                        transformStyle: 'preserve-3d',
                        transform: isFlipped 
                          ? (flipAnim.dir === 'next' ? 'rotateY(-178deg)' : 'rotateY(178deg)') 
                          : 'rotateY(0deg)',
                        transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                        zIndex: 30,
                      }}
                      onTransitionEnd={handleFlipEnd}
                    >
                      {/* Front Face (Turns away) */}
                      <div 
                        className={flipAnim.dir === 'next' ? "book-page book-page-right" : "book-page book-page-left"} 
                        style={{ 
                          backfaceVisibility: 'hidden', 
                          inset: 0, 
                          position: 'absolute', 
                          background: '#faf6ed',
                          borderRadius: 0,
                          border: 'none',
                          boxShadow: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'block',
                          overflow: 'hidden'
                        }}
                      >
                        {flipAnim.frontPage >= 1 && flipAnim.frontPage <= numPages ? (
                          <PageCanvasWrapper canvas={getPage(flipAnim.frontPage)} />
                        ) : (
                          <div className="w-full h-full bg-[#faf6ed]" />
                        )}
                      </div>

                      {/* Back Face (Turns in) */}
                      <div 
                        className={flipAnim.dir === 'next' ? "book-page book-page-left" : "book-page book-page-right"} 
                        style={{ 
                          backfaceVisibility: 'hidden', 
                          inset: 0, 
                          position: 'absolute', 
                          transform: 'rotateY(180deg)',
                          background: '#faf6ed',
                          borderRadius: 0,
                          border: 'none',
                          boxShadow: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'block',
                          overflow: 'hidden'
                        }}
                      >
                        {flipAnim.backPage >= 1 && flipAnim.backPage <= numPages ? (
                          <PageCanvasWrapper canvas={getPage(flipAnim.backPage)} />
                        ) : (
                          <div className="w-full h-full bg-[#faf6ed]" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Page numbers */}
                  {isDouble && (
                    <div className="absolute bottom-2 left-4 pointer-events-none z-40">
                      <span className="text-[10px] text-black/30 font-mono">{spread}</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-4 pointer-events-none z-40">
                    <span className="text-[10px] text-black/30 font-mono">
                      {isDouble ? spread + 1 : spread}
                    </span>
                  </div>
                </div>
              </>
            );
          })()}

        </div>

        {/* FOOTER */}
        {!showCover && !loading && !error && numPages > 0 && (
          <footer className="shrink-0 flex items-center justify-center gap-4 py-3 px-4
            bg-black/50 backdrop-blur-md border-t border-white/[0.07]">
            <button onClick={() => startPageFlip('prev')} disabled={!canPrev}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500
                hover:text-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed
                transition-all rounded-lg hover:bg-white/5">
              <ChevronLeft className="w-4 h-4"/><span className="hidden sm:inline">Prev</span>
            </button>
            <div className="flex items-center gap-3">
              <motion.span key={label} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
                className="text-white/70 text-sm font-mono tabular-nums min-w-[52px] text-center">
                {label}
              </motion.span>
              <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-emerald-400 rounded-full"
                  animate={{ width:`${(spread/numPages)*100}%` }}
                  transition={{ duration:0.4, ease:'easeOut' }}/>
              </div>
              <span className="text-gray-600 text-sm font-mono">{numPages}</span>
            </div>
            <button onClick={() => startPageFlip('next')} disabled={!canNext}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500
                hover:text-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed
                transition-all rounded-lg hover:bg-white/5">
              <span className="hidden sm:inline">Next</span><ChevronRight className="w-4 h-4"/>
            </button>
          </footer>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
