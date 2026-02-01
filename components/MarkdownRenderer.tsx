import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-100 prose-a:text-blue-400 prose-strong:text-emerald-400">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};