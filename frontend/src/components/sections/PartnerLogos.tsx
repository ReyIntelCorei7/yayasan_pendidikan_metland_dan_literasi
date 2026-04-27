import { partners } from '../../data/partners';

export default function PartnerLogos() {
  const activePartners = partners.filter((p) => p.isActive);

  return (
    <section className="bg-offwhite py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-8 text-center">
          Our Partners & Supporters
        </p>
      </div>

      {/* Infinite Marquee */}
      <div className="relative group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
          {/* First set */}
          <div className="flex shrink-0">
            {activePartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-10 flex items-center shrink-0"
              >
                <div className="w-[120px] h-[50px] flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-500 hover:text-charcoal whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex shrink-0">
            {activePartners.map((partner) => (
              <a
                key={`dup-${partner.id}`}
                href={partner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-10 flex items-center shrink-0"
              >
                <div className="w-[120px] h-[50px] flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300">
                  <span className="text-sm font-medium text-gray-500 hover:text-charcoal whitespace-nowrap">
                    {partner.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
