'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';

interface NewThreadFormProps {
  userEmail: string;
}

export default function NewThreadForm({ userEmail }: NewThreadFormProps) {
  const t = useTranslations('community');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a thread title');
      return;
    }

    if (title.length > 100) {
      setError('Title must be 100 characters or less');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to create a thread');
        setIsSubmitting(false);
        return;
      }

      // Insert new thread
      const { data: newThread, error: insertError } = await supabase
        .from('threads')
        .insert({
          title: title.trim(),
          author_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (!newThread) {
        throw new Error('Failed to create thread');
      }

      // Redirect to the new thread page
      router.push(`/community/${newThread.id}`);
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              💡 Got a Question or Topic?
            </h2>
            <p className="text-blue-100">
              Start a new discussion with the community
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{t('newThread')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Start a New Discussion
        </h2>
        <button
          onClick={() => {
            setIsExpanded(false);
            setTitle('');
            setError('');
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          disabled={isSubmitting}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* User Info */}
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
        <span>Posting as: {userEmail}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="thread-title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Thread Title
          </label>
          <input
            id="thread-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Questions about importing from Germany"
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-shadow"
            disabled={isSubmitting}
            autoFocus
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              Be clear and descriptive
            </span>
            <span
              className={`font-medium ${
                title.length > 100
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {title.length}/100
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              After creating the thread, you can add more details in your first
              comment
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setError('');
              }}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || title.length > 100}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
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
                  <span>Creating...</span>
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Create Thread</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
