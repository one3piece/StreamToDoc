import React from 'react';
import { Video, Sliders, Wand2, Link as LinkIcon } from 'lucide-react';

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  conciseness: number;
  setConciseness: (val: number) => void;
  onGenerate: () => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  url,
  setUrl,
  conciseness,
  setConciseness,
  onGenerate,
  isProcessing,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-4xl mx-auto transform transition-all hover:shadow-2xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Turn Video into Knowledge
          </h2>
          <p className="text-slate-500">
            Paste a YouTube, Bilibili, or TikTok URL to get an AI-powered summary instantly.
          </p>
        </div>

        {/* Input Area */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-lg"
          />
        </div>

        {/* Controls */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-slate-700">Conciseness Level</span>
            </div>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm border border-slate-100">
              {conciseness}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={conciseness}
            onChange={(e) => setConciseness(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 transition-all"
          />
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
            <span>Detailed (Study Mode)</span>
            <span>Balanced</span>
            <span>Brief (TL;DR)</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onGenerate}
          disabled={!url || isProcessing}
          className={`
            relative w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-indigo-500/30 
            flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
            ${
              !url || isProcessing
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'
            }
          `}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Video...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5" />
              <span>Generate Document</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
