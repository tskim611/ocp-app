import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { createServerClient } from '@/lib/supabase-server';
import MarkdownContent from '@/components/MarkdownContent';
import type { Guide } from '@/lib/database.types';
import { getTranslations } from 'next-intl/server';

interface GuidePageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

async function getGuide(slug: string): Promise<Guide | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuide(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | OCP App',
    };
  }

  return {
    title: `${guide.title} | OCP App`,
    description: guide.content.substring(0, 160),
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug, locale } = await params;
  const guide = await getGuide(slug);
  const t = await getTranslations('guides');

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/guides"
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
              <span className="font-medium">{t('backToGuides')}</span>
            </Link>
          </div>

          {/* Guide Header */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Title Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {guide.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <time
                  dateTime={guide.created_at}
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
                  {new Date(guide.created_at).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                {guide.updated_at !== guide.created_at && (
                  <span className="text-sm flex items-center gap-2">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {t('updated')}{' '}
                    {new Date(guide.updated_at).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              <MarkdownContent content={guide.content} />
            </div>
          </article>

          {/* Footer Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Link
              href="/guides"
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
              <span>{t('viewAllGuides')}</span>
            </Link>

            <Link
              href="/tools/calculator"
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span>{t('tryCalculator')}</span>
            </Link>
          </div>

          {/* Help Box */}
          <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              {t('needHelp.title')}
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              {t('needHelp.description')}
            </p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 font-medium text-sm"
            >
              <span>{t('needHelp.askInCommunity')}</span>
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
      </div>
    </div>
  );
}
