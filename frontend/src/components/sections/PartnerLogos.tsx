import usePartners from '../../hooks/usePartners';

export default function PartnerLogos() {
  const { partners, loading } = usePartners();
  const activePartners = partners.filter((p) => p.isActive);

  /* Shared card renderer to avoid duplication */
  const renderPartner = (partner: (typeof activePartners)[0], keyPrefix = '') => (
    <a
      key={`${keyPrefix}${partner.id}`}
      href={partner.websiteUrl || '#'}
      target={partner.websiteUrl ? "_blank" : undefined}
      rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
      className={`mx-2 sm:mx-4 md:mx-6 flex items-center shrink-0 ${!partner.websiteUrl ? 'cursor-default' : ''}`}
      title={partner.name}
      onClick={(e) => {
        if (!partner.websiteUrl) e.preventDefault();
      }}
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

  if (loading) {
    return (
      <section className="bg-offwhite py-12 sm:py-16 md:py-20 overflow-hidden relative">
        <div className="section-divider w-full absolute top-0" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-primary uppercase tracking-widest mb-6 sm:mb-10 text-center font-semibold" style={{ fontFamily: "'Geist', Inter, sans-serif" }}>
            Mitra &amp; Pendukung Kami
          </p>
          <div className="flex justify-center space-x-8 animate-pulse opacity-50">
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
            <div className="w-24 h-12 bg-gray-200 rounded hidden sm:block"></div>
            <div className="w-24 h-12 bg-gray-200 rounded hidden md:block"></div>
          </div>
        </div>
      </section>
    );
  }

  if (activePartners.length === 0) {
    return null; // Don't show the section if no partners
  }

  return (
    <section className="bg-offwhite py-12 sm:py-16 md:py-20 overflow-hidden relative">
      {/* Top divider */}
      <div className="section-divider w-full absolute top-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p
          className="text-[10px] sm:text-xs text-primary uppercase tracking-widest mb-6 sm:mb-10 text-center font-semibold"
          style={{ fontFamily: "'Geist', Inter, sans-serif" }}
        >
          Mitra &amp; Pendukung Kami
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative group fade-mask-x">
        <div className="w-max flex animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
          {/* First set */}
          <div className="flex shrink-0 items-center justify-around">
            {activePartners.map((p) => renderPartner(p))}
          </div>
          {/* Duplicate set 1 for seamless loop */}
          <div className="flex shrink-0 items-center justify-around">
            {activePartners.map((p) => renderPartner(p, 'dup1-'))}
          </div>
          {/* Duplicate set 2 for ultra wide screens */}
          <div className="flex shrink-0 items-center justify-around">
            {activePartners.map((p) => renderPartner(p, 'dup2-'))}
          </div>
          {/* Duplicate set 3 for ultra wide screens */}
          <div className="flex shrink-0 items-center justify-around">
            {activePartners.map((p) => renderPartner(p, 'dup3-'))}
          </div>
        </div>
      </div>
    </section>
  );
}
