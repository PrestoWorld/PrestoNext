# PrestoNext Development Guide

Hướng dẫn phát triển chi tiết cho PrestoNext.

## Mục lục

1. [Setup Development Environment](#setup-development-environment)
2. [Project Structure](#project-structure)
3. [Adding New Features](#adding-new-features)
4. [Customization Examples](#customization-examples)
5. [Testing](#testing)
6. [Performance Optimization](#performance-optimization)

---

## Setup Development Environment

### Prerequisites

```bash
# Node.js 18+
node --version

# npm 9+
npm --version

# PHP 8.1+ (for PrestoWorld)
php --version
```

### Installation

```bash
# Clone
git clone <repo>
cd PrestoNext

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start dev server
npm run dev
```

### Development Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

---

## Project Structure

### Detailed Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Route groups (optional)
│   │   ├── about/
│   │   └── contact/
│   ├── api/                      # API routes
│   │   ├── posts/
│   │   │   ├── route.ts          # GET /api/posts
│   │   │   └── [...slug]/
│   │   │       └── route.ts      # GET /api/posts/:id
│   │   ├── terms/
│   │   ├── media/
│   │   ├── menus/
│   │   ├── settings/
│   │   ├── users/
│   │   └── search/
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx          # Dynamic post page
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx          # Category page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── error.tsx                 # Error boundary
├── components/
│   ├── layout/
│   │   ├── header.tsx            # Site header
│   │   ├── footer.tsx            # Site footer
│   │   └── sidebar.tsx           # Optional sidebar
│   ├── providers.tsx             # Context providers
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── image.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── posts/                    # Feature components
│       ├── post-card.tsx
│       ├── post-list.tsx
│       └── post-content.tsx
├── config/
│   └── index.ts                  # App configuration
├── hooks/
│   └── use-prestoworld.ts        # Data fetching hooks
├── lib/
│   ├── api/
│   │   └── prestoworld-client.ts # HTTP client
│   ├── repositories/
│   │   └── index.ts              # Repository pattern
│   └── utils.ts                  # Utility functions
└── types/
    └── prestoworld.ts            # TypeScript types
```

---

## Adding New Features

### 1. New Page Type

**Bước 1**: Tạo page file

```typescript
// src/app/products/[slug]/page.tsx
import { postRepository } from '@/lib/repositories';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await postRepository.findAllWithCache({
    post_type: 'product',
    status: 'publish',
    per_page: 100,
  });
  
  return products?.data.map((p) => ({ slug: p.slug })) ?? [];
}

export default async function ProductPage({ params }: PageProps) {
  const product = await postRepository.findBySlug(params.slug, 'product');
  
  if (!product) {
    notFound();
  }
  
  return (
    <div>
      <h1>{product.title}</h1>
      <div>{product.content}</div>
    </div>
  );
}
```

**Bước 2**: Thêm metadata

```typescript
export async function generateMetadata({ params }: PageProps) {
  const product = await postRepository.findBySlug(params.slug, 'product');
  
  return {
    title: product?.title,
    description: product?.excerpt,
  };
}
```

### 2. New API Endpoint

**Bước 1**: Tạo API route

```typescript
// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.PRESTOWORLD_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  const response = await fetch(
    `${API_URL}/api/v1/posts?post_type=product${category ? `&category=${category}` : ''}`
  );
  const data = await response.json();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 3. New Hook

```typescript
// src/hooks/use-products.ts
import useSWR from 'swr';
import type { PrestoPost } from '@/types/prestoworld';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useProducts(category?: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return {
    products: data?.data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
```

### 4. New Component

```typescript
// src/components/products/product-card.tsx
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/image';
import type { PrestoPost } from '@/types/prestoworld';

interface ProductCardProps {
  product: PrestoPost;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card hover>
      <Link href={product.link}>
        {product.custom_data?.image && (
          <OptimizedImage
            src={product.custom_data.image as string}
            alt={product.title}
            fill
          />
        )}
        <h3>{product.title}</h3>
        <p>{product.excerpt}</p>
      </Link>
    </Card>
  );
}
```

---

## Customization Examples

### Example 1: E-commerce Site

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  site: {
    name: 'My Shop',
    url: 'https://myshop.com',
  },
  features: {
    enableSearch: true,
    enableNewsletter: true,
  },
  rendering: {
    routes: {
      '/products/:slug': 'isr',
      '/cart': 'csr',
      '/checkout': 'ssr',
    },
  },
};
```

### Example 2: Blog Site

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  site: {
    name: 'My Blog',
  },
  rendering: {
    defaultStrategy: 'isr',
    revalidation: {
      posts: 300,    // 5 phút
      home: 60,      // 1 phút
    },
  },
  features: {
    enableComments: true,
    enableNewsletter: true,
  },
};
```

### Example 3: Corporate Site

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  site: {
    name: 'My Company',
  },
  rendering: {
    defaultStrategy: 'ssg',  // Static generation
    routes: {
      '/news/:slug': 'isr',
      '/contact': 'ssr',
    },
  },
  deployment: {
    target: 'static',
    staticExport: true,
  },
};
```

### Example 4: Multi-language

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  features: {
    enableMultiLanguage: true,
    supportedLocales: ['en', 'vi', 'fr', 'de'],
    defaultLocale: 'en',
  },
};

// Sử dụng trong page
export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const post = await postRepository.findBySlug(params.slug, 'post', params.locale);
  // ...
}
```

---

## Testing

### Unit Tests

```typescript
// src/lib/repositories/__tests__/post-repository.test.ts
import { PostRepository } from '../index';

describe('PostRepository', () => {
  it('should fetch posts', async () => {
    const repo = new PostRepository();
    const result = await repo.findAll({ status: 'publish' });
    
    expect(result.success).toBe(true);
  });
});
```

### Component Tests

```typescript
// src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Run Tests

```bash
npm run test
npm run test:watch
```

---

## Performance Optimization

### 1. Image Optimization

```typescript
// Sử dụng OptimizedImage thay vì <img>
import { OptimizedImage } from '@/components/ui/image';

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  fill
  priority={false}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 2. Font Optimization

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Font display swap
  variable: '--font-inter',
});
```

### 3. Code Splitting

```typescript
// Dynamic import cho components nặng
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>,
  ssr: false,  // Client-only
});
```

### 4. Caching Strategy

```typescript
// Static với revalidate
export const revalidate = 3600; // 1 giờ

// Dynamic (không cache)
export const dynamic = 'force-dynamic';

// Static params
export async function generateStaticParams() {
  // Pre-render các trang phổ biến
}
```

### 5. API Response Caching

```typescript
// Trong API route
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
});
```

---

## Best Practices

1. **Sử dụng TypeScript strict mode** - Đã bật trong tsconfig.json
2. **Server Components mặc định** - Chỉ dùng 'use client' khi cần interactivity
3. **Sử dụng Repository Pattern** - Không gọi API trực tiếp trong components
4. **Type-safe API responses** - Sử dụng types trong src/types/
5. **Error handling** - Luôn kiểm tra response.success
6. **SEO** - Sử dụng generateMetadata cho dynamic pages
7. **Accessibility** - Sử dụng semantic HTML, ARIA labels

---

## Troubleshooting

### Common Issues

**Issue**: `Error: Configuring Next.js via 'next.config.ts' is not supported`
**Fix**: Đổi thành `next.config.js` hoặc `next.config.mjs`

**Issue**: `Module not found: lucide-react`
**Fix**: `npm install lucide-react`

**Issue**: API không kết nối
**Fix**: Kiểm tra `PRESTOWORLD_API_URL` trong `.env.local`

**Issue**: Trang trắng
**Fix**: Kiểm tra console errors, kiểm tra API response

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PrestoWorld CMS](../prestoworld.org)
- [Tailwind CSS](https://tailwindcss.com)
- [SWR](https://swr.vercel.app)
- [TypeScript](https://typescriptlang.org)