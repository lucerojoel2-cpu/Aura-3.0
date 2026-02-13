
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';

export const VisionView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Describe this image in detail.');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const analyze = async () => {
    if (!preview || loading) return;
    setLoading(true);
    try {
      const base64 = preview.split(',')[1];
      const result = await gemini.analyzeImage(prompt, base64, file?.type || 'image/png');
      setAnalysis(result || 'No analysis returned.');
    } catch (error) {
      console.error(error);
      setAnalysis('Error analyzing image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Vision Intelligence</h2>
        <p className="text-slate-400 mt-2">Upload images to analyze, extract text, or get creative insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div 
            className={`aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 relative overflow-hidden ${
              preview ? 'border-violet-500/50' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Upload" className="w-full h-full object-contain rounded-xl" />
                <button 
                  onClick={() => {setPreview(null); setFile(null);}}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center text-slate-500 hover:text-slate-300 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-4xl mb-4"></i>
                <span className="font-medium text-sm">Drop image here or click to upload</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300">Analysis Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 min-h-[100px]"
              placeholder="What do you want to know about this image?"
            />
            <button
              onClick={analyze}
              disabled={!preview || loading}
              className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold transition-all aura-glow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-circle-notch animate-spin"></i> Analyzing...
                </span>
              ) : 'Run Visual Analysis'}
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Analysis Output</h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {analysis ? (
              <div className="text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                {analysis}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                <i className="fa-solid fa-brain text-4xl"></i>
                <p className="text-sm italic">Waiting for analysis results...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
