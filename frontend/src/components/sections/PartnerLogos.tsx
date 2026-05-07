import { partners } from '../../data/partners';

export default function PartnerLogos() {
  const activePartners = partners.filter((p) => p.isActive);

  /* Shared card renderer to avoid duplication */
  const renderPartner = (partner: (typeof activePartners)[0], keyPrefix = '') => (
    <a
      key={`${keyPrefix}${partner.id}`}
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-4 sm:mx-6 md:mx-10 flex items-center shrink-0"
      title={partner.name}
    >
      <div className="w-[120px] h-[50px] sm:w-[180px] sm:h-[70px] md:w-[200px] md:h-[80px] flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300">
        {partner.logo && !partner.logo.includes('placeholder') ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-xs sm:text-sm md:text-base font-medium text-gray-500 hover:text-charcoal whitespace-nowrap">
            {partner.name}
          </span>
        )}
      </div>
    </a>
  );

  return (
    <section className="bg-offwhite py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-6 sm:mb-10 text-center">
          Our Partners &amp; Supporters
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative group">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r from-offwhite to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l from-offwhite to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
          {/* First set */}
          <div className="flex shrink-0 items-center">
            {activePartners.map((p) => renderPartner(p))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex shrink-0 items-center">
            {activePartners.map((p) => renderPartner(p, 'dup-'))}
          </div>
        </div>
      </div>
    </section>
  );
}
