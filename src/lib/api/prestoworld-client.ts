/**
 * API Client for PrestoWorld CMS
 * Type-safe interface for communicating with the headless API
 */

import type {
  PrestoPost,
  PrestoPaginatedResponse,
  PrestoPostQuery,
  PrestoTerm,
  PrestoTermQuery,
  PrestoMedia,
  PrestoUser,
  PrestoMenu,
  PrestoSiteSettings,
  PrestoApiResponse,
  PrestoApiError,
} from '@/types/prestoworld';

const API_BASE_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

class PrestoWorldApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PrestoApiResponse<T>> {
    const url = `${this.baseUrl}/api/${API_VERSION}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      next: { revalidate: 60 }, // Default ISR revalidation
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'API request failed',
        code: data.code,
        status: response.status,
      } as PrestoApiError;
    }

    return { success: true, data } as PrestoApiResponse<T>;
  }

  // Posts
  async getPosts(query: PrestoPostQuery = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoPost>>> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, String(v)));
        } else {
          params.set(key, String(value));
        }
      }
    });

    return this.request<PrestoPaginatedResponse<PrestoPost>>(`/posts?${params.toString()}`);
  }

  async getPost(id: number | string, locale?: string): Promise<PrestoApiResponse<PrestoPost>> {
    const params = locale ? `?locale=${locale}` : '';
    return this.request<PrestoPost>(`/posts/${id}${params}`);
  }

  async getPostBySlug(slug: string, postType: string = 'post', locale?: string): Promise<PrestoApiResponse<PrestoPost>> {
    const params = new URLSearchParams({ slug, post_type: postType });
    if (locale) params.set('locale', locale);
    return this.request<PrestoPost>(`/posts/by-slug?${params.toString()}`);
  }

  // Terms/Taxonomies
  async getTerms(query: PrestoTermQuery = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoTerm>>> {
    const params = new URLSearchParams();
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, String(v)));
        } else {
          params.set(key, String(value));
        }
      }
    });

    return this.request<PrestoPaginatedResponse<PrestoTerm>>(`/terms?${params.toString()}`);
  }

  async getTerm(id: number | string): Promise<PrestoApiResponse<PrestoTerm>> {
    return this.request<PrestoTerm>(`/terms/${id}`);
  }

  async getTermBySlug(slug: string, taxonomy: string): Promise<PrestoApiResponse<PrestoTerm>> {
    return this.request<PrestoTerm>(`/terms/by-slug?slug=${slug}&taxonomy=${taxonomy}`);
  }

  // Categories (convenience)
  async getCategories(query: Omit<PrestoTermQuery, 'taxonomy'> = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoTerm>>> {
    return this.getTerms({ ...query, taxonomy: 'category' });
  }

  // Tags (convenience)
  async getTags(query: Omit<PrestoTermQuery, 'taxonomy'> = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoTerm>>> {
    return this.getTerms({ ...query, taxonomy: 'post_tag' });
  }

  // Media
  async getMedia(query: { per_page?: number; page?: number; search?: string } = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoMedia>>> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    return this.request<PrestoPaginatedResponse<PrestoMedia>>(`/media?${params.toString()}`);
  }

  async getMediaById(id: number | string): Promise<PrestoApiResponse<PrestoMedia>> {
    return this.request<PrestoMedia>(`/media/${id}`);
  }

  // Users
  async getUser(id: number | string): Promise<PrestoApiResponse<PrestoUser>> {
    return this.request<PrestoUser>(`/users/${id}`);
  }

  async getUsers(query: { per_page?: number; page?: number; search?: string } = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoUser>>> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    return this.request<PrestoPaginatedResponse<PrestoUser>>(`/users?${params.toString()}`);
  }

  // Menus
  async getMenus(): Promise<PrestoApiResponse<PrestoMenu[]>> {
    return this.request<PrestoMenu[]>('/menus');
  }

  async getMenu(slug: string): Promise<PrestoApiResponse<PrestoMenu>> {
    return this.request<PrestoMenu>(`/menus/${slug}`);
  }

  // Site Settings
  async getSiteSettings(): Promise<PrestoApiResponse<PrestoSiteSettings>> {
    return this.request<PrestoSiteSettings>('/settings');
  }

  // Search
  async search(query: string, options: { post_type?: string; per_page?: number } = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoPost>>> {
    const params = new URLSearchParams({ q: query });
    if (options.post_type) params.set('post_type', options.post_type);
    if (options.per_page) params.set('per_page', String(options.per_page));
    return this.request<PrestoPaginatedResponse<PrestoPost>>(`/search?${params.toString()}`);
  }
}

// Singleton instance
export const prestoworldApi = new PrestoWorldApiClient();

// Named exports for convenience
export const api = prestoworldApi;
export default prestoworldApi;