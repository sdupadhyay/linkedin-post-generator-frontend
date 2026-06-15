import { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';

interface LoaderProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  { range: [0, 15], text: 'Understanding tone and vocabulary complexity...' },
  { range: [16, 32], text: 'Detecting hook strategies and opening patterns...' },
  { range: [33, 48], text: 'Measuring average paragraph and content length...' },
  { range: [49, 65], text: 'Identifying emoji usage and visual formatting style...' },
  { range: [66, 82], text: 'Analyzing storytelling patterns and flow structures...' },
  { range: [83, 95], text: 'Correlating call-to-action styles and conversions...' },
  { range: [96, 100], text: 'Building and storing your custom AI Writing DNA...' },
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(STATUS_MESSAGES[0].text);

  useEffect(() => {
    // Total duration: ~5.5 seconds.
    // Interval runs every 55ms, incrementing progress by 1.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 55);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Determine status message based on current progress percentage
    const msg = STATUS_MESSAGES.find(
      (item) => progress >= item.range[0] && progress <= item.range[1]
    );
    if (msg) {
      setCurrentMessage(msg.text);
    }

    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600); // Small pause at 100% for impact
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 z-10 text-center select-none animate-fade-in-up">
      {/* Background Neon glows */}
      <div className="radial-glow top-1/3 left-1/4 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />

      {/* Orbital AI Spinner */}
      <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10 animate-pulse-glow" />

        {/* Orbit Ring 1 - Cyan */}
        <div className="absolute w-32 h-32 rounded-full border-t border-b border-brand-cyan/20 animate-spin-slow" />

        {/* Orbit Ring 2 - Violet (Spinning Counter-Clockwise) */}
        <div className="absolute w-26 h-26 rounded-full border-l border-r border-brand-purple/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />

        {/* Orbit Ring 3 - Indigo (Fast) */}
        <div className="absolute w-20 h-20 rounded-full border-t-2 border-brand-indigo/30 animate-spin" style={{ animationDuration: '3s' }} />

        {/* Inner Hub Glass Sphere */}
        <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md relative">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-4 h-4 text-cyan-600 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="max-w-md mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-wider animate-pulse">
          <Cpu className="w-3.5 h-3.5 text-cyan-600" />
          <span>AI Engine Active</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Analyzing your writing style...
        </h2>

        {/* Glass Progress Bar */}
        <div className="w-64 md:w-80 mx-auto h-3.5 bg-slate-200 rounded-full border border-slate-300/10 overflow-hidden p-[2px] shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-75 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center w-64 md:w-80 mx-auto text-xs font-mono text-slate-500">
          <span>COMPLETION</span>
          <span className="text-indigo-600 font-semibold text-sm">{progress}%</span>
        </div>

        {/* Message Rotator */}
        <p className="text-sm text-slate-500 h-8 italic transition-all duration-300 animate-pulse">
          {currentMessage}
        </p>
      </div>
    </div>
  );
}
