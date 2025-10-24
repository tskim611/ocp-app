# Mobile UX Features Documentation

This document describes the mobile-focused visual and tactile interactions added to the OCP App to enhance user experience on mobile devices.

## 📱 Features Overview

### 1. **Haptic Feedback System** (`/src/lib/haptics.ts`)

Provides tactile feedback through device vibration patterns.

#### Patterns Available:
- `light` (50ms) - Gentle tap for selections
- `medium` (100ms) - Standard feedback
- `heavy` (200ms) - Strong confirmation
- `success` - Double-tap pattern for successful actions
- `error` - Irregular pattern for errors
- `warning` - Triple-tap for warnings
- `selection` (25ms) - Very light tap for UI selections
- `impact` (75ms) - Quick tap for button presses
- `notification` - Gentle pattern for notifications

#### Usage:
```tsx
import { triggerHaptic } from '@/lib/haptics';

// Trigger a haptic pattern
triggerHaptic('success');

// Use custom pattern (array of durations in ms)
triggerCustomHaptic([50, 100, 50]);

// Check if haptics are supported
if (isHapticsSupported()) {
  // Device supports vibration
}
```

#### Features:
- ✅ Respects `prefers-reduced-motion` settings
- ✅ Gracefully degrades on unsupported devices
- ✅ 9 predefined patterns for common interactions
- ✅ Custom pattern support

---

### 2. **Pull-to-Refresh** (`/src/hooks/usePullToRefresh.ts` + `/src/components/mobile/PullToRefreshIndicator.tsx`)

Native-like pull-to-refresh gesture for updating content.

#### Usage:
```tsx
import PullToRefreshIndicator from '@/components/mobile/PullToRefreshIndicator';

function MyPage() {
  const handleRefresh = async () => {
    await fetchNewData();
  };

  return (
    <PullToRefreshIndicator onRefresh={handleRefresh}>
      <div>{/* Your content */}</div>
    </PullToRefreshIndicator>
  );
}
```

#### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRefresh` | `() => Promise<void>` | Required | Async function to refresh data |
| `threshold` | `number` | 80 | Distance (px) to trigger refresh |
| `disabled` | `boolean` | false | Disable the gesture |

#### Features:
- ✅ Only activates when scrolled to top
- ✅ Visual progress indicator
- ✅ Haptic feedback at threshold
- ✅ Pull resistance for natural feel
- ✅ "Release to refresh" text hint

---

### 3. **Bottom Sheet Modal** (`/src/components/mobile/BottomSheet.tsx`)

Mobile-optimized modal that slides from the bottom of the screen.

#### Usage:
```tsx
import BottomSheet from '@/components/mobile/BottomSheet';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Sheet</button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Options"
        snapPoints={[30, 60, 90]}
        initialSnap={1}
      >
        <p>Sheet content here...</p>
      </BottomSheet>
    </>
  );
}
```

#### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Control visibility |
| `onClose` | `() => void` | Required | Close callback |
| `title` | `string` | - | Optional header title |
| `snapPoints` | `number[]` | `[90]` | Heights as % of viewport |
| `initialSnap` | `number` | 0 | Initial snap point index |
| `closeOnBackdrop` | `boolean` | true | Click backdrop to close |
| `showHandle` | `boolean` | true | Show drag handle |

#### Features:
- ✅ Drag handle for resizing
- ✅ Multiple snap points (e.g., 30%, 60%, 90% height)
- ✅ Drag down to dismiss
- ✅ Backdrop blur effect
- ✅ Prevents body scroll when open
- ✅ Auto-adjusts to stay on screen

---

### 4. **Touch Ripple Effect** (`/src/components/mobile/TouchRipple.tsx`)

Material Design-inspired ripple animation on tap.

#### Usage:
```tsx
import TouchRipple from '@/components/mobile/TouchRipple';

function MyComponent() {
  return (
    <TouchRipple
      onClick={() => console.log('Clicked!')}
      color="rgba(255, 255, 255, 0.3)"
    >
      <button>Click me!</button>
    </TouchRipple>
  );
}
```

#### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Content to wrap |
| `className` | `string` | '' | Additional classes |
| `color` | `string` | `'rgba(0, 0, 0, 0.2)'` | Ripple color |
| `duration` | `number` | 600 | Animation duration (ms) |
| `hapticFeedback` | `boolean` | true | Enable haptic on tap |
| `disabled` | `boolean` | false | Disable interactions |
| `onClick` | `function` | - | Click handler |

#### Features:
- ✅ Ripple expands from tap point
- ✅ Multiple concurrent ripples
- ✅ Customizable color and duration
- ✅ Works with touch and mouse events
- ✅ Optional haptic feedback

---

### 5. **Toast Notifications** (`/src/contexts/ToastContext.tsx` + `/src/components/mobile/ToastContainer.tsx`)

Bottom-positioned, mobile-optimized toast notifications.

#### Setup:
The app is already wrapped with `ToastProvider` in `/src/app/[locale]/layout.tsx`.

#### Usage:
```tsx
import { useToast } from '@/contexts/ToastContext';

function MyComponent() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success('Saved!')}>
      Save
    </button>
  );
}
```

#### API:
```tsx
// Simple toasts
toast.success('Operation successful!');
toast.error('Something went wrong!');
toast.warning('Please be careful!');
toast.info('Did you know...?');

// With custom duration (0 = persistent)
toast.success('Saved!', 5000);

// With action button
toast.addToast({
  message: 'Item deleted',
  type: 'error',
  duration: 5000,
  action: {
    label: 'Undo',
    onClick: () => restoreItem(),
  },
});
```

#### Features:
- ✅ 4 toast types (success, error, warning, info)
- ✅ Auto-dismiss with progress bar
- ✅ Swipe to dismiss
- ✅ Action button support
- ✅ Stacked toasts
- ✅ Haptic feedback per type
- ✅ Bottom-positioned for thumb reach
- ✅ Dark mode support

---

### 6. **Swipeable Cards** (`/src/components/mobile/SwipeableCard.tsx`)

Cards with left/right swipe actions (like email apps).

#### Usage:
```tsx
import SwipeableCard from '@/components/mobile/SwipeableCard';

function MyComponent() {
  return (
    <SwipeableCard
      leftAction={{
        icon: '🗑️',
        label: 'Delete',
        color: '#ef4444',
        onAction: () => handleDelete(),
      }}
      rightAction={{
        icon: '📦',
        label: 'Archive',
        color: '#10b981',
        onAction: () => handleArchive(),
      }}
    >
      <div>Your card content</div>
    </SwipeableCard>
  );
}
```

#### Props:
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Card content |
| `leftAction` | `SwipeAction` | Left swipe action |
| `rightAction` | `SwipeAction` | Right swipe action |
| `threshold` | `number` | Distance to trigger (default: 80px) |
| `className` | `string` | Additional classes |

#### SwipeAction Interface:
```tsx
interface SwipeAction {
  icon: ReactNode;
  color: string;      // Background color (e.g., '#ef4444')
  label: string;      // Action label
  onAction: () => void; // Callback function
}
```

#### Features:
- ✅ Visual action preview while swiping
- ✅ Color-coded actions (red=delete, green=archive)
- ✅ Haptic feedback at threshold
- ✅ Progress opacity effect
- ✅ Prevents over-swiping
- ✅ Swipe hint indicator

---

### 7. **Long-Press Context Menu** (`/src/hooks/useLongPress.ts` + `/src/components/mobile/ContextMenu.tsx`)

iOS/Android-style context menus triggered by long-press.

#### Usage:
```tsx
import ContextMenu from '@/components/mobile/ContextMenu';

function MyComponent() {
  const menuItems = [
    {
      icon: '✏️',
      label: 'Edit',
      onClick: () => handleEdit(),
    },
    {
      icon: '🗑️',
      label: 'Delete',
      onClick: () => handleDelete(),
      destructive: true,
    },
  ];

  return (
    <ContextMenu menuItems={menuItems}>
      <div>Press and hold this content</div>
    </ContextMenu>
  );
}
```

#### MenuItem Interface:
```tsx
interface MenuItem {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean; // Red styling
  disabled?: boolean;
}
```

#### Features:
- ✅ 500ms long-press delay
- ✅ Visual progress indicator
- ✅ Movement threshold (cancels if finger moves)
- ✅ Auto-positioned to stay on screen
- ✅ Backdrop blur
- ✅ Destructive action styling (red)
- ✅ Haptic feedback on trigger
- ✅ Click-outside to close

---

## 🎨 Integration Examples

### Example 1: Enhanced Form Submission
```tsx
import { useToast } from '@/contexts/ToastContext';
import TouchRipple from '@/components/mobile/TouchRipple';
import { triggerHaptic } from '@/lib/haptics';

function MyForm() {
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitData();
      triggerHaptic('success');
      toast.success('Form submitted successfully!');
    } catch (error) {
      triggerHaptic('error');
      toast.error('Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <TouchRipple>
        <button type="submit">Submit</button>
      </TouchRipple>
    </form>
  );
}
```

### Example 2: Community Thread Actions
```tsx
import SwipeableCard from '@/components/mobile/SwipeableCard';
import ContextMenu from '@/components/mobile/ContextMenu';
import { useToast } from '@/contexts/ToastContext';

function ThreadList() {
  const toast = useToast();

  return (
    <SwipeableCard
      leftAction={{
        icon: '🗑️',
        label: 'Delete',
        color: '#ef4444',
        onAction: () => {
          toast.success('Thread deleted');
        },
      }}
      rightAction={{
        icon: '⭐',
        label: 'Favorite',
        color: '#eab308',
        onAction: () => {
          toast.success('Added to favorites');
        },
      }}
    >
      <ContextMenu
        menuItems={[
          {
            icon: '🔗',
            label: 'Copy Link',
            onClick: () => toast.info('Link copied'),
          },
          {
            icon: '🔕',
            label: 'Mute',
            onClick: () => toast.info('Thread muted'),
          },
        ]}
      >
        <div className="p-4">
          <h3>Thread Title</h3>
          <p>Thread content...</p>
        </div>
      </ContextMenu>
    </SwipeableCard>
  );
}
```

### Example 3: Settings with Bottom Sheet
```tsx
import { useState } from 'react';
import BottomSheet from '@/components/mobile/BottomSheet';
import TouchRipple from '@/components/mobile/TouchRipple';

function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TouchRipple onClick={() => setIsOpen(true)}>
        <button>Settings</button>
      </TouchRipple>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Settings"
        snapPoints={[50, 90]}
      >
        <div className="space-y-4">
          <label>
            <input type="checkbox" /> Enable notifications
          </label>
          <label>
            <input type="checkbox" /> Dark mode
          </label>
        </div>
      </BottomSheet>
    </>
  );
}
```

---

## 🎯 Best Practices

### 1. **Haptic Feedback**
- ✅ Use `light` for navigation and selections
- ✅ Use `impact` for button presses
- ✅ Use `success` for completed actions
- ✅ Use `error` for failures
- ✅ Use `warning` for destructive actions
- ❌ Don't overuse - too much vibration is annoying
- ❌ Don't force vibration - respect `prefers-reduced-motion`

### 2. **Pull-to-Refresh**
- ✅ Use for feed/list updates
- ✅ Show what was updated in a toast
- ❌ Don't use on pages with horizontal scrolling content
- ❌ Don't use for critical actions (use explicit buttons)

### 3. **Bottom Sheets**
- ✅ Use for mobile forms and options
- ✅ Use for confirmations and selections
- ✅ Provide multiple snap points for content of varying length
- ❌ Don't use for critical alerts (use modals)
- ❌ Don't nest bottom sheets

### 4. **Touch Ripples**
- ✅ Use on all tappable elements
- ✅ Use lighter colors on dark backgrounds
- ❌ Don't use excessive durations (keep 400-600ms)

### 5. **Toasts**
- ✅ Use for confirmations and feedback
- ✅ Keep messages concise (1-2 sentences)
- ✅ Use appropriate types (success/error/warning/info)
- ❌ Don't use for critical information (use modals)
- ❌ Don't stack too many (max 3-4)

### 6. **Swipeable Cards**
- ✅ Use for list items with common actions
- ✅ Use color coding (red=delete, green=archive)
- ✅ Show swipe hint for first-time users
- ❌ Don't use for navigation (use links)
- ❌ Don't make both directions destructive

### 7. **Context Menus**
- ✅ Use for secondary actions
- ✅ Mark destructive actions appropriately
- ✅ Group related actions
- ❌ Don't hide primary actions (use visible buttons)
- ❌ Don't make menus too long (max 5-6 items)

---

## 🔧 Browser Support

| Feature | iOS Safari | Android Chrome | Desktop |
|---------|-----------|----------------|---------|
| Haptics | ✅ | ✅ | ⚠️ Limited |
| Pull-to-Refresh | ✅ | ✅ | ✅ |
| Bottom Sheet | ✅ | ✅ | ✅ |
| Touch Ripple | ✅ | ✅ | ✅ |
| Toasts | ✅ | ✅ | ✅ |
| Swipe | ✅ | ✅ | ⚠️ Mouse only |
| Long-Press | ✅ | ✅ | ✅ |

---

## 🧪 Testing

### Live Demo
Visit `/mobile-demo` to test all mobile interactions in one place:
- [http://localhost:3000/en/mobile-demo](http://localhost:3000/en/mobile-demo)
- [http://localhost:3000/ko/mobile-demo](http://localhost:3000/ko/mobile-demo)

### Testing Checklist
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test with reduced motion preference enabled
- [ ] Test in dark mode
- [ ] Test toast stacking (trigger 3-4 toasts)
- [ ] Test bottom sheet drag on different screen sizes
- [ ] Test swipe threshold on different touch sensitivity
- [ ] Test long-press with finger movement
- [ ] Test pull-to-refresh at different scroll positions

---

## 📚 Additional Resources

- [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Material Design - Motion](https://m3.material.io/styles/motion/overview)
- [iOS HIG - Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures)

---

## 🚀 Future Enhancements

Potential additions for future versions:

1. **Swipe Navigation** - Full-page swipe to navigate between sections
2. **Floating Action Button (FAB)** - Mobile-optimized quick action button
3. **Skeleton Loaders** - Content placeholders during loading
4. **Infinite Scroll** - Auto-load more content on scroll
5. **Voice Feedback** - Screen reader announcements for actions
6. **Gesture Tutorials** - First-time user onboarding for gestures
7. **Shake to Undo** - Shake device to undo last action
8. **3D Touch Support** - Pressure-sensitive interactions (iOS)

---

**Created:** 2025-10-24
**Version:** 1.0.0
**Author:** Claude Code
