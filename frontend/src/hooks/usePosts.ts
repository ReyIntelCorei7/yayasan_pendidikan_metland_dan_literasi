import { useState, useEffect } from 'react';
import type { Post } from '../types';
import { posts as staticPosts } from '../data/posts';
import api from '../services/api';

// ─── Module-level shared state ────────────────────────────────────────────────
// Shared across all hook instances so only ONE network request happens at a time.

let cachedPosts: Post[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/** The in-flight promise, shared so concurrent callers wait on the same request */
let pendingPromise: Promise<Post[]> | null = null;

function isCacheValid(): boolean {
  return cachedPosts !== null && Date.now() - cacheTimestamp < CACHE_DURATION;
}

/** Fetch with a hard timeout; resolves to static data if API is too slow or fails */
function fetchWithTimeout(timeoutMs = 5000): Promise<Post[]> {
  if (pendingPromise) return pendingPromise; // deduplicate concurrent calls

  const fetchPromise = api.posts.list() as Promise<Post[]>;
  const timeoutPromise = new Promise<Post[]>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );

  pendingPromise = Promise.race([fetchPromise, timeoutPromise])
    .then((data) => {
      cachedPosts = data;
      cacheTimestamp = Date.now();
      return data;
    })
    .catch((err) => {
      console.warn('[usePosts] API failed, using static data:', err);
      return staticPosts as Post[];
    })
    .finally(() => {
      pendingPromise = null; // allow future fetches
    });

  return pendingPromise;
}

// ─── usePosts ─────────────────────────────────────────────────────────────────

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(cachedPosts ?? staticPosts as Post[]);
  const [loading, setLoading] = useState(!isCacheValid());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Already have fresh cached data — no need to fetch
    if (isCacheValid()) {
      setPosts(cachedPosts!);
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetchWithTimeout(5000)
      .then((data) => {
        if (cancelled) return;
        // If data is static fallback (not from API), show a soft warning
        if (data === staticPosts) {
          setError('Tidak dapat memuat artikel terbaru. Menampilkan data offline.');
        }
        setPosts(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { posts, loading, error };
}

// ─── usePost ──────────────────────────────────────────────────────────────────

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

    // Check module-level cache first
    if (isCacheValid() && cachedPosts) {
      const found = cachedPosts.find((p) => p.slug === slug) ?? null;
      setPost(found);
      setLoading(false);
      return;
    }

    const fetchPromise = api.posts.bySlug(slug) as Promise<Post>;
    const timeoutPromise = new Promise<Post>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    );

    Promise.race([fetchPromise, timeoutPromise])
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        console.warn('[usePost] API failed, using static data:', err);
        if (!cancelled) {
          const fallback = staticPosts.find((p) => p.slug === slug) ?? null;
          setPost(fallback);
          if (!fallback) setError('Artikel tidak ditemukan.');
        }
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
