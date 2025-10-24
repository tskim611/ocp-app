'use client';

import { useCallback, useRef, useState } from 'react';
import { triggerHaptic } from '@/lib/haptics';

interface LongPressOptions {
  onLongPress: (e: React.TouchEvent | React.MouseEvent) => void;
  onClick?: (e: React.TouchEvent | React.MouseEvent) => void;
  delay?: number; // Delay in milliseconds before triggering long press
  movementThreshold?: number; // Max movement in pixels before canceling
  hapticFeedback?: boolean;
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
  movementThreshold = 10,
  hapticFeedback = true,
}: LongPressOptions) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const progressIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  const startProgressAnimation = useCallback(() => {
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / delay) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, 10);
  }, [delay]);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = undefined;
    }
    setIsLongPressing(false);
    setProgress(0);
    hasMoved.current = false;
  }, []);

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      // Store start position
      if ('touches' in e) {
        startPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        startPos.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      hasMoved.current = false;
      setIsLongPressing(true);

      // Light haptic on press start
      if (hapticFeedback) {
        triggerHaptic('selection');
      }

      // Start progress animation
      startProgressAnimation();

      // Set timer for long press
      timerRef.current = setTimeout(() => {
        if (!hasMoved.current) {
          setIsLongPressing(false);
          setProgress(100);

          // Stronger haptic on long press trigger
          if (hapticFeedback) {
            triggerHaptic('medium');
          }

          onLongPress(e);
        }
      }, delay);
    },
    [onLongPress, delay, hapticFeedback, startProgressAnimation]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!startPos.current) return;

      let currentX: number, currentY: number;

      if ('touches' in e) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      const deltaX = Math.abs(currentX - startPos.current.x);
      const deltaY = Math.abs(currentY - startPos.current.y);

      // Cancel if moved beyond threshold
      if (deltaX > movementThreshold || deltaY > movementThreshold) {
        hasMoved.current = true;
        cancelTimer();
      }
    },
    [movementThreshold, cancelTimer]
  );

  const handleEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      // If timer is still running, it's a regular click
      if (timerRef.current && !hasMoved.current) {
        cancelTimer();
        if (onClick) {
          onClick(e);
        }
      } else {
        cancelTimer();
      }
    },
    [onClick, cancelTimer]
  );

  return {
    handlers: {
      onMouseDown: handleStart,
      onMouseUp: handleEnd,
      onMouseMove: handleMove,
      onMouseLeave: cancelTimer,
      onTouchStart: handleStart,
      onTouchEnd: handleEnd,
      onTouchMove: handleMove,
    },
    isLongPressing,
    progress,
  };
}
