import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export interface HeroStat {
  id: number;
  value: number;
  suffix: string | null;
  label: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  is_letter: boolean;
  letter: string | null;
  sort_order: number;
}

export function useHeroStats() {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.heroStats.list();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch hero stats:', err);
        setError('Failed to fetch hero stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [i18n.language]);

  return { stats, loading, error };
}
