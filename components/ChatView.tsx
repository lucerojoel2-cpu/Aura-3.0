
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { gemini } from '../services/geminiService';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: "Hello! I'm Aura 2.0. How can I assist you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await gemini.generateText(input, { search: useSearch });
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
        // Fixed: Cast to any to resolve potential SDK vs local type conflicts and handle optionality
        groundingLinks: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as any) || [],
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "Error: Failed to connect to AI service.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              m.role === 'user' 
              ? 'bg-violet-600 text-white aura-glow' 
              : 'glass text-slate-200'
            }`}>
              <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>
              {m.groundingLinks && m.groundingLinks.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/50">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.groundingLinks.map((link, idx) => {
                      // Improved: ensure we have a valid URI before rendering
                      const url = link.web?.uri || link.maps?.uri;
                      if (!url) return null;
                      return (
                        <a 
                          key={idx} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1 border border-slate-700"
                        >
                          <i className="fa-solid fa-link text-[9px]"></i>
                          {link.web?.title || 'Source'}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl p-4 flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/50 backdrop-blur-lg border-t border-slate-800">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
          <button
            type="button"
            onClick={() => setUseSearch(!useSearch)}
            className={`flex-shrink-0 h-12 w-12 rounded-xl border transition-all flex items-center justify-center ${
              useSearch ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle Google Search Grounding"
          >
            <i className="fa-solid fa-globe"></i>
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none min-h-[48px] max-h-32 transition-all"
              rows={1}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center aura-glow shadow-lg shadow-violet-600/20"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
