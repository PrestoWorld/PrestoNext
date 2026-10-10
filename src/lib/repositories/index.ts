/**
 * Repository Pattern for PrestoWorld Data Access
 * Provides abstraction layer for data fetching with caching strategies
 */

import { prestoworldApi } from '@/lib/api/prestoworld-client';
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
} from '@/types/prestoworld';

/**
 * Cache configuration for different data types
 */
interface CacheConfig {
  revalidate: number; // seconds
  tags: string[];
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  posts: { revalidate: 60, tags: ['posts'] },
  post: { revalidate: 300, tags: ['post'] },
  terms: { revalidate: 3600, tags: ['terms'] },
  term: { revalidate: 3600, tags: ['term'] },
  media: { revalidate: 3600, tags: ['media'] },
  menus: { revalidate: 3600, tags: ['menus'] },
  settings: { revalidate: 3600, tags: ['settings'] },
  users: { revalidate: 3600, tags: ['users'] },
};

/**
 * Base Repository Interface
 */
export interface IRepository<T, TQuery = unknown> {
  findAll(query?: TQuery): Promise<PrestoApiResponse<PrestoPaginatedResponse<T>>>;
  findById(id: number | string): Promise<PrestoApiResponse<T>>;
  findBySlug(slug: string, ...args: unknown[]): Promise<PrestoApiResponse<T>>;
}

/**
 * Post Repository
 */
export class PostRepository implements IRepository<PrestoPost, PrestoPostQuery> {
  private cache = CACHE_CONFIGS.posts;
  private singleCache = CACHE_CONFIGS.post;

  async findAll(query: PrestoPostQuery = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoPost>>> {
    return prestoworldApi.getPosts(query);
  }

  async findById(id: number | string, locale?: string): Promise<PrestoApiResponse<PrestoPost>> {
    return prestoworldApi.getPost(id, locale);
  }

  async findBySlug(slug: string, postType: string = 'post', locale?: string): Promise<PrestoApiResponse<PrestoPost>> {
    return prestoworldApi.getPostBySlug(slug, postType, locale);
  }

  /**
   * Get posts with ISR cache configuration
   */
  async findAllWithCache(query: PrestoPostQuery = {}): Promise<PrestoPaginatedResponse<PrestoPost> | null> {
    const response = await this.findAll(query);
    if (response.success) {
      return response.data;
    }
    return null;
  }

  /**
   * Get single post with ISR cache configuration
   */
  async findByIdWithCache(id: number | string, locale?: string): Promise<PrestoPost | null> {
    const response = await this.findById(id, locale);
    return response.success ? response.data : null;
  }

  /**
   * Get related posts by terms
   */
  async getRelatedPosts(postId: number, postType: string, limit: number = 5): Promise<PrestoPost[]> {
    const post = await this.findByIdWithCache(postId);
    if (!post) return [];

    const termIds = post.terms.map(t => t.id);
    if (termIds.length === 0) return [];

    const response = await this.findAll({
      post_type: postType,
      tax_query: [{
        taxonomy: post.terms[0]?.taxonomy || 'category',
        terms: termIds,
        operator: 'IN',
      }],
      per_page: limit + 1, // +1 to exclude current post
      status: 'publish',
    });

    if (!response.success) return [];

    return response.data.data
      .filter(p => p.id !== postId)
      .slice(0, limit);
  }
}

/**
 * Term Repository
 */
export class TermRepository implements IRepository<PrestoTerm, PrestoTermQuery> {
  private cache = CACHE_CONFIGS.terms;
  private singleCache = CACHE_CONFIGS.term;

  async findAll(query: PrestoTermQuery = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoTerm>>> {
    return prestoworldApi.getTerms(query);
  }

  async findById(id: number | string): Promise<PrestoApiResponse<PrestoTerm>> {
    return prestoworldApi.getTerm(id);
  }

  async findBySlug(slug: string, taxonomy: string): Promise<PrestoApiResponse<PrestoTerm>> {
    return prestoworldApi.getTermBySlug(slug, taxonomy);
  }

  async getCategories(query: Omit<PrestoTermQuery, 'taxonomy'> = {}): Promise<PrestoPaginatedResponse<PrestoTerm> | null> {
    const response = await prestoworldApi.getCategories(query);
    return response.success ? response.data : null;
  }

  async getTags(query: Omit<PrestoTermQuery, 'taxonomy'> = {}): Promise<PrestoPaginatedResponse<PrestoTerm> | null> {
    const response = await prestoworldApi.getTags(query);
    return response.success ? response.data : null;
  }

  async getCategoryBySlug(slug: string): Promise<PrestoTerm | null> {
    const response = await this.findBySlug(slug, 'category');
    return response.success ? response.data : null;
  }

  async getTagBySlug(slug: string): Promise<PrestoTerm | null> {
    const response = await this.findBySlug(slug, 'post_tag');
    return response.success ? response.data : null;
  }
}

/**
 * Media Repository
 */
export class MediaRepository implements IRepository<PrestoMedia> {
  private cache = CACHE_CONFIGS.media;

  async findAll(query: { per_page?: number; page?: number; search?: string } = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoMedia>>> {
    return prestoworldApi.getMedia(query);
  }

  async findById(id: number | string): Promise<PrestoApiResponse<PrestoMedia>> {
    return prestoworldApi.getMediaById(id);
  }

  async findBySlug(): Promise<PrestoApiResponse<PrestoMedia>> {
    throw new Error('Media does not support findBySlug');
  }

  async getMediaById(id: number | string): Promise<PrestoMedia | null> {
    const response = await this.findById(id);
    return response.success ? response.data : null;
  }
}

/**
 * Menu Repository
 */
export class MenuRepository implements IRepository<PrestoMenu> {
  private cache = CACHE_CONFIGS.menus;

  async findAll(): Promise<PrestoApiResponse<PrestoMenu[]>> {
    return prestoworldApi.getMenus();
  }

  async findById(): Promise<PrestoApiResponse<PrestoMenu>> {
    throw new Error('Use findBySlug for menus');
  }

  async findBySlug(slug: string): Promise<PrestoApiResponse<PrestoMenu>> {
    return prestoworldApi.getMenu(slug);
  }

  async getMenu(slug: string): Promise<PrestoMenu | null> {
    const response = await this.findBySlug(slug);
    return response.success ? response.data : null;
  }

  async getAllMenus(): Promise<PrestoMenu[]> {
    const response = await this.findAll();
    return response.success ? response.data : [];
  }
}

/**
 * Settings Repository
 */
export class SettingsRepository {
  private cache = CACHE_CONFIGS.settings;

  async getSettings(): Promise<PrestoSiteSettings | null> {
    const response = await prestoworldApi.getSiteSettings();
    return response.success ? response.data : null;
  }
}

/**
 * User Repository
 */
export class UserRepository implements IRepository<PrestoUser> {
  private cache = CACHE_CONFIGS.users;

  async findAll(query: { per_page?: number; page?: number; search?: string } = {}): Promise<PrestoApiResponse<PrestoPaginatedResponse<PrestoUser>>> {
    return prestoworldApi.getUsers(query);
  }

  async findById(id: number | string): Promise<PrestoApiResponse<PrestoUser>> {
    return prestoworldApi.getUser(id);
  }

  async findBySlug(): Promise<PrestoApiResponse<PrestoUser>> {
    throw new Error('Users do not support findBySlug');
  }

  async getUser(id: number | string): Promise<PrestoUser | null> {
    const response = await this.findById(id);
    return response.success ? response.data : null;
  }
}

/**
 * Search Repository
 */
export class SearchRepository {
  async search(query: string, options: { post_type?: string; per_page?: number } = {}): Promise<PrestoPaginatedResponse<PrestoPost> | null> {
    const response = await prestoworldApi.search(query, options);
    return response.success ? response.data : null;
  }
}

// Export singleton instances
export const postRepository = new PostRepository();
export const termRepository = new TermRepository();
export const mediaRepository = new MediaRepository();
export const menuRepository = new MenuRepository();
export const settingsRepository = new SettingsRepository();
export const userRepository = new UserRepository();
export const searchRepository = new SearchRepository();