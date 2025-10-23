import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { createServerClient } from '@/lib/supabase-server';
import type { Thread, CommentWithAuthor } from '@/lib/database.types';
import { getTranslations } from 'next-intl/server';
import ThreadReplies from '@/components/ThreadReplies';
import CommentForm from '@/components/CommentForm';

interface ThreadPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

async function getThread(id: string): Promise<Thread | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getThreadAuthor(authorId: string) {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('users')
    .select('email')
    .eq('id', authorId)
    .single();

  return data?.email || 'Unknown';
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

export async function generateMetadata({ params }: ThreadPageProps) {
  const { id } = await params;
  const thread = await getThread(id);

  if (!thread) {
    return {
      title: 'Thread Not Found | OCP App',
    };
  }

  return {
    title: `${thread.title} | Community | OCP App`,
    description: `Join the discussion about: ${thread.title}`,
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id, locale } = await params;
  const thread = await getThread(id);
  const t = await getTranslations('community');

  if (!thread) {
    notFound();
  }

  const authorEmail = await getThreadAuthor(thread.author_id);
  const comments = await getComments(thread.id);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">{t('backToCommunity')}</span>
            </Link>
          </div>

          {/* Thread Header */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
            {/* Title Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 break-words">
                {thread.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-4 h-4"
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
                  <span>{authorEmail}</span>
                </div>
                <time
                  dateTime={thread.created_at}
                  className="text-sm flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(thread.created_at).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                  {comments.length} {t('comments')}
                  {comments.length !== 1 ? 's' : ''}
                </h2>
                <ThreadReplies comments={comments} locale={locale} />
              </div>

              {/* Comment Form */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">{t('addComment')}</h3>
                <CommentForm threadId={thread.id} />
              </div>
            </div>
          </article>

          {/* Related Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>{t('viewAllThreads')}</span>
            </Link>

            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>{t('readGuides')}</span>
            </Link>
          </div>

          {/* Help Box */}
          <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              {t('guidelines.title')}
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <li>{t('guidelines.rule1')}</li>
              <li>{t('guidelines.rule2')}</li>
              <li>{t('guidelines.rule3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
