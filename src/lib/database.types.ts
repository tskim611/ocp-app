/**
 * Database Types
 * Auto-generated types for Supabase tables
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      guides: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
      };
      threads: {
        Row: {
          id: string;
          title: string;
          author_id: string;
          created_at: string;
          updated_at: string;
          last_activity_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author_id: string;
          created_at?: string;
          updated_at?: string;
          last_activity_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author_id?: string;
          created_at?: string;
          updated_at?: string;
          last_activity_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          thread_id: string;
          author_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          author_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          author_id?: string;
          body?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      guides_with_authors: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: string;
          published: boolean;
          created_at: string;
          updated_at: string;
          author_id: string;
          author_email: string;
        };
      };
      threads_with_details: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
          last_activity_at: string;
          author_id: string;
          author_email: string;
          comment_count: number;
        };
      };
      comments_with_authors: {
        Row: {
          id: string;
          thread_id: string;
          body: string;
          created_at: string;
          updated_at: string;
          author_id: string;
          author_email: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// =============================================
// Convenience Types
// =============================================

// Table types
export type User = Database['public']['Tables']['users']['Row'];
export type Guide = Database['public']['Tables']['guides']['Row'];
export type Thread = Database['public']['Tables']['threads']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];

// Insert types (for creating new records)
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type GuideInsert = Database['public']['Tables']['guides']['Insert'];
export type ThreadInsert = Database['public']['Tables']['threads']['Insert'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

// Update types (for updating records)
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type GuideUpdate = Database['public']['Tables']['guides']['Update'];
export type ThreadUpdate = Database['public']['Tables']['threads']['Update'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

// View types
export type GuideWithAuthor =
  Database['public']['Views']['guides_with_authors']['Row'];
export type ThreadWithDetails =
  Database['public']['Views']['threads_with_details']['Row'];
export type CommentWithAuthor =
  Database['public']['Views']['comments_with_authors']['Row'];

// =============================================
// Extended Types with Relations
// =============================================

export interface GuideWithRelations extends Guide {
  author?: User;
}

export interface ThreadWithRelations extends Thread {
  author?: User;
  comments?: CommentWithAuthor[];
  comment_count?: number;
}

export interface CommentWithRelations extends Comment {
  author?: User;
  thread?: Thread;
}
