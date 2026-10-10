/**
 * Configuration System for PrestoNext
 * Supports multi-platform deployment with environment-specific settings
 */

export interface PrestoNextConfig {
  // Site Configuration
  site: {
    name: string;
    description: string;
    url: string;
    language: string;
    timezone: string;
  };

  // PrestoWorld API Configuration
  api: {
    baseUrl: string;
    version: string;
    timeout: number;
    retryAttempts: number;
  };

  // Rendering Strategy Configuration
  rendering: {
    // Default rendering strategy per route type
    defaultStrategy: 'ssr' | 'ssg' | 'isr' | 'csr';
    // Route-specific strategies
    routes: Record<string, 'ssr' | 'ssg' | 'isr' | 'csr'>;
    // ISR revalidation times (seconds)
    revalidation: {
      posts: number;
      pages: number;
      terms: number;
      search: number;
      home: number;
    };
  };

  // Caching Configuration
  cache: {
    enabled: boolean;
    provider: 'memory' | 'redis' | 'vercel' | 'cloudflare';
    ttl: {
      posts: number;
      terms: number;
      menus: number;
      settings: number;
      media: number;
    };
  };

  // SEO Configuration
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultImage: string;
    twitterHandle: string;
    facebookAppId: string;
  };

  // Analytics Configuration
  analytics: {
    provider: 'ga4' | 'plausible' | 'umami' | 'custom' | 'none';
    trackingId?: string;
    customScript?: string;
  };

  // Performance Configuration
  performance: {
    enableImageOptimization: boolean;
    enableFontOptimization: boolean;
    enableScriptOptimization: boolean;
    preloadCriticalResources: boolean;
  };

  // Feature Flags
  features: {
    enableSearch: boolean;
    enableComments: boolean;
    enableNewsletter: boolean;
    enableDarkMode: boolean;
    enableMultiLanguage: boolean;
    supportedLocales: string[];
    defaultLocale: string;
  };

  // Theme Configuration
  theme: {
    defaultTheme: string;
    availableThemes: string[];
    enableThemeSwitching: boolean;
  };

  // Plugin/Extension System
  plugins: {
    enabled: string[];
    directories: string[];
  };

  // Deployment Target Configuration
  deployment: {
    target: 'vercel' | 'netlify' | 'cloudflare' | 'aws' | 'docker' | 'static' | 'custom';
    region?: string;
    edgeRuntime: boolean;
    staticExport: boolean;
    outputDirectory: string;
  };
}

/**
 * Default configuration
 */
export const defaultConfig: PrestoNextConfig = {
  site: {
    name: 'PrestoWorld',
    description: 'A modern headless CMS frontend',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    language: 'en',
    timezone: 'UTC',
  },

  api: {
    baseUrl: process.env.PRESTOWORLD_API_URL || 'http://localhost:8000',
    version: 'v1',
    timeout: 10000,
    retryAttempts: 3,
  },

  rendering: {
    defaultStrategy: 'isr',
    routes: {
      '/': 'isr',
      '/posts/:slug': 'isr',
      '/pages/:slug': 'isr',
      '/category/:slug': 'isr',
      '/tag/:slug': 'isr',
      '/author/:slug': 'isr',
      '/search': 'ssr',
      '/api/*': 'ssr',
    },
    revalidation: {
      posts: 60,
      pages: 300,
      terms: 3600,
      search: 30,
      home: 60,
    },
  },

  cache: {
    enabled: true,
    provider: 'vercel',
    ttl: {
      posts: 60,
      terms: 3600,
      menus: 3600,
      settings: 3600,
      media: 3600,
    },
  },

  seo: {
    defaultTitle: 'PrestoWorld',
    titleTemplate: '%s | PrestoWorld',
    defaultDescription: 'A modern headless CMS frontend built with Next.js',
    defaultImage: '/og-image.png',
    twitterHandle: '@prestoworld',
    facebookAppId: '',
  },

  analytics: {
    provider: 'none',
  },

  performance: {
    enableImageOptimization: true,
    enableFontOptimization: true,
    enableScriptOptimization: true,
    preloadCriticalResources: true,
  },

  features: {
    enableSearch: true,
    enableComments: false,
    enableNewsletter: false,
    enableDarkMode: true,
    enableMultiLanguage: true,
    supportedLocales: ['en', 'vi'],
    defaultLocale: 'en',
  },

  theme: {
    defaultTheme: 'default',
    availableThemes: ['default'],
    enableThemeSwitching: false,
  },

  plugins: {
    enabled: [],
    directories: ['src/plugins'],
  },

  deployment: {
    target: 'vercel',
    edgeRuntime: true,
    staticExport: false,
    outputDirectory: '.next',
  },
};

/**
 * Environment-specific overrides
 */
const environmentConfigs: Record<string, Partial<PrestoNextConfig>> = {
  development: {
    api: {
      baseUrl: process.env.PRESTOWORLD_API_URL || 'http://localhost:8000',
      version: 'v1',
      timeout: 30000,
      retryAttempts: 1,
    },
    rendering: {
      defaultStrategy: 'ssr',
      routes: {},
      revalidation: {
        posts: 0,
        pages: 0,
        terms: 0,
        search: 0,
        home: 0,
      },
    },
    cache: {
      enabled: false,
      provider: 'memory',
      ttl: {
        posts: 0,
        terms: 0,
        menus: 0,
        settings: 0,
        media: 0,
      },
    },
    performance: {
      enableImageOptimization: false,
      enableFontOptimization: false,
      enableScriptOptimization: false,
      preloadCriticalResources: false,
    },
  },

  production: {
    rendering: {
      defaultStrategy: 'isr',
      routes: {
        '/': 'isr',
        '/posts/:slug': 'isr',
        '/pages/:slug': 'isr',
        '/category/:slug': 'isr',
        '/tag/:slug': 'isr',
        '/author/:slug': 'isr',
        '/search': 'ssr',
        '/api/*': 'ssr',
      },
      revalidation: {
        posts: 60,
        pages: 300,
        terms: 3600,
        search: 30,
        home: 60,
      },
    },
    cache: {
      enabled: true,
      provider: 'vercel',
      ttl: {
        posts: 60,
        terms: 3600,
        menus: 3600,
        settings: 3600,
        media: 3600,
      },
    },
    performance: {
      enableImageOptimization: true,
      enableFontOptimization: true,
      enableScriptOptimization: true,
      preloadCriticalResources: true,
    },
  },

  static: {
    rendering: {
      defaultStrategy: 'ssg',
      routes: {},
      revalidation: {
        posts: 0,
        pages: 0,
        terms: 0,
        search: 0,
        home: 0,
      },
    },
    cache: {
      enabled: false,
      provider: 'memory',
      ttl: {
        posts: 0,
        terms: 0,
        menus: 0,
        settings: 0,
        media: 0,
      },
    },
    deployment: {
      target: 'static',
      edgeRuntime: false,
      staticExport: true,
      outputDirectory: 'out',
    },
  },
};

/**
 * Get merged configuration for current environment
 */
export function getConfig(): PrestoNextConfig {
  const env = process.env.NODE_ENV || 'development';
  const deploymentTarget = process.env.DEPLOYMENT_TARGET || env;
  
  const baseConfig = { ...defaultConfig };
  const envConfig = environmentConfigs[env] || {};
  const targetConfig = environmentConfigs[deploymentTarget] || {};

  return deepMerge(baseConfig, envConfig, targetConfig);
}

/**
 * Deep merge utility
 */
function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  const result = { ...target } as T;
  
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (sourceValue !== undefined) {
        (result as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }
  
  return result;
}

/**
 * Get rendering strategy for a specific route
 */
export function getRenderingStrategy(pathname: string): 'ssr' | 'ssg' | 'isr' | 'csr' {
  const config = getConfig();
  
  // Check exact match first
  if (config.rendering.routes[pathname]) {
    return config.rendering.routes[pathname];
  }
  
  // Check pattern matches
  for (const [pattern, strategy] of Object.entries(config.rendering.routes)) {
    if (matchRoute(pattern, pathname)) {
      return strategy;
    }
  }
  
  return config.rendering.defaultStrategy;
}

/**
 * Simple route pattern matching
 */
function matchRoute(pattern: string, pathname: string): boolean {
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/:([^/]+)/g, '([^/]+)');
  
  return new RegExp(`^${regexPattern}$`).test(pathname);
}

/**
 * Get revalidation time for a route
 */
export function getRevalidationTime(pathname: string): number {
  const config = getConfig();
  const strategy = getRenderingStrategy(pathname);
  
  if (strategy !== 'isr') return 0;
  
  // Match route to revalidation config
  if (pathname === '/') return config.rendering.revalidation.home;
  if (pathname.startsWith('/posts/')) return config.rendering.revalidation.posts;
  if (pathname.startsWith('/pages/')) return config.rendering.revalidation.pages;
  if (pathname.startsWith('/category/') || pathname.startsWith('/tag/')) return config.rendering.revalidation.terms;
  if (pathname.startsWith('/search')) return config.rendering.revalidation.search;
  
  return config.rendering.revalidation.posts;
}

export const config = getConfig();