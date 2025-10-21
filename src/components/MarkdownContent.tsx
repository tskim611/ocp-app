'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownContentProps {
  content: string;
}

/**
 * MarkdownContent Component
 * Renders markdown content with proper styling and security
 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-4 mt-8 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-3 mt-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mb-2 mt-4 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mb-2 mt-3 text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),

          // Paragraph styling
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {children}
            </p>
          ),

          // Link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          // List styling
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // Code styling
          code: ({ inline, className, children }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code
                className={`block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono ${className || ''}`}
              >
                {children}
              </code>
            );
          },

          // Pre (code block) styling
          pre: ({ children }) => (
            <pre className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
              {children}
            </pre>
          ),

          // Blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic">
              {children}
            </blockquote>
          ),

          // Table styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-t border-gray-300 dark:border-gray-600" />
          ),

          // Image styling
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg shadow-md my-4"
            />
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
