/**
 * Custom React Hooks for PrestoNext
 * Data fetching, caching, and state management
 */

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { useCallback, useMemo } from 'react';
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
} from '@/types/prestoworld';
import {
  postRepository,
  termRepository,
  mediaRepository,
  menuRepository,
  settingsRepository,
  userRepository,
  searchRepository,
} from '@/lib/repositories';
import { getRevalidationTime } from '@/config';

/**
 * Generic fetcher for SWR
 */
const fetcher = async <T,>(key: string): Promise<T> => {
  const response = await fetch(key);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

/**
 * Hook for fetching posts with pagination
 */
export function usePosts(query: PrestoPostQuery = {}, options: SWRConfiguration<PrestoPaginatedResponse<PrestoPost>> = {}) {
  const key = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (Array.isArray(v)) {
          v.forEach(val => params.append(`${k}[]`, String(val)));
        } else {
          params.set(k, String(v));
        }
      }
    });
    return `/api/posts?${params.toString()}`;
  }, [query]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPaginatedResponse<PrestoPost>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      ...options,
    }
  );

  return {
    posts: data?.data ?? [],
    pagination: data?.meta,
    links: data?.links,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching a single post
 */
export function usePost(id: number | string | null, locale?: string) {
  const key = useMemo(() => {
    if (!id) return null;
    const params = locale ? `?locale=${locale}` : '';
    return `/api/posts/${id}${params}`;
  }, [id, locale]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPost>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    post: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching a post by slug
 */
export function usePostBySlug(slug: string | null, postType: string = 'post', locale?: string) {
  const key = useMemo(() => {
    if (!slug) return null;
    const params = new URLSearchParams({ slug, post_type: postType });
    if (locale) params.set('locale', locale);
    return `/api/posts/by-slug?${params.toString()}`;
  }, [slug, postType, locale]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPost>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    post: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching terms (categories, tags, custom taxonomies)
 */
export function useTerms(query: PrestoTermQuery = {}, options: SWRConfiguration<PrestoPaginatedResponse<PrestoTerm>> = {}) {
  const key = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (Array.isArray(v)) {
          v.forEach(val => params.append(`${k}[]`, String(val)));
        } else {
          params.set(k, String(v));
        }
      }
    });
    return `/api/terms?${params.toString()}`;
  }, [query]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPaginatedResponse<PrestoTerm>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...options,
    }
  );

  return {
    terms: data?.data ?? [],
    pagination: data?.meta,
    links: data?.links,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching categories
 */
export function useCategories(query: Omit<PrestoTermQuery, 'taxonomy'> = {}) {
  return useTerms({ ...query, taxonomy: 'category' });
}

/**
 * Hook for fetching tags
 */
export function useTags(query: Omit<PrestoTermQuery, 'taxonomy'> = {}) {
  return useTerms({ ...query, taxonomy: 'post_tag' });
}

/**
 * Hook for fetching a single term
 */
export function useTerm(id: number | string | null) {
  const key = useMemo(() => id ? `/api/terms/${id}` : null, [id]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoTerm>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    term: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching media
 */
export function useMedia(query: { per_page?: number; page?: number; search?: string } = {}) {
  const key = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v));
    });
    return `/api/media?${params.toString()}`;
  }, [query]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPaginatedResponse<PrestoMedia>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    media: data?.data ?? [],
    pagination: data?.meta,
    links: data?.links,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching menus
 */
export function useMenu(slug: string | null) {
  const key = useMemo(() => slug ? `/api/menus/${slug}` : null, [slug]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoMenu>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    menu: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching all menus
 */
export function useMenus() {
  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoMenu[]>(
    '/api/menus',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    menus: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching site settings
 */
export function useSiteSettings() {
  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoSiteSettings>(
    '/api/settings',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    }
  );

  return {
    settings: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for fetching user/author
 */
export function useUser(id: number | string | null) {
  const key = useMemo(() => id ? `/api/users/${id}` : null, [id]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoUser>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for search
 */
export function useSearch(query: string, options: { post_type?: string; per_page?: number } = {}) {
  const key = useMemo(() => {
    if (!query.trim()) return null;
    const params = new URLSearchParams({ q: query });
    if (options.post_type) params.set('post_type', options.post_type);
    if (options.per_page) params.set('per_page', String(options.per_page));
    return `/api/search?${params.toString()}`;
  }, [query, options.post_type, options.per_page]);

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPaginatedResponse<PrestoPost>>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    results: data?.data ?? [],
    pagination: data?.meta,
    links: data?.links,
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for related posts
 */
export function useRelatedPosts(postId: number | null, postType: string, limit: number = 5) {
  const key = useMemo(() => 
    postId ? `/api/posts/${postId}/related?type=${postType}&limit=${limit}` : null,
    [postId, postType, limit]
  );

  const { data, error, isLoading, mutate, ...rest } = useSWR<PrestoPost[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    posts: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
    ...rest,
  };
}

/**
 * Hook for prefetching data
 */
export function usePrefetch() {
  const prefetch = useCallback(async (key: string) => {
    try {
      await fetch(key);
    } catch {
      // Ignore prefetch errors
    }
  }, []);

  const prefetchPost = useCallback(async (id: number | string) => {
    await prefetch(`/api/posts/${id}`);
  }, [prefetch]);

  const prefetchPosts = useCallback(async (query: PrestoPostQuery) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (Array.isArray(v)) {
          v.forEach(val => params.append(`${k}[]`, String(val)));
        } else {
          params.set(k, String(v));
        }
      }
    });
    await prefetch(`/api/posts?${params.toString()}`);
  }, [prefetch]);

  return {
    prefetch,
    prefetchPost,
    prefetchPosts,
  };
}

/**
 * Hook for infinite scrolling pagination
 */
export function useInfinitePosts(query: PrestoPostQuery = {}) {
  const { data, error, isLoading, mutate, size, setSize } = useSWR<PrestoPaginatedResponse<PrestoPost>[]>(
    '/api/posts/infinite',
    async (_, { arg: page }) => {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          if (Array.isArray(v)) {
            v.forEach(val => params.append(`${k}[]`, String(val)));
          } else {
            params.set(k, String(v));
          }
        }
      });
      params.set('page', String(page));
      const response = await fetch(`/api/posts?${params.toString()}`);
      return response.json();
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const posts = useMemo(() => data?.flatMap(page => page.data) ?? [], [data]);
  const isLoadingMore = isLoading && size > 1;
  const hasMore = data ? data[data.length - 1]?.links?.next !== null : false;

  return {
    posts,
    isLoading,
    isLoadingMore,
    isError: !!error,
    error,
    hasMore,
    loadMore: () => setSize(size + 1),
    mutate,
  };
}