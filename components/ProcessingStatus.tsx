import React, { useEffect, useState } from 'react';
import { Download, FileText, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
}

export default function ProcessingStatus({ progress }: ProcessingStatusProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Download, label: 'Downloading Audio', threshold: 0 },
    { icon: FileText, label: 'Transcribing Speech (Whisper)', threshold: 25 },
    { icon: BrainCircuit, label: 'Analyzing with Gemini AI', threshold: 60 },
    { icon: CheckCircle2, label: 'Finalizing Document', threshold: 90 },
  ];

  useEffect(() => {
    let stepIndex = -1;
    // Iterate backwards to find the last step that meets the threshold criteria
    for (let i = steps.length - 1; i >= 0; i--) {
      if (progress >= steps[i].threshold) {
        stepIndex = i;
        break;
      }
    }
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <div className="max-w-2xl mx-auto mt-12 text-center">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
              Processing
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-indigo-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-300 ease-out"
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={index}
              className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${
                isActive || isCompleted ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`p-3 rounded-full ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600 animate-pulse'
                    : isCompleted
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-indigo-700' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
