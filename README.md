# PrestoNext Documentation

Tài liệu hướng dẫn sử dụng, phát triển và tuỳ biến PrestoNext - frontend Next.js cho PrestoWorld CMS.

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Cài đặt](#cài-đặt)
3. [Cấu hình](#cấu-hình)
4. [Kiến trúc](#kiến-trúc)
5. [Phát triển](#phát-triển)
6. [Tuỳ biến theo project](#tuỳ-biến-theo-project)
7. [Triển khai](#triển-khai)
8. [API Reference](#api-reference)

---

## Giới thiệu

PrestoNext là frontend Next.js 14 (App Router) cho PrestoWorld CMS (Witals PHP framework). Hỗ trợ:

- **Hybrid Rendering**: SSR, SSG, ISR, CSR tuỳ chọn theo route
- **Type-safe**: TypeScript toàn bộ, Zod validation
- **Multi-platform**: Vercel, Netlify, Cloudflare, AWS, Docker, Static export
- **Extensible**: Plugin system, theme support, modular architecture

### Yêu cầu hệ thống

- Node.js >= 18.17
- npm >= 9 hoặc pnpm/yarn
- PrestoWorld CMS >= 1.0 (PHP 8.1+, Witals framework)

---

## Cài đặt

### 1. Clone và cài dependencies

```bash
git clone <prestonext-repo>
cd PrestoNext
npm install
```

### 2. Cấu hình environment

```bash
cp .env.example .env.local
```

Chỉnh `.env.local`:

```env
# PrestoWorld API
PRESTOWORLD_API_URL=http://localhost:8000

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Deployment
DEPLOYMENT_TARGET=vercel
NODE_ENV=development
```

### 3. Chạy development

```bash
npm run dev
# Mở http://localhost:3000
```

### 4. Build production

```bash
npm run build
npm start
```

---

## Cấu hình

### Environment Variables

| Biến | Mô tả | Default |
|------|--------|---------|
| `PRESTOWORLD_API_URL` | URL PrestoWorld CMS | `http://localhost:8000` |
| `NEXT_PUBLIC_SITE_URL` | URL frontend | `http://localhost:3000` |
| `DEPLOYMENT_TARGET` | Nền tảng deploy | `vercel` |
| `NODE_ENV` | Environment | `development` |

### File cấu hình

- `src/config/index.ts` - Cấu hình chính (site, API, rendering, cache, SEO, features, deployment)
- `next.config.js` - Next.js config (images, headers, rewrites)
- `tailwind.config.ts` - Tailwind CSS theme

### Rendering Strategy

Cấu hình trong `src/config/index.ts`:

```typescript
rendering: {
  defaultStrategy: 'isr',
  routes: {
    '/': 'isr',
    '/posts/:slug': 'isr',
    '/pages/:slug': 'isr',
    '/category/:slug': 'isr',
    '/search': 'ssr',
    '/api/*': 'ssr',
  },
  revalidation: {
    posts: 60,      // 1 phút
    pages: 300,     // 5 phút
    terms: 3600,    // 1 giờ
    search: 30,     // 30 giây
    home: 60,
  },
}
```

**Các strategy:**
- `ssr` - Server-Side Rendering (dynamic, không cache)
- `ssg` - Static Site Generation (build time)
- `isr` - Incremental Static Regeneration (revalidate theo giây)
- `csr` - Client-Side Rendering (SWR hooks)

---

## Kiến trúc

### Cấu trúc thư mục

```
PrestoNext/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes (proxy)
│   │   │   ├── posts/
│   │   │   ├── terms/
│   │   │   ├── media/
│   │   │   ├── menus/
│   │   │   ├── settings/
│   │   │   ├── users/
│   │   │   └── search/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   ├── providers.tsx       # Context providers
│   │   └── ui/                 # UI components
│   ├── config/                 # Configuration
│   ├── hooks/                  # React hooks (SWR)
│   ├── lib/
│   │   ├── api/                # API client
│   │   ├── repositories/       # Repository pattern
│   │   └── utils.ts            # Utilities
│   └── types/                  # TypeScript types
├── public/                     # Static assets
└── next.config.js
```

### Design Patterns

1. **Repository Pattern** (`src/lib/repositories/`)
   - Abstraction layer cho data access
   - `PostRepository`, `TermRepository`, `MediaRepository`, `MenuRepository`, `SettingsRepository`, `UserRepository`, `SearchRepository`

2. **API Client** (`src/lib/api/prestoworld-client.ts`)
   - Singleton HTTP client
   - Type-safe methods

3. **Hooks** (`src/hooks/use-prestoworld.ts`)
   - SWR-based data fetching
   - `usePosts`, `usePost`, `usePostBySlug`, `useTerms`, `useCategories`, `useTags`, `useMedia`, `useMenu`, `useMenus`, `useSiteSettings`, `useUser`, `useSearch`, `useRelatedPosts`, `useInfinitePosts`

4. **Providers** (`src/components/providers.tsx`)
   - `PrestoNextProvider` - Config context
   - `SEOProvider` - SEO context
   - `AnalyticsProvider` - Analytics tracking
   - `SearchProvider` - Search state
   - `MenuProvider` - Mobile menu state

### Data Flow

```
Page (Server Component)
  ↓
Repository (find/findById/findBySlug)
  ↓
API Client (prestoworldApi)
  ↓
PrestoWorld CMS API (/api/v1/*)
  ↓
Response (typed)
```

---

## Phát triển

### Thêm trang mới

Ví dụ: trang `/posts/[slug]`:

```typescript
// src/app/posts/[slug]/page.tsx
import { postRepository } from '@/lib/repositories';
import { getRevalidationTime } from '@/config';

export async function generateStaticParams() {
  const posts = await postRepository.findAllWithCache({
    status: 'publish',
    per_page: 100,
  });
  
  return posts?.data.map((post) => ({
    slug: post.slug,
  })) ?? [];
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await postRepository.findBySlug(params.slug, 'post');
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export const revalidate = getRevalidationTime('/posts/:slug');
```

### Thêm API route proxy

```typescript
// src/app/api/custom/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PRESTOWORLD_API_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const response = await fetch(`${PRESTOWORLD_API_URL}/api/v1/custom`);
  const data = await response.json();
  
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  });
}
```

### Thêm hook

```typescript
// src/hooks/use-custom.ts
import useSWR from 'swr';

export function useCustomData() {
  const { data, error, isLoading } = useSWR('/api/custom', fetcher);
  
  return { data, error, isLoading };
}
```

### Thêm UI component

```typescript
// src/components/ui/custom.tsx
'use client';

import { cn } from '@/lib/utils';

export function CustomComponent({ className }: { className?: string }) {
  return <div className={cn('p-4', className)}>Content</div>;
}
```

---

## Tuỳ biến theo project

### 1. Thay đổi theme colors

Chỉnh `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        // ... thay đổi màu chính
      },
    },
  },
}
```

### 2. Thay đổi fonts

Chỉnh `src/app/layout.tsx`:

```typescript
import { Inter, Roboto_Slab } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});
```

### 3. Thêm locale mới

Chỉnh `src/config/index.ts`:

```typescript
features: {
  enableMultiLanguage: true,
  supportedLocales: ['en', 'vi', 'fr'],  // thêm 'fr'
  defaultLocale: 'en',
},
```

### 4. Thêm feature flag

```typescript
features: {
  enableComments: true,      // bật comments
  enableNewsletter: true,    // bật newsletter
  enableDarkMode: false,     // tắt dark mode
},
```

### 5. Thay đổi deployment target

```typescript
deployment: {
  target: 'netlify',        // hoặc 'cloudflare', 'aws', 'docker', 'static'
  edgeRuntime: true,
  staticExport: false,
  outputDirectory: '.next',
},
```

### 6. Thêm plugin

```typescript
plugins: {
  enabled: ['seo', 'analytics', 'sitemap'],
  directories: ['src/plugins'],
},
```

### 7. Tuỳ chỉnh SEO

```typescript
seo: {
  defaultTitle: 'My Site',
  titleTemplate: '%s | My Site',
  defaultDescription: 'Custom description',
  defaultImage: '/custom-og.png',
  twitterHandle: '@mytwitter',
},
```

### 8. Tuỳ chỉnh cache

```typescript
cache: {
  enabled: true,
  provider: 'redis',        // hoặc 'memory', 'vercel', 'cloudflare'
  ttl: {
    posts: 120,             // 2 phút
    terms: 7200,            // 2 giờ
  },
},
```

### 9. Thêm post type mới

Trong PrestoWorld, đăng ký post type mới. Trong PrestoNext:

```typescript
// Sử dụng repository với post_type
const products = await postRepository.findAll({
  post_type: 'product',
  status: 'publish',
});
```

### 10. Thêm taxonomy mới

```typescript
const genres = await termRepository.findAll({
  taxonomy: 'genre',
});
```

---

## Triển khai

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Environment variables trong Vercel dashboard:
- `PRESTOWORLD_API_URL`
- `NEXT_PUBLIC_SITE_URL`

### Netlify

```bash
npm run build
# Upload .next hoặc dùng Netlify CLI
```

### Static Export

```bash
# Chỉnh config
DEPLOYMENT_TARGET=static

# Build
npm run build
# Output: out/
```

### Docker

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

### Cloudflare Pages

```bash
npm run build
# Deploy .next với Cloudflare Wrangler
```

---

## API Reference

### PrestoWorld API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/v1/posts` | Danh sách posts |
| GET | `/api/v1/posts/{id}` | Post theo ID |
| GET | `/api/v1/posts/by-slug?slug=X&post_type=Y` | Post theo slug |
| GET | `/api/v1/posts/{id}/related` | Posts liên quan |
| GET | `/api/v1/terms` | Danh sách terms |
| GET | `/api/v1/terms/{id}` | Term theo ID |
| GET | `/api/v1/terms/by-slug?slug=X&taxonomy=Y` | Term theo slug |
| GET | `/api/v1/media` | Danh sách media |
| GET | `/api/v1/media/{id}` | Media theo ID |
| GET | `/api/v1/menus` | Danh sách menus |
| GET | `/api/v1/menus/{slug}` | Menu theo slug |
| GET | `/api/v1/settings` | Site settings |
| GET | `/api/v1/users` | Danh sách users |
| GET | `/api/v1/users/{id}` | User theo ID |
| GET | `/api/v1/search?q=X` | Tìm kiếm |

### Query Parameters (Posts)

| Param | Type | Mô tả |
|-------|------|--------|
| `post_type` | string/string[] | Loại post |
| `status` | string | Trạng thái |
| `search` | string | Tìm kiếm |
| `category` | string | Category slug |
| `author` | number | Author ID |
| `tax_query` | array | Taxonomy query |
| `order` | ASC/DESC | Thứ tự |
| `orderby` | string | Sắp xếp theo |
| `per_page` | number | Số item/trang |
| `page` | number | Trang |
| `locale` | string | Ngôn ngữ |

### Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "post_type": "post",
    "title": "Hello World",
    "slug": "hello-world",
    "content": "...",
    "excerpt": "...",
    "link": "/post/hello-world",
    "terms": [...],
    "custom_data": {...}
  },
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

---

## Troubleshooting

### Lỗi thường gặp

1. **API không kết nối được**
   - Kiểm tra `PRESTOWORLD_API_URL`
   - Kiểm tra PrestoWorld CMS đang chạy

2. **Trang không hiển thị**
   - Kiểm tra `NODE_ENV`
   - Kiểm tra rendering strategy

3. **Type errors**
   - Chạy `npm run type-check`
   - Kiểm tra types trong `src/types/`

4. **Cache không update**
   - Kiểm tra revalidate time
   - Clear cache: `npm run build`

---

## Liên hệ

- PrestoWorld CMS: `/Users/puleeno/Projects/prestoworld.org`
- PrestoNext Frontend: `/Users/puleeno/Projects/PrestoNext`
- Documentation: `docs/` folder