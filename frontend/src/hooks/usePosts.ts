import { useState, useEffect, useRef, useCallback } from 'react';
import type { Post } from '../types';
import api from '../services/api';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

    async function fetchPostsWithRetry(attempt = 0): Promise<void> {
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
      } catch (err) {
        if (cancelled || currentFetchId !== fetchIdRef.current) return;

        // Retry on transient errors (network, 429, 5xx)
        if (attempt < MAX_RETRIES) {
          console.warn(`[usePosts] Attempt ${attempt + 1} failed, retrying in ${RETRY_DELAY_MS}ms...`, err);
          await delay(RETRY_DELAY_MS);
          if (!cancelled && currentFetchId === fetchIdRef.current) {
            return fetchPostsWithRetry(attempt + 1);
          }
          return;
        }

        console.error('[usePosts] All retries failed:', err);
        // DON'T clear existing posts on error — keep previous data visible
        // Only set error message so the UI can show a non-destructive notification
        setError('Gagal memuat artikel terbaru. Silakan coba refresh halaman.');
      } finally {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchPostsWithRetry();
    return () => { cancelled = true; };
  }, [page, activeCategory, searchQuery]);

  const handleSetCategory = useCallback((cat: string) => {
    setActiveCategory(prev => {
      if (prev === cat) return prev;
      setPage(1);
      return cat;
    });
  }, []);

  const handleSetSearch = useCallback((query: string) => {
    setSearchQuery(prev => {
      if (prev === query) return prev;
      setPage(1);
      return query;
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setPage(p => p + 1);
    }
  }, [loading, loadingMore, hasMore]);

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
