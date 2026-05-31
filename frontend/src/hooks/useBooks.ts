import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

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
  
  // Track last fetch to prevent duplicate requests
  const fetchIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const currentFetchId = ++fetchIdRef.current;

    async function fetchBooks() {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await api.books.list({
          page,
          per_page: 12,
          category: activeCategory === 'Semua' ? undefined : activeCategory,
          search: searchQuery || undefined,
        });

        if (cancelled || currentFetchId !== fetchIdRef.current) return;

        setBooks(prev => page === 1 ? response.data : [...prev, ...response.data]);
        setHasMore(response.current_page < response.last_page);
        setError(null);
        
        if (page === 1 && response.data.length === 0) {
          setError('Gagal memuat buku atau tidak ada buku ditemukan.');
        }
      } catch (err) {
        console.error('Failed to fetch books:', err);
        if (cancelled || currentFetchId !== fetchIdRef.current) return;
        if (page === 1) setBooks([]);
        setError('Gagal memuat buku');
      } finally {
        if (!cancelled && currentFetchId === fetchIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    fetchBooks();
    return () => { cancelled = true; };
  }, [page, activeCategory, searchQuery]);

  // Reset when filters change
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
