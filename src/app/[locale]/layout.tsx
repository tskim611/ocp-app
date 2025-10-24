import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/mobile/ToastContainer';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OCP App',
  description: 'Next.js application with TypeScript, Tailwind, and Supabase',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

const locales = ['en', 'ko'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </div>
  );
}
