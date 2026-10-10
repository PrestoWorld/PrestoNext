/**
 * Optimized Image Component
 * Wrapper around Next.js Image with common patterns
 */

'use client';

import Image from 'next/image';
import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      fill = false,
      priority = false,
      placeholder = 'blur',
      blurDataURL,
      sizes,
      quality = 75,
      className,
      objectFit = 'cover',
      objectPosition = 'center',
      ...props
    },
    ref
  ) => {
    // Generate a simple blur placeholder if not provided
    const computedBlurDataURL = blurDataURL || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image
          ref={ref}
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={computedBlurDataURL}
          sizes={sizes || (fill ? '100vw' : undefined)}
          quality={quality}
          style={{
            objectFit,
            objectPosition,
            ...props.style,
          }}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };

/**
 * Responsive Image Component
 * Handles multiple breakpoints automatically
 */
export interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'sizes'> {
  widths?: number[];
  breakpoints?: Record<string, string>;
}

export const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  (
    {
      src,
      alt,
      fill = true,
      priority = false,
      placeholder = 'blur',
      blurDataURL,
      widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      breakpoints,
      quality = 75,
      className,
      objectFit = 'cover',
      objectPosition = 'center',
      ...props
    },
    ref
  ) => {
    const computedBlurDataURL = blurDataURL || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    // Generate sizes attribute from breakpoints
    const defaultBreakpoints = {
      '(max-width: 640px)': '100vw',
      '(max-width: 768px)': '100vw',
      '(max-width: 1024px)': '50vw',
      '(max-width: 1280px)': '33vw',
    };

    const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints };
    const sizes = Object.entries(mergedBreakpoints)
      .map(([query, size]) => `${query} ${size}`)
      .join(', ');

    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={computedBlurDataURL}
        sizes={sizes}
        quality={quality}
        style={{
          objectFit,
          objectPosition,
          ...props.style,
        }}
        className={cn('block', className)}
        {...props}
      />
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';

/**
 * Avatar Component
 * For user/profile images with fallback
 */
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  fallbackColor?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

const colorPalette = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-pink-500',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      fallbackColor,
      className,
      ...props
    },
    ref
  ) => {
    const hasImage = !!src;
    const initials = name ? getInitials(name) : '?';
    const bgColor = fallbackColor || (name ? getColorFromName(name) : 'bg-gray-500');

    if (hasImage) {
      return (
        <Image
          ref={ref}
          src={src!}
          alt={alt || name || 'Avatar'}
          width={parseInt(sizeClasses[size].split('-')[1]) * 4}
          height={parseInt(sizeClasses[size].split('-')[1]) * 4}
          className={cn(sizeClasses[size], shapeClasses[shape], 'object-cover', className)}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size],
          shapeClasses[shape],
          bgColor,
          'flex items-center justify-center text-white font-medium',
          className
        )}
        {...props}
      >
        {initials}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

/**
 * Avatar Group Component
 */
import { ReactNode } from 'react';

export interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({ children, max = 5, size = 'md', className }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} aria-label={`${childrenArray.length} people`}>
      {visibleChildren.map((child, index) => (
        <span key={index} className="relative z-10">
          {React.cloneElement(child as React.ReactElement, { size })}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={cn(sizeClasses[size], 'rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-white font-medium border-2 border-white dark:border-gray-900')}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
}