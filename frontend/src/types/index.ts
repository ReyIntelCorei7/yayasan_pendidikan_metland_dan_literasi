export interface Program {
  id: string;
  title: string;
  slug: string;
  category: 'education' | 'health' | 'livelihoods';
  tagline: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  isFeatured: boolean;
  order: number;
}

export interface ImpactStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: string;
}

export interface Scholar {
  id: string;
  name: string;
  country: string;
  flag: string;
  quote: string;
  photo: string;
  program: string;
  graduationYear: number;
  isFeatured: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
    photo: string;
    title: string;
  };
  tags: string[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  websiteUrl: string;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  department: string;
  bio: string;
  photo: string;
  order: number;
  social: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
    description: string;
  }[];
}
