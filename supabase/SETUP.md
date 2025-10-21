# Quick Setup Guide

## Prerequisites

- Supabase account and project
- Project URL and anon key in `.env.local`

## Step 1: Apply the Migration

Choose one of the following methods:

### Method A: Supabase Dashboard (Easiest)

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy the entire contents of `migrations/20250101000000_initial_schema.sql`
5. Paste into the SQL editor
6. Click **"Run"**
7. Wait for success message

### Method B: Supabase CLI

```bash
# Install CLI (if not already installed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Apply migration
supabase db push
```

## Step 2: Verify the Setup

Run these queries in the SQL Editor to verify:

```sql
-- Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'guides', 'threads', 'comments');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'guides', 'threads', 'comments');

-- Check views were created
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE '%_with_%';
```

All queries should return results. If any return empty, re-run the migration.

## Step 3: Test with Sample Data

Create a test user and add sample data:

```sql
-- Insert a test user (replace with your actual auth user ID)
INSERT INTO public.users (id, email)
VALUES ('your-auth-user-id', 'test@example.com');

-- Insert a test guide
INSERT INTO public.guides (slug, title, content, author_id, published)
VALUES (
  'test-guide',
  'Test Guide',
  'This is a test guide',
  'your-auth-user-id',
  true
);

-- Insert a test thread
INSERT INTO public.threads (title, author_id)
VALUES ('Test Thread', 'your-auth-user-id');

-- Insert a test comment (use the thread ID from above)
INSERT INTO public.comments (thread_id, author_id, body)
VALUES (
  'thread-id-from-above',
  'your-auth-user-id',
  'Test comment'
);
```

## Step 4: Test RLS Policies

### Test Public Read Access

```sql
-- This should work (public can read published guides)
SELECT * FROM guides WHERE published = true;

-- This should work (public can read all threads)
SELECT * FROM threads;

-- This should work (public can read all comments)
SELECT * FROM comments;
```

### Test Write Access (requires authentication)

These should fail when not authenticated:

```sql
-- Should fail without auth
INSERT INTO guides (slug, title, content, author_id)
VALUES ('test', 'Test', 'Content', 'some-user-id');

-- Should fail without auth
INSERT INTO threads (title, author_id)
VALUES ('Test', 'some-user-id');

-- Should fail without auth
INSERT INTO comments (thread_id, author_id, body)
VALUES ('some-thread-id', 'some-user-id', 'Comment');
```

## Step 5: Use in Your App

### Import Types

```typescript
import type { Guide, Thread, Comment } from '@/lib/database.types';
```

### Use Helper Functions

```typescript
import { getPublishedGuides, createThread } from '@/lib/db-helpers';

// Get guides
const guides = await getPublishedGuides();

// Create thread (requires authentication)
const thread = await createThread({
  title: 'My Thread',
  author_id: userId,
});
```

## Troubleshooting

### Migration Fails

**Error: "relation already exists"**

- Tables already exist. Either drop them first or skip this migration.

**Error: "must be owner of table"**

- You don't have sufficient permissions. Use the project owner account.

### RLS Issues

**Error: "new row violates row-level security policy"**

- You're not authenticated or trying to modify someone else's data.
- Check that `auth.uid()` matches the `author_id`.

### Can't Read Data

**No results from queries**

- Check RLS policies are correct
- Verify you're querying published guides (if applicable)
- Check user authentication status

### Functions Not Working

**TypeScript errors**

- Ensure types are imported correctly
- Check database.types.ts matches your schema
- Regenerate types if schema changed

## Next Steps

1. ✅ Migration applied successfully
2. ✅ RLS policies working
3. ✅ Sample data inserted
4. 🔜 Build your UI components
5. 🔜 Implement authentication
6. 🔜 Add real content

## Useful Commands

```bash
# View database structure
supabase db dump --schema-only

# Export data
supabase db dump --data-only

# Backup everything
supabase db dump -f backup.sql

# Reset database (local only!)
supabase db reset
```

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Review RLS policies in the migration file
- Test policies in the SQL Editor
- Check Supabase logs for errors
