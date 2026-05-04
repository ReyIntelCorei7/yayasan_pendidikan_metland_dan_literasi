import HeroSection from '../components/sections/HeroSection';
import WhatWeDo from '../components/sections/WhatWeDo';
import ImpactSpotlight from '../components/sections/ImpactSpotlight';
import ProgramsGrid from '../components/sections/ProgramsGrid';
import ImpactNumbers from '../components/sections/ImpactNumbers';
import ScholarStories from '../components/sections/ScholarStories';
import NewsInsights from '../components/sections/NewsInsights';
import PartnerLogos from '../components/sections/PartnerLogos';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <NewsInsights />
      <ImpactSpotlight />
      <ProgramsGrid />
      <PartnerLogos />
    </>
  );
}
