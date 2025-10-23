'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import type { ThreadWithDetails } from '@/lib/database.types';
import { useSwipeable } from '@/hooks/useSwipeable';
import { cn } from '@/lib/utils';

interface ThreadCardProps {
  thread: ThreadWithDetails;
  locale: string;
  index: number;
}

/**
 * Enhanced thread card with expand/collapse and swipe interactions
 * Features hover lift, smooth transitions, and automotive-inspired design
 */
export function ThreadCard({ thread, locale, index }: ThreadCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipeLeft: () => setIsExpanded(false),
    onSwipeRight: () => setIsExpanded(true),
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article
      {...swipeHandlers}
      className={cn(
        'relative group overflow-hidden rounded-xl transition-all duration-300',
        'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
        'border border-gray-200 dark:border-gray-700',
        'hover:shadow-2xl hover:-translate-y-1 hover:border-blue-500 dark:hover:border-blue-400',
        isExpanded && 'shadow-xl ring-2 ring-blue-500 dark:ring-blue-400'
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <Link href={`/community/${thread.id}`} className="block">
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2 className={cn(
                "font-semibold mb-2 transition-all duration-200",
                "text-gray-900 dark:text-gray-100",
                "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                isExpanded ? "text-xl" : "text-lg line-clamp-2"
              )}>
                {thread.title}
              </h2>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                {/* Author */}
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate max-w-[150px]">{thread.author_email}</span>
                </div>

                {/* Comment count */}
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">
                    {thread.comment_count} {thread.comment_count === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <time dateTime={thread.last_activity_at}>
                    {formatDate(thread.last_activity_at)}
                  </time>
                </div>
              </div>
            </div>

            {/* Arrow icon with animation */}
            <div className={cn(
              "flex-shrink-0 transition-all duration-300",
              "w-10 h-10 rounded-full flex items-center justify-center",
              "bg-blue-100 dark:bg-blue-900/30",
              "group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50",
              "group-hover:scale-110"
            )}>
              <svg
                className={cn(
                  "w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform duration-300",
                  isExpanded && "rotate-90"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Expandable content */}
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            isExpanded ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Click to view full discussion and join the conversation...
              </p>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Discussion
                </span>
              </div>
            </div>
          </div>

          {/* Mobile swipe indicator */}
          {isExpanded && (
            <div className="lg:hidden absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Swipe to collapse
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Expand/Collapse button (desktop) */}
      <button
        onClick={handleToggle}
        className="hidden lg:block absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        <svg
          className={cn(
            "w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Activity indicator */}
      {thread.comment_count > 5 && (
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
          <div className="relative">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
            <div className="absolute inset-0 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>
      )}
    </article>
  );
}
