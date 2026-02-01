import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, SUPPORTED_SOURCES } from "../types";

// Helper to format source list for the prompt
const getSourceListString = () => {
  return SUPPORTED_SOURCES.map(s => s.url).join(', ');
};

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Standard Model for heavy reasoning + search
const MODEL_NAME = 'gemini-3-pro-preview';

export const generateWeeklyOutlook = async (): Promise<AnalysisResult> => {
  const sources = getSourceListString();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
    You are a Senior Financial Analyst for the Indonesian Market.
    Current Date: ${today}.

    TASK:
    Create a comprehensive "Weekly Market Outlook" report. 
    
    CONSTRAINTS:
    - You MUST use the Google Search tool to find the *latest* news (last 7 days) specifically from these domains: ${sources}.
    - Do not invent news. Base everything on search results.
    - If search results are insufficient for a specific section, state that clearly based on available data.

    REPORT STRUCTURE (Markdown):
    1. **Executive Summary**: 3 bullet points summarizing the week's sentiment.
    2. **Macroeconomic Overview**: 
       - Key global/local economic data released recently.
       - Central bank policies (BI, Fed).
    3. **Commodity Watch**: 
       - Oil, Coal, CPO, Gold, Nickel updates.
    4. **Stock Market Strategy (IHSG)**:
       - Top-down analysis impact on sectors.
       - Potential winners/losers based on macro news.
    5. **Key Takeaways**: Actionable insight for investors.

    Tone: Professional, Insightful, Concise, Financial Terminology (English or Indonesian is fine, prefer Indonesian for local context but English is acceptable if better).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.3, // Low temperature for factual accuracy
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding metadata safely
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = rawChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return {
      markdown: text,
      sources: sourceLinks,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error("Error generating outlook:", error);
    throw error;
  }
};

export const analyzeNewsImpact = async (newsTopic: string): Promise<AnalysisResult> => {
  const sources = getSourceListString();
  
  const prompt = `
    You are a Financial Risk Analyst.
    
    TASK:
    Analyze the market impact of the following news topic/headline: "${newsTopic}"
    
    CONSTRAINTS:
    - Search for context and details ONLY from these high-trust sources: ${sources}.
    - Focus on the impact on the Indonesian Stock Market (IHSG) and Rupiah (IDR).

    OUTPUT FORMAT (Markdown):
    1. **News Context**: What actually happened? (Cite sources).
    2. **Direct Impact**:
       - **Positive**: Sectors/Stocks likely to benefit.
       - **Negative**: Sectors/Stocks likely to suffer.
    3. **Macro Linkage**: How does this affect inflation, rates, or GDP?
    4. **Verdict**: Bullish, Bearish, or Neutral?

    IMPORTANT:
    At the very end of your response, strictly output one of the following tags on a new line to summarize the overall sentiment:
    "SENTIMENT_TAG: Positive"
    "SENTIMENT_TAG: Negative"
    "SENTIMENT_TAG: Neutral"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.4,
      },
    });

    let text = response.text || "No analysis generated.";
    let sentiment: 'Positive' | 'Negative' | 'Neutral' | undefined;

    // Extract sentiment
    const sentimentMatch = text.match(/SENTIMENT_TAG:\s*(Positive|Negative|Neutral)/i);
    if (sentimentMatch) {
      const rawSentiment = sentimentMatch[1].toLowerCase();
      if (rawSentiment === 'positive') sentiment = 'Positive';
      else if (rawSentiment === 'negative') sentiment = 'Negative';
      else sentiment = 'Neutral';

      // Clean the tag from the markdown
      text = text.replace(sentimentMatch[0], '').trim();
    }

    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = rawChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return {
      markdown: text,
      sources: sourceLinks,
      timestamp: new Date().toISOString(),
      sentiment,
    };
  } catch (error) {
    console.error("Error analyzing news:", error);
    throw error;
  }
};