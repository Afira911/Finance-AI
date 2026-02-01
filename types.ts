export interface Source {
  name: string;
  url: string;
  category: 'Local' | 'International';
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
  { name: 'CNBC Indonesia', url: 'cnbcindonesia.com', category: 'Local' },
  { name: 'Kontan', url: 'investasi.kontan.co.id', category: 'Local' },
  { name: 'Bisnis Indonesia', url: 'bisnis.com', category: 'Local' },
  { name: 'Investor Daily', url: 'investor.id', category: 'Local' },
  { name: 'InvestorTrust', url: 'investortrust.id', category: 'Local' },
  { name: 'CNBC International', url: 'cnbc.com', category: 'International' },
  { name: 'Bloomberg', url: 'bloomberg.com', category: 'International' },
  { name: 'Reuters', url: 'reuters.com', category: 'International' },
  { name: 'Financial Times', url: 'ft.com', category: 'International' },
];