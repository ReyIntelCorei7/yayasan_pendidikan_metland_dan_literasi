import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/book-animation.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Props ─── */
interface BookOpenAnimationProps {
  coverTitle?: string;
  coverSubtitle?: ReactNode;
  leftPageContent?: ReactNode;
  rightPageContent?: ReactNode;
  backgroundColor?: string;
}

/* ─── Main Component ─── */
export default function BookOpenAnimation({
  coverTitle = 'Literasi',
  coverSubtitle = 'Yayasan Pendidikan Metland',
  leftPageContent,
  rightPageContent,
  backgroundColor = '#FFFFFF',
}: BookOpenAnimationProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const coverFrontRef = useRef<HTMLDivElement>(null);
  const pageLeftContentRef = useRef<HTMLDivElement>(null);
  const pageRightContentRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const book = bookRef.current;
    const coverFront = coverFrontRef.current;
    const pageLeftContent = pageLeftContentRef.current;
    const pageRightContent = pageRightContentRef.current;
    const scrollHint = scrollHintRef.current;
    const label = labelRef.current;
    const shadow = shadowRef.current;

    if (!scene || !book || !coverFront || !pageLeftContent || !pageRightContent) return;

    // Set initial states
    gsap.set(book, { scale: 0.88, opacity: 0, rotateX: 5 });
    gsap.set(coverFront, { rotateY: 0 });
    gsap.set(pageLeftContent, { opacity: 0, x: -15 });
    gsap.set(pageRightContent, { opacity: 0, x: 15 });

    // Create the main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: '+=200%', // 2x viewport height of scroll distance
        pin: true,
        scrub: 1.5, // smooth scrubbing
        anticipatePin: 1,
        // Ensure compatibility with Lenis
        invalidateOnRefresh: true,
      },
    });

    // Phase 0: Scene label fades out
    if (label) {
      tl.to(label, {
        opacity: 0,
        y: -20,
        duration: 0.1,
        ease: 'power1.in',
      }, 0);
    }

    // Phase 1: Book fades in and scales up (0% → 20% of scroll)
    tl.to(book, {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      duration: 0.2,
      ease: 'power2.out',
    }, 0);

    // Phase 1.5: Scroll hint fades out
    if (scrollHint) {
      tl.to(scrollHint, {
        opacity: 0,
        duration: 0.1,
        ease: 'power1.in',
      }, 0.05);
    }

    // Phase 2: Cover opens (20% → 65% of scroll)
    tl.to(coverFront, {
      rotateY: -178, // Not exactly 180 to avoid z-fighting
      duration: 0.45,
      ease: 'power2.inOut',
    }, 0.2);

    // Phase 2.5: Shadow changes as cover opens
    if (shadow) {
      tl.to(shadow, {
        width: '85%',
        opacity: 0.8,
        duration: 0.45,
      }, 0.2);
    }

    // Phase 3: Left page content fades in (55% → 75%)
    tl.to(pageLeftContent, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      ease: 'power1.out',
    }, 0.6);

    // Phase 4: Right page content fades in (65% → 85%)
    tl.to(pageRightContent, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      ease: 'power1.out',
    }, 0.68);

    // Phase 5: Hold for reading (85% → 100%)
    // No animation, just let user read the content

    // Entrance animation for the book (non-scroll, just on mount)
    const entranceTl = gsap.timeline({ delay: 0.3 });
    
    if (label) {
      entranceTl.fromTo(label,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0
      );
    }

    if (scrollHint) {
      entranceTl.fromTo(scrollHint,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.5
      );
    }

    // Cleanup
    return () => {
      tl.kill();
      entranceTl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === scene) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      className="book-scene"
      style={{ backgroundColor }}
    >
      {/* Top label */}
      <div ref={labelRef} className="book-scene-label">
        <p
          className="text-xs font-semibold tracking-[3px] uppercase"
          style={{ color: 'rgba(28,28,28,0.4)' }}
        >
          Program Literasi — Yayasan Pendidikan Metland
        </p>
      </div>

      {/* 3D Book */}
      <div className="book-wrapper">
        <div ref={bookRef} className="book">
          {/* Spine */}
          <div className="book-spine" />

          {/* Pages (always visible behind the cover) */}
          <div className="book-pages">
            {/* Left page */}
            <div className="book-page book-page-left">
              <div
                ref={pageLeftContentRef}
                className="page-content page-content-left"
              >
                {leftPageContent || (
                  <DefaultLeftPage />
                )}
              </div>
            </div>

            {/* Right page */}
            <div className="book-page book-page-right">
              <div
                ref={pageRightContentRef}
                className="page-content page-content-right"
              >
                {rightPageContent || (
                  <DefaultRightPage />
                )}
              </div>
            </div>
          </div>

          {/* Back cover (left side, static) */}
          <div className="book-cover-back" />

          {/* Front cover (right side, animated) */}
          <div ref={coverFrontRef} className="book-cover-front">
            {/* Outside face */}
            <div className="cover-outside">
              <div className="cover-title">{coverTitle}</div>
              <div className="cover-divider" />
              <div className="cover-subtitle">{coverSubtitle}</div>
            </div>

            {/* Inside face (visible when opened) */}
            <div className="cover-inside">
              <InsideCoverContent />
            </div>
          </div>
        </div>

        {/* Book shadow on surface */}
        <div ref={shadowRef} className="book-shadow" />
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="scroll-hint">
        <span className="scroll-hint-text">Scroll</span>
        <div className="scroll-hint-line" />
      </div>
    </section>
  );
}

/* ─── Default Content Components ─── */

function DefaultLeftPage() {
  return (
    <div>
      <p
        className="font-semibold uppercase mb-4"
        style={{
          color: '#3D8ABF',
          fontSize: 'clamp(8px, 1vw, 11px)',
          letterSpacing: '2.5px',
        }}
      >
        Program Literasi
      </p>
      <h2
        className="font-black"
        style={{
          color: '#1C1C1C',
          fontSize: 'clamp(20px, 3.5vw, 42px)',
          letterSpacing: '-1.5px',
          lineHeight: '1.05',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        Membangun
        <br />
        Budaya
        <br />
        Membaca.
      </h2>
      <div
        className="mt-4"
        style={{
          width: '36px',
          height: '3px',
          background: '#3D8ABF',
          borderRadius: '2px',
        }}
      />
    </div>
  );
}

function DefaultRightPage() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <p
          className="leading-relaxed mb-4"
          style={{
            color: '#555',
            fontSize: 'clamp(9px, 1.1vw, 13px)',
            lineHeight: '1.7',
          }}
        >
          Literasi bukan sekadar kemampuan membaca dan menulis. Di era digital,
          literasi mencakup berpikir kritis, memahami informasi, dan
          mengkomunikasikan ide secara efektif.
        </p>
        <p
          className="leading-relaxed"
          style={{
            color: '#777',
            fontSize: 'clamp(8px, 1vw, 12px)',
            lineHeight: '1.7',
          }}
        >
          Yayasan Pendidikan Metland berkomitmen menjadikan literasi
          sebagai fondasi seluruh proses pembelajaran.
        </p>
      </div>

      {/* Mini stats */}
      <div className="mt-4">
        <div
          className="flex gap-4 pt-3"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <MiniStat value="5.000+" label="E-Book" />
          <MiniStat value="1.200+" label="Buku Fisik" />
          <MiniStat value="12" label="Ruang Baca" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-bold"
        style={{
          color: '#3D8ABF',
          fontSize: 'clamp(12px, 1.5vw, 18px)',
          lineHeight: '1.2',
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: '#999',
          fontSize: 'clamp(7px, 0.8vw, 9px)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase' as const,
          marginTop: '2px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function InsideCoverContent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center"
      style={{ opacity: 0.5 }}
    >
      {/* Decorative book icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#999"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: '12px', opacity: 0.4 }}
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <p
        style={{
          color: '#aaa',
          fontSize: 'clamp(7px, 0.9vw, 10px)',
          letterSpacing: '2px',
          textTransform: 'uppercase' as const,
          fontWeight: 500,
        }}
      >
        Yayasan Pendidikan
      </p>
      <p
        style={{
          color: '#999',
          fontSize: 'clamp(6px, 0.7vw, 8px)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase' as const,
          marginTop: '4px',
        }}
      >
        Metland & Literasi
      </p>
    </div>
  );
}
