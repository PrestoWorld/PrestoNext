/**
 * Footer Component
 * Site footer with navigation, social links, copyright
 */

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Rss, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { config } from '@/config';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com', ariaLabel: 'Facebook' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', ariaLabel: 'Twitter' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com', ariaLabel: 'Instagram' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', ariaLabel: 'LinkedIn' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com', ariaLabel: 'YouTube' },
  { name: 'GitHub', icon: Github, href: 'https://github.com', ariaLabel: 'GitHub' },
  { name: 'RSS', icon: Rss, href: '/feed.xml', ariaLabel: 'RSS Feed' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@example.com', ariaLabel: 'Email' },
];

const footerLinks = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Community', href: '/community' },
    { label: 'Support', href: '/support' },
    { label: 'Partners', href: '/partners' },
    { label: 'Affiliates', href: '/affiliates' },
    { label: 'API Docs', href: '/api-docs' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Security', href: '/security' },
    { label: 'GDPR', href: '/gdpr' },
  ],
};

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800', className)} role="contentinfo">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="PrestoWorld Home">
              <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">PrestoWorld</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              A modern headless CMS frontend built with Next.js. Powered by PrestoWorld CMS.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.slice(0, 5).map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <nav aria-label="Product">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources Links */}
          <nav aria-label="Resources">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} {config.site.name}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Cookies
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Built with</span>
              <span className="text-red-500">♥</span>
              <span>Next.js & PrestoWorld</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}