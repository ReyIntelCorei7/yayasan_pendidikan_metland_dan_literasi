import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface ImpactStatItem {
  id: string;
  value: number;
  suffix: string;
  label: any;
  description: any;
  icon: string;
}

export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        const data = await api.impactStats.list();
        if (mounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch impact stats'));
          console.error('Error fetching impact stats:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, loading, error };
}
