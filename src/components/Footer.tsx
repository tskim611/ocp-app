'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
              OCP App
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your complete resource for importing vehicles to Korea. Calculate costs, read guides, and connect with the community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools/calculator"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('calculator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('guides')}
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('community')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Information
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
              All cost estimates are approximate. Please consult with licensed customs brokers for accurate quotes and official regulations.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500">
            © {currentYear} OCP App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
