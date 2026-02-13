
import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400">Manage your Aura configuration and account.</p>
      </div>

      <div className="space-y-6">
        <section className="glass rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500">
              <i className="fa-solid fa-key text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">API Configuration</h3>
              <p className="text-sm text-slate-500">System is using pre-configured API keys.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-300">Gemini Pro connected</span>
            </div>
            <span className="text-xs text-slate-500">v3.0-preview</span>
          </div>
        </section>

        <section className="glass rounded-3xl p-6 border border-slate-800">
           <h3 className="text-lg font-bold text-white mb-6">Preferences</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">Voice Response (Live)</p>
                  <p className="text-xs text-slate-500">Select preferred AI voice profile</p>
                </div>
                <select className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-300">
                  <option>Zephyr (Balanced)</option>
                  <option>Puck (Cheerful)</option>
                  <option>Charon (Deep)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-2 border-t border-slate-800 pt-4">
                <div>
                  <p className="text-sm font-medium text-slate-200">Privacy Mode</p>
                  <p className="text-xs text-slate-500">Local history encryption</p>
                </div>
                <div className="w-10 h-5 bg-violet-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
           </div>
        </section>

        <section className="bg-red-500/5 rounded-3xl p-6 border border-red-500/20">
           <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
           <p className="text-sm text-slate-500 mb-4">Actions here are permanent and cannot be undone.</p>
           <button className="px-6 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 text-sm font-bold hover:bg-red-500/20 transition-colors">
              Delete All Chat History
           </button>
        </section>
      </div>
    </div>
  );
};
