import { useState, useEffect, useRef } from 'react';
import type { Post } from '../types';
import api from '../services/api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentFetchId = ++fetchIdRef.current;

    async function fetchPosts() {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await api.posts.list({
          page,
          per_page: 15,
          category: activeCategory === 'All' ? undefined : activeCategory,
          search: searchQuery || undefined,
        });

        if (cancelled || currentFetchId !== fetchIdRef.current) return;

        setPosts(prev => page === 1 ? response.data : [...prev, ...response.data]);
        setHasMore(response.current_page < response.last_page);
        setError(null);
        
        if (page === 1 && response.data.length === 0) {
          setError('Gagal memuat artikel atau tidak ada artikel ditemukan.');
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        if (cancelled || currentFetchId !== fetchIdRef.current) return;
        if (page === 1) setPosts([]);
        setError('Gagal memuat artikel terbaru.');
      } finally {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, [page, activeCategory, searchQuery]);

  const handleSetCategory = (cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSetSearch = (query: string) => {
    if (query === searchQuery) return;
    setSearchQuery(query);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setPage(p => p + 1);
    }
  };

  return { 
    posts, 
    loading, 
    loadingMore, 
    error,
    activeCategory,
    setActiveCategory: handleSetCategory,
    searchQuery,
    setSearchQuery: handleSetSearch,
    hasMore,
    loadMore
  };
}

export function usePost(slug: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    api.posts.bySlug(slug)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        console.warn('[usePost] API failed:', err);
        if (!cancelled) setError('Artikel tidak ditemukan.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
}
