import React from 'react';
import { AnalysisResult } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ArrowTopRightOnSquareIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Props {
  result: AnalysisResult | null;
  isLoading: boolean;
  title: string;
}

const SentimentBadge = ({ sentiment }: { sentiment: 'Positive' | 'Negative' | 'Neutral' }) => {
  const styles = {
    Positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Negative: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Neutral: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const icons = {
    Positive: '🚀',
    Negative: '🔻',
    Neutral: '⚖️',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[sentiment]} transition-all duration-300`}>
      <span className="mr-2 text-sm">{icons[sentiment]}</span>
      {sentiment.toUpperCase()}
    </span>
  );
};

export const AnalysisView: React.FC<Props> = ({ result, isLoading, title }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-mono text-sm">Synthesizing market data from verified sources...</p>
        <div className="text-xs text-slate-600">Checking Bloomberg, CNBC, Kontan...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/50">
        <p className="text-slate-500">Ready to generate intelligence.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-slate-700 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          {result.sentiment && (
            <div className="mt-3">
              <SentimentBadge sentiment={result.sentiment} />
            </div>
          )}
        </div>
        <div className="flex items-center text-xs text-slate-400 md:mt-2">
          <ClockIcon className="w-4 h-4 mr-1" />
          {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <MarkdownRenderer content={result.markdown} />
      </div>

      {/* Sources Footnote */}
      {result.sources.length > 0 && (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Verified Sources Used</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors truncate"
              >
                <ArrowTopRightOnSquareIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

