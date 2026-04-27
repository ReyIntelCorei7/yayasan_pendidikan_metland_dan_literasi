import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCursor } from '../../hooks/useCursor';

export default function RootLayout() {
  const { cursorX, cursorY, isHovering, isTouchDevice } = useCursor();

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-lime focus:text-charcoal focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Custom Cursor (desktop only) */}
      {!isTouchDevice && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-[10px] h-[10px] bg-lime rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
              x: cursorX,
              y: cursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: isHovering ? 0 : 1 }}
          />
          <motion.div
            className="fixed top-0 left-0 w-[36px] h-[36px] border-2 border-lime/40 rounded-full pointer-events-none z-[9998]"
            style={{
              x: cursorX,
              y: cursorY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{ scale: isHovering ? 2.5 : 1, opacity: isHovering ? 0.4 : 1 }}
          />
        </>
      )}

      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
