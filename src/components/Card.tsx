import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  children?: ReactNode;
  href?: string;
}

export default function Card({
  title,
  description,
  children,
  href,
}: CardProps) {
  const CardContent = () => (
    <>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <CardContent />
      </a>
    );
  }

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
      <CardContent />
    </div>
  );
}
