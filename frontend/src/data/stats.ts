import type { ImpactStat } from '../types';

export const impactStats: ImpactStat[] = [
  {
    id: '1',
    value: 5000,
    suffix: '+',
    label: 'E-Book Tersedia',
    description: 'Akses ke ribuan e-book gratis untuk siswa dan guru.',
    icon: 'book',
  },
  {
    id: '2',
    value: 1200,
    suffix: '+',
    label: 'Buku Fisik',
    description: 'Koleksi buku fisik berkualitas di setiap perpustakaan sekolah.',
    icon: 'book-open',
  },
  {
    id: '3',
    value: 12,
    suffix: '',
    label: 'Ruang Baca',
    description: 'Ruang baca dan diskusi yang nyaman bagi siswa.',
    icon: 'users',
  },
  {
    id: '4',
    value: 5,
    suffix: '',
    label: 'Unit Sekolah',
    description: 'Program aktif di seluruh sekolah jaringan Metland.',
    icon: 'home',
  },
];
