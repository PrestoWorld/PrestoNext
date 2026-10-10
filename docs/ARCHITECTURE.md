# PrestoNext Architecture

Kiến trúc hệ thống PrestoNext - frontend Next.js cho PrestoWorld CMS.

## Tổng quan

```
┌─────────────────────────────────────────────────────────────┐
│                     PrestoNext (Next.js)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  │  (App Router)│  │   (UI/Layout)│  │   (SWR)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │                │
│  ┌──────▼─────────────────▼─────────────────▼───────┐      │
│  │              Repository Pattern                   │      │
│  │  PostRepository, TermRepository, MediaRepository │      │
│  └──────────────────────┬──────────────────────────┘      │
│                         │                                  │
│  ┌──────────────────────▼──────────────────────────┐      │
│  │           API Client (prestoworldApi)            │      │
│  │         Type-safe HTTP client                    │      │
│  └──────────────────────┬──────────────────────────┘      │
└─────────────────────────┼─────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  PrestoWorld CMS (PHP)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Headless-CMS Module                        │   │
│  │  PostController, TermController, MediaController     │   │
│  │  MenuController, SettingController, UserController   │   │
│  │  SearchController                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Schema Module (PostRepository)          │   │
│  │         Post types, Terms, Taxonomies                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Witals Framework                        │   │
│  │         Container, HTTP, Module System               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Repository Pattern

```
┌─────────────────┐
│   Components    │  ← Sử dụng repository
└────────┬────────┘
         │
┌────────▼────────┐
│  Repository     │  ← Abstraction layer
│  (Interface)    │
└────────┬────────┘
         │
┌────────▼────────┐
│  API Client     │  ← HTTP requests
└────────┬────────┘
         │
┌────────▼────────┐
│  PrestoWorld    │  ← Data source
│  API            │
└─────────────────┘
```

**Lợi ích:**
- Tách biệt data access khỏi business logic
- Dễ test (mock repository)
- Dễ thay đổi data source
- Type-safe

### 2. API Client (Singleton)

```typescript
class PrestoWorldApiClient {
  private static instance: PrestoWorldApiClient;
  private baseUrl: string;
  
  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  static getInstance(baseUrl?: string) {
    if (!PrestoWorldApiClient.instance) {
      PrestoWorldApiClient.instance = new PrestoWorldApiClient(baseUrl!);
    }
    return PrestoWorldApiClient.instance;
  }
}
```

### 3. Hooks Pattern (SWR)

```
┌──────────────┐
│   Component  │  ← usePosts()
└──────┬───────┘
       │
┌──────▼───────┐
│  SWR Cache   │  ← Deduping, Revalidation
└──────┬───────┘
       │
┌──────▼───────┐
│  API Route   │  ← /api/posts
└──────┬───────┘
       │
┌──────▼───────┐
│  PrestoWorld │
└──────────────┘
```

### 4. Provider Pattern

```
PrestoNextProvider
├── SEOProvider
├── AnalyticsProvider
├── SearchProvider
└── MenuProvider
```

## Rendering Strategies

### SSR (Server-Side Rendering)

```typescript
// Dynamic rendering - mỗi request render lại
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await fetchData();  // Fetch mỗi request
  return <div>{data}</div>;
}
```

**Sử dụng khi:**
- Data thay đổi liên tục
- Personalized content
- Real-time data

### SSG (Static Site Generation)

```typescript
// Static - build time
export default async function Page() {
  const data = await fetchData();  // Fetch tại build time
  return <div>{data}</div>;
}
```

**Sử dụng khi:**
- Content ít thay đổi
- Landing pages
- Documentation

### ISR (Incremental Static Regeneration)

```typescript
// Static với revalidate
export const revalidate = 60;  // Regenerate mỗi 60s

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Sử dụng khi:**
- Blog posts
- Product pages
- Content thay đổi định kỳ

### CSR (Client-Side Rendering)

```typescript
'use client';

import { usePosts } from '@/hooks/use-prestoworld';

export default function Page() {
  const { posts, isLoading } = usePosts();  // Fetch ở client
  
  if (isLoading) return <Loading />;
  return <div>{posts.map(p => ...)}</div>;
}
```

**Sử dụng khi:**
- Search results
- User-specific content
- Interactive features

## Data Flow

### Server Component Flow

```
1. Request → Next.js Server
2. Server Component renders
3. Repository.find() called
4. API Client fetches from PrestoWorld
5. Response cached (ISR)
6. HTML returned to client
```

### Client Component Flow

```
1. Component mounts
2. SWR hook triggers
3. Fetch /api/* (Next.js API route)
4. API route proxies to PrestoWorld
5. Response cached in SWR
6. Component re-renders
```

## Module Structure

### PrestoWorld Headless-CMS Module

```
modules/Headless-CMS/
├── Module.php                    # Module registration
├── src/
│   ├── Controller/
│   │   ├── PostController.php    # /api/v1/posts
│   │   ├── TermController.php    # /api/v1/terms
│   │   ├── MediaController.php   # /api/v1/media
│   │   ├── MenuController.php    # /api/v1/menus
│   │   ├── SettingController.php # /api/v1/settings
│   │   ├── UserController.php    # /api/v1/users
│   │   └── SearchController.php  # /api/v1/search
│   ├── Serializer/
│   │   ├── PostSerializer.php    # Transform post data
│   │   ├── TermSerializer.php
│   │   ├── MediaSerializer.php
│   │   ├── MenuSerializer.php
│   │   ├── SettingSerializer.php
│   │   └── UserSerializer.php
│   ├── Transformer/
│   │   ├── PostTransformer.php   # JSON:API style
│   │   ├── TermTransformer.php
│   │   ├── MediaTransformer.php
│   │   ├── MenuTransformer.php
│   │   ├── SettingTransformer.php
│   │   └── UserTransformer.php
│   ├── Middleware/
│   └── Contract/
└── routes/
```

### PrestoNext Frontend

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (proxy)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── layout/             # Header, Footer
│   ├── providers.tsx       # Context providers
│   └── ui/                 # UI components
├── config/                 # Configuration
├── hooks/                  # React hooks
├── lib/
│   ├── api/                # API client
│   ├── repositories/       # Repository pattern
│   └── utils.ts            # Utilities
└── types/                  # TypeScript types
```

## Caching Layers

```
┌─────────────────────────────────────┐
│  1. Browser Cache                   │
│     (Cache-Control headers)         │
├─────────────────────────────────────┤
│  2. CDN Cache (Vercel/Cloudflare)   │
│     (s-maxage, stale-while-revalidate)│
├─────────────────────────────────────┤
│  3. Next.js ISR Cache               │
│     (revalidate)                    │
├─────────────────────────────────────┤
│  4. SWR Client Cache                │
│     (dedupingInterval)              │
├─────────────────────────────────────┤
│  5. PrestoWorld Cache               │
│     (application level)             │
└─────────────────────────────────────┘
```

## Security

### Headers

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

### CORS

```typescript
{
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
  ],
}
```

### Input Validation

- Sử dụng Zod cho input validation
- Type-safe API responses
- Sanitize HTML content

## Performance

### Image Optimization

```typescript
// next.config.js
images: {
  remotePatterns: [{ protocol: 'https', hostname: '**' }],
  formats: ['image/avif', 'image/webp'],
}
```

### Font Optimization

```typescript
// next/font/google
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

### Code Splitting

- Automatic với App Router
- Dynamic imports cho heavy components
- optimizePackageImports

### Bundle Analysis

```bash
npm run build
# Phân tích bundle size trong output
```

## Scalability

### Horizontal Scaling

- Stateless API routes
- Edge runtime support
- CDN caching

### Vertical Scaling

- ISR giảm server load
- SWR giảm API calls
- Cache layers

### Database Connection Pooling

- PrestoWorld handles DB connections
- Next.js stateless

## Monitoring

### Analytics Integration

```typescript
// src/components/providers.tsx
export function AnalyticsProvider({ children }) {
  const trackEvent = (event, properties) => {
    // GA4, Plausible, Umami, custom
  };
  
  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}
```

### Error Tracking

- Next.js error boundaries
- Sentry integration (optional)
- Console logging trong dev

## Testing Strategy

```
Unit Tests (Jest)
├── Components
├── Hooks
├── Repositories
└── Utils

Integration Tests
├── API routes
└── Pages

E2E Tests (Playwright/Cypress)
├── User flows
└── Critical paths
```

## Deployment Architecture

### Vercel (Recommended)

```
User → Vercel Edge → Next.js Server → PrestoWorld API
                         ↓
                    ISR Cache
```

### Static Export

```
Build Time → Static HTML → CDN → User
```

### Docker

```
Docker Container → Node.js → Next.js → PrestoWorld API
```

## Best Practices

1. **Server Components mặc định** - Chỉ 'use client' khi cần
2. **ISR cho content pages** - Cân bằng performance & freshness
3. **Repository Pattern** - Tách biệt concerns
4. **Type safety** - TypeScript strict mode
5. **Error boundaries** - Graceful degradation
6. **SEO** - generateMetadata cho mọi page
7. **Accessibility** - ARIA labels, semantic HTML
8. **Caching** - Multi-layer caching strategy

## Future Enhancements

- [ ] GraphQL API support
- [ ] Webhook integration cho real-time updates
- [ ] Edge Functions cho personalization
- [ ] Advanced caching với Redis
- [ ] Multi-site support
- [ ] Plugin marketplace
- [ ] Visual editor integration
- [ ] A/B testing framework