
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-20 md:w-64 flex flex-col h-screen border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center aura-glow">
          <i className="fa-solid fa-bolt text-white text-xl"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          AURA 2.0
        </span>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewMode)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="text-xl w-6 flex justify-center">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <i className="fa-solid fa-user text-xs"></i>
          </div>
          <div className="hidden md:block overflow-hidden">
            <p className="text-xs font-medium truncate">Aura User</p>
            <p className="text-[10px] text-slate-500 truncate">Free Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
