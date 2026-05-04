import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import type { Book } from '../../hooks/useBooks';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Props { book: Book; onClose: () => void; }

function PageStack({ side }: { side: 'left' | 'right' }) {
  const colors = ['#ede5d5', '#e2d9c8', '#d7cfbc', '#ccc5b0'];
  return (
    <div style={{ position: 'relative', width: 8, alignSelf: 'stretch', flexShrink: 0 }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${i * 2}%`, bottom: `${i * 2}%`,
          [side === 'left' ? 'right' : 'left']: 0,
          width: 3 - i * 0.4, background: c,
          borderRadius: side === 'left' ? '2px 0 0 2px' : '0 2px 2px 0',
        }} />
      ))}
    </div>
  );
}

export default function FlipbookReader({ book, onClose }: Props) {
  const [spread,   setSpread]   = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [isDouble, setDouble]   = useState(window.innerWidth >= 900);
  const [scale,    setScale]    = useState(1);
  const [dims,     setDims]     = useState({ w: 380, h: 537 });
  const [flipSide, setFlipSide] = useState<'left'|'right'|null>(null);
  const [flipDir,  setFlipDir]  = useState<'next'|'prev'>('next');

  const pdfRef       = useRef<pdfjsLib.PDFDocumentProxy|null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spreadRef    = useRef(1);
  const npRef        = useRef(0);
  const dblRef       = useRef(isDouble);
  const dimsRef      = useRef(dims);
  const animRef      = useRef(false);
  const skipRef      = useRef(-1);
  const rafRef       = useRef(0);
  const touchX       = useRef(0);
  const tasks        = useRef<Map<string, any>>(new Map());

  const leftRef  = useRef<HTMLCanvasElement>(null);
  const rightRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef  = useRef<HTMLCanvasElement>(null);
  const flipRef  = useRef<HTMLDivElement>(null);
  const curlRef  = useRef<HTMLDivElement>(null);

  useEffect(() => { spreadRef.current = spread; }, [spread]);
  useEffect(() => { npRef.current = numPages; }, [numPages]);
  useEffect(() => { dblRef.current = isDouble; }, [isDouble]);
  useEffect(() => { dimsRef.current = dims; }, [dims]);

  useEffect(() => {
    const fn = () => setDouble(window.innerWidth >= 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const computeDims = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth - 64;
    const ch = containerRef.current.clientHeight - 32;
    const ratio = 0.707;
    let pH = ch * 0.88, pW = pH * ratio;
    if (dblRef.current) {
      const mx = (cw - 30) / 2;
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false); pdfRef.current = null;
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

  // Render page into canvas, always filling w×h with centered content
  const renderPage = useCallback(async (
    pageNum: number, canvas: HTMLCanvasElement | null, d?: { w: number; h: number }
  ) => {
    if (!canvas) return;
    const { w, h } = d ?? dimsRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!pdfRef.current || pageNum < 1 || pageNum > pdfRef.current.numPages) return;
    const key = `${pageNum}`;
    const prev = tasks.current.get(key);
    if (prev) { try { prev.cancel(); } catch (_) {} tasks.current.delete(key); }
    try {
      const page = await pdfRef.current.getPage(pageNum);
      const vp = page.getViewport({ scale: 1 });
      const rs = Math.min((w * dpr) / vp.width, (h * dpr) / vp.height);
      const sv = page.getViewport({ scale: rs });
      const ox = Math.round((canvas.width - sv.width) / 2);
      const oy = Math.round((canvas.height - sv.height) / 2);
      ctx.fillStyle = '#fdf8f0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const task = page.render({ canvasContext: ctx, viewport: sv, transform: [1, 0, 0, 1, ox, oy] });
      tasks.current.set(key, task);
      await task.promise; tasks.current.delete(key);
    } catch (e: any) { if (e?.name !== 'RenderingCancelledException') console.error(e); }
  }, []);

  // Copy one canvas to another synchronously (for glitch-free swap at transitionend)
  const copyCanvas = (src: HTMLCanvasElement | null, dst: HTMLCanvasElement | null) => {
    if (!src || !dst) return;
    dst.width = src.width; dst.height = src.height;
    dst.style.width = src.style.width; dst.style.height = src.style.height;
    const ctx = dst.getContext('2d')!;
    ctx.drawImage(src, 0, 0);
  };

  // Re-render static pages when spread/dims changes
  useEffect(() => {
    if (loading || numPages === 0) return;
    if (skipRef.current === spread) { skipRef.current = -1; return; }
    renderPage(spread, leftRef.current);
    if (isDouble) renderPage(spread + 1, rightRef.current);
  }, [spread, numPages, loading, isDouble, dims, scale, renderPage]);

  const doFlip = useCallback(async (dir: 'next' | 'prev') => {
    if (animRef.current) return;
    const sp  = spreadRef.current;
    const np  = npRef.current;
    const dbl = dblRef.current;
    const stp = dbl ? 2 : 1;
    if (dir === 'next' && sp + stp > np) return;
    if (dir === 'prev' && sp <= 1) return;

    animRef.current = true;
    setFlipDir(dir);

    const nextSp = dir === 'next' ? Math.min(sp + stp, np) : Math.max(sp - stp, 1);
    const d = dimsRef.current;

    /*
     * NEXT: right page (sp+1) flips left
     *   flipFront = sp+1  (front face = current right page)
     *   flipBack  = nextSp (back face = next left page)
     *   During anim: rightCanvas = nextSp+1 (hidden under flip, safe to update)
     *   At transitionend (-180deg): flip is over LEFT area
     *     → drawImage leftCanvas ← flipBack (sync, instant, no flash)
     *
     * PREV: left page (sp) flips right
     *   flipFront = sp    (front face = current left page)
     *   flipBack  = nextSp+1 in double, nextSp in single (back face = prev right)
     *   During anim: leftCanvas = nextSp (hidden under flip, safe)
     *   At transitionend (+180deg): flip is over RIGHT area
     *     → drawImage rightCanvas ← flipBack
     */
    const frontPage = dir === 'next' ? (dbl ? sp + 1 : sp) : sp;
    const backPage  = dir === 'next' ? nextSp : (dbl ? nextSp + 1 : nextSp);

    // 1. Pre-render flip faces
    await Promise.all([
      renderPage(frontPage, frontRef.current, d),
      renderPage(backPage, backRef.current, d),
    ]);

    // 2. Show flip card (over right side for next, left side for prev)
    const side: 'left'|'right' = dir === 'next' ? 'right' : 'left';
    setFlipSide(side);

    // 3. Update the HIDDEN canvas during animation (covered by flip card)
    if (dir === 'next') {
      // rightCanvas hidden → pre-render next right page
      const nextRight = dbl ? nextSp + 1 : nextSp + 1;
      renderPage(nextRight, rightRef.current, d); // fire-and-forget (hidden)
    } else {
      // leftCanvas hidden → pre-render prev left page
      renderPage(nextSp, leftRef.current, d); // fire-and-forget (hidden)
    }

    // 4. Wait 2 rAF to ensure flip card mounted, then start animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = flipRef.current;
        if (!el) { animRef.current = false; setFlipSide(null); return; }

        el.style.willChange = 'transform';
        el.style.transition = 'transform 680ms cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        el.style.transform  = dir === 'next' ? 'rotateY(-180deg)' : 'rotateY(180deg)';

        // Curl shadow via rAF
        const t0 = performance.now();
        const animCurl = (now: number) => {
          const p = Math.min((now - t0) / 680, 1);
          if (curlRef.current) curlRef.current.style.opacity = String(Math.sin(p * Math.PI) * 0.4);
          if (p < 1) rafRef.current = requestAnimationFrame(animCurl);
        };
        rafRef.current = requestAnimationFrame(animCurl);

        el.addEventListener('transitionend', () => {
          cancelAnimationFrame(rafRef.current);
          if (curlRef.current) curlRef.current.style.opacity = '0';

          /*
           * At this point the flip card is at ±180deg and covers the OTHER side:
           * NEXT at -180deg → flip card is over LEFT area  → copy backRef→leftRef
           * PREV at +180deg → flip card is over RIGHT area → copy backRef→rightRef
           * Both ops are synchronous drawImage → zero-latency, no flash possible
           */
          if (dir === 'next') {
            copyCanvas(backRef.current, leftRef.current);
          } else {
            copyCanvas(backRef.current, rightRef.current);
          }

          // Reset flip element, hide it, update spread
          el.style.willChange = el.style.transition = el.style.transform = '';
          skipRef.current = nextSp;
          setFlipSide(null);
          setSpread(nextSp);
          spreadRef.current = nextSp;
          animRef.current = false;
        }, { once: true });
      });
    });
  }, [renderPage]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') doFlip('next');
      else if (e.key === 'ArrowLeft') doFlip('prev');
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [doFlip, onClose]);

  const onTS = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 60) dx < 0 ? doFlip('next') : doFlip('prev');
  };

  const zoomIn    = () => setScale(s => Math.min(+(s + 0.15).toFixed(2), 2.0));
  const zoomOut   = () => setScale(s => Math.max(+(s - 0.15).toFixed(2), 0.5));
  const zoomReset = () => setScale(1);

  const canNext = isDouble ? spread + 2 <= numPages : spread < numPages;
  const canPrev = spread > 1;
  const label   = isDouble && spread + 1 <= numPages ? `${spread}–${spread + 1}` : String(spread);

  // Flip layer style — inset:0 so it covers exactly its parent container
  const flipLayerSx = (side: 'left'|'right'): React.CSSProperties => ({
    position: 'absolute', inset: 0,
    transformStyle: 'preserve-3d',
    transformOrigin: side === 'right' ? 'left center' : 'right center',
    zIndex: 20,
    cursor: 'default',
  });

  // The flip card DOM (front + back + curl) — used in one place at a time
  const FlipCard = ({ side }: { side: 'left'|'right' }) => {
    if (flipSide !== side) return null;
    const shadowFront = side === 'right'
      ? 'linear-gradient(to left,rgba(0,0,0,0.12) 0%,transparent 30%)'
      : 'linear-gradient(to right,rgba(0,0,0,0.12) 0%,transparent 30%)';
    const shadowBack = side === 'right'
      ? 'linear-gradient(to right,rgba(0,0,0,0.12) 0%,transparent 30%)'
      : 'linear-gradient(to left,rgba(0,0,0,0.12) 0%,transparent 30%)';
    const curlBg = side === 'right'
      ? 'linear-gradient(to left,rgba(0,0,0,0.30) 0%,transparent 50%)'
      : 'linear-gradient(to right,rgba(0,0,0,0.30) 0%,transparent 50%)';
    return (
      <div ref={flipRef} style={flipLayerSx(side)}>
        {/* Front face */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          background:'#fdf8f0', overflow:'hidden',
          boxShadow:'0 4px 30px rgba(0,0,0,0.4)',
        }}>
          <canvas ref={frontRef} style={{ display:'block', width:'100%', height:'100%' }} />
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', background: shadowFront }} />
        </div>
        {/* Back face */}
        <div style={{
          position:'absolute', inset:0, backfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          background:'#fdf8f0', overflow:'hidden',
          boxShadow:'0 4px 30px rgba(0,0,0,0.4)',
        }}>
          <canvas ref={backRef} style={{ display:'block', width:'100%', height:'100%' }} />
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', background: shadowBack }} />
        </div>
        {/* Curl shadow */}
        <div ref={curlRef} style={{
          position:'absolute', inset:0, pointerEvents:'none',
          zIndex:5, opacity:0, background: curlBg,
        }} />
      </div>
    );
  };

  const pageSx = (isLeft: boolean): React.CSSProperties => ({
    position: 'relative',
    width: dims.w, height: dims.h,
    background: '#fdf8f0',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: isDouble
      ? (isLeft ? '4px 0 0 4px' : '0 4px 4px 0')
      : '4px',
    boxShadow: isDouble
      ? isLeft
        ? 'inset -4px 0 12px rgba(0,0,0,0.08),inset 0 0 30px rgba(0,0,0,0.04)'
        : 'inset  4px 0 12px rgba(0,0,0,0.08),inset 0 0 30px rgba(0,0,0,0.04)'
      : 'inset 0 0 30px rgba(0,0,0,0.04)',
  });

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
            <button onClick={zoomIn}  className="p-1.5 text-gray-500 hover:text-white rounded transition-colors"><ZoomIn  className="w-3.5 h-3.5"/></button>
            <div className="w-px h-5 bg-white/10 mx-2"/>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"><X className="w-5 h-5"/></button>
          </div>
        </header>

        {/* BOOK AREA */}
        <div ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          style={{ perspective: '1400px' }}
          onTouchStart={onTS} onTouchEnd={onTE}>

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
              {/* Click zones */}
              <div className="absolute left-0 top-0 bottom-0 w-1/4 z-50 cursor-w-resize" onClick={() => doFlip('prev')}/>
              <div className="absolute right-0 top-0 bottom-0 w-1/4 z-50 cursor-e-resize" onClick={() => doFlip('next')}/>

              {/* Book */}
              <div className="relative flex items-stretch"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.7),0 20px 40px rgba(0,0,0,0.5)',
                }}>
                {isDouble && <PageStack side="left"/>}

                {/* LEFT PAGE */}
                {isDouble && (
                  <div style={pageSx(true)}>
                    <canvas ref={leftRef} style={{ display:'block', width:'100%', height:'100%' }}/>
                    <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                      <span className="text-[10px] text-gray-400 font-mono">{spread}</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 w-8 pointer-events-none"
                      style={{ background:'linear-gradient(to left,rgba(0,0,0,0.06),transparent)' }}/>
                    <FlipCard side="left"/>
                  </div>
                )}

                {/* SPINE */}
                <div style={{
                  width: isDouble ? 16 : 0, alignSelf:'stretch', flexShrink:0, zIndex:30,
                  background:'linear-gradient(90deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.38) 50%,rgba(0,0,0,0.15) 100%)',
                }}/>

                {/* RIGHT PAGE */}
                <div style={pageSx(false)}>
                  <canvas
                    ref={isDouble ? rightRef : leftRef}
                    style={{ display:'block', width:'100%', height:'100%' }}/>
                  <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {isDouble ? spread + 1 : spread}
                    </span>
                  </div>
                  {isDouble && (
                    <div className="absolute inset-y-0 left-0 w-8 pointer-events-none"
                      style={{ background:'linear-gradient(to right,rgba(0,0,0,0.06),transparent)' }}/>
                  )}
                  <FlipCard side="right"/>
                </div>

                {isDouble && <PageStack side="right"/>}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        {!loading && !error && numPages > 0 && (
          <footer className="shrink-0 flex items-center justify-center gap-4 py-3 px-4
            bg-black/50 backdrop-blur-md border-t border-white/[0.07]">
            <button onClick={() => doFlip('prev')} disabled={!canPrev}
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
            <button onClick={() => doFlip('next')} disabled={!canNext}
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
