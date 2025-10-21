-- =============================================
-- QUICK SETUP SQL
-- Copy and paste this entire file into Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE TABLES
-- =============================================

-- Users table
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

-- =============================================
-- CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(published);
CREATE INDEX IF NOT EXISTS idx_threads_author ON public.threads(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_thread ON public.comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.comments(author_id);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - GUIDES
-- =============================================

-- Allow everyone to view published guides
CREATE POLICY "Anyone can view published guides" ON public.guides
  FOR SELECT USING (published = true);

-- Allow authenticated users to insert guides
CREATE POLICY "Authenticated users can insert guides" ON public.guides
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own guides
CREATE POLICY "Users can update own guides" ON public.guides
  FOR UPDATE USING (auth.uid() = author_id);

-- =============================================
-- RLS POLICIES - THREADS
-- =============================================

-- Allow everyone to view threads
CREATE POLICY "Anyone can view threads" ON public.threads
  FOR SELECT USING (true);

-- Allow authenticated users to create threads
CREATE POLICY "Authenticated users can create threads" ON public.threads
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own threads
CREATE POLICY "Users can update own threads" ON public.threads
  FOR UPDATE USING (auth.uid() = author_id);

-- =============================================
-- RLS POLICIES - COMMENTS
-- =============================================

-- Allow everyone to view comments
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
DROP TRIGGER IF EXISTS update_thread_activity_on_comment ON public.comments;
CREATE TRIGGER update_thread_activity_on_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_thread_activity();

-- =============================================
-- CREATE VIEWS
-- =============================================

-- View: guides with author info
CREATE OR REPLACE VIEW guides_with_authors AS
SELECT
  g.*,
  u.email as author_email
FROM public.guides g
LEFT JOIN public.users u ON g.author_id = u.id;

-- View: threads with details
CREATE OR REPLACE VIEW threads_with_details AS
SELECT
  t.*,
  u.email as author_email,
  COUNT(c.id) as comment_count
FROM public.threads t
LEFT JOIN public.users u ON t.author_id = u.id
LEFT JOIN public.comments c ON t.id = c.thread_id
GROUP BY t.id, u.email;

-- View: comments with author info
CREATE OR REPLACE VIEW comments_with_authors AS
SELECT
  c.*,
  u.email as author_email
FROM public.comments c
LEFT JOIN public.users u ON c.author_id = u.id;

-- =============================================
-- DONE!
-- =============================================
-- Your database is now set up.
-- Next steps:
-- 1. Run: npm run db:check
-- 2. Run: npm run seed:guides
-- 3. Run: npm run dev
-- 4. Visit: http://localhost:3000/guides
-- =============================================
