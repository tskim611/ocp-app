-- =============================================
-- Initial Schema Migration
-- =============================================
-- Description: Creates users, guides, threads, and comments tables
-- with proper relationships and RLS policies
-- Author: OCP App
-- Date: 2025-01-01
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: users
-- =============================================
-- Extends Supabase auth.users with additional profile data
-- This table is automatically populated via trigger when user signs up
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Add index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- =============================================
-- TABLE: guides
-- =============================================
-- Stores guide content (markdown/text)
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT false
);

-- Add index for slug lookups (most common query)
CREATE UNIQUE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);

-- Add index for author queries
CREATE INDEX IF NOT EXISTS idx_guides_author_id ON public.guides(author_id);

-- Add index for published guides
CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(published, created_at DESC);

-- Add index for full-text search on title and content
CREATE INDEX IF NOT EXISTS idx_guides_search ON public.guides USING gin(to_tsvector('english', title || ' ' || content));

-- =============================================
-- TABLE: threads
-- =============================================
-- Community discussion threads
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Optional: track last activity for sorting
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for author queries
CREATE INDEX IF NOT EXISTS idx_threads_author_id ON public.threads(author_id);

-- Add index for sorting by activity
CREATE INDEX IF NOT EXISTS idx_threads_last_activity ON public.threads(last_activity_at DESC);

-- Add index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_threads_created_at ON public.threads(created_at DESC);

-- =============================================
-- TABLE: comments
-- =============================================
-- Comments on threads
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for thread queries (most common)
CREATE INDEX IF NOT EXISTS idx_comments_thread_id ON public.comments(thread_id, created_at ASC);

-- Add index for author queries
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);

-- =============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_threads_updated_at
  BEFORE UPDATE ON public.threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER: Update thread last_activity_at on new comment
-- =============================================
CREATE OR REPLACE FUNCTION public.update_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.threads
  SET last_activity_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_activity_on_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_thread_activity();

-- =============================================
-- TRIGGER: Auto-create user profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table (runs when user signs up)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------
-- USERS TABLE POLICIES
-- ---------------------------------------------

-- Public read access (anyone can view user profiles)
CREATE POLICY "Users are viewable by everyone"
  ON public.users
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ---------------------------------------------
-- GUIDES TABLE POLICIES
-- ---------------------------------------------

-- Public read access for published guides
CREATE POLICY "Published guides are viewable by everyone"
  ON public.guides
  FOR SELECT
  USING (published = true);

-- Authors can view their own unpublished guides
CREATE POLICY "Authors can view their own guides"
  ON public.guides
  FOR SELECT
  USING (auth.uid() = author_id);

-- Authenticated users can create guides
CREATE POLICY "Authenticated users can create guides"
  ON public.guides
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own guides
CREATE POLICY "Authors can update their own guides"
  ON public.guides
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own guides
CREATE POLICY "Authors can delete their own guides"
  ON public.guides
  FOR DELETE
  USING (auth.uid() = author_id);

-- ---------------------------------------------
-- THREADS TABLE POLICIES
-- ---------------------------------------------

-- Public read access (anyone can view threads)
CREATE POLICY "Threads are viewable by everyone"
  ON public.threads
  FOR SELECT
  USING (true);

-- Authenticated users can create threads
CREATE POLICY "Authenticated users can create threads"
  ON public.threads
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own threads
CREATE POLICY "Authors can update their own threads"
  ON public.threads
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own threads
CREATE POLICY "Authors can delete their own threads"
  ON public.threads
  FOR DELETE
  USING (auth.uid() = author_id);

-- ---------------------------------------------
-- COMMENTS TABLE POLICIES
-- ---------------------------------------------

-- Public read access (anyone can view comments)
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments
  FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own comments
CREATE POLICY "Authors can update their own comments"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors can delete their own comments
CREATE POLICY "Authors can delete their own comments"
  ON public.comments
  FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================
-- HELPFUL VIEWS (Optional)
-- =============================================

-- View: guides_with_authors
-- Joins guides with author information
CREATE OR REPLACE VIEW public.guides_with_authors AS
SELECT
  g.id,
  g.slug,
  g.title,
  g.content,
  g.published,
  g.created_at,
  g.updated_at,
  u.id as author_id,
  u.email as author_email
FROM public.guides g
JOIN public.users u ON g.author_id = u.id;

-- View: threads_with_authors_and_comment_count
-- Joins threads with author info and comment counts
CREATE OR REPLACE VIEW public.threads_with_details AS
SELECT
  t.id,
  t.title,
  t.created_at,
  t.updated_at,
  t.last_activity_at,
  u.id as author_id,
  u.email as author_email,
  COUNT(c.id) as comment_count
FROM public.threads t
JOIN public.users u ON t.author_id = u.id
LEFT JOIN public.comments c ON t.id = c.thread_id
GROUP BY t.id, u.id, u.email;

-- View: comments_with_authors
-- Joins comments with author information
CREATE OR REPLACE VIEW public.comments_with_authors AS
SELECT
  c.id,
  c.thread_id,
  c.body,
  c.created_at,
  c.updated_at,
  u.id as author_id,
  u.email as author_email
FROM public.comments c
JOIN public.users u ON c.author_id = u.id;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant access to views
GRANT SELECT ON public.guides_with_authors TO authenticated, anon;
GRANT SELECT ON public.threads_with_details TO authenticated, anon;
GRANT SELECT ON public.comments_with_authors TO authenticated, anon;
