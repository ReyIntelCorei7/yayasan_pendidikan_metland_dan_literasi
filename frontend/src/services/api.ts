// API Service - Connects React frontend to Laravel backend
// Falls back to static data if API is unavailable

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

async function fetchApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}&_t=${Date.now()}`;
    } else {
      url += `?_t=${Date.now()}`;
    }
  } else {
    url += `?_t=${Date.now()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
}

export const api = {
  programs: {
    list: () => fetchApi<any[]>('/programs'),
    bySlug: (slug: string) => fetchApi<any>(`/programs/${slug}`),
  },
  posts: {
    list: (params?: { page?: number; per_page?: number; category?: string; search?: string }) => 
      fetchApi<PaginatedResponse<any>>('/posts', params),
    bySlug: (slug: string) => fetchApi<any>(`/posts/${slug}`),
  },
  scholars: {
    list: () => fetchApi<any[]>('/scholars'),
  },
  partners: {
    list: () => fetchApi<any[]>('/partners'),
  },
  impactStats: {
    list: () => fetchApi<any[]>('/impact-stats'),
  },
  collectionStats: {
    list: () => fetchApi<any[]>('/collection-stats'),
  },
  team: {
    list: () => fetchApi<any[]>('/team'),
  },
  books: {
    list: (params?: { page?: number; per_page?: number; category?: string; search?: string }) => 
      fetchApi<PaginatedResponse<any>>('/books', params),
    byId: (id: string) => fetchApi<any>(`/books/${id}`),
  },
  heroStats: {
    list: () => fetchApi<any[]>('/hero-stats'),
  },
};

export default api;
