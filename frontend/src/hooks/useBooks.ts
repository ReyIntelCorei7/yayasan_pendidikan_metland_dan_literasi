import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  coverImage?: string;
  pdfUrl: string;
  order: number;
}

export default function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      try {
        if (page === 1) {
          setLoading(true);
          setBooks([]);
        } else {
          setLoadingMore(true);
        }

        const params: Record<string, string | number> = {
          page,
          per_page: 12,
        };
        if (activeCategory && activeCategory !== 'Semua') {
          params.category = activeCategory;
        }
        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const response = await api.books.list(params);

        if (controller.signal.aborted) return;

        if (response && response.data) {
          setBooks(prev => page === 1 ? response.data : [...prev, ...response.data]);
          setHasMore(response.current_page < response.last_page);
          setError(null);
        } else {
          console.error('[useBooks] Unexpected response format:', response);
          setBooks([]);
          setError('Format respons tidak sesuai');
        }
      } catch (err: any) {
        if (controller.signal.aborted) return;
        console.error('[useBooks] Failed to fetch books:', err);
        if (page === 1) setBooks([]);
        setError('Gagal memuat buku: ' + (err?.message || 'Unknown error'));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchBooks();
    return () => { controller.abort(); };
  }, [page, activeCategory, debouncedSearch]);

  // Reset when filters change
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
    books,
    loading,
    loadingMore,
    error,
    activeCategory,
    setActiveCategory: handleSetCategory,
    searchQuery,
    setSearchQuery: handleSetSearch,
    hasMore,
    loadMore,
  };
}
