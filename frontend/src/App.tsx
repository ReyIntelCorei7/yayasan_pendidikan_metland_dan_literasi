import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RootLayout from './components/layout/RootLayout';
import PageTransition from './components/animations/PageTransition';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const VisiMisi = lazy(() => import('./pages/VisiMisi'));
const StrukturOrganisasi = lazy(() => import('./pages/StrukturOrganisasi'));
const OurSchool = lazy(() => import('./pages/OurSchool'));
const SchoolDetail = lazy(() => import('./pages/SchoolDetail'));
const Artikel = lazy(() => import('./pages/Artikel'));
const ArtikelDetail = lazy(() => import('./pages/ArtikelDetail'));
const Literasi = lazy(() => import('./pages/Literasi'));
const Contact = lazy(() => import('./pages/Contact'));

// Keep old routes available for backward compatibility
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const ProgramDetail = lazy(() => import('./pages/ProgramDetail'));
const Impact = lazy(() => import('./pages/Impact'));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageTransition locationKey={location.pathname}>
        <Routes location={location}>
          <Route element={<RootLayout />}>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />

            {/* Profil Routes */}
            <Route path="/profil" element={<VisiMisi />} />
            <Route path="/profil/visi-misi" element={<VisiMisi />} />
            <Route path="/profil/struktur-organisasi" element={<StrukturOrganisasi />} />

            {/* Our School Routes */}
            <Route path="/our-school" element={<OurSchool />} />
            <Route path="/our-school/:slug" element={<SchoolDetail />} />

            {/* Artikel Routes */}
            <Route path="/artikel" element={<Artikel />} />
            <Route path="/artikel/:slug" element={<ArtikelDetail />} />

            {/* Literasi Route */}
            <Route path="/literasi" element={<Literasi />} />

            {/* Contact Route */}
            <Route path="/contact" element={<Contact />} />

            {/* Legacy routes - keep for backward compat */}
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:slug" element={<ProgramDetail />} />
            <Route path="/impact" element={<Impact />} />

            {/* Old news routes → redirect internally still work */}
            <Route path="/news" element={<Artikel />} />
            <Route path="/news/:slug" element={<ArtikelDetail />} />
          </Route>
        </Routes>
      </PageTransition>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
