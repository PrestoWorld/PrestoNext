/**
 * Home Page
 * Main landing page with hero, featured posts, categories
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Tag, FolderOpen, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/image';
import { postRepository, termRepository } from '@/lib/repositories';
import { formatDate, truncate, cn } from '@/lib/utils';
import { config } from '@/config';
import type { PrestoPost, PrestoTerm } from '@/types/prestoworld';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to PrestoWorld - A modern headless CMS frontend built with Next.js',
};

interface PostCardProps {
  post: PrestoPost;
  variant?: 'default' | 'featured' | 'compact';
}

function PostCard({ post, variant = 'default' }: PostCardProps) {
  const postTypeLabels: Record<string, string> = {
    post: 'Article',
    page: 'Page',
    product: 'Product',
    event: 'Event',
  };

  const formatPostType = (type: string) => postTypeLabels[type] || type;

  if (variant === 'featured') {
    return (
      <article className="relative group h-96 md:h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {post.custom_data?.featured_image && (
          <OptimizedImage
            src={post.custom_data.featured_image as string}
            alt={post.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            {post.terms.slice(0, 2).map((term) => (
              <span
                key={term.id}
                className="px-2 py-1 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm"
              >
                {term.name}
              </span>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
            <Link href={post.link} className="hover:text-primary-300 transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-white/90 mb-4 line-clamp-2 text-base md:text-lg">
            {truncate(stripHtml(post.excerpt || post.content), 200)}
          </p>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            {post.custom_data?.author_name && (
              <span className="flex items-center gap-1">
                {post.custom_data.author_name}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="flex gap-4">
        {post.custom_data?.featured_image && (
          <Link href={post.link} className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <OptimizedImage
              src={post.custom_data.featured_image as string}
              alt={post.title}
              fill
              className="object-cover"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
              {formatPostType(post.post_type)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            <Link href={post.link} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {truncate(stripHtml(post.excerpt || post.content), 150)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      {post.custom_data?.featured_image && (
        <Link href={post.link} className="relative aspect-video overflow-hidden rounded-t-xl">
          <OptimizedImage
            src={post.custom_data.featured_image as string}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      <CardContent className="flex-1 flex flex-col p-5 pt-0">
        <div className="flex items-center gap-2 mb-3">
          {post.terms.slice(0, 2).map((term) => (
            <Link
              key={term.id}
              href={term.url}
              className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {term.name}
            </Link>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          <Link href={post.link} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {truncate(stripHtml(post.excerpt || post.content), 180)}
        </p>
      </CardContent>
      <CardFooter className="pt-0 border-t-0">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(post.published_at || post.created_at)}
          </span>
          <Link
            href={post.link}
            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            Read more
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

async function getFeaturedPosts(): Promise<PrestoPost[]> {
  const response = await postRepository.findAll({
    status: 'publish',
    per_page: 5,
    orderby: 'date',
    order: 'DESC',
  });
  return response.success ? response.data.data : [];
}

async function getLatestPosts(): Promise<PrestoPost[]> {
  const response = await postRepository.findAll({
    status: 'publish',
    per_page: 6,
    orderby: 'date',
    order: 'DESC',
  });
  return response.success ? response.data.data : [];
}

async function getCategories(): Promise<PrestoTerm[]> {
  const response = await termRepository.getCategories({
    per_page: 8,
    hide_empty: true,
    orderby: 'count',
    order: 'DESC',
  });
  return response?.data ?? [];
}

export default async function HomePage() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    getFeaturedPosts(),
    getLatestPosts(),
    getCategories(),
  ]);

  const featuredPost = featuredPosts[0];
  const otherFeaturedPosts = featuredPosts.slice(1, 4);

  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24" aria-labelledby="hero-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 id="hero-heading" className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Welcome to <span className="text-primary-600 dark:text-primary-400">PrestoWorld</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              A modern headless CMS frontend built with Next.js. Featuring hybrid rendering, 
              TypeScript, and a beautiful, accessible UI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/posts">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section aria-labelledby="featured-heading" className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 id="featured-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Featured Article
              </h2>
            </div>
            <PostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      {/* More Featured Posts */}
      {otherFeaturedPosts.length > 0 && (
        <section aria-labelledby="more-featured-heading" className="py-8">
          <div className="container mx-auto px-4">
            <h2 id="more-featured-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              More Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherFeaturedPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section aria-labelledby="categories-heading" className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 id="categories-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Categories
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/categories">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.url}
                  className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} {category.count === 1 ? 'post' : 'posts'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts */}
      <section aria-labelledby="latest-heading" className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 id="latest-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Latest Posts
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/posts">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
          {latestPosts.length > 6 && (
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/posts">Load More Posts</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="py-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why PrestoNext?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Hybrid Rendering',
                description: 'Supports SSR, SSG, and ISR out of the box. Choose the best rendering strategy per page.',
              },
              {
                icon: Tag,
                title: 'Type-Safe API',
                description: 'Full TypeScript support with auto-generated types from PrestoWorld CMS schema.',
              },
              {
                icon: FolderOpen,
                title: 'Extensible Architecture',
                description: 'Plugin system, theme support, and modular design for multi-purpose deployments.',
              },
            ].map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <div className="mx-auto mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Deploy your own PrestoNext frontend in minutes. Connect to your PrestoWorld CMS and start building.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="https://github.com/prestoworld/prestonext" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/docs/getting-started">
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}