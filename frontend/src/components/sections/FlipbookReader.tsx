import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import type { Book } from '../../hooks/useBooks';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface FlipbookReaderProps {
  book: Book;
  onClose: () => void;
}

export default function FlipbookReader({ book, onClose }: FlipbookReaderProps) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [isDoubleSpread, setIsDoubleSpread] = useState(window.innerWidth >= 768);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive: detect screen size
  useEffect(() => {
    const handleResize = () => setIsDoubleSpread(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
    setPdfLoading(false);
  }

  const pageStep = isDoubleSpread ? 2 : 1;

  const goToNext = useCallback(() => {
    if (isFlipping || currentPage + pageStep > numPages) return;
    setFlipDirection('right');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((p) => Math.min(p + pageStep, numPages));
      setIsFlipping(false);
    }, 400);
  }, [currentPage, numPages, isFlipping, pageStep]);

  const goToPrev = useCallback(() => {
    if (isFlipping || currentPage <= 1) return;
    setFlipDirection('left');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((p) => Math.max(p - pageStep, 1));
      setIsFlipping(false);
    }, 400);
  }, [currentPage, isFlipping, pageStep]);

  // Calculate page dimensions
  const getPageWidth = () => {
    if (!containerRef.current) return 400;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight - 80; // leave room for nav
    const maxH = ch * 0.85;
    const ratio = 0.707; // A4 ratio (width/height)
    let pw = maxH * ratio;
    if (isDoubleSpread) {
      pw = Math.min(pw, (cw - 40) / 2);
    } else {
      pw = Math.min(pw, cw - 40);
    }
    return Math.max(pw, 200);
  };

  const pageWidth = getPageWidth();
  const displayPage = isDoubleSpread ? (currentPage % 2 === 0 ? currentPage - 1 : currentPage) : currentPage;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex flex-col"
        style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-[#1C1C1C] border-b border-white/10 shrink-0">
          <a
            href={book.pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-lime text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
          <h2 className="text-white text-sm md:text-base font-medium truncate max-w-[50vw] text-center">
            {book.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Book Area ─── */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden px-4"
          style={{ perspective: '2000px' }}
        >
          <Document
            file={book.pdfUrl.replace(/^https?:\/\/[^\/]+/, '')}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-lime animate-spin" />
                <p className="text-gray-400 text-sm">Memuat buku…</p>
              </div>
            }
            error={
              <div className="text-center">
                <p className="text-red-400 mb-2">Gagal memuat PDF</p>
                <a
                  href={book.pdfUrl}
                  download
                  className="text-lime underline text-sm"
                >
                  Download langsung
                </a>
              </div>
            }
          >
            {!pdfLoading && (
              <div className="flex items-center justify-center gap-[2px]">
                {/* Left page (or single page on mobile) */}
                <motion.div
                  key={`page-${displayPage}`}
                  initial={
                    flipDirection === 'right'
                      ? { rotateY: -90, opacity: 0.5 }
                      : { rotateY: 90, opacity: 0.5 }
                  }
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    transformOrigin: isDoubleSpread ? 'right center' : 'center',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className="overflow-hidden"
                    style={{
                      backgroundColor: '#FFFFF0',
                      boxShadow: '-4px 4px 20px rgba(0,0,0,0.4)',
                    }}
                  >
                    <Page
                      pageNumber={displayPage}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                </motion.div>

                {/* Right page (desktop only) */}
                {isDoubleSpread && displayPage + 1 <= numPages && (
                  <motion.div
                    key={`page-${displayPage + 1}`}
                    initial={
                      flipDirection === 'right'
                        ? { rotateY: 90, opacity: 0.5 }
                        : { rotateY: -90, opacity: 0.5 }
                    }
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                    style={{
                      transformOrigin: 'left center',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div
                      className="overflow-hidden"
                      style={{
                        backgroundColor: '#FFFFF0',
                        boxShadow: '4px 4px 20px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Page
                        pageNumber={displayPage + 1}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </Document>
        </div>

        {/* ─── Navigation ─── */}
        {!pdfLoading && numPages > 0 && (
          <div className="shrink-0 flex items-center justify-center gap-6 py-4 bg-[#1C1C1C] border-t border-white/10">
            <button
              onClick={goToPrev}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-lime disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <span className="text-gray-300 text-sm font-mono tabular-nums">
              Halaman {displayPage}
              {isDoubleSpread && displayPage + 1 <= numPages ? `–${displayPage + 1}` : ''}
              {' / '}
              {numPages}
            </span>

            <button
              onClick={goToNext}
              disabled={currentPage + pageStep > numPages}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-lime disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
