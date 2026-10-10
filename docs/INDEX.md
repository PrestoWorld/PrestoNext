# PrestoNext - Next.js Frontend for PrestoWorld CMS

PrestoNext là frontend Next.js 14 cho PrestoWorld CMS (Witals PHP framework), hỗ trợ hybrid rendering (SSR/SSG/ISR/CSR), TypeScript, và multi-platform deployment.

## ✨ Tính năng

- 🚀 **Hybrid Rendering** - SSR, SSG, ISR, CSR tuỳ chọn theo route
- 🔒 **Type-Safe** - TypeScript toàn bộ, Zod validation
- 🌐 **Multi-Platform** - Vercel, Netlify, Cloudflare, AWS, Docker, Static
- 🔌 **Extensible** - Plugin system, theme support, modular architecture
- 🎨 **Modern UI** - Tailwind CSS, dark mode, responsive
- 📱 **Accessible** - ARIA labels, semantic HTML, keyboard navigation

## 🚀 Quick Start

```bash
# Cài đặt
npm install

# Cấu hình
cp .env.example .env.local

# Chạy dev server
npm run dev
```

Mở http://localhost:3000

## 📚 Tài liệu

| Tài liệu | Mô tả |
|----------|--------|
| [Quick Start](docs/QUICKSTART.md) | Bắt đầu nhanh trong 5 phút |
| [README](README.md) | Hướng dẫn sử dụng tổng quan |
| [Development](docs/DEVELOPMENT.md) | Hướng dẫn phát triển chi tiết |
| [Customization](docs/CUSTOMIZATION.md) | Tuỳ biến theo từng project |
| [API Reference](docs/API.md) | API đầy đủ (REST, Client, Repository, Hooks) |
| [Architecture](docs/ARCHITECTURE.md) | Kiến trúc hệ thống & design patterns |

## 🏗️ Kiến trúc

```
PrestoNext (Next.js 14)
├── App Router (src/app/)
├── Repository Pattern (src/lib/repositories/)
├── API Client (src/lib/api/)
├── Hooks (src/hooks/)
└── UI Components (src/components/)
         ↓
PrestoWorld CMS (PHP/Witals)
└── Headless-CMS Module (/api/v1/*)
```

## 📁 Cấu trúc Project

```
PrestoNext/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes (proxy)
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   ├── config/           # Configuration
│   ├── hooks/            # React hooks (SWR)
│   ├── lib/              # API client, repositories, utils
│   └── types/            # TypeScript types
├── docs/                 # Documentation
├── public/               # Static assets
└── next.config.js        # Next.js config
```

## ⚙️ Cấu hình

```typescript
// src/config/index.ts
export const config: PrestoNextConfig = {
  site: { name: 'PrestoWorld' },
  api: { baseUrl: 'http://localhost:8000' },
  rendering: {
    defaultStrategy: 'isr',
    revalidation: { posts: 60, terms: 3600 },
  },
  features: {
    enableSearch: true,
    enableDarkMode: true,
    supportedLocales: ['en', 'vi'],
  },
  deployment: { target: 'vercel' },
};
```

## 🔌 API Endpoints

| Endpoint | Mô tả |
|----------|--------|
| `GET /api/v1/posts` | Danh sách posts |
| `GET /api/v1/posts/{id}` | Post theo ID |
| `GET /api/v1/posts/by-slug` | Post theo slug |
| `GET /api/v1/terms` | Danh sách terms |
| `GET /api/v1/media` | Danh sách media |
| `GET /api/v1/menus` | Danh sách menus |
| `GET /api/v1/settings` | Site settings |
| `GET /api/v1/users` | Danh sách users |
| `GET /api/v1/search?q=X` | Tìm kiếm |

## 🛠️ Commands

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run start        # Start production
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run test         # Jest tests
```

## 🎯 Use Cases

- **Blog/Magazine** - ISR cho posts, SSR cho search
- **E-commerce** - ISR cho products, CSR cho cart
- **Corporate** - SSG cho pages, ISR cho news
- **Documentation** - SSG toàn bộ, edge runtime

## 🤝 Liên kết

- **PrestoWorld CMS**: `/Users/puleeno/Projects/prestoworld.org`
- **PrestoNext**: `/Users/puleeno/Projects/PrestoNext`
- **Witals Framework**: PHP framework cho PrestoWorld

## 📄 License

MIT License - xem [LICENSE](./LICENSE)