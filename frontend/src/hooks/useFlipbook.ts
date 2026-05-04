import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface PageDims { w: number; h: number; }

export function useFlipbook(pdfUrl: string, scale: number, isDouble: boolean) {
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dims, setDims] = useState<PageDims>({ w: 380, h: 537 });

  const pdfRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTasksRef = useRef<Map<number, pdfjsLib.RenderTask>>(new Map());

  // Load PDF
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    const path = pdfUrl.replace(/^https?:\/\/[^/]+/, '');
    pdfjsLib.getDocument({
      url: path,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    }).promise.then(doc => {
      if (cancelled) return;
      pdfRef.current = doc;
      setNumPages(doc.numPages);
      setIsLoading(false);
    }).catch(() => {
      if (!cancelled) { setHasError(true); setIsLoading(false); }
    });

    return () => { cancelled = true; };
  }, [pdfUrl]);

  // Compute page dimensions from container
  const computeDims = useCallback(() => {
    if (!containerRef.current) return;
    const cw = containerRef.current.clientWidth - 48;
    const ch = containerRef.current.clientHeight - 32;
    const ratio = 0.707;
    let pH = ch * 0.90;
    let pW = pH * ratio;
    if (isDouble) {
      const maxW = (cw - 20) / 2;
      if (pW > maxW) { pW = maxW; pH = pW / ratio; }
    } else {
      if (pW > cw) { pW = cw; pH = pW / ratio; }
    }
    const w = Math.max(Math.floor(pW * scale), 160);
    const h = Math.max(Math.floor(pH * scale), 226);
    setDims({ w, h });
  }, [isDouble, scale]);

  useEffect(() => {
    computeDims();
    const ro = new ResizeObserver(computeDims);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeDims]);

  // Render a page into a canvas — canvas always fills w×h exactly
  const renderPage = useCallback(async (pageNum: number, canvas: HTMLCanvasElement | null, d?: PageDims) => {
    if (!pdfRef.current || !canvas) return;
    if (pageNum < 1 || pageNum > (pdfRef.current.numPages)) return;

    const existing = renderTasksRef.current.get(pageNum);
    if (existing) { try { existing.cancel(); } catch (_) {} }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { w, h } = d ?? dims;

    // Always set canvas to full page area
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fdf8f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const page = await pdfRef.current.getPage(pageNum);
      const vp = page.getViewport({ scale: 1 });

      // Scale to fit inside w×h while preserving aspect ratio
      const renderScale = Math.min((w * dpr) / vp.width, (h * dpr) / vp.height);
      const scaled = page.getViewport({ scale: renderScale });

      // Center the PDF content within the canvas
      const offsetX = Math.round((canvas.width  - scaled.width)  / 2);
      const offsetY = Math.round((canvas.height - scaled.height) / 2);

      // Fill paper background again (already done above, but ensure full coverage)
      ctx.fillStyle = '#fdf8f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const task = page.render({
        canvasContext: ctx,
        viewport: scaled,
        transform: [1, 0, 0, 1, offsetX, offsetY],
      });
      renderTasksRef.current.set(pageNum, task);
      await task.promise;
      renderTasksRef.current.delete(pageNum);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') console.error('render error', err);
    }
  }, [dims]);


  // Clear a canvas to paper color
  const clearCanvas = useCallback((canvas: HTMLCanvasElement | null, d?: PageDims) => {
    if (!canvas) return;
    const { w, h } = d ?? dims;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fdf8f0';
    ctx.fillRect(0, 0, w, h);
  }, [dims]);

  return { numPages, isLoading, hasError, dims, pdfRef, containerRef, renderPage, clearCanvas };
}
