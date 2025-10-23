'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  automotive?: boolean; // Dashboard gauge style
  className?: string;
  animate?: boolean;
}

/**
 * Progress bar with automotive dashboard styling option
 * Displays horizontal bar or gauge-like indicator
 */
export function ProgressBar({
  value,
  label,
  showPercentage = false,
  automotive = false,
  className,
  animate = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value, animate]);

  const percentage = Math.min(Math.max(displayValue, 0), 100);

  if (automotive) {
    // Automotive gauge-style progress
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
            {showPercentage && (
              <span className="text-blue-600 dark:text-blue-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className="relative h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
          {/* Glow effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {/* Indicator marks */}
          <div className="absolute inset-0 flex justify-between px-1">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="w-px h-full bg-gray-400/50 dark:bg-gray-500/50"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Standard progress bar
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
