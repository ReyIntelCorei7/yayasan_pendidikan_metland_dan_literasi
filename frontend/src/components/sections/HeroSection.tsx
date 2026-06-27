import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useHeroStats } from "../../hooks/useHeroStats";

import hero1 from "../../assets/sekolahsmkmetland.webp";
import hero2 from "../../assets/sekolahsmkmetlandcibitung.webp";
import hero3 from "../../assets/kepalasekolahsmkmetland.jpeg";
import useBanners from "../../hooks/useBanners";

const defaultHeroImages = [hero1, hero2, hero3];
const metlandTitleFont =
  "'Eras Bold ITC', 'Eras Demi ITC', 'Eras Medium ITC', 'Eras ITC', sans-serif";

/* ──────────────── Animated Counter ──────────────── */
function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
  separator = ".",
}: {
  end: number;
  suffix?: string;
  duration?: number;
  separator?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  const formatted =
    value >= 1000
      ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      : value.toString();

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

/* ──────────────── Icon Components ──────────────── */
const TrophyIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const GraduationIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
  </svg>
);

const SchoolIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
  </svg>
);

const AwardIcon = () => (
  <svg
    className="w-7 h-7"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

/* ──────────────── Stats Data factory (needs t() so defined inside component) ──────────────── */

/* ──────────────── Main Component ──────────────── */
export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const { banners, loading } = useBanners();
  const { stats: dynamicStats } = useHeroStats();

  const fallbackStats = [
    {
      value: 25,
      suffix: "+",
      label: t("hero.stats.years"),
      description: t("hero.stats.years_desc"),
      icon: <TrophyIcon />,
    },
    {
      value: 3000,
      suffix: "+",
      label: t("hero.stats.students"),
      description: t("hero.stats.students_desc"),
      icon: <GraduationIcon />,
    },
    {
      value: 5,
      suffix: "",
      label: t("hero.stats.units"),
      description: t("hero.stats.units_desc"),
      icon: <SchoolIcon />,
    },
    {
      value: 0,
      suffix: "",
      label: t("hero.stats.achievements"),
      description: t("hero.stats.achievements_desc"),
      icon: <AwardIcon />,
      isLetter: true,
      letter: "150+",
    },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    trophy: <TrophyIcon />,
    graduation: <GraduationIcon />,
    school: <SchoolIcon />,
    award: <AwardIcon />,
  };

  const currentLang = i18n.language || "id";

  const displayStats =
    dynamicStats && dynamicStats.length > 0
      ? dynamicStats.slice(0, 4).map((stat) => ({
          value: stat.value,
          suffix: stat.suffix || "",
          label: stat.label?.[currentLang] || stat.label?.id || "",
          description:
            stat.description?.[currentLang] || stat.description?.id || "",
          icon: iconMap[stat.icon] || <TrophyIcon />,
          isLetter: stat.is_letter,
          letter: stat.letter || "",
        }))
      : fallbackStats;

  // While loading: don't show anything yet (avoid flash of default images)
  // After loading: use API banners, or fall back to defaults if API returned empty/failed
  const activeImages = loading
    ? []
    : banners && banners.length > 0
      ? banners.map((b) => b.image)
      : defaultHeroImages;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset slide index when images change (e.g. banners loaded from API)
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeImages.length]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, activeImages.length]);

  return (
    <section
      className="relative min-h-screen min-w-screen overflow-hidden bg-[#020c1b]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Background Slideshow ── */}
      <AnimatePresence mode="wait">
        {activeImages.length > 0 && (
          <motion.img
            key={currentIndex}
            src={activeImages[currentIndex]}
            alt=""
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover object-center"
            loading="eager"
          />
        )}
      </AnimatePresence>

      {/* ── Dark Overlays ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,12,27,0.75) 0%, rgba(2,12,27,0.45) 40%, rgba(2,12,27,0.82) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(2,12,27,0.70) 0%, rgba(2,12,27,0.20) 50%, rgba(2,12,27,0.50) 100%)",
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Spacer for navbar */}
        <div className="h-20 lg:h-24" />

        {/* ── Vertical "Selamat Datang" label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="hidden lg:flex items-center gap-3 absolute left-8 top-1/2 -translate-y-1/2 z-20"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg) translateY(50%)",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#3D8ABF] animate-pulse" />
          <span
            className="text-xs text-white/40 tracking-[0.3em] uppercase font-medium"
            style={{ fontFamily: "'Geist', Inter, sans-serif" }}
          >
            {t("hero.welcome")}
          </span>
          <div className="w-px h-16 bg-white/10" />
        </motion.div>

        {/* Logo whatsapp untuk kontak */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="hidden lg:flex items-center gap-3 fixed right-8 top-1/2 -translate-y-1/2 z-20 mt-80"
          style={{}}
        >
          <a
            href="https://wa.me/6287720720829"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-2 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#1DA851] transition-all duration-300 shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 hover:scale-[1.03] shadow-md"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-8 h-8"
            />
          </a>
        </motion.div>

        {/* Hero Text Content — bold editorial */}
        <div className="flex-1 flex items-center pb-6 lg:pb-8">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Heading — bold + italic accent */}
              <h1 className="font-bold text-white leading-[0.95] tracking-tight">
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                >
                  {t("hero.title_line1")}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="block mt-1 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  style={{
                    fontFamily: metlandTitleFont,
                    fontWeight: 700,
                  }}
                >
                  {t("hero.title_line2")}
                </motion.span>
              </h1>

              {/* Accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-16 h-[2px] bg-[#3D8ABF] origin-left mt-6 mb-5"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="text-sm sm:text-base md:text-lg text-white/65 max-w-md lg:max-w-xl leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.7 }}
                className="flex flex-wrap gap-3 sm:gap-4 mt-8"
              >
                <a
                  href="/profil"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-[#3D8ABF] text-white text-sm font-semibold rounded-full hover:bg-[#2E6F9E] transition-all duration-300 shadow-lg shadow-[#3D8ABF]/25 hover:shadow-[#3D8ABF]/40 hover:scale-[1.03]"
                >
                  {t("hero.about_us")}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
                <a
                  href="/our-school"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                >
                  {t("hero.education_unit")}
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Mobile Slide Indicators ── */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-6 mt-4">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "w-8 bg-[#3D8ABF]"
                  : "w-3 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ─── Stats Strip (Bottom) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }}
          className="w-full border-t border-white/[0.08]"
          style={{
            background: "rgba(2,12,27,0.55)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.08]">
              {displayStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                  className="group px-4 sm:px-6 lg:px-8 py-5 lg:py-6 hover:bg-white/[0.03] transition-colors duration-500 overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-md min-w-0 flex-1 break-all whitespace-normal"
                      style={{ fontFamily: "'Geist', Inter, sans-serif" }}
                    >
                      {stat.isLetter ? (
                        <span>{stat.letter}</span>
                      ) : (
                        <AnimatedCounter
                          end={stat.value}
                          suffix={stat.suffix}
                          separator="."
                        />
                      )}
                    </div>
                    <div className="text-[#3D8ABF]/60 group-hover:text-[#3D8ABF] transition-colors duration-300 scale-90 shrink-0">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white/90 mb-1 truncate">
                    {stat.label}
                  </div>
                  <p className="text-[0.65rem] sm:text-xs text-white/50 leading-relaxed max-w-[90%] line-clamp-3">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Slide Indicators (vertical, right side) ── */}
        <div className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "w-2 h-8 bg-[#3D8ABF]"
                  : "w-2 h-2 bg-white/25 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Animated Wave — sits behind the stats strip */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-[5]">
        <style>{`
          @keyframes waveScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {/* Layer 1 — main wave */}
        <div
          style={{ width: "200%", animation: "waveScroll 18s linear infinite" }}
        >
          <svg
            viewBox="0 0 2880 120"
            className="block w-full h-[45px] sm:h-[54px] md:h-[63px] lg:h-[75px]"
            preserveAspectRatio="none"
          >
            <path
              fill="#3D8ABF"
              d="M0,40 C180,100 360,10 540,60 C720,110 900,20 1080,70 C1260,120 1440,30 1440,40 C1620,100 1800,10 1980,60 C2160,110 2340,20 2520,70 C2700,120 2880,30 2880,40 L2880,120 L0,120 Z"
            />
          </svg>
        </div>

        {/* Layer 2 — secondary wave (faster, translucent) */}
        <div
          style={{
            width: "200%",
            animation: "waveScroll 12s linear infinite",
            marginTop: "-30px",
          }}
        >
          <svg
            viewBox="0 0 2880 120"
            className="block w-full h-[36px] sm:h-[42px] md:h-[51px] lg:h-[60px]"
            preserveAspectRatio="none"
          >
            <path
              fill="rgba(61,138,191,0.45)"
              d="M0,60 C160,10 320,100 480,50 C640,0 800,90 960,40 C1120,0 1280,80 1440,60 C1600,10 1760,100 1920,50 C2080,0 2240,90 2400,40 C2560,0 2720,80 2880,60 L2880,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
