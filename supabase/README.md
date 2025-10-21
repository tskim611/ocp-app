# Database Schema Documentation

This directory contains the SQL migrations and documentation for the OCP App database schema.

## Overview

The database consists of 4 main tables with full Row Level Security (RLS) policies:

1. **users** - User profiles (extends auth.users)
2. **guides** - Content guides with markdown support
3. **threads** - Community discussion threads
4. **comments** - Comments on threads

## Schema Diagram

```
┌─────────────┐
│   auth.users │ (Supabase Auth)
└──────┬──────┘
       │
       │ (1:1)
       ▼
┌─────────────┐
│    users    │
│─────────────│
│ id          │ PK, FK → auth.users
│ email       │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       │ (1:many)
       ├─────────────────────────────────┬─────────────────┐
       ▼                                 ▼                 ▼
┌─────────────┐                   ┌─────────────┐  ┌─────────────┐
│   guides    │                   │   threads   │  │  comments   │
│─────────────│                   │─────────────│  │─────────────│
│ id          │ PK                │ id          │  │ id          │ PK
│ slug        │ UNIQUE            │ title       │  │ thread_id   │ FK → threads
│ title       │                   │ author_id   │  │ author_id   │ FK → users
│ content     │ TEXT              │ created_at  │  │ body        │ TEXT
│ author_id   │ FK → users        │ updated_at  │  │ created_at  │
│ created_at  │                   │ last_act... │  │ updated_at  │
│ updated_at  │                   └─────────────┘  └─────────────┘
│ published   │ BOOLEAN                   │               │
└─────────────┘                           │               │
                                          │ (1:many)      │
                                          └───────────────┘
```

## Tables

### users

Extends Supabase's `auth.users` table with additional profile information.

**Columns:**

- `id` (UUID, PK) - References auth.users.id
- `email` (TEXT, UNIQUE) - User email address
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**

- `idx_users_email` - Email lookups
- `idx_users_created_at` - Sorting by join date

**RLS Policies:**

- ✅ SELECT: Public (anyone can view profiles)
- ✅ UPDATE: Authenticated users (own profile only)
- ❌ INSERT: Automatic via trigger on auth.users
- ❌ DELETE: Cascades from auth.users

### guides

Stores guide content (supports markdown).

**Columns:**

- `id` (UUID, PK) - Auto-generated
- `slug` (TEXT, UNIQUE) - URL-friendly identifier
- `title` (TEXT) - Guide title
- `content` (TEXT) - Guide content (markdown supported)
- `author_id` (UUID, FK) - References users.id
- `published` (BOOLEAN) - Publication status
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**

- `idx_guides_slug` - Slug lookups (most common)
- `idx_guides_author_id` - Author queries
- `idx_guides_published` - Published guides sorting
- `idx_guides_search` - Full-text search

**RLS Policies:**

- ✅ SELECT: Public (published guides) OR Author (all own guides)
- ✅ INSERT: Authenticated users
- ✅ UPDATE: Authors (own guides only)
- ✅ DELETE: Authors (own guides only)

### threads

Community discussion threads.

**Columns:**

- `id` (UUID, PK) - Auto-generated
- `title` (TEXT) - Thread title
- `author_id` (UUID, FK) - References users.id
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp
- `last_activity_at` (TIMESTAMPTZ) - Last comment timestamp

**Indexes:**

- `idx_threads_author_id` - Author queries
- `idx_threads_last_activity` - Sorting by activity
- `idx_threads_created_at` - Sorting by creation

**RLS Policies:**

- ✅ SELECT: Public (anyone can view)
- ✅ INSERT: Authenticated users
- ✅ UPDATE: Authors (own threads only)
- ✅ DELETE: Authors (own threads only)

### comments

Comments on threads.

**Columns:**

- `id` (UUID, PK) - Auto-generated
- `thread_id` (UUID, FK) - References threads.id
- `author_id` (UUID, FK) - References users.id
- `body` (TEXT) - Comment content
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**

- `idx_comments_thread_id` - Thread queries (with created_at)
- `idx_comments_author_id` - Author queries

**RLS Policies:**

- ✅ SELECT: Public (anyone can view)
- ✅ INSERT: Authenticated users
- ✅ UPDATE: Authors (own comments only)
- ✅ DELETE: Authors (own comments only)

## Views

### guides_with_authors

Convenience view that joins guides with author information.

**Columns:** All guide columns + `author_email`

### threads_with_details

Joins threads with author info and comment count.

**Columns:** All thread columns + `author_email`, `comment_count`

### comments_with_authors

Joins comments with author information.

**Columns:** All comment columns + `author_email`

## Triggers

### Auto-update Timestamps

All tables have triggers that automatically update the `updated_at` column on any UPDATE operation.

### Auto-create User Profile

When a user signs up via Supabase Auth, a trigger automatically creates a corresponding row in the `users` table.

### Update Thread Activity

When a new comment is added to a thread, the thread's `last_activity_at` timestamp is automatically updated.

## Row Level Security (RLS)

All tables have RLS enabled with the following pattern:

**Public Read, Private Write:**

- Anyone (including unauthenticated users) can **read** data
- Only **authenticated users** can **create** data
- Users can only **update/delete** their own data

### Authentication Check

RLS policies use `auth.uid()` to check the current user's ID. This function returns:

- The authenticated user's UUID when logged in
- `NULL` when not authenticated

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply migrations
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/20250101000000_initial_schema.sql`
4. Paste and run the SQL

### Option 3: Using Supabase API

```bash
# Get your connection string from Supabase dashboard
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres" \
  -f migrations/20250101000000_initial_schema.sql
```

## TypeScript Types

TypeScript types are automatically generated in `src/lib/database.types.ts`.

### Usage Example

```typescript
import type { Guide, GuideInsert, GuideUpdate } from '@/lib/database.types';

// Reading data
const guide: Guide = {
  id: '123',
  slug: 'getting-started',
  title: 'Getting Started',
  content: 'Guide content...',
  author_id: '456',
  published: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

// Inserting data
const newGuide: GuideInsert = {
  slug: 'new-guide',
  title: 'New Guide',
  content: 'Content here',
  author_id: userId,
};

// Updating data
const updates: GuideUpdate = {
  title: 'Updated Title',
  content: 'Updated content',
};
```

## Helper Functions

Convenient database query functions are available in `src/lib/db-helpers.ts`.

### Example Usage

```typescript
import {
  getPublishedGuides,
  getGuideBySlug,
  createThread,
  getThreadWithComments,
} from '@/lib/db-helpers';

// Get all published guides
const guides = await getPublishedGuides();

// Get specific guide
const guide = await getGuideBySlug('getting-started');

// Create a thread
const thread = await createThread({
  title: 'New Discussion',
  author_id: userId,
});

// Get thread with comments
const { thread, comments } = await getThreadWithComments(threadId);
```

## Security Considerations

1. **Never disable RLS** on public tables
2. **Always validate user input** before inserting into the database
3. **Use parameterized queries** to prevent SQL injection
4. **Limit query results** to prevent performance issues
5. **Monitor API usage** in Supabase dashboard

## Performance Tips

1. Use **indexed columns** in WHERE clauses (slug, author_id, etc.)
2. Use **views** for complex joins (guides_with_authors, etc.)
3. Use **pagination** for large result sets
4. Consider **caching** frequently accessed data
5. Use **select()** to fetch only needed columns

## Testing

### Test RLS Policies

```sql
-- Test as anonymous user
SET LOCAL ROLE anon;
SELECT * FROM guides WHERE published = true; -- Should work
INSERT INTO guides (...) VALUES (...); -- Should fail

-- Test as authenticated user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"user-id-here"}';
SELECT * FROM guides; -- Should see own + published
INSERT INTO guides (...) VALUES (...); -- Should work
```

## Maintenance

### Backup

```bash
# Backup entire database
supabase db dump -f backup.sql

# Backup specific table
supabase db dump --table guides -f guides_backup.sql
```

### Reset (Development Only)

```bash
# Reset local database
supabase db reset

# This will drop all tables and re-run migrations
```

## Support

For issues or questions:

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
