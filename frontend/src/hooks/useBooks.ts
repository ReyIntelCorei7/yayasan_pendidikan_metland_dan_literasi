import { useState, useEffect, useMemo } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await api.books.list();
        if (!cancelled) {
          setBooks(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch books:', err);
        if (!cancelled) {
          setBooks([]);
          setError('Gagal memuat buku');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();
    return () => { cancelled = true; };
  }, []);

  const filteredBooks = useMemo(() => {
    if (activeCategory === 'Semua') return books;
    return books.filter((b) => b.category === activeCategory);
  }, [books, activeCategory]);

  return {
    books,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    filteredBooks,
  };
}
