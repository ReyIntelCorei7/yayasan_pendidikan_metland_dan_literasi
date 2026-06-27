import { useState, useEffect } from 'react';
import { getTrans } from '../i18n';
import { API_BASE } from '../services/api';

export function usePageContent(page: string, language: string) {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/page-contents/${encodeURIComponent(page)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch page content');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  const getContent = (section: string) => {
    return getTrans(data[section], language);
  };

  return { data, getContent, loading, error };
}
