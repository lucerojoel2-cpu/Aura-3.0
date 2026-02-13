
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../services/geminiService';
import { Modality } from '@google/genai';

export const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const encodePCM = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const stopLiveSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  };

  const startLiveSession = async () => {
    setIsConnecting(true);
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const sessionPromise = gemini.getLiveConnection({
        onopen: () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64 = encodePCM(inputData);
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
          setIsActive(true);
          setIsConnecting(false);
        },
        onmessage: async (msg: any) => {
          if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const data = decodeBase64(msg.serverContent.modelTurn.parts[0].inlineData.data);
            const buffer = await decodeAudioData(data, outputCtx);
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }

          if (msg.serverContent?.outputTranscription) {
             setTranscription(prev => [...prev.slice(-10), `Model: ${msg.serverContent.outputTranscription.text}`]);
          }
          if (msg.serverContent?.inputTranscription) {
             setTranscription(prev => [...prev.slice(-10), `You: ${msg.serverContent.inputTranscription.text}`]);
          }
        },
        onerror: (e: any) => {
          console.error('Live API Error:', e);
          stopLiveSession();
        },
        onclose: () => {
          stopLiveSession();
        }
      }, {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Failed to start Live session:', err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopLiveSession();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
        {/* Animated aura rings */}
        <div className={`absolute inset-0 rounded-full border-2 border-violet-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
        <div className={`absolute inset-4 rounded-full border-2 border-violet-400/30 ${isActive ? 'animate-pulse' : ''}`}></div>
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex flex-col items-center justify-center aura-glow z-10 shadow-[0_0_80px_rgba(139,92,246,0.4)]">
          <i className={`fa-solid ${isActive ? 'fa-waveform-lines' : 'fa-microphone'} text-5xl text-white mb-2`}></i>
          <p className="text-white text-xs font-bold tracking-widest uppercase">
            {isConnecting ? 'Initializing...' : isActive ? 'Listening' : 'Ready'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-lg mb-8 glass rounded-2xl p-4 min-h-[160px] max-h-[160px] overflow-y-auto">
        <p className="text-[10px] uppercase text-slate-500 font-bold mb-3 border-b border-slate-800 pb-2">Live Transcript</p>
        <div className="space-y-2">
          {transcription.length === 0 ? (
            <p className="text-slate-600 text-sm italic">Speech-to-text will appear here...</p>
          ) : (
            transcription.map((line, i) => (
              <p key={i} className={`text-sm ${line.startsWith('You:') ? 'text-slate-400' : 'text-violet-400 font-medium'}`}>
                {line}
              </p>
            ))
          )}
        </div>
      </div>

      <button
        onClick={isActive ? stopLiveSession : startLiveSession}
        disabled={isConnecting}
        className={`px-8 py-4 rounded-full font-bold transition-all duration-300 transform active:scale-95 flex items-center gap-3 ${
          isActive 
            ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
            : 'bg-violet-600 text-white aura-glow hover:bg-violet-500'
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-white'}`}></div>
        {isConnecting ? 'Starting...' : isActive ? 'End Interaction' : 'Start Aura Live'}
      </button>

      <p className="mt-8 text-slate-500 text-xs text-center max-w-xs leading-relaxed">
        Engage in a natural, real-time voice conversation with Gemini 2.5 Flash. Low latency, human-like response.
      </p>
    </div>
  );
};
