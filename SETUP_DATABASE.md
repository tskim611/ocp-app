# Database Setup Guide

You need to create the database tables before seeding guides. Here's how:

---

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Go to Your Supabase Project

Visit: https://supabase.com/dashboard

Select your project: **tyoeowlacwmhctmdrcgu**

### Step 2: Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click **New query**

### Step 3: Run the Migration

Copy the entire contents of `supabase/migrations/20250101000000_initial_schema.sql` and paste it into the SQL editor.

Or manually copy this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Threads table
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(published);
CREATE INDEX IF NOT EXISTS idx_threads_author ON public.threads(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_thread ON public.comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guides
CREATE POLICY "Guides are viewable by everyone" ON public.guides
  FOR SELECT USING (published = true);

CREATE POLICY "Users can insert guides" ON public.guides
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own guides" ON public.guides
  FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for threads
CREATE POLICY "Threads are viewable by everyone" ON public.threads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON public.threads
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own threads" ON public.threads
  FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update thread last_activity_at
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.threads
  SET last_activity_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for thread activity
CREATE TRIGGER update_thread_activity_on_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_thread_activity();

-- Create views for easier querying
CREATE OR REPLACE VIEW guides_with_authors AS
SELECT
  g.*,
  u.email as author_email
FROM public.guides g
LEFT JOIN public.users u ON g.author_id = u.id;

CREATE OR REPLACE VIEW threads_with_details AS
SELECT
  t.*,
  u.email as author_email,
  COUNT(c.id) as comment_count
FROM public.threads t
LEFT JOIN public.users u ON t.author_id = u.id
LEFT JOIN public.comments c ON t.id = c.thread_id
GROUP BY t.id, u.email;

CREATE OR REPLACE VIEW comments_with_authors AS
SELECT
  c.*,
  u.email as author_email
FROM public.comments c
LEFT JOIN public.users u ON c.author_id = u.id;
```

### Step 4: Click "Run" or press Ctrl+Enter

You should see: **Success. No rows returned**

### Step 5: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should now see tables:
   - users
   - guides
   - threads
   - comments

---

## Option 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref tyoeowlacwmhctmdrcgu

# Run migrations
supabase db push
```

---

## After Setup: Run the Seed Script

Once the tables are created, run:

```bash
npm run seed:guides
```

You should see:

```
🌱 Starting guide seed...

📝 Inserting: How to Import a Car from the US to Korea
   ✅ Successfully inserted "us-to-kr-import"

✨ Seed complete!
```

---

## Verify Everything Works

### 1. Check in Supabase

Go to **Table Editor** → **guides**

You should see your guide with:
- slug: `us-to-kr-import`
- title: How to Import a Car from the US to Korea
- published: `true`

### 2. View on Your Website

```bash
npm run dev
```

Visit: http://localhost:3000/guides

You should see your guide listed!

---

## Troubleshooting

### "relation 'public.guides' does not exist"
→ The SQL hasn't been run yet. Go back to Step 3.

### "permission denied for schema public"
→ Run the SQL in the SQL Editor, not as a regular user.

### "function uuid_generate_v4() does not exist"
→ Run the first line of the SQL to enable the UUID extension:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Selected your project
- [ ] Opened SQL Editor
- [ ] Copied and pasted the full migration SQL
- [ ] Clicked "Run"
- [ ] Saw "Success" message
- [ ] Verified tables exist in Table Editor
- [ ] Ran `npm run seed:guides`
- [ ] Saw success message
- [ ] Checked guides table has data

You're all set! 🎉
