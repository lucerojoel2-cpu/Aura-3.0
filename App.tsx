
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { LiveView } from './components/LiveView';
import { VisionView } from './components/VisionView';
import { SettingsView } from './components/SettingsView';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('chat');

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <ChatView />;
      case 'live':
        return <LiveView />;
      case 'vision':
        return <VisionView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ChatView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>
      </div>

      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {/* Header (View Title) */}
        <header className="h-16 flex items-center px-8 border-b border-slate-900 bg-slate-950/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-violet-500 aura-glow"></div>
             <h1 className="font-semibold text-slate-200 capitalize tracking-wide">{currentView} Mode</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
             <div className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                API_STATUS: ONLINE
             </div>
             <button className="text-slate-400 hover:text-white transition-colors">
                <i className="fa-solid fa-bell"></i>
             </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
