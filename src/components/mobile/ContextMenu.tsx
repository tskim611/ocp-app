'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { useLongPress } from '@/hooks/useLongPress';
import { triggerHaptic } from '@/lib/haptics';

export interface MenuItem {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  children: ReactNode;
  menuItems: MenuItem[];
  className?: string;
}

export default function ContextMenu({
  children,
  menuItems,
  className = '',
}: ContextMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const { handlers, isLongPressing, progress } = useLongPress({
    onLongPress: (e) => {
      let clientX: number, clientY: number;

      if ('touches' in e) {
        const touch = e.touches[0] || e.changedTouches[0];
        clientX = touch?.clientX || 0;
        clientY = touch?.clientY || 0;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      setMenuPosition({ x: clientX, y: clientY });
      setIsMenuOpen(true);
      triggerHaptic('medium');
    },
    delay: 500,
  });

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        triggerHaptic('light');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Adjust menu position to keep it on screen
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let { x, y } = menuPosition;

    // Adjust horizontal position
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 10;
    }

    // Adjust vertical position
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 10;
    }

    setMenuPosition({ x, y });
  }, [isMenuOpen]); // Only run when menu opens

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    triggerHaptic(item.destructive ? 'warning' : 'impact');
    item.onClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Wrapped content with long-press */}
      <div {...handlers} className={`relative select-none ${className}`}>
        {children}

        {/* Long-press progress indicator */}
        {isLongPressing && progress > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-blue-500/10 rounded-lg" />
            <div
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Context Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" />

          {/* Menu */}
          <div
            ref={menuRef}
            className="fixed z-[60] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden min-w-[200px] border border-gray-200 dark:border-gray-700"
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
              animation: 'scaleIn 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left
                  transition-colors duration-150
                  ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : item.destructive
                      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }
                  ${index !== 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}
                `}
              >
                {item.icon && (
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                )}
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
