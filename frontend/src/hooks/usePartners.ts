import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Partner } from '../types';

export default function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchPartners() {
      try {
        setLoading(true);
        const data = await api.partners.list();
        
        if (mounted) {
          setPartners(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Failed to fetch partners:', err);
        if (mounted) {
          setError('Gagal memuat mitra');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPartners();

    return () => {
      mounted = false;
    };
  }, []);

  return { partners, loading, error };
}
