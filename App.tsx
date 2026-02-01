import React, { useState } from 'react';
import { SourceTicker } from './components/SourceTicker';
import { AnalysisView } from './components/AnalysisView';
import { generateWeeklyOutlook, analyzeNewsImpact } from './services/geminiService';
import { AnalysisResult, ReportType, SUPPORTED_SOURCES } from './types';
import { PresentationChartLineIcon, NewspaperIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportType>(ReportType.WEEKLY_OUTLOOK);
  const [newsQuery, setNewsQuery] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutlook = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await generateWeeklyOutlook();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate outlook. Check API Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeNewsImpact(newsQuery);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze news. Check API Key.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: ReportType) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
    setNewsQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">MarketInsight <span className="text-emerald-500">ID</span></h1>
              <p className="text-[10px] text-slate-400 leading-none">Powered by Gemini v3</p>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 hidden sm:block">
             Real-time Analysis Engine
          </div>
        </div>
        <SourceTicker />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Disclaimer (Answering the user's "How" question indirectly) */}
        <div className="mb-8 p-4 bg-slate-900/50 rounded-lg border border-slate-800 text-sm text-slate-400">
          <strong className="text-slate-300">System Note:</strong> This tool utilizes 
          <span className="text-emerald-400 mx-1">Google Gemini Search Grounding</span> 
          to access real-time data from specific financial portals (CNBC, Kontan, Bloomberg, etc.) without direct scraping, ensuring compliance and speed.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Controls */}
          <div className="lg:col-span-1 space-y-6">
            <nav className="space-y-2">
              <button
                onClick={() => switchTab(ReportType.WEEKLY_OUTLOOK)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === ReportType.WEEKLY_OUTLOOK
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <PresentationChartLineIcon className="w-5 h-5 mr-3" />
                Weekly Market Outlook
              </button>
              
              <button
                onClick={() => switchTab(ReportType.NEWS_ANALYSIS)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === ReportType.NEWS_ANALYSIS
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <NewspaperIcon className="w-5 h-5 mr-3" />
                News Impact Analysis
              </button>
            </nav>

            {/* Controls Area */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              {activeTab === ReportType.WEEKLY_OUTLOOK ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300">Generate Report</h3>
                  <p className="text-xs text-slate-500">
                    Compiles data from the last 7 days regarding Macro, Commodities, and Policy.
                  </p>
                  <button
                    onClick={handleGenerateOutlook}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? 'Processing...' : 'Run Analysis'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300">Analyze Topic</h3>
                  <p className="text-xs text-slate-500">
                    Enter a headline or topic to check its impact on IHSG/IDR.
                  </p>
                  <form onSubmit={handleAnalyzeNews}>
                    <div className="relative mb-4">
                      <input
                        type="text"
                        value={newsQuery}
                        onChange={(e) => setNewsQuery(e.target.value)}
                        placeholder="e.g. Fed rate cuts impact..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <MagnifyingGlassIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !newsQuery}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Impact'}
                    </button>
                  </form>
                </div>
              )}
            </div>
            
            {/* Status Panel */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Status</h3>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Model</span>
                    <span className="text-emerald-400">Gemini 3 Pro</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-slate-400">Tool</span>
                    <span className="text-emerald-400">Google Search</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-slate-400">Sources</span>
                    <span className="text-emerald-400">{SUPPORTED_SOURCES.length} Active</span>
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg mb-6 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <AnalysisView 
              result={result} 
              isLoading={loading}
              title={activeTab === ReportType.WEEKLY_OUTLOOK ? "Weekly Market Outlook" : "News Impact Analysis"}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;