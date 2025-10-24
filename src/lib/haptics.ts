/**
 * Haptic Feedback Utilities for Mobile Devices
 * Provides tactile feedback through device vibration patterns
 */

export type HapticPattern =
  | 'light'      // Single short tap (50ms)
  | 'medium'     // Single medium tap (100ms)
  | 'heavy'      // Single strong tap (200ms)
  | 'success'    // Double tap pattern
  | 'warning'    // Triple tap pattern
  | 'error'      // Irregular pattern for errors
  | 'selection'  // Very light tap for selections (25ms)
  | 'impact'     // Quick impact for button presses (75ms)
  | 'notification'; // Gentle pattern for notifications

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [50, 50, 100],
  warning: [50, 50, 50, 50, 100],
  error: [100, 50, 100, 50, 200],
  selection: 25,
  impact: 75,
  notification: [50, 100, 50],
};

/**
 * Checks if the device supports vibration
 */
export const isHapticsSupported = (): boolean => {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Triggers haptic feedback with the specified pattern
 * @param pattern - The haptic pattern to trigger
 * @param force - Force vibration even if user preferences suggest reduced motion
 */
export const triggerHaptic = (pattern: HapticPattern, force = false): void => {
  // Check if haptics are supported
  if (!isHapticsSupported()) {
    return;
  }

  // Respect user's reduced motion preferences unless forced
  if (!force && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const vibrationPattern = HAPTIC_PATTERNS[pattern];

  try {
    navigator.vibrate(vibrationPattern);
  } catch (error) {
    // Silently fail if vibration is blocked or fails
    console.debug('Haptic feedback failed:', error);
  }
};

/**
 * Stops any ongoing vibration
 */
export const cancelHaptic = (): void => {
  if (isHapticsSupported()) {
    try {
      navigator.vibrate(0);
    } catch (error) {
      console.debug('Cancel haptic failed:', error);
    }
  }
};

/**
 * Custom haptic pattern
 * @param pattern - Array of vibration durations in milliseconds
 */
export const triggerCustomHaptic = (pattern: number[]): void => {
  if (!isHapticsSupported()) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.debug('Custom haptic failed:', error);
  }
};

/**
 * React hook for haptic feedback
 */
export const useHaptics = () => {
  return {
    trigger: triggerHaptic,
    cancel: cancelHaptic,
    custom: triggerCustomHaptic,
    isSupported: isHapticsSupported(),
  };
};
