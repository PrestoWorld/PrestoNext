# PrestoNext API Reference

Tài liệu API đầy đủ cho PrestoNext.

## Mục lục

1. [REST API](#rest-api)
2. [Client API](#client-api)
3. [Repository API](#repository-api)
4. [Hooks API](#hooks-api)
5. [Types](#types)

---

## REST API

### Base URL

```
{PRESTOWORLD_API_URL}/api/v1
```

### Authentication

PrestoNext sử dụng public API, không yêu cầu authentication cho read operations.

### Endpoints

#### Posts

**GET /posts**

Lấy danh sách posts.

```
GET /api/v1/posts?post_type=post&status=publish&per_page=10&page=1
```

**Query Parameters:**

| Param | Type | Required | Default | Mô tả |
|-------|------|----------|---------|--------|
| `post_type` | string | No | `post` | Loại post |
| `status` | string | No | `publish` | Trạng thái |
| `search` | string | No | - | Tìm kiếm |
| `category` | string | No | - | Category slug |
| `author` | number | No | - | Author ID |
| `order` | string | No | `DESC` | ASC/DESC |
| `orderby` | string | No | `date` | date/title/id |
| `per_page` | number | No | `10` | Items per page |
| `page` | number | No | `1` | Page number |
| `locale` | string | No | - | Ngôn ngữ |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "post_type": "post",
      "status": "publish",
      "title": "Hello World",
      "slug": "hello-world",
      "content": "<p>Content...</p>",
      "excerpt": "Excerpt...",
      "author_id": 1,
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00",
      "published_at": "2024-01-01 00:00:00",
      "link": "/post/hello-world",
      "terms": [...],
      "custom_data": {...}
    }
  ],
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10,
    "from": 1,
    "to": 10
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  }
}
```

**GET /posts/{id}**

Lấy post theo ID.

```
GET /api/v1/posts/1?locale=en
```

**GET /posts/by-slug**

Lấy post theo slug.

```
GET /api/v1/posts/by-slug?slug=hello-world&post_type=post
```

**GET /posts/{id}/related**

Lấy posts liên quan.

```
GET /api/v1/posts/1/related?type=post&limit=5
```

#### Terms

**GET /terms**

Lấy danh sách terms.

```
GET /api/v1/terms?taxonomy=category&per_page=20
```

**Query Parameters:**

| Param | Type | Required | Default | Mô tả |
|-------|------|----------|---------|--------|
| `taxonomy` | string | No | `category` | Taxonomy name |
| `search` | string | No | - | Tìm kiếm |
| `parent` | number | No | - | Parent ID |
| `hide_empty` | boolean | No | `false` | Ẩn empty terms |
| `per_page` | number | No | `20` | Items per page |
| `page` | number | No | `1` | Page number |
| `orderby` | string | No | `name` | name/slug/count/id |
| `order` | string | No | `ASC` | ASC/DESC |

**GET /terms/{id}**

Lấy term theo ID.

**GET /terms/by-slug**

Lấy term theo slug.

```
GET /api/v1/terms/by-slug?slug=news&taxonomy=category
```

#### Media

**GET /media**

Lấy danh sách media.

```
GET /api/v1/media?per_page=20&search=image
```

**GET /media/{id}**

Lấy media theo ID.

#### Menus

**GET /menus**

Lấy danh sách menus.

**GET /menus/{slug}**

Lấy menu theo slug.

```
GET /api/v1/menus/main-menu
```

#### Settings

**GET /settings**

Lấy site settings.

```json
{
  "success": true,
  "data": {
    "site_title": "PrestoWorld",
    "site_tagline": "A modern CMS",
    "site_url": "https://prestoworld.com",
    "home_url": "/",
    "admin_email": "admin@example.com",
    "timezone": "UTC",
    "locale": "en",
    "date_format": "F j, Y",
    "time_format": "g:i A",
    "posts_per_page": 10,
    "default_category": 1,
    "default_post_format": "standard"
  }
}
```

#### Users

**GET /users**

Lấy danh sách users.

**GET /users/{id}**

Lấy user theo ID.

#### Search

**GET /search**

Tìm kiếm nội dung.

```
GET /api/v1/search?q=keyword&post_type=post&per_page=10
```

**Query Parameters:**

| Param | Type | Required | Default | Mô tả |
|-------|------|----------|---------|--------|
| `q` | string | Yes | - | Search query |
| `post_type` | string | No | - | Loại post |
| `per_page` | number | No | `10` | Items per page |

---

## Client API

### Import

```typescript
import { prestoworldApi, api } from '@/lib/api/prestoworld-client';
```

### Methods

```typescript
// Posts
await prestoworldApi.getPosts(query);
await prestoworldApi.getPost(id, locale);
await prestoworldApi.getPostBySlug(slug, postType, locale);

// Terms
await prestoworldApi.getTerms(query);
await prestoworldApi.getTerm(id);
await prestoworldApi.getTermBySlug(slug, taxonomy);
await prestoworldApi.getCategories(query);
await prestoworldApi.getTags(query);

// Media
await prestoworldApi.getMedia(query);
await prestoworldApi.getMediaById(id);

// Users
await prestoworldApi.getUser(id);
await prestoworldApi.getUsers(query);

// Menus
await prestoworldApi.getMenus();
await prestoworldApi.getMenu(slug);

// Settings
await prestoworldApi.getSiteSettings();

// Search
await prestoworldApi.search(query, options);
```

### Example

```typescript
const response = await prestoworldApi.getPosts({
  post_type: 'post',
  status: 'publish',
  per_page: 10,
  page: 1,
});

if (response.success) {
  console.log(response.data.data);    // Posts array
  console.log(response.data.meta);    // Pagination meta
  console.log(response.data.links);   // Pagination links
} else {
  console.error(response.error);
}
```

---

## Repository API

### Import

```typescript
import {
  postRepository,
  termRepository,
  mediaRepository,
  menuRepository,
  settingsRepository,
  userRepository,
  searchRepository,
} from '@/lib/repositories';
```

### PostRepository

```typescript
// Find all posts
const posts = await postRepository.findAll(query);
const posts = await postRepository.findAllWithCache(query);

// Find by ID
const post = await postRepository.findById(id, locale);
const post = await postRepository.findByIdWithCache(id, locale);

// Find by slug
const post = await postRepository.findBySlug(slug, postType, locale);

// Related posts
const related = await postRepository.getRelatedPosts(postId, postType, limit);
```

### TermRepository

```typescript
// Find all terms
const terms = await termRepository.findAll(query);

// Find by ID
const term = await termRepository.findById(id);

// Find by slug
const term = await termRepository.findBySlug(slug, taxonomy);

// Categories
const categories = await termRepository.getCategories(query);
const category = await termRepository.getCategoryBySlug(slug);

// Tags
const tags = await termRepository.getTags(query);
const tag = await termRepository.getTagBySlug(slug);
```

### MediaRepository

```typescript
const media = await mediaRepository.findAll(query);
const item = await mediaRepository.findById(id);
const item = await mediaRepository.getMediaById(id);
```

### MenuRepository

```typescript
const menus = await menuRepository.findAll();
const menu = await menuRepository.findBySlug(slug);
const menu = await menuRepository.getMenu(slug);
const allMenus = await menuRepository.getAllMenus();
```

### SettingsRepository

```typescript
const settings = await settingsRepository.getSettings();
```

### UserRepository

```typescript
const users = await userRepository.findAll(query);
const user = await userRepository.findById(id);
const user = await userRepository.getUser(id);
```

### SearchRepository

```typescript
const results = await searchRepository.search(query, options);
```

---

## Hooks API

### Import

```typescript
import {
  usePosts,
  usePost,
  usePostBySlug,
  useTerms,
  useCategories,
  useTags,
  useTerm,
  useMedia,
  useMenu,
  useMenus,
  useSiteSettings,
  useUser,
  useSearch,
  useRelatedPosts,
  useInfinitePosts,
  usePrefetch,
} from '@/hooks/use-prestoworld';
```

### usePosts

```typescript
const { posts, pagination, links, isLoading, isError, error, mutate } = usePosts({
  post_type: 'post',
  status: 'publish',
  per_page: 10,
});
```

### usePost

```typescript
const { post, isLoading, isError, error, mutate } = usePost(id, locale);
```

### usePostBySlug

```typescript
const { post, isLoading, isError, error, mutate } = usePostBySlug(slug, postType, locale);
```

### useTerms

```typescript
const { terms, pagination, links, isLoading, isError, error, mutate } = useTerms({
  taxonomy: 'category',
});
```

### useCategories / useTags

```typescript
const { terms, pagination, isLoading } = useCategories();
const { terms, pagination, isLoading } = useTags();
```

### useTerm

```typescript
const { term, isLoading, isError } = useTerm(id);
```

### useMedia

```typescript
const { media, pagination, isLoading } = useMedia({ per_page: 20 });
```

### useMenu / useMenus

```typescript
const { menu, isLoading } = useMenu('main-menu');
const { menus, isLoading } = useMenus();
```

### useSiteSettings

```typescript
const { settings, isLoading } = useSiteSettings();
```

### useUser

```typescript
const { user, isLoading } = useUser(id);
```

### useSearch

```typescript
const { results, pagination, isLoading } = useSearch('keyword', {
  post_type: 'post',
  per_page: 10,
});
```

### useRelatedPosts

```typescript
const { posts, isLoading } = useRelatedPosts(postId, 'post', 5);
```

### useInfinitePosts

```typescript
const { posts, isLoading, isLoadingMore, isError, hasMore, loadMore, mutate } = useInfinitePosts({
  post_type: 'post',
  per_page: 10,
});

// Load more
<button onClick={loadMore}>Load More</button>
```

### usePrefetch

```typescript
const { prefetch, prefetchPost, prefetchPosts } = usePrefetch();

// Prefetch on hover
<Link href="/posts/1" onMouseEnter={() => prefetchPost(1)}>
  Post
</Link>
```

---

## Types

### Import

```typescript
import type {
  PrestoPost,
  PrestoTerm,
  PrestoMedia,
  PrestoUser,
  PrestoMenu,
  PrestoMenuItem,
  PrestoSiteSettings,
  PrestoPaginatedResponse,
  PrestoPostQuery,
  PrestoTermQuery,
  PrestoApiResponse,
  PrestoApiSuccess,
  PrestoApiError,
  PrestoTranslation,
  PrestoBlock,
  PrestoParsedContent,
} from '@/types/prestoworld';
```

### PrestoPost

```typescript
interface PrestoPost {
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
```

### PrestoTerm

```typescript
interface PrestoTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
  url: string;
}
```

### PrestoPaginatedResponse

```typescript
interface PrestoPaginatedResponse<T> {
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
```

### PrestoApiResponse

```typescript
type PrestoApiResponse<T> = PrestoApiSuccess<T> | PrestoApiError;

interface PrestoApiSuccess<T> {
  success: true;
  data: T;
}

interface PrestoApiError {
  success: false;
  error: string;
  message?: string;
  code?: string;
  status: number;
}
```

### Usage Example

```typescript
import type { PrestoPost, PrestoApiResponse } from '@/types/prestoworld';

async function getPost(id: number): Promise<PrestoPost | null> {
  const response: PrestoApiResponse<PrestoPost> = await prestoworldApi.getPost(id);
  
  if (response.success) {
    return response.data;
  }
  
  return null;
}
```

---

## Utilities

### Import

```typescript
import {
  cn,
  formatDate,
  formatRelativeTime,
  truncate,
  stripHtml,
  slugify,
  getInitials,
  debounce,
  throttle,
  isBrowser,
  getEnv,
  sleep,
  retry,
  generateId,
  deepClone,
  omit,
  pick,
} from '@/lib/utils';
```

### Examples

```typescript
// Class name merging
cn('bg-white', 'dark:bg-gray-900', condition && 'hidden');

// Date formatting
formatDate('2024-01-01');                    // "January 1, 2024"
formatDate('2024-01-01', { timeZone: 'UTC' });
formatRelativeTime('2024-01-01');            // "2d ago"

// Text utilities
truncate('Long text...', 100);               // Truncate to 100 chars
stripHtml('<p>Hello</p>');                   // "Hello"
slugify('Hello World');                      // "hello-world"
getInitials('John Doe');                     // "JD"

// Function utilities
debounce(fn, 300);                           // Debounce 300ms
throttle(fn, 1000);                          // Throttle 1s

// Object utilities
omit(obj, ['key1', 'key2']);                 // Remove keys
pick(obj, ['key1', 'key2']);                 // Pick keys
deepClone(obj);                              // Deep clone

// Async utilities
await sleep(1000);                           // Wait 1s
await retry(fn, 3, 1000);                    // Retry 3 times
```

---

## Configuration API

### Import

```typescript
import {
  config,
  getConfig,
  getRenderingStrategy,
  getRevalidationTime,
} from '@/config';
```

### Examples

```typescript
// Get current config
const cfg = getConfig();

// Get rendering strategy for route
const strategy = getRenderingStrategy('/posts/my-post');
// 'isr' | 'ssr' | 'ssg' | 'csr'

// Get revalidation time for route
const revalidate = getRevalidationTime('/posts/my-post');
// 60 (seconds)
```

---

## Error Handling

### API Errors

```typescript
const response = await prestoworldApi.getPosts();

if (!response.success) {
  console.error('Error:', response.error);
  console.error('Status:', response.status);
  console.error('Code:', response.code);
  return;
}

// Use response.data
```

### Try-Catch

```typescript
try {
  const post = await postRepository.findById(1);
  if (!post) {
    throw new Error('Post not found');
  }
} catch (error) {
  console.error('Failed to fetch post:', error);
}
```

---

## Best Practices

1. **Luôn kiểm tra `response.success`** trước khi sử dụng data
2. **Sử dụng Repository Pattern** thay vì gọi API trực tiếp
3. **Sử dụng hooks** cho client-side data fetching
4. **Sử dụng Server Components** khi có thể (performance)
5. **Type-safe** - sử dụng types từ `@/types/prestoworld`
6. **Error handling** - luôn có fallback cho API errors
7. **Caching** - sử dụng revalidate hợp lý
8. **SEO** - sử dụng `generateMetadata` cho dynamic pages