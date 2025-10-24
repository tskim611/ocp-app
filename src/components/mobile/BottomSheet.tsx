'use client';

import { useEffect, useRef, useState } from 'react';
import { triggerHaptic } from '@/lib/haptics';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Percentages of viewport height (e.g., [30, 60, 90])
  initialSnap?: number; // Index of initial snap point
  closeOnBackdrop?: boolean;
  showHandle?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [90],
  initialSnap = 0,
  closeOnBackdrop = true,
  showHandle = true,
}: BottomSheetProps) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  const currentSnapPoint = snapPoints[currentSnapIndex];
  const sheetHeight = `${currentSnapPoint}vh`;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when sheet is open
      document.body.style.overflow = 'hidden';
      triggerHaptic('light');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
    triggerHaptic('selection');
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    // Only allow dragging downward
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = currentY.current - startY.current;
    const threshold = window.innerHeight * 0.15; // 15% of viewport

    if (diff > threshold) {
      // Check if there's a lower snap point
      if (currentSnapIndex < snapPoints.length - 1) {
        setCurrentSnapIndex(currentSnapIndex + 1);
        triggerHaptic('impact');
      } else {
        // Close if already at lowest snap point
        onClose();
        triggerHaptic('medium');
      }
    }

    setIsDragging(false);
    setTranslateY(0);
    startY.current = 0;
    currentY.current = 0;
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
      triggerHaptic('light');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{
          opacity: isOpen ? 0.5 : 0,
        }}
        onClick={handleBackdropClick}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
        style={{
          height: sheetHeight,
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: `calc(${sheetHeight} - 100px)` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
