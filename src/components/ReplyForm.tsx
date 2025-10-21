'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface ReplyFormProps {
  threadId: string;
}

export default function ReplyForm({ threadId }: ReplyFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (body.trim().length < 10) {
      setError('Reply must be at least 10 characters');
      return;
    }

    if (body.trim().length > 2000) {
      setError('Reply must be 2000 characters or less');
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    const { error: insertError } = await supabase
      .from('comments')
      .insert([
        {
          thread_id: threadId,
          author_id: user.id,
          body: body.trim(),
        },
      ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else {
      setBody(''); // Clear form
      setSuccess(true);
      router.refresh(); // Refresh to show new comment

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const characterCount = body.length;
  const isValid = body.trim().length >= 10 && body.trim().length <= 2000;

  return (
    <div className="mt-8 p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Post a Reply
      </h3>

      {/* User Info */}
      {user && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <svg
            className="w-5 h-5"
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
          <span>Posting as: {user.email}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <div className="mb-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts, experiences, or ask a question..."
            rows={6}
            maxLength={2000}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-y transition-shadow"
            disabled={loading}
          />

          {/* Character Counter */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Minimum 10 characters
            </span>
            <span
              className={`font-medium ${
                characterCount > 2000
                  ? 'text-red-600 dark:text-red-400'
                  : characterCount >= 10
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {characterCount} / 2000
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Reply posted successfully!
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-800 dark:text-red-200">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button Row */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 Be respectful and constructive
          </p>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                  className="w-5 h-5"
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
                <span>Post Reply</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
