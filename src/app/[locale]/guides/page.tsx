import { createServerClient } from '@/lib/supabase-server';
import type { GuideWithAuthor } from '@/lib/database.types';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

async function getGuides(): Promise<GuideWithAuthor[]> {
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

export const metadata = {
  title: 'Import Guides | OCP App',
  description:
    'Step-by-step guides for importing vehicles to Korea. Learn about documentation, costs, and regulations.',
};

export default async function Guides() {
  const guides = await getGuides();
  const t = await getTranslations('guides');

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {t('subtitle')}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/tools/calculator"
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>{t('costCalculator')}</span>
              </Link>
            </div>
          </div>

          {/* Guides List */}
          {guides.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-semibold mb-3">
                {t('comingSoon.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('comingSoon.description')}
              </p>
              <Link
                href="/tools/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span>{t('comingSoon.tryCalculator')}</span>
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
          ) : (
            <div className="space-y-6">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="block group"
                >
                  <article className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {guide.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {guide.content.substring(0, 200)}...
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <time
                            dateTime={guide.created_at}
                            className="flex items-center gap-1"
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
                            {new Date(guide.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}
                          </time>
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
          )}

          {/* Info Box */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
              {t('quickTips.title')}
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <li>{t('quickTips.tip1')}</li>
              <li>{t('quickTips.tip2')}</li>
              <li>{t('quickTips.tip3')}</li>
              <li>{t('quickTips.tip4')}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
