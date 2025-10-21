# Authentication System Documentation

Complete guide to the authentication system implemented in OCP App.

## Overview

The authentication system uses Supabase Auth with React Context for state management across the application.

## Components

### 1. `useUser` Hook

Located: `src/hooks/useUser.ts`

A custom React hook that manages authentication state.

#### Features:
- Fetches current user on mount
- Listens for auth state changes in real-time
- Returns user object and loading state
- Automatically cleans up subscriptions

#### Usage:

```typescript
import { useUser } from '@/hooks/useUser';

function MyComponent() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Welcome, {user.email}!</div>;
  }

  return <div>Please sign in</div>;
}
```

#### Return Value:

```typescript
{
  user: User | null,     // Supabase User object or null if not authenticated
  loading: boolean       // true while fetching initial auth state
}
```

#### User Object Properties:

```typescript
user.id          // User's unique ID
user.email       // User's email address
user.created_at  // Account creation timestamp
// ... and more Supabase user properties
```

---

### 2. `UserProvider` Context

Located: `src/contexts/UserContext.tsx`

A React Context Provider that wraps the app and provides authentication state to all components.

#### Setup:

Already configured in `src/app/layout.tsx`:

```typescript
import { UserProvider } from '@/contexts/UserContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
```

#### Usage in Components:

```typescript
import { useUserContext } from '@/contexts/UserContext';

function MyComponent() {
  const { user, loading } = useUserContext();

  return (
    <div>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

---

### 3. `LogoutButton` Component

Located: `src/components/LogoutButton.tsx`

A pre-built button component for signing out users.

#### Features:
- Calls `supabase.auth.signOut()`
- Shows loading state during logout
- Redirects to home page after logout
- Error handling with alerts
- Styled with Tailwind CSS

#### Usage:

```typescript
import LogoutButton from '@/components/LogoutButton';

function Header() {
  const { user } = useUserContext();

  return (
    <header>
      {user && <LogoutButton />}
    </header>
  );
}
```

---

## Authentication Pages

### Login Page: `/login`

Features:
- Email + password inputs
- Form validation
- Error messages
- Loading states
- Redirects to home on success

### Signup Page: `/signup`

Features:
- Email + password + confirm password
- Client-side validation
- Password matching check
- Terms acceptance checkbox
- Email confirmation handling
- Success/error messages

---

## Common Use Cases

### 1. Show Content Only to Logged-in Users

```typescript
'use client';

import { useUserContext } from '@/contexts/UserContext';

export default function ProtectedContent() {
  const { user, loading } = useUserContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        <p>Please sign in to view this content</p>
        <a href="/login">Sign In</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {user.email}!</p>
    </div>
  );
}
```

### 2. Conditional Rendering Based on Auth State

```typescript
'use client';

import { useUserContext } from '@/contexts/UserContext';
import Link from 'next/link';

export default function Navigation() {
  const { user } = useUserContext();

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/guides">Guides</Link>

      {user ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

### 3. Get User in Server Components

For server components, use the server-side Supabase client:

```typescript
import { createServerClient } from '@/lib/supabase-server';

export default async function ServerComponent() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {user.email}!</div>;
}
```

### 4. Protect a Page with Redirect

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';

export default function ProtectedPage() {
  const { user, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Only logged-in users can see this!</p>
    </div>
  );
}
```

### 5. Form That Requires Authentication

```typescript
'use client';

import { useState } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';

export default function CommentForm({ postId }: { postId: string }) {
  const { user } = useUserContext();
  const [comment, setComment] = useState('');

  if (!user) {
    return (
      <div>
        <p>Please sign in to comment</p>
        <a href="/login">Sign In</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: comment,
      });

    if (!error) {
      setComment('');
      alert('Comment posted!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
```

---

## Authentication Flow

### Sign Up Flow:

1. User visits `/signup`
2. Fills out email, password, confirm password
3. Clicks "Create account"
4. `supabase.auth.signUp()` is called
5. If successful:
   - Session is created (if no email confirmation required)
   - `useUser` hook detects the new session
   - User state updates throughout app
   - Redirect to home page
6. If email confirmation required:
   - Success message shown
   - User receives email
   - Must click link to confirm
   - Then can sign in

### Sign In Flow:

1. User visits `/login`
2. Enters email and password
3. Clicks "Sign in"
4. `supabase.auth.signInWithPassword()` is called
5. If successful:
   - Session is created
   - `useUser` hook detects the session
   - User state updates throughout app
   - Redirect to home page
6. If failed:
   - Error message displayed
   - User can try again

### Sign Out Flow:

1. User clicks "Sign out" button
2. `supabase.auth.signOut()` is called
3. Session is cleared
4. `useUser` hook detects the change
5. User state set to `null` throughout app
6. UI updates to show logged-out state
7. Redirect to home page

---

## Real-time Updates

The authentication system uses Supabase's `onAuthStateChange` listener to detect changes in real-time:

- Sign in on one tab → other tabs update automatically
- Sign out on one tab → other tabs update automatically
- Session expires → user logged out automatically
- Works across all components without manual updates

---

## Error Handling

### Client-side Errors:

```typescript
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Handle Supabase error
    console.error('Auth error:', error.message);
    setError(error.message);
  }
} catch (err) {
  // Handle network or other errors
  console.error('Unexpected error:', err);
  setError('An unexpected error occurred');
}
```

### Common Error Messages:

- "Invalid login credentials" - Wrong email/password
- "Email not confirmed" - User hasn't verified email
- "User already registered" - Email already in use
- "Password should be at least 6 characters" - Password too short

---

## TypeScript Types

### User Type:

```typescript
import { User } from '@supabase/supabase-js';

// User object includes:
interface User {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
  // ... many more properties
}
```

### Context Type:

```typescript
interface UserContextType {
  user: User | null;
  loading: boolean;
}
```

---

## Testing Authentication

### Manual Testing:

1. **Sign Up:**
   - Go to `/signup`
   - Create account
   - Check if redirected
   - Check if header shows user email

2. **Sign In:**
   - Go to `/login`
   - Sign in with credentials
   - Check if redirected
   - Check if header shows user email

3. **Sign Out:**
   - Click "Sign out" in header
   - Check if redirected to home
   - Check if header shows "Sign in/Sign up"

4. **Persistence:**
   - Sign in
   - Refresh page
   - Check if still signed in

5. **Protected Content:**
   - Visit community page
   - Check if "Start New Thread" appears (logged in)
   - Sign out
   - Check if form disappears

---

## Troubleshooting

### User always null:

1. Check if UserProvider wraps your component
2. Verify Supabase client is configured correctly
3. Check browser console for errors
4. Verify .env.local has correct Supabase credentials

### Context error "must be used within a UserProvider":

- Ensure your component is wrapped by UserProvider
- Check that layout.tsx includes UserProvider wrapper

### Sign in/up not working:

1. Check Supabase project settings
2. Verify email confirmation settings
3. Check browser network tab for API errors
4. Verify environment variables are loaded

### Session not persisting:

1. Check browser localStorage (Supabase stores session there)
2. Clear localStorage and try again
3. Check if cookies are enabled
4. Verify HTTPS in production

---

## Best Practices

1. **Always check loading state:**
   ```typescript
   const { user, loading } = useUserContext();
   if (loading) return <Loading />;
   ```

2. **Use UserContext for client components:**
   ```typescript
   'use client';
   import { useUserContext } from '@/contexts/UserContext';
   ```

3. **Use server client for server components:**
   ```typescript
   import { createServerClient } from '@/lib/supabase-server';
   ```

4. **Handle errors gracefully:**
   - Show user-friendly messages
   - Don't expose sensitive error details
   - Provide next steps

5. **Protect sensitive routes:**
   - Check auth before rendering
   - Redirect to login if needed
   - Show loading states

6. **Keep auth logic in components:**
   - Don't put auth checks in pages
   - Use dedicated components
   - Keep pages clean

---

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [React Context Docs](https://react.dev/reference/react/useContext)

---

## File Structure

```
src/
├── hooks/
│   └── useUser.ts              # Auth state hook
├── contexts/
│   └── UserContext.tsx         # Auth context provider
├── components/
│   ├── LogoutButton.tsx        # Logout button component
│   └── Header.tsx              # Updated with auth UI
├── app/
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── signup/
│   │   └── page.tsx            # Signup page
│   └── layout.tsx              # Wrapped with UserProvider
└── lib/
    ├── supabase.ts             # Client-side Supabase
    └── supabase-server.ts      # Server-side Supabase
```

---

## Summary

The authentication system is fully integrated and provides:

✅ User authentication with Supabase
✅ Real-time auth state updates
✅ Global user context accessible anywhere
✅ Login and signup pages
✅ Logout functionality in header
✅ Protected content rendering
✅ Server and client component support
✅ TypeScript type safety
✅ Error handling
✅ Loading states
✅ Mobile responsive design

All components can now access user state through the `useUserContext()` hook!
