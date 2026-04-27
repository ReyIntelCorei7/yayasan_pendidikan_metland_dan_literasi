import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import WordReveal from '../components/animations/WordReveal';
import StaggerGrid, { staggerItemVariants } from '../components/animations/StaggerGrid';
import { posts } from '../data/posts';

const categories = ['All', ...new Set(posts.map((p) => p.category))];

export default function NewsIndex() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = posts
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center bg-charcoal overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504711434969-e33886168d8c?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center px-6">
          <WordReveal text="News & Insights" tag="h1" className="text-4xl lg:text-6xl font-light text-white justify-center" delay={0.2} />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-400 mt-4">
            Stories, updates, and reports from across our programs.
          </motion.p>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    activeCategory === cat
                      ? 'bg-lime text-charcoal'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-lime/50 w-full md:w-64"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCategory + searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((post) => (
                  <motion.div key={post.id} variants={staggerItemVariants}>
                    <Link to={`/news/${post.slug}`} className="group block">
                      <div className="aspect-[16/10] overflow-hidden rounded-xl">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      <span className="text-xs text-lime bg-lime/10 rounded-full px-3 py-1 inline-block mb-3 mt-4">{post.category}</span>
                      <h3 className="text-base font-medium leading-snug text-charcoal group-hover:text-lime transition-colors">{post.title}</h3>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <span>{post.author.name}</span>
                        <span>·</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </StaggerGrid>
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-12">No articles found.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
