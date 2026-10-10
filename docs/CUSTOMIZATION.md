# PrestoNext Customization Guide

Hướng dẫn tuỳ biến PrestoNext theo từng project cụ thể.

## Mục lục

1. [Project Types](#project-types)
2. [Theme Customization](#theme-customization)
3. [Feature Configuration](#feature-configuration)
4. [Deployment Targets](#deployment-targets)
5. [Plugin System](#plugin-system)
6. [Multi-site Setup](#multi-site-setup)

---

## Project Types

### Blog / Magazine

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  site: {
    name: 'My Blog',
    description: 'Personal blog about technology',
  },
  rendering: {
    defaultStrategy: 'isr',
    routes: {
      '/': 'isr',
      '/posts/:slug': 'isr',
      '/category/:slug': 'isr',
      '/tag/:slug': 'isr',
      '/author/:slug': 'isr',
      '/search': 'ssr',
    },
    revalidation: {
      posts: 300,      // 5 phút
      pages: 600,      // 10 phút
      terms: 3600,     // 1 giờ
      search: 30,
      home: 60,
    },
  },
  features: {
    enableSearch: true,
    enableComments: true,
    enableNewsletter: true,
    enableDarkMode: true,
  },
  seo: {
    defaultTitle: 'My Blog',
    titleTemplate: '%s | My Blog',
    defaultDescription: 'Thoughts on technology and life',
  },
};
```

### E-commerce

```typescript
export const config: PrestoNextConfig = {
  site: {
    name: 'My Shop',
    description: 'Online store',
  },
  rendering: {
    defaultStrategy: 'isr',
    routes: {
      '/': 'isr',
      '/products/:slug': 'isr',
      '/category/:slug': 'isr',
      '/cart': 'csr',
      '/checkout': 'ssr',
      '/account': 'ssr',
    },
    revalidation: {
      posts: 60,       // Products update thường xuyên
      terms: 1800,     // 30 phút
    },
  },
  features: {
    enableSearch: true,
    enableNewsletter: true,
    enableDarkMode: false,
  },
  cache: {
    enabled: true,
    provider: 'redis',
    ttl: {
      posts: 60,
      terms: 1800,
    },
  },
};
```

### Corporate / Business

```typescript
export const config: PrestoNextConfig = {
  site: {
    name: 'My Company',
    description: 'Corporate website',
  },
  rendering: {
    defaultStrategy: 'ssg',  // Static generation
    routes: {
      '/': 'ssg',
      '/about': 'ssg',
      '/services': 'ssg',
      '/contact': 'ssr',
      '/news/:slug': 'isr',
    },
    revalidation: {
      posts: 3600,
      pages: 86400,    // 24 giờ
      home: 3600,
    },
  },
  features: {
    enableSearch: false,
    enableComments: false,
    enableNewsletter: false,
    enableDarkMode: false,
  },
  deployment: {
    target: 'static',
    staticExport: true,
  },
};
```

### Documentation Site

```typescript
export const config: PrestoNextConfig = {
  site: {
    name: 'Docs',
    description: 'Documentation',
  },
  rendering: {
    defaultStrategy: 'ssg',
    routes: {
      '/docs/:slug': 'ssg',
      '/api/:slug': 'ssg',
    },
  },
  features: {
    enableSearch: true,
    enableDarkMode: true,
  },
  deployment: {
    target: 'vercel',
    edgeRuntime: true,
  },
};
```

---

## Theme Customization

### 1. Colors

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Thêm brand colors
        brand: {
          500: '#ff6b35',
          600: '#e55a2b',
        },
      },
    },
  },
};

export default config;
```

### 2. Typography

```typescript
// src/app/layout.tsx
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Layout

```typescript
// tailwind.config.ts
theme: {
  extend: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',  // Wider max width
      },
    },
    borderRadius: {
      '4xl': '2rem',
    },
  },
}
```

### 4. Dark Mode

```typescript
// src/config/index.ts
features: {
  enableDarkMode: true,  // Bật/tắt dark mode
}

// Sử dụng trong components
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    Content
  </p>
</div>
```

---

## Feature Configuration

### Enable/Disable Features

```typescript
// src/config/index.ts
features: {
  enableSearch: true,        // Bật tìm kiếm
  enableComments: false,     // Tắt comments
  enableNewsletter: true,    // Bật newsletter
  enableDarkMode: true,      // Bật dark mode
  enableMultiLanguage: true, // Bật đa ngôn ngữ
  supportedLocales: ['en', 'vi'],
  defaultLocale: 'en',
}
```

### Conditional Rendering

```typescript
import { config } from '@/config';

export function NewsletterSection() {
  if (!config.features.enableNewsletter) {
    return null;
  }
  
  return <NewsletterForm />;
}
```

### Feature Flags

```typescript
// src/config/index.ts
features: {
  // ... other features
  experimental: {
    enableAI: false,
    enableChat: false,
  },
}

// Sử dụng
if (config.features.experimental?.enableAI) {
  // AI feature
}
```

---

## Deployment Targets

### Vercel

```typescript
deployment: {
  target: 'vercel',
  edgeRuntime: true,
  staticExport: false,
  outputDirectory: '.next',
}
```

```bash
# Deploy
npm i -g vercel
vercel --prod
```

### Netlify

```typescript
deployment: {
  target: 'netlify',
  edgeRuntime: false,
  staticExport: false,
}
```

```bash
npm run build
# Deploy .next folder
```

### Cloudflare Pages

```typescript
deployment: {
  target: 'cloudflare',
  edgeRuntime: true,
  staticExport: false,
}
```

### AWS (S3 + CloudFront)

```typescript
deployment: {
  target: 'aws',
  edgeRuntime: false,
  staticExport: true,
  outputDirectory: 'out',
}
```

```bash
npm run build
# Upload out/ to S3
```

### Docker

```typescript
deployment: {
  target: 'docker',
  edgeRuntime: false,
  staticExport: false,
}
```

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export (GitHub Pages, etc.)

```typescript
deployment: {
  target: 'static',
  edgeRuntime: false,
  staticExport: true,
  outputDirectory: 'out',
}
```

```bash
npm run build
# Output: out/ folder
```

---

## Plugin System

### Creating a Plugin

```typescript
// src/plugins/my-plugin/index.ts
import type { PrestoNextConfig } from '@/config';

export interface MyPluginOptions {
  apiKey?: string;
  enabled?: boolean;
}

export function myPlugin(options: MyPluginOptions = {}) {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    
    // Hook vào config
    config(config: PrestoNextConfig) {
      return {
        ...config,
        features: {
          ...config.features,
          enableMyFeature: options.enabled ?? true,
        },
      };
    },
    
    // Hook vào routes
    routes() {
      return [
        {
          path: '/my-feature',
          component: () => import('./MyFeature'),
        },
      ];
    },
    
    // Hook vào API
    apiEndpoints() {
      return {
        '/api/my-endpoint': async () => {
          return { data: 'Hello from plugin' };
        },
      };
    },
  };
}
```

### Registering Plugins

```typescript
// src/config/index.ts
plugins: {
  enabled: ['my-plugin', 'seo-plugin'],
  directories: ['src/plugins'],
}
```

### Using Plugins

```typescript
import { myPlugin } from '@/plugins/my-plugin';

const plugin = myPlugin({ enabled: true });

// Trong component
if (plugin.isEnabled()) {
  // Plugin logic
}
```

---

## Multi-site Setup

### Multiple Sites từ 1 codebase

```typescript
// src/config/sites.ts
export const sites = {
  'site1.com': {
    name: 'Site 1',
    theme: 'theme1',
    apiUrl: 'https://api1.prestoworld.com',
  },
  'site2.com': {
    name: 'Site 2',
    theme: 'theme2',
    apiUrl: 'https://api2.prestoworld.com',
  },
};

// src/config/index.ts
export function getConfig(hostname?: string) {
  const site = hostname ? sites[hostname] : sites['site1.com'];
  
  return {
    ...defaultConfig,
    site: {
      ...defaultConfig.site,
      name: site.name,
    },
    api: {
      ...defaultConfig.api,
      baseUrl: site.apiUrl,
    },
  };
}
```

### Middleware cho Multi-site

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0];
  
  // Set site-specific headers
  const response = NextResponse.next();
  response.headers.set('x-site', hostname || 'default');
  
  return response;
}
```

---

## Environment-specific Configs

### Development

```typescript
// .env.development
PRESTOWORLD_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEPLOYMENT_TARGET=vercel
NODE_ENV=development
```

### Production

```typescript
// .env.production
PRESTOWORLD_API_URL=https://api.prestoworld.com
NEXT_PUBLIC_SITE_URL=https://www.prestoworld.com
DEPLOYMENT_TARGET=vercel
NODE_ENV=production
```

### Staging

```typescript
// .env.staging
PRESTOWORLD_API_URL=https://staging-api.prestoworld.com
NEXT_PUBLIC_SITE_URL=https://staging.prestoworld.com
DEPLOYMENT_TARGET=vercel
NODE_ENV=production
```

---

## Quick Start Templates

### Minimal Blog

```bash
# Copy template
cp -r templates/minimal-blog/* src/

# Update config
# src/config/index.ts
```

### Full E-commerce

```bash
cp -r templates/ecommerce/* src/
```

### Documentation

```bash
cp -r templates/docs/* src/
```

---

## Summary

| Mục tiêu | Cách làm |
|----------|----------|
| Thay đổi giao diện | `tailwind.config.ts`, `src/app/layout.tsx` |
| Thay đổi behavior | `src/config/index.ts` |
| Thêm tính năng | `src/features/`, `src/plugins/` |
| Thay đổi deployment | `deployment.target` trong config |
| Multi-language | `features.supportedLocales` |
| Multi-site | `src/config/sites.ts` |

---

## Support

- Documentation: `docs/DEVELOPMENT.md`
- API Reference: `README.md#api-reference`
- PrestoWorld CMS: `/Users/puleeno/Projects/prestoworld.org`