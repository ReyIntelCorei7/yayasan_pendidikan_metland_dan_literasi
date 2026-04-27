import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WordReveal from '../animations/WordReveal';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerGrid, { staggerItemVariants } from '../animations/StaggerGrid';
import { posts } from '../../data/posts';

const displayPosts = posts.slice(0, 6);

export default function NewsInsights() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <ScrollReveal>
              <p className="text-xs text-lime uppercase tracking-[0.2em] mb-4">Latest Updates</p>
            </ScrollReveal>
            <WordReveal
              text="News & Insights"
              tag="h2"
              className="text-4xl lg:text-5xl font-light text-charcoal"
            />
          </div>
          <Link
            to="/news"
            className="text-sm font-medium text-charcoal hover:text-lime transition-colors mt-4 md:mt-0 group"
          >
            View All
            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <motion.div key={post.id} variants={staggerItemVariants}>
              <Link to={`/news/${post.slug}`} className="group block">
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden rounded-xl">
                  <motion.img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    loading="lazy"
                  />
                </div>

                {/* Category */}
                <span className="text-xs text-lime bg-lime/10 rounded-full px-3 py-1 inline-block mb-3 mt-4">
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-base font-medium leading-snug text-charcoal group-hover:text-lime transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <img
                    src={post.author.photo}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                    loading="lazy"
                  />
                  <span>{post.author.name}</span>
                  <span>·</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
