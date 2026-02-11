import React from 'react';
import { SummaryResult } from '../types';
import { Clock, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Actually, lets avoid adding a heavy markdown lib dependency if possible, or assume it exists. 
// Standard React practice avoids assuming non-standard libs. I will implement a simple parser for the demo or just render text.
// Actually, I can use simple whitespace rendering for now to keep it dependency-free.

interface SummaryContentProps {
  data: SummaryResult;
}

const SummaryContent: React.FC<SummaryContentProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Overview & Timeline */}
      <div className="lg:col-span-1 space-y-6">
        {/* Overview Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Overview
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {data.overview}
          </p>
        </div>

        {/* Timeline Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Timeline
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {data.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start group">
                <div className="absolute left-0 h-5 w-5 rounded-full border-2 border-slate-50 bg-white group-hover:border-indigo-500 transition-colors"></div>
                <div className="ml-8">
                  <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {item.timestamp}
                  </span>
                  <h4 className="font-semibold text-slate-700 text-sm mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Main Content & Key Points */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Points */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
          <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            Key Takeaways
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.keyPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <span className="text-slate-700 text-sm font-medium leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Structured Summary
          </h3>
          <div className="prose prose-slate prose-headings:font-bold prose-h2:text-lg prose-h2:text-indigo-700 prose-p:text-slate-600 max-w-none">
             {/* Simple renderer for markdown-like structure if we don't use a library */}
             {data.structuredSummary.split('\n').map((line, i) => {
                 if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                 if (line.startsWith('- ')) return <li key={i} className="ml-4 text-slate-600 list-disc">{line.replace('- ', '')}</li>;
                 if (line.trim() === '') return <br key={i}/>;
                 return <p key={i} className="mb-2 text-slate-600 leading-relaxed">{line}</p>
             })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryContent;
