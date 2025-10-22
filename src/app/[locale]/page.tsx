'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight whitespace-pre-line">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed whitespace-pre-line">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/guides">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  {t('hero.ctaPrimary')}
                </button>
              </Link>
              <Link href="/tools/calculator">
                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-lg border-2 border-blue-600 dark:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  {t('hero.ctaSecondary')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4 leading-tight px-4 whitespace-pre-line">
              {t('featuresSection.title')}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 text-base sm:text-lg max-w-2xl mx-auto px-4 whitespace-pre-line">
              {t('featuresSection.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Import Guides */}
              <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
                <div className="text-5xl mb-6">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('features.guides.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                  {t('features.guides.description')}
                </p>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group-hover:gap-3 transition-all"
                >
                  <span>{t('features.guides.cta')}</span>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>

              {/* Feature 2: Cost Calculator */}
              <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
                <div className="text-5xl mb-6">🧮</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('features.calculator.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                  {t('features.calculator.description')}
                </p>
                <Link
                  href="/tools/calculator"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group-hover:gap-3 transition-all"
                >
                  <span>{t('features.calculator.cta')}</span>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>

              {/* Feature 3: Community Forum */}
              <div className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
                <div className="text-5xl mb-6">💬</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {t('features.community.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                  {t('features.community.description')}
                </p>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group-hover:gap-3 transition-all"
                >
                  <span>{t('features.community.cta')}</span>
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4 leading-tight px-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-16 text-base sm:text-lg px-4">
              {t('howItWorksSection.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  1
                </div>
                {/* Arrow - hidden on mobile, visible on desktop */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full">
                  <svg
                    className="w-full h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 100 24"
                    preserveAspectRatio="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M0 12 L80 12 M70 6 L80 12 L70 18"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('howItWorks.step1.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('howItWorks.step1.description')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  2
                </div>
                {/* Arrow - hidden on mobile, visible on desktop */}
                <div className="hidden md:block absolute top-8 left-1/2 w-full">
                  <svg
                    className="w-full h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 100 24"
                    preserveAspectRatio="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M0 12 L80 12 M70 6 L80 12 L70 18"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('howItWorks.step2.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('howItWorks.step2.description')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {t('howItWorks.step3.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t('howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight px-4 whitespace-pre-line">
              {t('cta.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed px-4 whitespace-pre-line">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/guides">
                <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  {t('cta.ctaPrimary')}
                </button>
              </Link>
              <Link href="/tools/calculator">
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white text-lg font-semibold rounded-lg border-2 border-white shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                  {t('cta.ctaSecondary')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 leading-tight px-4">
              {t('whyChoose.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('whyChoose.expertGuidance.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('whyChoose.expertGuidance.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('whyChoose.accurateCalculations.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('whyChoose.accurateCalculations.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('whyChoose.activeCommunity.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('whyChoose.activeCommunity.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t('whyChoose.freeTools.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('whyChoose.freeTools.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
