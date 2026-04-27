import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const footerLinks = {
  'Our School': [
    { label: 'TK Tunas Metropolitan', href: '/our-school/tk-tunas-metropolitan' },
    { label: 'SD Tunas Metropolitan', href: '/our-school/sd-tunas-metropolitan' },
    { label: 'SMK Pariwisata Metland School', href: '/our-school/smk-pariwisata-metland-school' },
    { label: 'SMK Metland', href: '/our-school/smk-metland' },
    { label: 'Metland College', href: '/our-school/metland-college' },
  ],
  'Navigasi': [
    { label: 'Home', href: '/' },
    { label: 'Visi & Misi', href: '/profil/visi-misi' },
    { label: 'Struktur Organisasi', href: '/profil/struktur-organisasi' },
    { label: 'Artikel', href: '/artikel' },
    { label: 'Literasi', href: '/literasi' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socialIcons = [
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ), href: '#', label: 'X (Twitter)' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  ), href: '#', label: 'Facebook' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  ), href: '#', label: 'Instagram' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ), href: '#', label: 'LinkedIn' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  ), href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo + Mission */}
          <div>
            <Link to="/" className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <path d="M18 2C18 2 8 8 8 18C8 28 18 34 18 34" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 4C18 4 10 9 10 18C10 27 18 32 18 32" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 6C18 6 12 10 12 18C12 26 18 30 18 30" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 8C18 8 14 11 14 18C14 25 18 28 18 28" stroke="#008C95" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 2C18 2 28 8 28 18C28 28 18 34 18 34" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 4C18 4 26 9 26 18C26 27 18 32 18 32" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 6C18 6 24 10 24 18C24 26 18 30 18 30" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 8C18 8 22 11 22 18C22 25 18 28 18 28" stroke="#008C95" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="font-semibold text-lg text-white">Higher Life</span>
            </Link>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-[200px]">
              Yayasan Pendidikan Metland — membangun generasi unggul melalui pendidikan berkualitas.
            </p>
          </div>

          {/* Columns 2-3: Nav Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-4">Tetap Terhubung</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="w-full bg-white/5 border border-white/10 rounded text-white placeholder-gray-600 px-4 py-3 text-sm focus:border-lime/50 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-lime text-charcoal w-full mt-2 py-3 rounded text-sm font-medium hover:bg-lime-hover transition-colors"
              >
                Berlangganan
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialIcons.map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:border-lime hover:bg-lime/10 hover:text-lime transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Yayasan Pendidikan Metland. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
