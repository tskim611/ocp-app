import { createServerClient } from '@/lib/supabase-server';
import CommunityAuth from '@/components/CommunityAuth';
import type { ThreadWithDetails } from '@/lib/database.types';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

async function getThreads(): Promise<ThreadWithDetails[]> {
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


export const metadata = {
  title: 'Community Forum | OCP App',
  description:
    'Join the OCP community to discuss vehicle imports, share experiences, and get advice from experienced importers.',
};

export default async function Community() {
  const threads = await getThreads();
  const t = await getTranslations('community');

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
              <Link
                href="/tools/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>{t('tryCalculator')}</span>
              </Link>
            </div>
          </div>

          {/* New Thread Form - Show only if logged in */}
          <CommunityAuth />

          {/* Threads List */}
          {threads.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-3">
                {t('noThreads')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('beFirst')}
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <span>{t('readGuidesFirst')}</span>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2">
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
                    <span className="font-medium text-blue-900 dark:text-blue-300">
                      {threads.length} {t('discussions')}
                      {threads.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{t('sortedByActivity')}</span>
                  </div>
                </div>
              </div>

              {/* Threads */}
              <div className="space-y-4">
                {threads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/community/${thread.id}`}
                    className="block group"
                  >
                    <article className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all bg-white dark:bg-gray-800">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {thread.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
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
                              <span>{thread.author_email}</span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span>
                                {thread.comment_count} {t('comments')}
                                {thread.comment_count !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <time dateTime={thread.last_activity_at}>
                                {new Date(
                                  thread.last_activity_at
                                ).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
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
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Info Box */}
          <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              {t('guidelines.title')}
            </h3>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <li>{t('guidelines.rule1')}</li>
              <li>{t('guidelines.rule2')}</li>
              <li>{t('guidelines.rule3')}</li>
              <li>{t('guidelines.rule4')}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
