'use client';

import { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import TouchRipple from '@/components/mobile/TouchRipple';
import BottomSheet from '@/components/mobile/BottomSheet';
import SwipeableCard from '@/components/mobile/SwipeableCard';
import ContextMenu from '@/components/mobile/ContextMenu';
import PullToRefreshIndicator from '@/components/mobile/PullToRefreshIndicator';
import { triggerHaptic } from '@/lib/haptics';

export default function MobileDemoPage() {
  const toast = useToast();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshCount((prev) => prev + 1);
    toast.success(`Refreshed ${refreshCount + 1} time${refreshCount + 1 > 1 ? 's' : ''}`);
  };

  return (
    <PullToRefreshIndicator onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Mobile UX Demo 📱
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Try all the mobile interactions below
            </p>
            {refreshCount > 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Pull down from top to refresh (Refreshed {refreshCount}x)
              </p>
            )}
          </div>

          {/* Toast Notifications Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔔 Toast Notifications
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tap buttons to trigger different toast types with haptic feedback
            </p>
            <div className="grid grid-cols-2 gap-3">
              <TouchRipple>
                <button
                  onClick={() => toast.success('Operation successful!')}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg font-semibold"
                >
                  Success
                </button>
              </TouchRipple>
              <TouchRipple>
                <button
                  onClick={() => toast.error('Something went wrong!')}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold"
                >
                  Error
                </button>
              </TouchRipple>
              <TouchRipple>
                <button
                  onClick={() => toast.warning('Please be careful!')}
                  className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold"
                >
                  Warning
                </button>
              </TouchRipple>
              <TouchRipple>
                <button
                  onClick={() => toast.info('Did you know...?')}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Info
                </button>
              </TouchRipple>
            </div>
          </section>

          {/* Touch Ripple Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ Touch Ripple Effect
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tap anywhere on these cards to see Material Design ripples
            </p>
            <div className="space-y-3">
              <TouchRipple className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
                <h3 className="font-bold text-lg">Purple Card</h3>
                <p className="text-sm opacity-90">Tap me!</p>
              </TouchRipple>
              <TouchRipple
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6"
                color="rgba(255, 255, 255, 0.3)"
              >
                <h3 className="font-bold text-lg">Blue Card</h3>
                <p className="text-sm opacity-90">Custom ripple color</p>
              </TouchRipple>
            </div>
          </section>

          {/* Bottom Sheet Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📋 Bottom Sheet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Mobile-optimized modal that slides from bottom. Drag down to close!
            </p>
            <TouchRipple>
              <button
                onClick={() => setIsBottomSheetOpen(true)}
                className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold"
              >
                Open Bottom Sheet
              </button>
            </TouchRipple>

            <BottomSheet
              isOpen={isBottomSheetOpen}
              onClose={() => setIsBottomSheetOpen(false)}
              title="Vehicle Import Details"
              snapPoints={[60, 90]}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Import Process Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Find your vehicle overseas</li>
                    <li>Calculate import costs</li>
                    <li>Arrange shipping</li>
                    <li>Handle customs clearance</li>
                    <li>Complete registration</li>
                  </ol>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Tip: Drag the handle at the top to adjust the sheet height!
                  </p>
                </div>
              </div>
            </BottomSheet>
          </section>

          {/* Swipeable Cards Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              👆 Swipeable Cards
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Swipe left to delete, swipe right to archive
            </p>
            <div className="space-y-3">
              <SwipeableCard
                leftAction={{
                  icon: '🗑️',
                  label: 'Delete',
                  color: '#ef4444',
                  onAction: () => toast.error('Thread deleted'),
                }}
                rightAction={{
                  icon: '📦',
                  label: 'Archive',
                  color: '#10b981',
                  onAction: () => toast.success('Thread archived'),
                }}
              >
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    How to import from Japan?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Detailed guide on importing vehicles...
                  </p>
                </div>
              </SwipeableCard>

              <SwipeableCard
                leftAction={{
                  icon: '🗑️',
                  label: 'Delete',
                  color: '#ef4444',
                  onAction: () => toast.error('Thread deleted'),
                }}
                rightAction={{
                  icon: '📦',
                  label: 'Archive',
                  color: '#10b981',
                  onAction: () => toast.success('Thread archived'),
                }}
              >
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Best shipping companies?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Compare costs and reliability...
                  </p>
                </div>
              </SwipeableCard>
            </div>
          </section>

          {/* Long-Press Context Menu Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ⏱️ Long-Press Context Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Press and hold on cards below to open contextual menus
            </p>
            <div className="space-y-3">
              <ContextMenu
                menuItems={[
                  {
                    icon: '✏️',
                    label: 'Edit',
                    onClick: () => toast.info('Edit clicked'),
                  },
                  {
                    icon: '📋',
                    label: 'Copy Link',
                    onClick: () => {
                      triggerHaptic('success');
                      toast.success('Link copied to clipboard');
                    },
                  },
                  {
                    icon: '🔗',
                    label: 'Share',
                    onClick: () => toast.info('Share clicked'),
                  },
                  {
                    icon: '🗑️',
                    label: 'Delete',
                    onClick: () => toast.error('Item deleted'),
                    destructive: true,
                  },
                ]}
              >
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Press and hold me!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Long-press to see contextual options
                  </p>
                </div>
              </ContextMenu>

              <ContextMenu
                menuItems={[
                  {
                    icon: '⭐',
                    label: 'Favorite',
                    onClick: () => toast.success('Added to favorites'),
                  },
                  {
                    icon: '🔕',
                    label: 'Mute',
                    onClick: () => toast.info('Thread muted'),
                  },
                  {
                    icon: '🚫',
                    label: 'Block User',
                    onClick: () => toast.warning('User blocked'),
                    destructive: true,
                  },
                ]}
              >
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Another long-press card
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Different menu options appear
                  </p>
                </div>
              </ContextMenu>
            </div>
          </section>

          {/* Haptic Feedback Test Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📳 Haptic Feedback Patterns
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test different vibration patterns (requires mobile device)
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { pattern: 'light' as const, label: 'Light', color: 'bg-gray-500' },
                { pattern: 'medium' as const, label: 'Medium', color: 'bg-blue-500' },
                { pattern: 'heavy' as const, label: 'Heavy', color: 'bg-purple-500' },
                { pattern: 'success' as const, label: 'Success', color: 'bg-green-500' },
                { pattern: 'warning' as const, label: 'Warning', color: 'bg-yellow-500' },
                { pattern: 'error' as const, label: 'Error', color: 'bg-red-500' },
              ].map(({ pattern, label, color }) => (
                <TouchRipple key={pattern}>
                  <button
                    onClick={() => {
                      triggerHaptic(pattern);
                      toast.info(`${label} haptic triggered`);
                    }}
                    className={`px-4 py-3 ${color} text-white rounded-lg font-semibold text-sm`}
                  >
                    {label}
                  </button>
                </TouchRipple>
              ))}
            </div>
          </section>

          {/* Info Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
            <p className="mb-2">💡 Best experienced on a mobile device</p>
            <p>All interactions include haptic feedback when supported</p>
          </div>
        </div>
      </div>
    </PullToRefreshIndicator>
  );
}
