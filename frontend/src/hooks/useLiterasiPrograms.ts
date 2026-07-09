import { useState, useEffect } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export interface LiterasiProgramItem {
  id?: string;
  title: string;
  desc: string;
}

export default function useLiterasiPrograms() {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<LiterasiProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api.literasiPrograms
      .list()
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setPrograms(
            data.map((p: any) => ({
              id: p.id,
              title: p.title,
              desc: p.description,
            }))
          );
        } else {
          // Fallback ke data i18n jika API kosong
          const literasiData = t('literasi', { returnObjects: true }) as any;
          setPrograms((literasiData.programs ?? []) as LiterasiProgramItem[]);
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Fallback ke data i18n jika API error
        const literasiData = t('literasi', { returnObjects: true }) as any;
        setPrograms((literasiData.programs ?? []) as LiterasiProgramItem[]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  return { programs, loading };
}
