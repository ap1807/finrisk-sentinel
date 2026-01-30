import React, { useEffect, useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line, Area
} from 'recharts';
import { financeController } from '../services/financeCore';
import { Transaction, TransactionType, Category, MonthlySummary } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#64748b'];

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<MonthlySummary[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [insights, setInsights] = useState({
    topCategory: { name: 'N/A', amount: 0 },
    maxTransaction: { description: 'N/A', amount: 0 },
    avgMonthlySpend: 0
  });

  useEffect(() => {
    const tx = financeController.getTransactionHistory();
    const trends = financeController.getCategoryTrends();
    const summary = financeController.getMonthlySummary();
    
    setTransactions(tx);
    setTrendData(trends);
    setSummaryData(summary);
    calculateStats(tx, trends);
  }, []);

  const calculateStats = (tx: Transaction[], trends: any[]) => {
    const stats: Record<string, number> = {};
    let total = 0;
    let maxTx = { description: 'None', amount: 0 };

    tx.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      stats[t.category] = (stats[t.category] || 0) + t.amount;
      total += t.amount;

      if (t.amount > maxTx.amount) {
        maxTx = { description: t.description, amount: t.amount };
      }
    });

    // Chart Data for Pie
    const chartData = Object.keys(stats).map(key => ({
      name: key,
      value: stats[key]
    })).sort((a, b) => b.value - a.value);

    // Insights
    const topCat = chartData.length > 0 ? { name: chartData[0].name, amount: chartData[0].value } : { name: 'N/A', amount: 0 };
    const avgSpend = trends.length > 0 ? total / trends.length : 0;

    setCategoryData(chartData);
    setTotalExpense(total);
    setInsights({
      topCategory: topCat,
      maxTransaction: maxTx,
      avgMonthlySpend: avgSpend
    });
  };

  const handleExportCSV = () => {
    const headers = ["Category", "Amount", "% of Total"];
    const rows = categoryData.map(item => [
      item.name,
      item.value.toFixed(2),
      totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) + '%' : '0%'
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Analytics & Reports</h1>
        <p className="text-slate-500">Deep dive into your spending patterns and intelligence insights.</p>
      </div>

      {/* Top Level Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Top Spending Category</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900">{insights.topCategory.name}</h3>
            <p className="text-indigo-600 font-medium">₹{insights.topCategory.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-slate-400 text-sm font-normal">total</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Highest Transaction</p>
          <div className="mt-2">
            <h3 className="text-lg font-bold text-slate-900 truncate" title={insights.maxTransaction.description}>{insights.maxTransaction.description}</h3>
            <p className="text-rose-600 font-medium">₹{insights.maxTransaction.amount.toLocaleString()} <span className="text-slate-400 text-sm font-normal">one-time</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
          </div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Avg. Monthly Spend</p>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-slate-900">₹{insights.avgMonthlySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            <p className="text-emerald-600 font-medium text-sm">Based on {trendData.length} months history</p>
          </div>
        </div>
      </div>

      {/* NEW: Financial Performance Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-slate-800">Financial Performance (Income vs Expense vs Savings)</h3>
          <div className="flex gap-4 text-xs font-medium">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Income</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div>Expense</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-600"></div>Savings</div>
          </div>
        </div>
        <div className="h-80 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={summaryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                
                {/* Areas for Context */}
                <Area type="monotone" dataKey="income" fill="url(#colorIncome)" stroke="#10b981" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" fill="url(#colorExpense)" stroke="#f43f5e" strokeWidth={2} />
                
                {/* Line for Net Savings */}
                <Line type="monotone" dataKey="savings" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Trend Stacked Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-6">Spending by Category Breakdown</h3>
          <div className="h-72 w-full flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                 <Tooltip 
                   cursor={{ fill: '#f1f5f9' }}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                 {Object.values(Category).map((cat, index) => (
                    // Only render bars if the category exists in data to avoid warnings or empty legends
                    <Bar 
                      key={cat} 
                      dataKey={cat} 
                      stackId="a" 
                      fill={COLORS[index % COLORS.length]} 
                      radius={[0, 0, 0, 0]} 
                      maxBarSize={50}
                    />
                 ))}
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-semibold text-slate-800 mb-6">Overall Expense Distribution</h3>
          <div className="h-72 w-full flex-1">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={categoryData}
                   cx="50%"
                   cy="50%"
                   innerRadius={70}
                   outerRadius={100}
                   paddingAngle={2}
                   dataKey="value"
                 >
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-800">Detailed Category Breakdown</h3>
          <button 
            onClick={handleExportCSV}
            className="text-sm flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Avg Transaction</th>
                <th className="px-6 py-4 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryData.map((item, idx) => {
                 // Simple calc for avg transaction size per category
                 const catCount = transactions.filter(t => t.category === item.name && t.type === TransactionType.EXPENSE).length;
                 const avg = catCount ? item.value / catCount : 0;

                 return (
                  <tr key={item.name} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shadow-sm ring-1 ring-white" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-900 font-medium">₹{item.value.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-slate-500">₹{avg.toFixed(0)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-slate-600 font-medium">{totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : 0}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${totalExpense > 0 ? (item.value / totalExpense) * 100 : 0}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
            <span className="text-sm font-medium text-slate-500 mr-2">Total Expenses Logged:</span>
            <span className="text-lg font-bold text-slate-900">₹{totalExpense.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Reports;