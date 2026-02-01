import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, SUPPORTED_SOURCES } from "../types";

const getSourceListString = () => {
  return SUPPORTED_SOURCES.map(s => s.url).join(', ');
};

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-pro-preview';

export const generateWeeklyOutlook = async (): Promise<AnalysisResult> => {
  const sources = getSourceListString();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // PROMPT DIOPTIMALKAN UNTUK MEMBEDAKAN TWITTER VS BERITA RESMI
  const prompt = `
    Current Date: ${today}.
    Role: Senior Market Strategist & Equity Analyst.

    TASK: 
    Generate a comprehensive Top-Down Market Outlook by cross-referencing three specific data layers to analyze the Indonesian Stock Exchange (IHSG) and its various sectors.
  
    LAYER 1: OFFICIAL REGULATORY & NEWS (High-Trust)
    - Sources: Bank Indonesia (bi.go.id), IDX (idx.co.id), BPS (bps.go.id), Bloomberg, Reuters, FT, and ${sources}.
    - Action: Analyze BI-Rate, liquidity (GWM), BPS inflation, and IDX disclosures (MSCI rebalancing, Corporate Actions).

    LAYER 2: SOCIAL SENTIMENT DIFFERENTIATION (X.com/Twitter)
    - Action: Search "site:x.com [Trending Market Topic]" to contrast Official News vs Retail Speculation.
    - Identify "Retail Noise", "Panic", or "Euphoria" that contradicts fundamental logic.

    LAYER 3: NUMERICAL VALIDATION
    - Sources: Yahoo Finance, Investing.com, Trading Economics.
    - Essential Data: 10Y Yield Spread (ID-US), Net Foreign Flow, Commodity Prices (Coal, CPO, Nickel, Gold, Oil), and Sectoral Indices.


    REPORT STRUCTURE (Strictly use this Markdown Format):
    ## 1. GLOBAL MACROECONOMIC OVERVIEW
    - Analysis of Fed/ECB/PBoC policies & impact on Emerging Market Foreign Flow.
    - Geopolitical issues affecting global equity sentiment.
    - Key Global Takeaway: [Insert brief insight]

    ## 2. DOMESTIC ECONOMIC PULSE (INDONESIA)
    - BI-Rate analysis, Rupiah stability, and BPS Inflation impact.
    - Critical Focus: Regulatory shifts (OJK/BEI) or Index rebalancing (MSCI/FTSE).
    - Domestic Sentiment: [Insert brief insight]

    ## 3. COMMODITY & VALAS DASHBOARD
    - Create a Markdown Table: | Commodity | Price | % Change | Impact on IDX |
    - Correlation: How price movements affect Energy/Basic Material sectors.

    ## 4. SECTORAL ANALYSIS & BLUE CHIP STRATEGY
    - Identify "Leading" vs "Lagging" sectors.
    - Deep dive into Blue Chips (e.g., Banking Big 4, ASII, TLKM) based on macro narrative.
    - Divergence: Contrast IDX Official Data vs X.com Social Sentiment.

    ## 5. INVESTMENT VERDICT & ACTIONABLE INSIGHTS
    - IHSG Projection (Support/Resistance).
    - Strategy: Define **Overweight** and **Underweight** sectors.
    - Tactical advice for risk management.

    FORMATTING CONSTRAINTS:
    - Use Markdown Table for all numerical data in the "Data Dashboard".
    - Use Horizontal Rules (---) to separate each of the 5 main sections.
    - Use Bold Bold for stock tickers (e.g., **BBCA**).
    - Use Blockquotes (>) for the "Investment Verdict" to make it stand out.
    - Ensure a clean visual hierarchy using H2 (##) for main sections.
    - Keep bullet points concise; no more than 2 sentences per point.

    IMPORTANT:
    - ALWAYS lead with official data from BI or IDX before mentioning secondary news sources.
    - You MUST use "Google Search" tool for real-time verification.
    - Tone: Professional, data-driven, Insightful, Concise, Financial Terminology (In English or Indonesian is fine, prefer Indonesian for local context but English is acceptable if better)."
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lebih rendah agar lebih faktual
      },
    });

    const text = response.text || "No analysis generated.";
    
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
    Role: Senior Financial Risk Analyst & Market Strategist.
    Current Date: ${today}.
    TASK: Analyze the market impact of the following high-impact news topic: "${newsTopic}"

    ---
    ANALYSIS GUIDELINES:
    1. **Fact-Checking & Contextualization**:
       - Verify using: Bank Indonesia (bi.go.id), IDX (idx.co.id), and BPS (bps.go.id).
       - Summary: "What happened" vs "What the market expected".

    2. **Market Correlation & Linkage**:
       - **IHSG Movement**: Drag or Tailwind?
       - **Currency (IDR)**: Stability and potential BI intervention.
       - **Sectoral Impact**: Map affected IDX sectors (Banking, Energy, etc.).

    3. **Foreign Flow & Institutional Projection**:
       - Predict Capital Inflow/Outflow.
       - Analyze how Fund Managers (Dapen, Insurance) might rebalance.

    4. **Sentiment Divergence Cross-Check**:
       - Search through all google grounder research and "site:x.com [Keyword from newsTopic]".
       - Compare Official Tone vs X.com Retail Sentiment (Detect Panic/Euphoria).

    OUTPUT STRUCTURE (MARKDOWN):
    ## 1. CONTEXT & FACT-CHECK
    - Summary of the event based on official data.
    - Identification of the "Core Trigger".

    ## 2. MARKET LINKAGE & SECTORAL IMPACT
    -Direct Impact on Blue Chips: Specifically mention tickers like BBCA, ASII, TLKM, or relevant leaders in the affected sector.
    -The Matrix: Identify "Winner" and "Loser" sectors in a concise list.
    
    ## 3. RISK ASSESSMENT & BLACK SWAN SCENARIOS
    - Identify downside risks or secondary effects (contagion risk).
    - Worst-case scenario analysis.

    ## 4. SENTIMENT DIVERGENCE ANALYSIS
    - Analysis: Professional vs Twitter crowd reaction.
    - Driven by Fundamentals or Pure Noise?

    ## 5. STRATEGIC VERDICT & ACTIONABLE INSIGHTS
    > **Verdict: [Bullish / Bearish / Neutral]**
    - Short-term (1-5 days) vs. Long-term (1 month+) outlook.
    - Actionable advice (e.g., Buy the dip, Take profit, Wait & see).

    FORMATTING CONSTRAINTS:
    - Use Markdown Table for all numerical data in the "Data Dashboard".
    - Use Horizontal Rules (---) to separate each of the 5 main sections.
    - Use Bold Bold for stock tickers (e.g., **BBCA**).
    - Use Blockquotes (>) for the "Investment Verdict" to make it stand out.
    - Ensure a clean visual hierarchy using H2 (##) for main sections.
    - Keep bullet points concise; no more than 2 sentences per point.

    At the end, output: "SENTIMENT_TAG: [Positive/Negative/Neutral]
    Tone: Professional, Insightful, Concise, Financial Terminology (In English or Indonesian is fine, prefer Indonesian for local context but English is acceptable if better)."
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    let text = response.text || "No analysis generated.";
    let sentiment: 'Positive' | 'Negative' | 'Neutral' | undefined;

    const sentimentMatch = text.match(/SENTIMENT_TAG:\s*(Positive|Negative|Neutral)/i);
    if (sentimentMatch) {
      sentiment = sentimentMatch[1] as any;
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