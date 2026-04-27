// API Service - Connects React frontend to Laravel backend
// Falls back to static data if API is unavailable

const API_BASE = '/api/v1';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  programs: {
    list: () => fetchApi<any[]>('/programs'),
    bySlug: (slug: string) => fetchApi<any>(`/programs/${slug}`),
  },
  posts: {
    list: () => fetchApi<any[]>('/posts'),
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
  team: {
    list: () => fetchApi<any[]>('/team'),
  },
  books: {
    list: () => fetchApi<any[]>('/books'),
    byId: (id: string) => fetchApi<any>(`/books/${id}`),
  },
};

export default api;
