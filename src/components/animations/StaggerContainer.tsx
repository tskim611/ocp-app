'use client';

import { ReactNode, Children } from 'react';
import { FadeIn } from './FadeIn';

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

/**
 * Container that staggers the animation of its children
 * Each child fades in with an incremental delay
 */
export function StaggerContainer({
  children,
  staggerDelay = 100,
  direction = 'up',
  className,
}: StaggerContainerProps) {
  const childArray = Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <FadeIn
          key={index}
          direction={direction}
          delay={index * staggerDelay}
          triggerOnce={true}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
