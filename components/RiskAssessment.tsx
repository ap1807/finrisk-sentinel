import React from 'react';
import { FinancialHealthReport, RiskLevel } from '../types';

interface Props {
  report: FinancialHealthReport;
}

const RiskAssessment: React.FC<Props> = ({ report }) => {
  const getStatusColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case RiskLevel.WARNING: return 'bg-amber-100 text-amber-800 border-amber-200';
      case RiskLevel.CRITICAL: return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Score Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Financial Health Score</h2>
          <p className="text-sm text-slate-500 mt-1">Calculated via deterministic risk engine</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
            {report.overallScore}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Est. Monthly Burn</p>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹{report.monthlyBurnRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Runway</p>
          <p className={`text-2xl font-bold mt-2 ${report.projectedRunwayMonths < 3 ? 'text-rose-600' : 'text-slate-900'}`}>
            {report.projectedRunwayMonths.toFixed(1)} <span className="text-sm font-normal text-slate-500">Months</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Expense Ratio</p>
          <p className={`text-2xl font-bold mt-2 ${report.expenseToIncomeRatio > 0.9 ? 'text-rose-600' : 'text-slate-900'}`}>
            {(report.expenseToIncomeRatio * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Intelligence/Alerts Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Intelligence & Recommendations</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {report.riskFactors.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No critical risks detected. Maintain current trajectory.
            </div>
          ) : (
            report.riskFactors.map((risk, idx) => (
              <div key={idx} className="p-4 flex gap-4">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${risk.severity === RiskLevel.CRITICAL ? 'bg-rose-500' : risk.severity === RiskLevel.WARNING ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-slate-900">{risk.title}</h4>
                    {risk.severity === RiskLevel.CRITICAL && (
                      <span className="text-[10px] font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">CRITICAL</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{risk.description}</p>
                  <div className="mt-3 flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="text-sm font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                      Action: {risk.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;