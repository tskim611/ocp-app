'use client';

import { useState, useRef, TouchEvent, ReactNode } from 'react';
import { triggerHaptic } from '@/lib/haptics';

interface SwipeAction {
  icon: ReactNode;
  color: string;
  label: string;
  onAction: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
  className?: string;
}

export default function SwipeableCard({
  children,
  leftAction,
  rightAction,
  threshold = 80,
  className = '',
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
    setHasTriggeredHaptic(false);
    triggerHaptic('selection');
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping) return;

    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;

    // Limit swipe distance to prevent over-swiping
    const maxSwipe = 120;
    const limitedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));

    // Only allow swipe if action is defined in that direction
    if ((diff > 0 && !rightAction) || (diff < 0 && !leftAction)) {
      return;
    }

    setTranslateX(limitedDiff);

    // Trigger haptic when threshold is reached
    if (Math.abs(limitedDiff) >= threshold && !hasTriggeredHaptic) {
      triggerHaptic('impact');
      setHasTriggeredHaptic(true);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

    const swipeDistance = Math.abs(translateX);
    const isLeftSwipe = translateX < 0;
    const isRightSwipe = translateX > 0;

    // Execute action if threshold is met
    if (swipeDistance >= threshold) {
      if (isLeftSwipe && leftAction) {
        triggerHaptic('success');
        leftAction.onAction();
      } else if (isRightSwipe && rightAction) {
        triggerHaptic('success');
        rightAction.onAction();
      }
    }

    // Reset
    setTranslateX(0);
    setIsSwiping(false);
    setHasTriggeredHaptic(false);
    startX.current = 0;
    currentX.current = 0;
  };

  const progress = Math.min(Math.abs(translateX) / threshold, 1);
  const showLeftAction = translateX < 0 && leftAction;
  const showRightAction = translateX > 0 && rightAction;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left Action Background */}
      {showLeftAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end px-6"
          style={{
            backgroundColor: leftAction.color,
            opacity: progress,
            width: `${Math.abs(translateX)}px`,
          }}
        >
          <div className="flex flex-col items-center text-white">
            <div className="text-2xl mb-1">{leftAction.icon}</div>
            <span className="text-xs font-semibold">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right Action Background */}
      {showRightAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start px-6"
          style={{
            backgroundColor: rightAction.color,
            opacity: progress,
            width: `${translateX}px`,
          }}
        >
          <div className="flex flex-col items-center text-white">
            <div className="text-2xl mb-1">{rightAction.icon}</div>
            <span className="text-xs font-semibold">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div
        className="relative bg-white dark:bg-gray-800 touch-pan-y"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Swipe Hint Indicator (shows on first render) */}
      {(leftAction || rightAction) && (
        <div className="absolute top-2 right-2 text-gray-400 dark:text-gray-600 text-xs animate-pulse">
          ⇄ Swipe
        </div>
      )}
    </div>
  );
}
