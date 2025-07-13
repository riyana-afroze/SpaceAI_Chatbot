"use client"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-invert prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Style headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mb-3 mt-5 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-white mb-2 mt-4 first:mt-0">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-bold text-white mb-2 mt-3 first:mt-0">{children}</h4>
          ),
          // Style paragraphs
          p: ({ children }) => (
            <p className="text-slate-200 mb-3 leading-relaxed last:mb-0">{children}</p>
          ),
          // Style lists
          ul: ({ children }) => (
            <ul className="text-slate-200 mb-3 ml-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-slate-200 mb-3 ml-4 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-slate-200 list-disc">{children}</li>
          ),
          // Style code blocks
          code: ({ children, ...props }: any) => {
            const isInline = !props.className
            if (isInline) {
              return (
                <code className="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className="block bg-slate-800 text-slate-200 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3" {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-slate-800 text-slate-200 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          // Style blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-3">
              {children}
            </blockquote>
          ),
          // Style links
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Style tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-slate-600 rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-slate-600 px-3 py-2 bg-slate-700 text-white font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-slate-600 px-3 py-2 text-slate-200">
              {children}
            </td>
          ),
          // Style horizontal rules
          hr: () => <hr className="border-slate-600 my-4" />,
          // Style strong/bold text
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          // Style emphasis/italic text
          em: ({ children }) => (
            <em className="italic text-slate-200">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
