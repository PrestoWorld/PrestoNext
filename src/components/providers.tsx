/**
 * Providers for PrestoNext
 * Sets up React context providers for the application
 */

'use client';

import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { config } from '@/config';

interface PrestoNextContextValue {
  config: typeof config;
  isClient: boolean;
}

const PrestoNextContext = createContext<PrestoNextContextValue | null>(null);

export function PrestoNextProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <PrestoNextContext.Provider value={{ config, isClient }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme={config.theme.defaultTheme}
        enableSystem={config.features.enableDarkMode}
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </PrestoNextContext.Provider>
  );
}

export function usePrestoNext() {
  const context = useContext(PrestoNextContext);
  if (!context) {
    throw new Error('usePrestoNext must be used within a PrestoNextProvider');
  }
  return context;
}

/**
 * SEO Provider for managing meta tags
 */
interface SEOContextValue {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultImage: string;
}

const SEOContext = createContext<SEOContextValue | null>(null);

export function SEOProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({
    defaultTitle: config.seo.defaultTitle,
    titleTemplate: config.seo.titleTemplate,
    defaultDescription: config.seo.defaultDescription,
    defaultImage: config.seo.defaultImage,
  }), []);

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
}

export function useSEO() {
  const context = useContext(SEOContext);
  if (!context) {
    throw new Error('useSEO must be used within a SEOProvider');
  }
  return context;
}

/**
 * Analytics Provider
 */
interface AnalyticsContextValue {
  trackEvent: (event: string, properties?: Record<string, unknown>) => void;
  trackPageView: (url: string, title?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackEvent = useCallback((event: string, properties?: Record<string, unknown>) => {
    if (!isBrowser) return;
    
    // Google Analytics 4
    if (config.analytics.provider === 'ga4' && config.analytics.trackingId) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', event, properties);
    }
    
    // Plausible
    if (config.analytics.provider === 'plausible') {
      (window as unknown as { plausible: (event: string, options?: { props: Record<string, unknown> }) => void }).plausible(event, { props: properties });
    }
    
    // Custom
    if (config.analytics.provider === 'custom' && config.analytics.customScript) {
      // Custom implementation
    }
  }, []);

  const trackPageView = useCallback((url: string, title?: string) => {
    if (!isBrowser) return;
    
    if (config.analytics.provider === 'ga4' && config.analytics.trackingId) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('config', config.analytics.trackingId, {
        page_path: url,
        page_title: title,
      });
    }
  }, []);

  const value = useMemo(() => ({ trackEvent, trackPageView }), [trackEvent, trackPageView]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    return { trackEvent: () => {}, trackPageView: () => {} };
  }
  return context;
}

/**
 * Search Provider for global search state
 */
interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (isBrowser) {
      const stored = localStorage.getItem('prestonext_recent_searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const addRecentSearch = useCallback((search: string) => {
    if (!search.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== search);
      const updated = [search, ...filtered].slice(0, 10);
      if (isBrowser) {
        localStorage.setItem('prestonext_recent_searches', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (isBrowser) {
      localStorage.removeItem('prestonext_recent_searches');
    }
  }, []);

  const value = useMemo(() => ({
    query,
    setQuery,
    isOpen,
    setIsOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  }), [query, isOpen, recentSearches, addRecentSearch, clearRecentSearches]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}

/**
 * Menu Provider for mobile menu state
 */
interface MenuContextValue {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const value = useMemo(() => ({
    isMobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu,
  }), [isMobileMenuOpen, toggleMobileMenu]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

// Import utilities
import { isBrowser } from '@/lib/utils';
import { useMemo } from 'react';