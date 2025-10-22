'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Link } from '@/i18n/routing';
import type { CommentWithAuthor } from '@/lib/database.types';

interface ThreadCommentsProps {
  threadId: string;
  initialComments: CommentWithAuthor[];
}

export default function ThreadComments({
  threadId,
  initialComments,
}: ThreadCommentsProps) {
  const t = useTranslations('community');
  const { user, loading } = useUser();
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (newComment.length > 5000) {
      setError('Comment must be 5000 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setError('You must be logged in to post a comment');
        setIsSubmitting(false);
        return;
      }

      // Insert new comment
      const { data: insertedComment, error: insertError } = await supabase
        .from('comments')
        .insert({
          thread_id: threadId,
          author_id: currentUser.id,
          body: newComment.trim(),
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Fetch the comment with author info
      const { data: commentWithAuthor, error: fetchError } = await supabase
        .from('comments_with_authors')
        .select('*')
        .eq('id', insertedComment.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Add to comments list
      setComments([...comments, commentWithAuthor]);
      setNewComment('');

      // Refresh to update comment count
      router.refresh();
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Comments List */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white px-2 sm:px-0">
          {t('replies')} ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 sm:mx-0">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💭</div>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              No comments yet. Be the first to reply!
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mx-2 sm:mx-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {comment.author_email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <time dateTime={comment.created_at}>
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {loading ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 animate-pulse mx-2 sm:mx-0">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : !user ? (
        <div className="text-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mx-2 sm:mx-0">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
            {t('signInToReply')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-4 sm:p-6 mx-2 sm:mx-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('postReply')}
          </h2>

          {/* User Info */}
          <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate">Posting as: {user.email}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="comment-body"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Comment
              </label>
              <textarea
                id="comment-body"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts, ask questions, or provide helpful information..."
                rows={5}
                maxLength={5000}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-shadow text-sm sm:text-base resize-y"
                disabled={isSubmitting}
              />
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Be helpful and respectful
                </span>
                <span
                  className={`font-medium ${
                    newComment.length > 5000
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {newComment.length}/5000
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim() || newComment.length > 5000}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 h-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
