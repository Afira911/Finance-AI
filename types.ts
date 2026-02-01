export interface Source {
  name: string;
  url: string;
  category: 'Local' | 'International' | 'Authority' | 'Data' | 'Sentiment';
}

export enum ReportType {
  WEEKLY_OUTLOOK = 'WEEKLY_OUTLOOK',
  NEWS_ANALYSIS = 'NEWS_ANALYSIS',
}

export interface AnalysisResult {
  markdown: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
  timestamp: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
}

export const SUPPORTED_SOURCES: Source[] = [
  // --- Media Lokal ---
  { name: 'CNBC Indonesia', url: 'cnbcindonesia.com', category: 'Local' },
  { name: 'Kontan', url: 'investasi.kontan.co.id', category: 'Local' },
  { name: 'Bisnis Indonesia', url: 'bisnis.com', category: 'Local' },
  { name: 'Investor Daily', url: 'investor.id', category: 'Local' },
  { name: 'InvestorTrust', url: 'investortrust.id', category: 'Local' },

  { name: 'CNBC International', url: 'cnbc.com', category: 'International' },
  { name: 'Bloomberg', url: 'bloomberg.com', category: 'International' },
  { name: 'Reuters', url: 'reuters.com', category: 'International' },
  { name: 'Financial Times', url: 'ft.com', category: 'International' },
  { name: 'Wall Street Journal', url: 'wsj.com', category: 'International' },

  { name: 'Bank Indonesia', url: 'bi.go.id', category: 'Authority' },
  { name: 'Bursa Efek Indonesia', url: 'idx.co.id', category: 'Authority' },
  { name: 'BPS Indonesia', url: 'bps.go.id', category: 'Authority' },

  { name: 'Trading Economics', url: 'tradingeconomics.com', category: 'Data' },
  { name: 'Investing.com', url: 'investing.com', category: 'Data' },
  { name: 'Yahoo Finance', url: 'finance.yahoo.com', category: 'Data' },

  { name: 'Stockbit', url: 'stockbit.com', category: 'Sentiment' },
  { name: 'X / Twitter', url: 'x.com', category: 'Sentiment' }
];
];