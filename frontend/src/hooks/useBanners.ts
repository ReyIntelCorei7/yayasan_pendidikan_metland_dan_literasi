import { useState, useEffect } from 'react';
import type { Banner } from '../types';

const API_BASE = '/api/v1';

export default function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const response = await fetch(`${API_BASE}/banners?_t=${timestamp}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: Banner[] = await response.json();
        
        if (mounted) {
          setBanners(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to fetch banners:', err);
          setError(err.message || 'Failed to load banners');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBanners();

    return () => {
      mounted = false;
    };
  }, []);

  return { banners, loading, error };
}
