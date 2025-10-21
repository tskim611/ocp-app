/**
 * Database Helper Functions
 * Convenient functions for common database operations
 */

import { createServerClient } from './supabase-server';
import { supabase } from './supabase';
import type {
  User,
  Guide,
  GuideInsert,
  GuideUpdate,
  Thread,
  ThreadInsert,
  ThreadUpdate,
  Comment,
  CommentInsert,
  CommentUpdate,
  GuideWithAuthor,
  ThreadWithDetails,
  CommentWithAuthor,
} from './database.types';

// =============================================
// USER QUERIES
// =============================================

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// =============================================
// GUIDE QUERIES
// =============================================

/**
 * Get all published guides
 */
export async function getPublishedGuides(): Promise<GuideWithAuthor[]> {
  const { data, error } = await supabase
    .from('guides_with_details')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return data || [];
}

/**
 * Get guide by slug
 */
export async function getGuideBySlug(
  slug: string
): Promise<GuideWithAuthor | null> {
  const { data, error } = await supabase
    .from('guides_with_details')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching guide:', error);
    return null;
  }

  return data;
}

/**
 * Get guides by author (requires authentication)
 */
export async function getGuidesByAuthor(
  authorId: string
): Promise<GuideWithAuthor[]> {
  const { data, error } = await supabase
    .from('guides_with_details')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new guide (requires authentication)
 */
export async function createGuide(guide: GuideInsert): Promise<Guide | null> {
  const { data, error } = await supabase
    .from('guides')
    .insert(guide)
    .select()
    .single();

  if (error) {
    console.error('Error creating guide:', error);
    return null;
  }

  return data;
}

/**
 * Update a guide (requires authentication and ownership)
 */
export async function updateGuide(
  id: string,
  updates: GuideUpdate
): Promise<Guide | null> {
  const { data, error } = await supabase
    .from('guides')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating guide:', error);
    return null;
  }

  return data;
}

/**
 * Delete a guide (requires authentication and ownership)
 */
export async function deleteGuide(id: string): Promise<boolean> {
  const { error } = await supabase.from('guides').delete().eq('id', id);

  if (error) {
    console.error('Error deleting guide:', error);
    return false;
  }

  return true;
}

/**
 * Search guides by title or content
 */
export async function searchGuides(query: string): Promise<GuideWithAuthor[]> {
  const { data, error } = await supabase
    .from('guides_with_details')
    .select('*')
    .eq('published', true)
    .textSearch('title', query, {
      type: 'websearch',
      config: 'english',
    });

  if (error) {
    console.error('Error searching guides:', error);
    return [];
  }

  return data || [];
}

// =============================================
// THREAD QUERIES
// =============================================

/**
 * Get all threads with details
 */
export async function getThreads(): Promise<ThreadWithDetails[]> {
  const { data, error } = await supabase
    .from('threads_with_details')
    .select('*')
    .order('last_activity_at', { ascending: false });

  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }

  return data || [];
}

/**
 * Get thread by ID
 */
export async function getThreadById(id: string): Promise<Thread | null> {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching thread:', error);
    return null;
  }

  return data;
}

/**
 * Get thread with all comments
 */
export async function getThreadWithComments(id: string): Promise<{
  thread: Thread | null;
  comments: CommentWithAuthor[];
}> {
  const thread = await getThreadById(id);

  if (!thread) {
    return { thread: null, comments: [] };
  }

  const { data: comments, error } = await supabase
    .from('comments_with_authors')
    .select('*')
    .eq('thread_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return { thread, comments: [] };
  }

  return { thread, comments: comments || [] };
}

/**
 * Get threads by author
 */
export async function getThreadsByAuthor(
  authorId: string
): Promise<ThreadWithDetails[]> {
  const { data, error } = await supabase
    .from('threads_with_details')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new thread (requires authentication)
 */
export async function createThread(
  thread: ThreadInsert
): Promise<Thread | null> {
  const { data, error } = await supabase
    .from('threads')
    .insert(thread)
    .select()
    .single();

  if (error) {
    console.error('Error creating thread:', error);
    return null;
  }

  return data;
}

/**
 * Update a thread (requires authentication and ownership)
 */
export async function updateThread(
  id: string,
  updates: ThreadUpdate
): Promise<Thread | null> {
  const { data, error } = await supabase
    .from('threads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating thread:', error);
    return null;
  }

  return data;
}

/**
 * Delete a thread (requires authentication and ownership)
 */
export async function deleteThread(id: string): Promise<boolean> {
  const { error } = await supabase.from('threads').delete().eq('id', id);

  if (error) {
    console.error('Error deleting thread:', error);
    return false;
  }

  return true;
}

// =============================================
// COMMENT QUERIES
// =============================================

/**
 * Get comments for a thread
 */
export async function getCommentsByThread(
  threadId: string
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments_with_authors')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

/**
 * Get comments by author
 */
export async function getCommentsByAuthor(
  authorId: string
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments_with_authors')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

/**
 * Create a new comment (requires authentication)
 */
export async function createComment(
  comment: CommentInsert
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data;
}

/**
 * Update a comment (requires authentication and ownership)
 */
export async function updateComment(
  id: string,
  updates: CommentUpdate
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error);
    return null;
  }

  return data;
}

/**
 * Delete a comment (requires authentication and ownership)
 */
export async function deleteComment(id: string): Promise<boolean> {
  const { error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }

  return true;
}

// =============================================
// SERVER-SIDE VARIANTS (for Server Components)
// =============================================

/**
 * Get published guides (server-side)
 */
export async function getPublishedGuidesServer(): Promise<GuideWithAuthor[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('guides_with_details')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return data || [];
}

/**
 * Get threads (server-side)
 */
export async function getThreadsServer(): Promise<ThreadWithDetails[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('threads_with_details')
    .select('*')
    .order('last_activity_at', { ascending: false });

  if (error) {
    console.error('Error fetching threads:', error);
    return [];
  }

  return data || [];
}
