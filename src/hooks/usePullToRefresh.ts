'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { triggerHaptic } from '@/lib/haptics';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance in pixels to trigger refresh (default: 80)
  maxPullDistance?: number; // Maximum pull distance (default: 120)
  resistance?: number; // Pull resistance factor (default: 2.5)
  disabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  shouldTriggerRefresh: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  resistance = 2.5,
  disabled = false,
}: PullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    shouldTriggerRefresh: false,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const hasTriggeredHaptic = useRef<boolean>(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled || state.isRefreshing) return;

      // Only activate if scrolled to top
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      hasTriggeredHaptic.current = false;
    },
    [disabled, state.isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled || state.isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      // Only handle downward pulls
      if (diff <= 0) return;

      // Check if still at top
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 0) return;

      // Apply resistance to pull distance
      const pullDistance = Math.min(diff / resistance, maxPullDistance);

      // Prevent default scroll behavior when pulling
      if (pullDistance > 10) {
        e.preventDefault();
      }

      const shouldTrigger = pullDistance >= threshold;

      // Trigger haptic feedback when threshold is crossed
      if (shouldTrigger && !hasTriggeredHaptic.current) {
        triggerHaptic('impact');
        hasTriggeredHaptic.current = true;
      }

      setState({
        isPulling: true,
        isRefreshing: false,
        pullDistance,
        shouldTriggerRefresh: shouldTrigger,
      });
    },
    [disabled, state.isRefreshing, resistance, maxPullDistance, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled) return;

    const { shouldTriggerRefresh } = state;

    if (shouldTriggerRefresh) {
      setState((prev) => ({
        ...prev,
        isPulling: false,
        isRefreshing: true,
      }));

      triggerHaptic('success');

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
        triggerHaptic('error');
      } finally {
        // Add a small delay for better UX
        setTimeout(() => {
          setState({
            isPulling: false,
            isRefreshing: false,
            pullDistance: 0,
            shouldTriggerRefresh: false,
          });
        }, 300);
      }
    } else {
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        shouldTriggerRefresh: false,
      });
    }

    startY.current = 0;
    currentY.current = 0;
    hasTriggeredHaptic.current = false;
  }, [disabled, state, onRefresh]);

  useEffect(() => {
    if (disabled) return;

    const element = document.body;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled]);

  return {
    ...state,
    progress: Math.min((state.pullDistance / threshold) * 100, 100),
  };
};
