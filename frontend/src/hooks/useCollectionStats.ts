import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface CollectionStatItem {
  id: string;
  value: number;
  suffix: string;
  title: any;
  description: any;
}

export function useCollectionStats() {
  const [stats, setStats] = useState<CollectionStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.collectionStats.list();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch collection stats'));
        console.error('Error fetching collection stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
