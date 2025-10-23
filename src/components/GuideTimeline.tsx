'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  level: number;
}

interface GuideTimelineProps {
  content: string;
}

export function GuideTimeline({ content }: GuideTimelineProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [timelineTop, setTimelineTop] = useState(96); // Initial top position (24 * 4 = 96px)
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const extractedSections: Section[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      extractedSections.push({ id, title, level });
    }

    setSections(extractedSections);
  }, [content]);

  // Track scroll position for active section and reading progress
  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Prevent division by zero and handle edge cases
      const maxScroll = documentHeight - windowHeight;
      const scrollPercent = maxScroll > 0
        ? Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100)
        : 0;

      setReadingProgress(scrollPercent);

      // Find active section only if sections exist
      if (sections.length > 0) {
        const headings = sections.map((section) =>
          document.getElementById(section.id)
        );

        // Start from the top and find the first section that's past the top of viewport
        let newActiveSection = sections[0].id;
        let activeSectionElement: HTMLElement | null = null;

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          if (heading && heading.getBoundingClientRect().top <= 120) {
            newActiveSection = sections[i].id;
            activeSectionElement = heading;
            break;
          }
        }
        setActiveSection(newActiveSection);

        // Position timeline next to the active section
        if (activeSectionElement && timelineRef.current) {
          const sectionRect = activeSectionElement.getBoundingClientRect();
          const timelineHeight = timelineRef.current.offsetHeight;

          // Calculate desired position: align timeline with active section
          let desiredTop = sectionRect.top + scrollTop;

          // Apply constraints to keep timeline visible and reasonable
          const minTop = 96; // Minimum top position (same as initial)
          const maxTop = documentHeight - timelineHeight - 100; // Leave some space at bottom

          // Keep within viewport when possible
          if (sectionRect.top < 100) {
            // If section is near/past top of viewport, keep timeline in viewport
            desiredTop = scrollTop + 100;
          }

          // Apply min/max constraints
          desiredTop = Math.max(minTop, Math.min(maxTop, desiredTop));

          setTimelineTop(desiredTop);
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen for resize events (can affect scroll height)
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check with a small delay to ensure DOM is ready
    handleScroll();
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timer);
    };
  }, [sections]);

  // Auto-scroll timeline to keep active section visible and centered
  useEffect(() => {
    if (activeItemRef.current && timelineRef.current) {
      // Small delay to ensure DOM has updated
      const timer = setTimeout(() => {
        const timeline = timelineRef.current;
        const activeItem = activeItemRef.current;

        if (timeline && activeItem) {
          // Always center the active item in the timeline for better visibility
          const activeOffsetTop = activeItem.offsetTop;
          const timelineHeight = timeline.clientHeight;
          const activeHeight = activeItem.clientHeight;

          // Calculate position to center the active item
          const scrollTo = activeOffsetTop - (timelineHeight / 2) + (activeHeight / 2);

          timeline.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          });
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const getCompletionStatus = (index: number): 'completed' | 'active' | 'pending' => {
    const activeSectionIndex = sections.findIndex((s) => s.id === activeSection);
    if (index < activeSectionIndex) return 'completed';
    if (index === activeSectionIndex) return 'active';
    return 'pending';
  };

  if (sections.length === 0) return null;

  return (
    <div className="hidden lg:block">
      {/* Floating Timeline Sidebar - follows active section */}
      <div
        className="absolute w-64 xl:w-72 transition-all duration-500 ease-out"
        style={{ top: `${timelineTop}px` }}
      >
        {/* Fixed Progress Bar - stays visible */}
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Reading Progress
            </span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
              {Math.round(readingProgress)}%
            </span>
          </div>

          {/* Automotive-style progress gauge */}
          <div className="relative h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${readingProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            <div className="absolute inset-0 flex justify-between px-1">
              {[0, 25, 50, 75, 100].map((mark) => (
                <div
                  key={mark}
                  className="w-0.5 h-full bg-blue-300 dark:bg-blue-700"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Timeline Navigation */}
        <div ref={timelineRef} className="max-h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin">
          <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600" />

          {/* Timeline items */}
          <nav className="space-y-1">
            {sections.map((section, index) => {
              const status = getCompletionStatus(index);
              const isActive = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  ref={isActive ? activeItemRef : null}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'relative w-full text-left group transition-all duration-200',
                    section.level === 1 && 'pl-0',
                    section.level === 2 && 'pl-6',
                    section.level === 3 && 'pl-10'
                  )}
                >
                  <div className="flex items-start gap-3 py-2">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0 mt-1">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                          status === 'completed' &&
                            'bg-green-500 border-green-500 shadow-lg shadow-green-500/50',
                          status === 'active' &&
                            'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/50 scale-110',
                          status === 'pending' &&
                            'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        )}
                      >
                        {status === 'completed' && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {status === 'active' && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                        {status === 'pending' && (
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                        )}
                      </div>

                      {/* Pulse ring for active item */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Section title */}
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          'text-sm transition-all duration-200 line-clamp-2',
                          section.level === 1 && 'font-bold',
                          section.level === 2 && 'font-semibold',
                          section.level === 3 && 'font-medium',
                          isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : status === 'completed'
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                        )}
                      >
                        {section.title}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Estimated reading time */}
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {Math.ceil(content.split(/\s+/).length / 200)} min read
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

