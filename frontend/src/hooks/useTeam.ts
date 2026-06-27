import { useState, useEffect } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  group: string;
  department: string | null;
  bio: string | null;
  photo: string | null;
  order: number;
  social: {
    linkedin: string | null;
    twitter: string | null;
  };
}

export function useTeam() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/v1/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch team data');
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
