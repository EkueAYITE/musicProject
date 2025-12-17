import {
  Article,
  Chanson,
  DashboardSummary,
  Poesie,
  Video,
  ApiResponse
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:4000/api';

type FetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

async function fetchJson<T>(endpoint: string, init?: FetchInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const publicApi = {
  getDashboard: (init?: FetchInit) => fetchJson<ApiResponse<DashboardSummary>>('/dashboard/summary', init),
  getChansons: (init?: FetchInit) => fetchJson<ApiResponse<Chanson[]>>('/chansons', init),
  getChanson: (id: number, init?: FetchInit) => fetchJson<ApiResponse<Chanson>>(`/chansons/${id}`, init),
  getVideos: (init?: FetchInit) => fetchJson<ApiResponse<Video[]>>('/videos', init),
  getVideo: (id: number, init?: FetchInit) => fetchJson<ApiResponse<Video>>(`/videos/${id}`, init),
  getPoesies: (init?: FetchInit) => fetchJson<ApiResponse<Poesie[]>>('/poesies', init),
  getPoesie: (id: number, init?: FetchInit) => fetchJson<ApiResponse<Poesie>>(`/poesies/${id}`, init),
  getArticles: (init?: FetchInit) => fetchJson<ApiResponse<Article[]>>('/articles', init),
  getArticle: (id: number, init?: FetchInit) => fetchJson<ApiResponse<Article>>(`/articles/${id}`, init)
};

export const contactApi = {
  async send(): Promise<void> {
    console.warn('Aucune API de contact configurée. Simuler seulement.');
    return Promise.resolve();
  }
};
