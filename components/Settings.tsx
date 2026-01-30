import React, { useState } from 'react';
import { financeController } from '../services/financeCore';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data to default factory settings? This cannot be undone.")) {
      financeController.resetSystem();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h1>
      <p className="text-slate-500 mb-8">Manage your preferences and system configuration.</p>

      {showSuccess && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
           System successfully reset to default state.
        </div>
      )}

      <div className="space-y-6">
        
        {/* Profile Section (Read Only) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">User Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
               <input disabled type="text" value="DemoUser_001" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
               <input disabled type="text" value="ADMINISTRATOR" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed" />
             </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive weekly risk assessment reports.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div>
                <p className="font-medium text-slate-700">Display Currency</p>
                <p className="text-sm text-slate-500">Select your preferred currency symbol.</p>
               </div>
               <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
               >
                 <option value="INR">INR (₹)</option>
                 <option value="USD">USD ($)</option>
                 <option value="EUR">EUR (€)</option>
               </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 overflow-hidden">
           <h2 className="text-lg font-semibold text-rose-600 mb-4 border-b border-rose-100 pb-2">Danger Zone</h2>
           <div className="flex items-center justify-between">
             <div>
               <p className="font-medium text-slate-800">Reset System Data</p>
               <p className="text-sm text-slate-500">Restore the simulated database to its initial seed state. All custom transactions will be lost.</p>
             </div>
             <button 
               onClick={handleReset}
               className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
             >
               Reset Data
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;