import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { financeController } from './services/financeCore';
import RiskAssessment from './components/RiskAssessment';
import SpendingChart from './components/SpendingChart';
import TransactionList from './components/TransactionList';
import CodeViewer from './components/CodeViewer';
import Reports from './components/Reports';
import Settings from './components/Settings';
import AIInsights from './components/AIInsights';
import { Transaction, Category, TransactionType } from './types';

// Enhanced Modal Component matching the provided UI design
const AddTransactionModal = ({ onClose, onSave }: { onClose: () => void, onSave: (t: any) => void }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return; // Basic validation
    
    // Safer ID generation
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    onSave({
      id: newId,
      description: desc,
      amount: parseFloat(amount),
      type,
      category,
      date: date,
      isRecurring: false
    });
    onClose();
  };

  // Helper for icons within the modal
  const getCategoryIcon = (c: Category) => {
     switch (c) {
      case Category.HOUSING: return '🏠';
      case Category.FOOD: return '🛒';
      case Category.TRANSPORT: return '⛽';
      case Category.SALARY: return '💸';
      case Category.ENTERTAINMENT: return '🎬';
      case Category.UTILITIES: return '💡';
      case Category.HEALTH: return '🏥';
      case Category.INVESTMENT: return '📈';
      default: return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 animate-in fade-in duration-200">
      {/* Modal Content - Bottom sheet on mobile, centered card on desktop */}
      <div className="bg-white w-full md:max-w-md h-[90vh] md:h-auto rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
           <h2 className="text-xl font-bold text-slate-900">Add Transaction</h2>
           <button onClick={onClose} type="button" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        {/* Scrollable Body wrapped in Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Type Selector (Income/Expense Toggles) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType(TransactionType.INCOME)}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-medium transition-all duration-200 ${
                    type === TransactionType.INCOME
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-[1.02]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Down Arrow for Income */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setType(TransactionType.EXPENSE)}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border font-medium transition-all duration-200 ${
                    type === TransactionType.EXPENSE
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md transform scale-[1.02]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Up Arrow for Expense */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  Expense
                </button>
              </div>
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₹)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Enter amount"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            {/* Category Selector (Pills) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2.5">
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                      category === cat
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{getCategoryIcon(cat)}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <input 
                type="text" 
                placeholder="What was this for?"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Footer with Save Button */}
          <div className="p-6 border-t border-slate-100 bg-white md:rounded-b-2xl">
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Page Component
const Dashboard = () => {
  const [data, setData] = useState({
    transactions: [] as Transaction[],
    summary: [] as any[],
    report: null as any,
    liquidCash: 12500 // Simulated current bank balance
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState(false);

  // Load Data via "Service"
  const refreshData = (currentCash: number) => {
    const tx = financeController.getTransactionHistory();
    const sum = financeController.getMonthlySummary();
    const rep = financeController.getAnalysis(currentCash);
    return { transactions: tx, summary: sum, report: rep, liquidCash: currentCash };
  };

  useEffect(() => {
    const initialData = refreshData(data.liquidCash);
    setData(initialData);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = (t: Transaction) => {
    financeController.addTransaction(t);
    
    // Calculate new liquid cash based on the transaction
    let newLiquidCash = data.liquidCash;
    if(t.type === TransactionType.EXPENSE) {
      newLiquidCash -= t.amount;
    } else {
      newLiquidCash += t.amount;
    }

    // Refresh all data with the new cash balance
    const updatedData = refreshData(newLiquidCash);
    setData(updatedData);
  };

  if (!data.report) return <div>Loading Intelligence Engine...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Dashboard</h1>
          <p className="text-slate-500">Real-time risk analysis and spending intelligence</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCodeViewerOpen(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            Backend Source
          </button>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Liquidity</span>
            <span className="text-lg font-bold text-slate-800">₹{data.liquidCash.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Risk & Analysis */}
        <div className="lg:col-span-2 space-y-8">
          <RiskAssessment report={data.report} />
          
          <AIInsights report={data.report} summary={data.summary} />

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-6">Cash Flow Trend (6 Months)</h3>
            <SpendingChart data={data.summary} />
          </div>
        </div>

        {/* Right Column: Transactions & Quick Stats */}
        <div className="space-y-8">
          <TransactionList transactions={data.transactions.slice(0, 8)} />
          
          <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-700 rounded-full opacity-50 blur-xl"></div>
             
             <h3 className="font-semibold relative z-10">Savings Goal</h3>
             <p className="text-indigo-200 text-sm mt-1 relative z-10">Emergency Fund</p>
             
             <div className="mt-6 relative z-10">
               <div className="flex justify-between text-sm mb-2">
                 <span>₹{data.liquidCash.toLocaleString()}</span>
                 <span className="opacity-70">Target: ₹25,000</span>
               </div>
               <div className="h-2 bg-indigo-800 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-indigo-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (data.liquidCash / 25000) * 100)}%` }}
                 ></div>
               </div>
               <p className="text-xs text-indigo-300 mt-3">
                 At your current burn rate, you will reach this goal in approximately 8 months.
               </p>
             </div>
          </div>
        </div>
      </div>

      {isModalOpen && <AddTransactionModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
      {isCodeViewerOpen && <CodeViewer onClose={() => setIsCodeViewerOpen(false)} />}
    </div>
  );
};

// Navigation Wrapper
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Sidebar/Header simplified */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
          <span className="font-bold text-slate-800 text-lg">FinRisk</span>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
             <p className="text-xs text-slate-500 font-medium">SYSTEM STATUS</p>
             <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-xs font-semibold text-slate-700">Risk Engine Active</span>
             </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;