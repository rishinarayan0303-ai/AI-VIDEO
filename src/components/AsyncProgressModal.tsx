import React, { useEffect, useState } from 'react';
import { Sparkles, Film, CheckCircle2, Loader2, Video, Layers, Wand2 } from 'lucide-react';

interface AsyncProgressModalProps {
  isOpen: boolean;
  message: string;
}

export const AsyncProgressModal: React.FC<AsyncProgressModalProps> = ({ isOpen, message }) => {
  const [progressPercent, setProgressPercent] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setProgressPercent(15);
      return;
    }

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen, message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 p-3 rounded-2xl animate-pulse">
            <Wand2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Multimodal Processing</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{message}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400 font-medium">
            <span>Overall Task Progress</span>
            <span className="text-indigo-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700/50 p-0.5">
            <div
              className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-300 shadow-md shadow-indigo-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Pipeline Phase Steps */}
        <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Reference Blueprint Extraction
            </span>
            <span className="text-emerald-400 text-[10px] font-bold">100%</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              Source Clips Analysis & Scene Segmentation
            </span>
            <span className="text-indigo-400 text-[10px] font-bold">{Math.min(100, progressPercent + 5)}%</span>
          </div>

          <div className="flex items-center justify-between text-zinc-500">
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              Chronological & Semantic Story Matching
            </span>
            <span className="text-[10px]">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};
