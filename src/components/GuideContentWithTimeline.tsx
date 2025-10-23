'use client';

import { useEffect, useRef } from 'react';
import MarkdownContent from './MarkdownContent';
import { GuideTimeline } from './GuideTimeline';

interface GuideContentWithTimelineProps {
  content: string;
}

export default function GuideContentWithTimeline({
  content,
}: GuideContentWithTimelineProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Add IDs to headings after MarkdownContent renders
  useEffect(() => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      heading.id = id;

      // Add scroll margin for better positioning when navigating
      heading.classList.add('scroll-mt-20');
    });
  }, [content]);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div ref={contentRef}>
          <MarkdownContent content={content} />
        </div>
      </div>

      {/* Timeline sidebar (hidden on mobile/tablet) */}
      <aside className="hidden lg:block flex-shrink-0 w-64 xl:w-72">
        <GuideTimeline content={content} />
      </aside>
    </div>
  );
}
