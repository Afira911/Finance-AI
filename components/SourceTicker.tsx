import React from 'react';
import { SUPPORTED_SOURCES } from '../types';

export const SourceTicker: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 overflow-hidden py-2">
      <div className="flex items-center space-x-2 animate-marquee whitespace-nowrap">
        <span className="text-slate-500 text-xs font-semibold px-4">DATA SOURCES:</span>
        {SUPPORTED_SOURCES.map((source, idx) => (
          <span key={idx} className="inline-flex items-center text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
            {source.name}
          </span>
        ))}
      </div>
    </div>
  );
};