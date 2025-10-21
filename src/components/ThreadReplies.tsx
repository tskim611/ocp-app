'use client';

import { useUser } from '@/lib/auth-context';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ReplyForm from './ReplyForm';

interface ThreadRepliesProps {
  threadId: string;
}

export default function ThreadReplies({ threadId }: ThreadRepliesProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8 text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-gray-600 dark:text-gray-400">
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign in
          </Link>{' '}
          to reply to this thread
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ReplyForm threadId={threadId} />
    </div>
  );
}
