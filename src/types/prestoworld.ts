/**
 * Core type definitions for PrestoWorld CMS API
 * Based on the Schema module's PostRepository and data structures
 */

/**
 * Base post type from PrestoWorld
 */
export interface PrestoPost {
  id: number;
  post_type: string;
  status: 'publish' | 'draft' | 'pending' | 'private' | 'trash' | 'auto-draft';
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  link: string;
  terms: PrestoTerm[];
  custom_data?: Record<string, unknown>;
  translations?: PrestoTranslation[];
}

/**
 * Term/Taxonomy from PrestoWorld
 */
export interface PrestoTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  url: string;
}

/**
 * Translation data for multilingual content
 */
export interface PrestoTranslation {
  translation_id: number;
  locale: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  source_language_code?: string;
}

/**
 * Media/Attachment from PrestoWorld
 */
export interface PrestoMedia {
  id: number;
  post_type: 'attachment';
  title: string;
  slug: string;
  mime_type: string;
  file_url: string;
  file_path: string;
  file_size: number;
  width?: number;
  height?: number;
  alt_text: string;
  caption: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * User/Author from PrestoWorld
 */
export interface PrestoUser {
  id: number;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

/**
 * Menu item for navigation
 */
export interface PrestoMenuItem {
  id: number;
  title: string;
  url: string;
  target?: string;
  classes?: string[];
  children?: PrestoMenuItem[];
  order: number;
  parent_id?: number;
}

/**
 * Menu structure
 */
export interface PrestoMenu {
  id: number;
  name: string;
  slug: string;
  items: PrestoMenuItem[];
}

/**
 * Site settings/configuration
 */
export interface PrestoSiteSettings {
  site_title: string;
  site_tagline: string;
  site_url: string;
  home_url: string;
  admin_email: string;
  timezone: string;
  locale: string;
  date_format: string;
  time_format: string;
  posts_per_page: number;
  default_category: number;
  default_post_format: string;
}

/**
 * Pagination response
 */
export interface PrestoPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

/**
 * API query parameters for posts
 */
export interface PrestoPostQuery {
  post_type?: string | string[];
  status?: string;
  search?: string;
  category?: string;
  tag?: string;
  author?: number;
  tax_query?: Array<{
    taxonomy: string;
    terms: string | string[];
    field?: 'slug' | 'term_id' | 'id';
    operator?: 'IN' | 'NOT IN' | 'AND';
  }>;
  order?: 'ASC' | 'DESC';
  orderby?: 'date' | 'title' | 'id' | 'modified' | 'rand';
  per_page?: number;
  page?: number;
  offset?: number;
  locale?: string;
}

/**
 * API query parameters for terms
 */
export interface PrestoTermQuery {
  taxonomy?: string | string[];
  search?: string;
  parent?: number;
  hide_empty?: boolean;
  per_page?: number;
  page?: number;
  orderby?: 'name' | 'slug' | 'count' | 'id';
  order?: 'ASC' | 'DESC';
}

/**
 * API error response
 */
export interface PrestoApiError {
  success: false;
  error: string;
  message?: string;
  code?: string;
  status: number;
}

/**
 * API success response
 */
export interface PrestoApiSuccess<T> {
  success: true;
  data: T;
}

/**
 * Generic API response
 */
export type PrestoApiResponse<T> = PrestoApiSuccess<T> | PrestoApiError;

/**
 * Block content from Gutenberg
 */
export interface PrestoBlock {
  name: string;
  attrs: Record<string, unknown>;
  innerBlocks?: PrestoBlock[];
  innerContent?: string[];
  innerHTML?: string;
}

/**
 * Parsed Gutenberg content
 */
export interface PrestoParsedContent {
  blocks: PrestoBlock[];
  html: string;
  plainText: string;
}