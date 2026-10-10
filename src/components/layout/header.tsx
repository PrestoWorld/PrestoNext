/**
 * Header Component
 * Main navigation header with logo, menu, search, user actions
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarGroup } from '@/components/ui/image';
import { useMenu } from '@/components/providers';
import { useSearchContext } from '@/components/providers';
import { useTheme } from 'next-themes';
import { useMenu as useMenuData } from '@/hooks/use-prestoworld';
import type { PrestoMenu } from '@/types/prestoworld';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useMenu();
  const { query, setQuery, isOpen: isSearchOpen, setIsOpen: setSearchOpen, recentSearches } = useSearchContext();
  const { theme, setTheme } = useTheme();
  const { menu, isLoading } = useMenuData('main');
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        isScrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm' : 'bg-transparent',
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="PrestoWorld Home">
            <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              PrestoWorld
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {menu?.items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <SearchButton 
              onClick={() => setSearchOpen(true)}
              isOpen={isSearchOpen}
              onClose={() => setSearchOpen(false)}
              query={query}
              onQueryChange={setQuery}
              recentSearches={recentSearches}
            />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <AvatarGroup max={3} size="sm">
                  <Avatar name="John Doe" src="/avatars/john.jpg" />
                  <Avatar name="Jane Smith" src="/avatars/jane.jpg" />
                  <Avatar name="Bob Wilson" />
                </AvatarGroup>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
            {menu?.items.map((item) => (
              <MobileMenuItem key={item.id} item={item} onClick={setMobileMenuOpen} />
            ))}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setSearchOpen(false)}
          query={query}
          onQueryChange={setQuery}
          recentSearches={recentSearches}
        />
      )}
    </header>
  );
}

/**
 * Menu Item Component
 */
function MenuItem({ item }: { item: PrestoMenuItem }) {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  if (hasChildren) {
    return (
      <div className="relative group">
        <button
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.title}
          <ChevronDown className="w-4 h-4" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
    >
      {item.title}
    </Link>
  );
}

/**
 * Mobile Menu Item Component
 */
function MobileMenuItem({ item, onClick }: { item: PrestoMenuItem; onClick: () => void }) {
  const hasChildren = item.children && item.children.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  if (hasChildren) {
    return (
      <div>
        <button
          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span>{item.title}</span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={onClick}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.url}
      className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg"
      onClick={onClick}
    >
      {item.title}
    </Link>
  );
}

/**
 * Search Button Component
 */
function SearchButton({ 
  onClick, 
  isOpen, 
  onClose, 
  query, 
  onQueryChange, 
  recentSearches 
}: {
  onClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  recentSearches: string[];
}) {
  const [showRecent, setShowRecent] = useState(false);

  if (isOpen) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            placeholder="Search posts, pages, categories..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={onClose}
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </Button>
        </form>

        {showRecent && recentSearches.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => {
                    onQueryChange(search);
                    handleSearchSubmit(new Event('submit') as unknown as React.FormEvent);
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label="Open search"
      className="relative"
    >
      <Search className="w-5 h-5" />
      <span className="hidden sm:inline ml-1">Search</span>
    </Button>
  );
}

function handleSearchSubmit(e: React.FormEvent) {
  e.preventDefault();
}

/**
 * Search Modal Component
 */
function SearchModal({ 
  isOpen, 
  onClose, 
  query, 
  onQueryChange, 
  recentSearches 
}: {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  recentSearches: string[];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
        <form onSubmit={handleSearchSubmit} className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search posts, pages, categories, tags..."
              className="w-full pl-12 pr-12 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="md"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </form>

        {recentSearches.length > 0 && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  type="button"
                  onClick={() => {
                    onQueryChange(search);
                    handleSearchSubmit(new Event('submit') as unknown as React.FormEvent);
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Import missing
import { useState } from 'react';