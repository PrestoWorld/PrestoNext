'use client';

import React, { forwardRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

export interface SlotProps {
  children?: React.ReactNode;
  className?: string;
}

const Slot = forwardRef<HTMLElement, SlotProps>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) {
    return <span ref={ref as any} className={className} {...props}>{children}</span>;
  }

  const child = children as React.ReactElement<any>;
  const mergedProps = {
    ...props,
    ...child.props,
    ref: ref || child.ref,
    className: cn(child.props.className, className),
  };

  return React.createElement(child.type, mergedProps);
});

Slot.displayName = 'Slot';
export { Slot };
