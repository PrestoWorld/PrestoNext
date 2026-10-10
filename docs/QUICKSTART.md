# PrestoNext Quick Start

Bắt đầu nhanh với PrestoNext.

## 1. Cài đặt (5 phút)

```bash
# Clone project
cd /Users/puleeno/Projects/PrestoNext

# Cài dependencies
npm install

# Cấu hình environment
cp .env.example .env.local
# Chỉnh PRESTOWORLD_API_URL nếu cần

# Chạy dev server
npm run dev
```

Mở http://localhost:3000

## 2. Cấu hình PrestoWorld

Đảm bảo PrestoWorld CMS đang chạy:

```bash
cd /Users/puleeno/Projects/prestoworld.org
# Start PHP server (ví dụ)
php -S localhost:8000
```

## 3. Kiểm tra API

```bash
# Test API connection
curl http://localhost:8000/api/v1/posts

# Test qua Next.js proxy
curl http://localhost:3000/api/posts
```

## 4. Thêm trang đầu tiên

```typescript
// src/app/hello/page.tsx
export default function HelloPage() {
  return <h1>Hello PrestoNext!</h1>;
}
```

Truy cập http://localhost:3000/hello

## 5. Lấy dữ liệu từ PrestoWorld

```typescript
// src/app/posts/page.tsx
import { postRepository } from '@/lib/repositories';

export default async function PostsPage() {
  const posts = await postRepository.findAllWithCache({
    status: 'publish',
    per_page: 10,
  });
  
  return (
    <div>
      <h1>Posts</h1>
      {posts?.data.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

## 6. Deploy

```bash
# Build
npm run build

# Deploy lên Vercel
npm i -g vercel
vercel --prod
```

## Tài liệu chi tiết

- **README.md** - Hướng dẫn sử dụng tổng quan
- **docs/DEVELOPMENT.md** - Hướng dẫn phát triển
- **docs/CUSTOMIZATION.md** - Tuỳ biến theo project
- **docs/API.md** - API reference đầy đủ

## Cấu trúc project

```
PrestoNext/
├── src/
│   ├── app/           # Pages & API routes (Next.js App Router)
│   ├── components/    # React components
│   ├── config/        # Configuration
│   ├── hooks/         # React hooks (SWR)
│   ├── lib/           # API client, repositories, utils
│   └── types/         # TypeScript types
├── docs/              # Documentation
└── public/            # Static assets
```

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Start production
npm run lint         # Lint
npm run type-check   # TypeScript check
npm run test         # Tests
```

## Hỗ trợ

- PrestoWorld CMS: `/Users/puleeno/Projects/prestoworld.org`
- PrestoNext: `/Users/puleeno/Projects/PrestoNext`