import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import type { Book } from '../../hooks/useBooks';
import * as pdfjsLib from 'pdfjs-dist';
import { drawIdle, drawCurlFrame, drawCornerCurl } from '../../lib/curlEngine';

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

export default function FlipbookReader({ book, onClose }: Props) {
  const [spread, setSpread]     = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [isDouble, setDouble]   = useState(window.innerWidth >= 900);
  const [scale, setScale]       = useState(1);

  const pdfRef       = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // Pre-rendered page cache: pageNum → offscreen canvas
  const pageCache = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderingPages = useRef<Set<number>>(new Set());

  // Animation state refs
  const flipState = useRef<FlipState>('idle');
  const flipDir   = useRef<'next' | 'prev'>('next');
  const flipProg  = useRef(0);
  const flipStart = useRef(0);
  const rafId     = useRef(0);
  const spreadRef = useRef(1);
  const npRef     = useRef(0);
  const dblRef    = useRef(isDouble);

  // Drag state
  const dragStartX = useRef(0);
  const dragCurX   = useRef(0);
  const isDragging = useRef(false);

  // Corner hover
  const hoverCorner = useRef<'br' | 'bl' | null>(null);
  const hoverAmt    = useRef(0);

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
    prerender().then(redraw);
  }, [spread, numPages, loading, isDouble, dims, prerender]);

  // Get cached page canvas
  const getPage = (n: number) => pageCache.current.get(n) ?? null;

  // Redraw the main canvas (idle state)
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = dimsRef.current;
    const dbl = dblRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const totalW = dbl ? w * 2 : w;
    canvas.width = Math.round(totalW * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = totalW + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const sp = spreadRef.current;
    drawIdle(ctx, dbl ? getPage(sp) : null, getPage(dbl ? sp + 1 : sp), w, h, dbl);
    // Corner curl preview
    if (hoverCorner.current && hoverAmt.current > 0 && flipState.current === 'idle') {
      drawCornerCurl(ctx, w, h, dbl, hoverCorner.current, hoverAmt.current);
    }
  }, []);

  // --- FLIP ANIMATION ---
  const FLIP_DURATION = 700; // ms

  const animateFlip = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = dimsRef.current;
    const dbl = dblRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const totalW = dbl ? w * 2 : w;
    canvas.width = Math.round(totalW * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = totalW + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const sp = spreadRef.current;
    const step = dbl ? 2 : 1;
    const dir = flipDir.current;
    const nextSp = dir === 'next' ? sp + step : sp - step;

    let front: HTMLCanvasElement | null, under: HTMLCanvasElement | null, stay: HTMLCanvasElement | null;
    if (dir === 'next') {
      front = getPage(dbl ? sp + 1 : sp);  // right page turns
      under = getPage(dbl ? nextSp : nextSp); // revealed page
      stay = dbl ? getPage(sp) : null;       // left page stays
    } else {
      front = getPage(dbl ? sp : sp);        // left page turns
      under = getPage(dbl ? nextSp + 1 : nextSp); // revealed
      stay = dbl ? getPage(sp + 1) : null;   // right stays
    }

    const prog = flipState.current === 'dragging' ? flipProg.current : ease(flipProg.current);
    drawCurlFrame(ctx, front, under, stay, w, h, dbl, prog, dir);
  }, []);

  const startAutoFlip = useCallback((dir: 'next' | 'prev') => {
    if (flipState.current !== 'idle') return;
    const sp = spreadRef.current;
    const np = npRef.current;
    const step = dblRef.current ? 2 : 1;
    if (dir === 'next' && sp + step > np) return;
    if (dir === 'prev' && sp <= 1) return;

    flipState.current = 'animating';
    flipDir.current = dir;
    flipProg.current = 0;
    flipStart.current = performance.now();

    // Pre-render target pages
    const nextSp = dir === 'next' ? sp + step : sp - step;
    [nextSp, nextSp + 1, nextSp - 1].forEach(p => {
      if (p >= 1 && p <= np) renderPageToCache(p);
    });

    const tick = (now: number) => {
      const elapsed = now - flipStart.current;
      flipProg.current = Math.min(elapsed / FLIP_DURATION, 1);
      animateFlip();
      if (flipProg.current < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        // Flip complete
        flipState.current = 'idle';
        flipProg.current = 0;
        spreadRef.current = nextSp;
        setSpread(nextSp);
        prerender().then(redraw);
      }
    };
    rafId.current = requestAnimationFrame(tick);
  }, [animateFlip, redraw, renderPageToCache, prerender]);

  // --- DRAG INTERACTION ---
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (flipState.current !== 'idle') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    const edgeZone = w * 0.2;

    // Only start drag from edges
    if (x > w - edgeZone) {
      // Right edge → next
      const sp = spreadRef.current, np = npRef.current, step = dblRef.current ? 2 : 1;
      if (sp + step > np) return;
      flipDir.current = 'next';
    } else if (x < edgeZone) {
      // Left edge → prev
      if (spreadRef.current <= 1) return;
      flipDir.current = 'prev';
    } else return;

    flipState.current = 'dragging';
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragCurX.current = e.clientX;
    flipProg.current = 0;
    canvas.setPointerCapture(e.pointerId);

    // Pre-render target
    const sp = spreadRef.current, step = dblRef.current ? 2 : 1;
    const nextSp = flipDir.current === 'next' ? sp + step : sp - step;
    [nextSp, nextSp + 1].forEach(p => {
      if (p >= 1 && p <= npRef.current) renderPageToCache(p);
    });
  }, [renderPageToCache]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (flipState.current === 'dragging' && isDragging.current) {
      dragCurX.current = e.clientX;
      const rect = canvas.getBoundingClientRect();
      const dx = dragCurX.current - dragStartX.current;
      const maxDrag = rect.width;
      if (flipDir.current === 'next') {
        flipProg.current = Math.max(0, Math.min(1, -dx / maxDrag));
      } else {
        flipProg.current = Math.max(0, Math.min(1, dx / maxDrag));
      }
      animateFlip();
      return;
    }

    // Corner hover detection (idle only)
    if (flipState.current === 'idle') {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width, h = rect.height;
      const zone = 80;
      let corner: 'br' | 'bl' | null = null;
      let amt = 0;

      // Bottom-right corner
      if (x > w - zone && y > h - zone) {
        const dist = Math.sqrt(Math.pow(w - x, 2) + Math.pow(h - y, 2));
        if (dist < zone) {
          corner = 'br';
          amt = 1 - dist / zone;
        }
      }
      // Bottom-left corner
      if (x < zone && y > h - zone) {
        const dist = Math.sqrt(x * x + Math.pow(h - y, 2));
        if (dist < zone) {
          corner = 'bl';
          amt = 1 - dist / zone;
        }
      }

      if (corner !== hoverCorner.current || Math.abs(amt - hoverAmt.current) > 0.02) {
        hoverCorner.current = corner;
        hoverAmt.current = amt;
        redraw();
      }
    }
  }, [animateFlip, redraw]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (flipState.current !== 'dragging' || !isDragging.current) return;
    isDragging.current = false;
    const canvas = canvasRef.current;
    if (canvas) canvas.releasePointerCapture(e.pointerId);

    const prog = flipProg.current;
    if (prog > 0.3) {
      // Complete the flip with animation from current progress
      flipState.current = 'animating';
      const startProg = prog;
      const remaining = 1 - startProg;
      const duration = remaining * FLIP_DURATION * 0.6;
      flipStart.current = performance.now();
      const sp = spreadRef.current;
      const step = dblRef.current ? 2 : 1;
      const nextSp = flipDir.current === 'next' ? sp + step : sp - step;

      const tick = (now: number) => {
        const elapsed = now - flipStart.current;
        const t = Math.min(elapsed / Math.max(duration, 100), 1);
        flipProg.current = startProg + remaining * ease(t);
        animateFlip();
        if (t < 1) {
          rafId.current = requestAnimationFrame(tick);
        } else {
          flipState.current = 'idle';
          flipProg.current = 0;
          spreadRef.current = nextSp;
          setSpread(nextSp);
          prerender().then(redraw);
        }
      };
      rafId.current = requestAnimationFrame(tick);
    } else {
      // Snap back
      flipState.current = 'animating';
      const startProg = prog;
      const duration = startProg * FLIP_DURATION * 0.5;
      flipStart.current = performance.now();

      const tick = (now: number) => {
        const elapsed = now - flipStart.current;
        const t = Math.min(elapsed / Math.max(duration, 100), 1);
        flipProg.current = startProg * (1 - ease(t));
        animateFlip();
        if (t < 1) {
          rafId.current = requestAnimationFrame(tick);
        } else {
          flipState.current = 'idle';
          flipProg.current = 0;
          redraw();
        }
      };
      rafId.current = requestAnimationFrame(tick);
    }
  }, [animateFlip, redraw, prerender]);

  const onPointerLeave = useCallback(() => {
    if (hoverCorner.current) {
      hoverCorner.current = null;
      hoverAmt.current = 0;
      if (flipState.current === 'idle') redraw();
    }
  }, [redraw]);

  // Touch swipe
  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (flipState.current !== 'idle') return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) {
      dx < 0 ? startAutoFlip('next') : startAutoFlip('prev');
    }
  };

  // Keyboard
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') startAutoFlip('next');
      else if (e.key === 'ArrowLeft') startAutoFlip('prev');
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [startAutoFlip, onClose]);

  // Cleanup
  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

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

          {loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-12 h-12">
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin"/>
                <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping"/>
              </div>
              <p className="text-gray-400 text-sm animate-pulse">Memuat buku…</p>
            </div>
          )}

          {error && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xs">
              <X className="w-10 h-10 text-red-400 mx-auto mb-4"/>
              <p className="text-red-400 font-medium mb-1">Gagal Memuat PDF</p>
              <p className="text-gray-500 text-sm mb-5">Coba unduh langsung</p>
              <a href={book.pdfUrl} download
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-5 py-2.5 rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4"/> Download
              </a>
            </motion.div>
          )}

          {!loading && !error && numPages > 0 && (
            <>
              {/* Click zones for flip */}
              <div className="absolute left-0 top-0 bottom-0 w-[15%] z-40 cursor-w-resize"
                onClick={() => startAutoFlip('prev')} />
              <div className="absolute right-0 top-0 bottom-0 w-[15%] z-40 cursor-e-resize"
                onClick={() => startAutoFlip('next')} />

              {/* Book container with shadow */}
              <div className="relative"
                style={{
                  width: totalW, height: dims.h,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 20px 40px rgba(0,0,0,0.5)',
                  borderRadius: 4,
                }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    display: 'block', width: totalW, height: dims.h,
                    borderRadius: 4, cursor: 'grab',
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerLeave}
                />

                {/* Page numbers */}
                {isDouble && (
                  <div className="absolute bottom-2 left-4 pointer-events-none">
                    <span className="text-[10px] text-white/30 font-mono">{spread}</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-4 pointer-events-none">
                  <span className="text-[10px] text-white/30 font-mono">
                    {isDouble ? spread + 1 : spread}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {!loading && !error && numPages > 0 && (
          <footer className="shrink-0 flex items-center justify-center gap-4 py-3 px-4
            bg-black/50 backdrop-blur-md border-t border-white/[0.07]">
            <button onClick={() => startAutoFlip('prev')} disabled={!canPrev}
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
            <button onClick={() => startAutoFlip('next')} disabled={!canNext}
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
