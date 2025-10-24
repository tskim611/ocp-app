'use client';

import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshIndicatorProps {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function PullToRefreshIndicator({
  onRefresh,
  threshold = 80,
  disabled = false,
  children,
}: PullToRefreshIndicatorProps) {
  const { isPulling, isRefreshing, pullDistance, shouldTriggerRefresh, progress } =
    usePullToRefresh({
      onRefresh,
      threshold,
      disabled,
    });

  const indicatorOpacity = Math.min(pullDistance / threshold, 1);
  const rotation = (progress / 100) * 360;

  return (
    <>
      {/* Pull-to-Refresh Indicator */}
      <div
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
          opacity: indicatorOpacity,
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
          {isRefreshing ? (
            // Refreshing spinner
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
          ) : (
            // Pull indicator arrow
            <svg
              className={`h-6 w-6 transition-colors ${
                shouldTriggerRefresh ? 'text-green-600' : 'text-blue-600'
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
        </div>

        {/* Progress text */}
        <div className="absolute top-full mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {isRefreshing
            ? 'Refreshing...'
            : shouldTriggerRefresh
            ? 'Release to refresh'
            : 'Pull to refresh'}
        </div>
      </div>

      {/* Backdrop overlay when pulling */}
      {isPulling && (
        <div
          className="fixed inset-0 bg-black pointer-events-none"
          style={{
            opacity: indicatorOpacity * 0.1,
            transition: 'opacity 0.2s ease-out',
          }}
        />
      )}

      {children}
    </>
  );
}
