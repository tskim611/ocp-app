'use client';

import { useState, useRef } from 'react';
import { triggerHaptic } from '@/lib/haptics';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface TouchRippleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number; // Duration in milliseconds
  hapticFeedback?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
}

export default function TouchRipple({
  children,
  className = '',
  color = 'rgba(0, 0, 0, 0.2)',
  duration = 600,
  hapticFeedback = true,
  disabled = false,
  onClick,
}: TouchRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>();
  const rippleIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Get touch/click coordinates
    let clientX: number;
    let clientY: number;

    if ('touches' in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Calculate ripple size (diameter should reach the farthest corner)
    const size = Math.max(
      Math.sqrt(x ** 2 + y ** 2),
      Math.sqrt((rect.width - x) ** 2 + y ** 2),
      Math.sqrt(x ** 2 + (rect.height - y) ** 2),
      Math.sqrt((rect.width - x) ** 2 + (rect.height - y) ** 2)
    ) * 2;

    const newRipple: Ripple = {
      id: rippleIdRef.current++,
      x,
      y,
      size,
    };

    setRipples((prev) => [...(prev || []), newRipple]);

    // Trigger haptic feedback
    if (hapticFeedback) {
      triggerHaptic('selection');
    }

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev?.filter((r) => r.id !== newRipple.id));
    }, duration);

    // Call onClick handler
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
      onMouseDown={createRipple}
      onTouchStart={createRipple}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}

      {/* Ripple effects */}
      {ripples?.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: 'translate(-50%, -50%) scale(0)',
            backgroundColor: color,
            animation: `ripple-effect ${duration}ms ease-out`,
          }}
        />
      ))}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes ripple-effect {
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
