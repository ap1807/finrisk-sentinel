import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FinancialHealthReport, MonthlySummary } from '../types';

interface Props {
  report: FinancialHealthReport;
  summary: MonthlySummary[];
}

const AIInsights: React.FC<Props> = ({ report, summary }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const generateInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a context-rich prompt based on local data
      const recentMonths = summary.slice(-3).map(s => 
        `${s.month}: Income ₹${s.income}, Expense ₹${s.expense}`
      ).join('\n');

      const risks = report.riskFactors.map(r => `${r.title}: ${r.description}`).join('\n');

      const prompt = `
        Act as a senior personal finance analyst for "FinRisk Sentinel".
        
        Analyze this user's financial snapshot:
        - Health Score: ${report.overallScore}/100 (${report.status})
        - Monthly Burn: ₹${report.monthlyBurnRate}
        - Runway: ${report.projectedRunwayMonths} months
        - Savings Rate: ${(report.savingsRate * 100).toFixed(1)}%
        
        Recent Activity (Last 3 Months):
        ${recentMonths}
        
        Identified Risks:
        ${risks}
        
        Provide a concise, human-friendly assessment (approx 150 words).
        1. Summarize their current stability in plain English.
        2. Analyze the recent trend (improving/worsening).
        3. Suggest 2 specific, actionable steps to improve their score.
        
        Tone: Professional, empathetic, and direct. 
        Format: Use standard text with bullet points for the suggestions.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "No insights generated.");
    } catch (err) {
      console.error("AI Generation Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 shadow-sm p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Gemini Intelligence</h3>
            <p className="text-xs text-slate-500">AI-Powered Financial Analyst</p>
          </div>
        </div>
        {!insight && !loading && (
          <button 
            onClick={generateInsights}
            className="text-sm bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <span>Analyze Finances</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse py-2">
          <div className="h-4 bg-indigo-200/50 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-5/6"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-2/3"></div>
        </div>
      )}

      {error && (
        <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-start gap-2">
           <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <span>Unable to connect to Gemini Intelligence. Please ensure your API Key is valid and try again.</span>
        </div>
      )}

      {insight && !loading && (
        <div className="relative z-10">
           <div className="prose prose-indigo prose-sm max-w-none text-slate-700">
             <div className="whitespace-pre-wrap leading-relaxed">{insight}</div>
           </div>
           <div className="mt-4 pt-4 border-t border-indigo-100 flex justify-end">
             <button onClick={generateInsights} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
               Refresh Analysis
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;