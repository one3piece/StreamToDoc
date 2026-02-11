import React, { useState, useCallback } from 'react';
import InputSection from './components/InputSection';
import ProcessingStatus from './components/ProcessingStatus';
import SummaryContent from './components/SummaryContent';
import MindMap from './components/MindMap';
import { generateSummary } from './services/geminiService';
import { AppState, SummaryResult, VideoMetadata } from './types';
import { MOCK_TRANSCRIPT, MOCK_VIDEO_META } from './constants';
import { LayoutDashboard, Network, Share2, Youtube, FileDown, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [conciseness, setConciseness] = useState(50);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'mindmap'>('summary');
  const [errorMsg, setErrorMsg] = useState('');

  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);

  const handleGenerate = useCallback(async () => {
    setAppState(AppState.PROCESSING);
    setProgress(0);
    setErrorMsg('');
    setResult(null);

    try {
      // Simulate Step 1: Download (0-25%)
      for (let i = 0; i <= 25; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 200));
      }
      
      // Update metadata (simulating fetch)
      setVideoMeta({
          url,
          ...MOCK_VIDEO_META
      });

      // Simulate Step 2: ASR / Transcribe (25-60%)
      for (let i = 25; i <= 60; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 300));
      }

      // Step 3: AI Generation (60-90%)
      setProgress(65);
      // We use MOCK_TRANSCRIPT to allow the Gemini API to actually work on meaningful text
      // even though we can't really download YouTube videos in the browser directly.
      const summaryData = await generateSummary(MOCK_TRANSCRIPT, conciseness);
      
      setProgress(100);
      setResult(summaryData);
      setAppState(AppState.COMPLETE);

    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  }, [url, conciseness]);

  const handleExport = (format: 'pdf' | 'docx') => {
      alert(`Export to ${format.toUpperCase()} feature coming soon!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Youtube className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">DocuStream<span className="text-indigo-600">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">History</a>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Input Section */}
        {appState === AppState.IDLE && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <InputSection
               url={url}
               setUrl={setUrl}
               conciseness={conciseness}
               setConciseness={setConciseness}
               onGenerate={handleGenerate}
               isProcessing={false}
             />
             
             {/* Feature Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <FileDown className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Video to Doc</h3>
                    <p className="text-slate-500 text-sm">Convert hours of footage into readable documents in seconds.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Network className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Mind Mapping</h3>
                    <p className="text-slate-500 text-sm">Visualize complex topics with auto-generated hierarchical maps.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Smart Export</h3>
                    <p className="text-slate-500 text-sm">Download as PDF, DOCX, or Markdown ready for your knowledge base.</p>
                </div>
             </div>
          </div>
        )}

        {/* Processing State */}
        {appState === AppState.PROCESSING && (
           <ProcessingStatus progress={progress} />
        )}

        {/* Error State */}
        {appState === AppState.ERROR && (
           <div className="max-w-2xl mx-auto mt-12 bg-red-50 border border-red-200 p-6 rounded-xl text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Generation Failed</h3>
              <p className="text-red-600 mb-6">{errorMsg || "Please check your API key and try again."}</p>
              <button 
                onClick={() => setAppState(AppState.IDLE)}
                className="bg-white border border-red-200 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
           </div>
        )}

        {/* Results View */}
        {appState === AppState.COMPLETE && result && videoMeta && (
          <div className="animate-in fade-in duration-500">
            {/* Header Result info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
               <div className="flex items-center gap-4">
                   <img src={videoMeta.thumbnail} alt="Thumbnail" className="w-24 h-16 object-cover rounded-lg shadow-sm border border-slate-200" />
                   <div>
                       <h1 className="text-2xl font-bold text-slate-900">{result.title}</h1>
                       <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                           <span>{videoMeta.duration}</span>
                           <span>•</span>
                           <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">Processed by Gemini</span>
                       </div>
                   </div>
               </div>
               
               <div className="flex items-center gap-3">
                   <button onClick={() => handleExport('docx')} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                       <FileDown className="w-4 h-4" /> Export DOCX
                   </button>
                   <button onClick={() => setAppState(AppState.IDLE)} className="text-slate-400 hover:text-slate-600 px-4 py-2 text-sm font-medium">
                       New Video
                   </button>
               </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-slate-200">
                <div className="flex gap-8">
                    <button 
                        onClick={() => setActiveTab('summary')}
                        className={`pb-4 px-2 text-sm font-semibold flex items-center gap-2 transition-colors relative ${activeTab === 'summary' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Summary & Timeline
                        {activeTab === 'summary' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('mindmap')}
                        className={`pb-4 px-2 text-sm font-semibold flex items-center gap-2 transition-colors relative ${activeTab === 'mindmap' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Network className="w-4 h-4" />
                        Mind Map Visualization
                        {activeTab === 'mindmap' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'summary' ? (
                    <SummaryContent data={result} />
                ) : (
                    <MindMap data={result.mindMap} />
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
