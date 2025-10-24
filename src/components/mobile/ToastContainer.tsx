'use client';

import { useToast, Toast, ToastType } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-500',
    icon: 'text-green-600 dark:text-green-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-500',
    icon: 'text-red-600 dark:text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-500',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-500',
    icon: 'text-blue-600 dark:text-blue-400',
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const colors = TOAST_COLORS[toast.type];
  const icon = TOAST_ICONS[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const startTime = Date.now();
      const duration = toast.duration; // Capture for closure
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        mb-3 rounded-xl border-l-4 shadow-lg overflow-hidden
        transform transition-all duration-300 ease-out
        ${colors.bg} ${colors.border}
        ${isExiting ? 'translate-y-2 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'}
      `}
      style={{
        animation: isExiting ? 'none' : 'slideInUp 0.3s ease-out',
      }}
    >
      <div className="flex items-start p-4">
        {/* Icon */}
        <div
          className={`
            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
            font-bold text-sm
            ${colors.icon}
          `}
        >
          {icon}
        </div>

        {/* Message */}
        <div className="flex-1 mx-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {toast.message}
          </p>
        </div>

        {/* Action or Close Button */}
        {toast.action ? (
          <button
            onClick={() => {
              toast.action!.onClick();
              handleClose();
            }}
            className="flex-shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {toast.action.label}
          </button>
        ) : (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all ease-linear ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                ? 'bg-red-500'
                : toast.type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}
