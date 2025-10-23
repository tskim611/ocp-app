'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  automotive?: boolean; // Speedometer-inspired loader
}

/**
 * Loading spinner with automotive-inspired variant
 * Can display as standard spinner or speedometer gauge
 */
export function LoadingSpinner({
  size = 'md',
  className,
  automotive = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (automotive) {
    // Automotive gauge/speedometer loader
    return (
      <div className={cn('relative', sizeClasses[size], className)}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        {/* Animated arc */}
        <svg
          className="absolute inset-0 -rotate-90 animate-spin"
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="80 100"
            strokeLinecap="round"
            className="text-blue-600 dark:text-blue-400"
          />
        </svg>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
        </div>
      </div>
    );
  }

  // Standard spinner
  return (
    <svg
      className={cn('animate-spin text-blue-600', sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
