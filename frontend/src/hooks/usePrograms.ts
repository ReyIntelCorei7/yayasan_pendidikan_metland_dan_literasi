import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function usePrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const data = await api.programs.list();
        setPrograms(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch programs'));
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}
