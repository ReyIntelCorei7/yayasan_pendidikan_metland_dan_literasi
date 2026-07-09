import HeroSection from '../components/sections/HeroSection';
import MarqueeStrip from '../components/sections/MarqueeStrip';
import WhatWeDo from '../components/sections/WhatWeDo';
import ExperienceSpotlight from '../components/sections/ImpactSpotlight';
import ProgramsGrid from '../components/sections/ProgramsGrid';
import ExperienceNumbers from '../components/sections/ImpactNumbers';
import NewsInsights from '../components/sections/NewsInsights';
import PartnerLogos from '../components/sections/PartnerLogos';
import CTABanner from '../components/sections/CTABanner';
import ImpactSpotlight from '../components/sections/ImpactSpotlight';

export default function Home() {
  return (
    <div className="homepage-dark">
      <HeroSection />
      <MarqueeStrip />
      <NewsInsights />
      <ImpactSpotlight/>
      <WhatWeDo />
      <ExperienceNumbers />
      <ProgramsGrid />
      <PartnerLogos />
      <CTABanner />
    </div>
  );
}
