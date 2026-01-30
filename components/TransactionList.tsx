import React from 'react';
import { Transaction, TransactionType, Category } from '../types';

interface Props {
  transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({ transactions }) => {
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case Category.HOUSING: return '🏠';
      case Category.FOOD: return '🛒';
      case Category.TRANSPORT: return '🚗';
      case Category.SALARY: return '💼';
      case Category.ENTERTAINMENT: return '🎬';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {transactions.map((t) => (
          <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                {getCategoryIcon(t.category)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{t.description}</p>
                <p className="text-xs text-slate-500">{t.date} • {t.category}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
              {t.type === TransactionType.INCOME ? '+' : '-'}₹{t.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;