import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import type { ThreadWithDetails, CommentWithAuthor } from '@/lib/database.types';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import ThreadComments from '@/components/ThreadComments';

interface ThreadPageProps {
  params: Promise<{ id: string }>;
}

async function getThread(id: string): Promise<ThreadWithDetails | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('threads_with_details')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching thread:', error);
    return null;
  }

  return data;
}

async function getComments(threadId: string): Promise<CommentWithAuthor[]> {
  const supabase = await createServerClient();

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

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const thread = await getThread(id);
  const t = await getTranslations('community');

  if (!thread) {
    notFound();
  }

  const comments = await getComments(id);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 sm:mb-8 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-base sm:text-lg">{t('backToList')}</span>
          </Link>

          {/* Thread Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight">
              {thread.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
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
                <span className="truncate">{thread.author_email}</span>
              </div>
              <div className="flex items-center gap-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <time dateTime={thread.created_at}>
                  {new Date(thread.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>
                  {thread.comment_count} {t('comments')}
                  {thread.comment_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <ThreadComments threadId={id} initialComments={comments} />
        </div>
      </main>
    </div>
  );
}
