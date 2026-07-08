import { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';

export interface OrgChartMember {
  id: string;
  name: string;
  title: string;
  photo: string | null;
}

export interface OrgChartNode {
  id: string;
  label: string;
  subtitle: string | null;
  level: number;
  order: number;
  parent_id: string | null;
  members: OrgChartMember[];
}

export function useOrgChart() {
  const [data, setData] = useState<OrgChartNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/org-chart?_t=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch org chart');
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
  }, []);

  return { data, loading, error };
}
