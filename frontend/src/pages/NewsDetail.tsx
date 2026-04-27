import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { posts } from '../data/posts';

const shareIcons = [
  { label: 'X', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'Facebook', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { label: 'LinkedIn', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

export default function NewsDetail() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Article Not Found</h1>
          <Link to="/news" className="text-lime hover:underline">← Back to News</Link>
        </div>
      </div>
    );
  }

  const related = posts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-lime z-[60] origin-left" style={{ scaleX }} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-charcoal mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <span className="text-xs text-lime bg-lime/10 rounded-full px-3 py-1 inline-block mb-4">{post.category}</span>
          <h1 className="text-3xl lg:text-5xl font-light leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <img src={post.author.photo} alt={post.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="text-charcoal font-medium">{post.author.name}</p>
              <p>{post.author.title}</p>
            </div>
            <span>·</span>
            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-16">
        <img src={post.featuredImage} alt={post.title} className="w-full aspect-[21/9] object-cover rounded-2xl" />
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 lg:px-8 pb-24">
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
          <p>{post.excerpt}</p>
          <p className="mt-6">{post.body}</p>
          <p className="mt-6">
            The impact of this work extends far beyond the immediate beneficiaries. When one person gains access
            to education or healthcare, the effects ripple through families, communities, and entire regions.
            This is the power of investing in human potential.
          </p>
          <p className="mt-6">
            As we look ahead, our commitment remains unwavering. We will continue to expand our reach,
            deepen our impact, and work alongside communities to build a brighter future for Africa.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1">#{tag}</span>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
          <Share2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Share</span>
          <div className="flex gap-2">
            {shareIcons.map((item) => (
              <a key={item.label} href="#" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-lime hover:border-lime transition-colors">
                {item.svg}
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-offwhite py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-12">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link key={p.id} to={`/news/${p.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-xl">
                    <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <h3 className="text-base font-medium mt-4 group-hover:text-lime transition-colors">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
