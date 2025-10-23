'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  automotive?: boolean; // Special automotive-inspired styling
  onClick?: () => void;
}

/**
 * Enhanced card component with automotive-inspired design
 * Features: hover lift, optional glow effect, dashboard-like panels
 */
export function Card({
  children,
  className,
  hover = true,
  glow = false,
  automotive = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl transition-all duration-300',
        // Base styles
        'bg-white dark:bg-gray-800',
        'border border-gray-200 dark:border-gray-700',
        // Hover effects
        hover &&
          'hover:shadow-2xl hover:-translate-y-1 hover:border-blue-500 dark:hover:border-blue-500',
        // Glow effect (automotive dashboard inspired)
        glow &&
          'shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        // Automotive panel styling
        automotive &&
          'bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-inner',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function CardHeader({ children, className, icon }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'p-6 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {icon && <div className="mb-3">{icon}</div>}
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
