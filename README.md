## Vision

OCP App helps Korean drivers import overseas cars with clarity and confidence.

This is a solo-built, AI-assisted platform combining:
- Step-by-step bilingual guidance  
- Transparent cost tools  
- Lightweight, useful community discussion

Built to be small, useful, and profitable — not a startup, but leverage.

# OCP App

A Next.js application built with TypeScript, Tailwind CSS, ESLint, Prettier, and Supabase.

## Project Structure

```
ocp-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── guides/            # Guides page
│   │   │   └── page.tsx
│   │   ├── tools/             # Tools page
│   │   │   └── page.tsx
│   │   ├── community/         # Community page
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── Layout.tsx         # Layout wrapper component
│   │   ├── Header.tsx         # Header navigation
│   │   ├── Footer.tsx         # Footer component
│   │   └── Card.tsx           # Card component
│   └── lib/                   # Utility libraries
│       ├── supabase.ts        # Supabase client (client-side)
│       ├── supabase-server.ts # Supabase client (server-side)
│       ├── supabase-examples.ts # Usage examples
│       └── utils.ts           # Utility functions
├── .prettierrc                # Prettier configuration
├── .prettierignore            # Prettier ignore patterns
├── eslint.config.mjs          # ESLint configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variables example
└── package.json               # Project dependencies
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then update `.env.local` with your Supabase credentials.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prettier --write .` - Format all files with Prettier

## Features

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Supabase** - Backend as a Service (configured)

## Pages

- `/` - Home page with navigation cards
- `/guides` - Guides and documentation
- `/tools` - Tools and utilities
- `/community` - Community resources

## Components

- **Layout** - Wraps pages with header and footer
- **Header** - Navigation bar with links
- **Footer** - Site footer with links
- **Card** - Reusable card component for content

## Utility Functions

The `lib/utils.ts` file includes:

- `cn()` - Merge Tailwind classes
- `formatDate()` - Format dates
- `truncateText()` - Truncate strings
- `debounce()` - Debounce function calls
- `sleep()` - Async delay utility

## Supabase Setup

This project includes a fully configured Supabase client using the latest SDK (v2.75.0).

### Configuration

1. Get your Supabase credentials from your project dashboard:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: Found in Settings > API

2. Add them to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Available Clients

#### Client-Side (`src/lib/supabase.ts`)

Use in Client Components (with `'use client'` directive):

```typescript
import { supabase } from '@/lib/supabase';

// Query data
const { data, error } = await supabase.from('table').select('*');

// Auth operations
await supabase.auth.signInWithPassword({ email, password });
```

#### Server-Side (`src/lib/supabase-server.ts`)

Use in Server Components, Server Actions, and Route Handlers:

```typescript
import { createServerClient } from '@/lib/supabase-server';

// In Server Component
const supabase = await createServerClient();
const { data } = await supabase.from('table').select('*');
```

### Usage Examples

See `src/lib/supabase-examples.ts` for comprehensive examples including:

- Client Component queries
- Server Component queries
- Server Actions
- API Routes
- Authentication (sign in, sign up, sign out)
- Real-time subscriptions

### Key Features

- **Auto-refresh tokens** - Automatically refreshes auth tokens
- **Session persistence** - Maintains user sessions across page reloads
- **Cookie-based auth** - Server-side auth using Next.js cookies
- **Type-safe** - Full TypeScript support
- **Error handling** - Built-in error validation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
