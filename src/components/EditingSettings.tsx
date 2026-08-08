import React from 'react';
import { Sliders, Sparkles, Clock, Palette, Zap, Check, ShieldCheck, Music, Subtitles } from 'lucide-react';
import { EditingSettings as EditingSettingsType, EditingStyle, VideoLength } from '../types';

interface EditingSettingsProps {
  settings: EditingSettingsType;
  onChangeSettings: (newSettings: EditingSettingsType) => void;
  onGenerateTimeline: () => void;
  clipCount: number;
  hasReference: boolean;
}

export const EditingSettings: React.FC<EditingSettingsProps> = ({
  settings,
  onChangeSettings,
  onGenerateTimeline,
  clipCount,
  hasReference,
}) => {
  const styles: { id: EditingStyle; label: string; desc: string }[] = [
    { id: 'match-reference', label: 'Match Reference', desc: 'Strictly mirror structure & pacing of reference' },
    { id: 'cinematic', label: 'Cinematic', desc: 'Smooth crossfades, golden hour emphasis & depth' },
    { id: 'fast-paced', label: 'Fast-Paced', desc: 'Snappy quick cuts, high tempo & energy' },
    { id: 'emotional', label: 'Emotional', desc: 'Lingering close-ups, gentle transitions & warmth' },
    { id: 'social-media', label: 'Social Media', desc: 'High hook emphasis, captions & punchy cuts' },
    { id: 'documentary', label: 'Documentary', desc: 'Authentic narrative, speech focus & contextual B-roll' },
    { id: 'story-focused', label: 'Story-Focused', desc: 'Logical chronological flow & plot progression' },
  ];

  const lengths: { id: VideoLength; label: string; seconds: number }[] = [
    { id: 'short', label: 'Short (~15–30s)', seconds: 25 },
    { id: 'medium', label: 'Medium (~30–60s)', seconds: 45 },
    { id: 'long', label: 'Long (~60–120s)', seconds: 90 },
    { id: 'custom', label: 'Custom', seconds: settings.customDurationSeconds || 30 },
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Editing Controls & AI Parameters</h2>
            <p className="text-xs text-zinc-400">
              Configure pacing, duration, and creativity balance before generating the AI timeline.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Video Length */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Video Duration</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {lengths.map((len) => (
              <button
                key={len.id}
                type="button"
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    videoLength: len.id,
                    customDurationSeconds: len.seconds,
                  })
                }
                className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  settings.videoLength === len.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold shadow-inner'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div>{len.label}</div>
              </button>
            ))}
          </div>

          {settings.videoLength === 'custom' && (
            <div className="pt-1">
              <label className="text-[11px] text-zinc-400 block mb-1">Custom Duration (seconds):</label>
              <input
                type="number"
                min={5}
                max={300}
                value={settings.customDurationSeconds}
                onChange={(e) =>
                  onChangeSettings({
                    ...settings,
                    customDurationSeconds: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* 2. Editing Style */}
        <div className="space-y-2.5 md:col-span-2">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Editing Style Archetype</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {styles.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeSettings({ ...settings, editingStyle: st.id })}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.editingStyle === st.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-inner'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div className="text-xs font-semibold text-zinc-200">{st.label}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. AI Creativity Slider & Options */}
      <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              AI Creativity Balance
            </span>
            <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 text-[11px]">
              {settings.creativityLevel < 30
                ? 'Conservative (Chronological)'
                : settings.creativityLevel > 70
                ? 'Creative (Atmospheric)'
                : 'Balanced Hybrid'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={settings.creativityLevel}
            onChange={(e) =>
              onChangeSettings({
                ...settings,
                creativityLevel: parseInt(e.target.value),
              })
            }
            className="w-full accent-indigo-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
            <span>Conservative (Strict Chronological)</span>
            <span>Creative (Atmospheric Flow)</span>
          </div>
        </div>

        {/* Toggles & Options */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-300">
          <label className="flex items-center gap-2 cursor-pointer bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700">
            <input
              type="checkbox"
              checked={settings.includeSubtitles}
              onChange={(e) => onChangeSettings({ ...settings, includeSubtitles: e.target.checked })}
              className="accent-indigo-500 rounded"
            />
            <Subtitles className="w-4 h-4 text-indigo-400" />
            <span>Generate Subtitles</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 hover:border-zinc-700">
            <input
              type="checkbox"
              checked={settings.audioNormalization}
              onChange={(e) => onChangeSettings({ ...settings, audioNormalization: e.target.checked })}
              className="accent-indigo-500 rounded"
            />
            <Music className="w-4 h-4 text-indigo-400" />
            <span>Audio Normalization</span>
          </label>
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="pt-2">
        <button
          onClick={onGenerateTimeline}
          disabled={clipCount === 0}
          className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            clipCount === 0
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.99]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
          <span>Match Reference & Generate AI Timeline ({clipCount} Clips Ready)</span>
        </button>
      </div>
    </div>
  );
};
