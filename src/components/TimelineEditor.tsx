import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Play,
  HelpCircle,
  MessageSquare,
  Send,
  Layers,
  Clock,
  Wand2,
  SlidersHorizontal,
  Volume2,
  Tag,
  Video,
} from 'lucide-react';
import { TimelineSection, TimelineClipItem, ClipMetadata, Project } from '../types';
import { ApiClient } from '../services/apiClient';

interface TimelineEditorProps {
  project: Project;
  timeline: TimelineSection[];
  onUpdateTimeline: (updatedTimeline: TimelineSection[]) => void;
  onStartAnalysis: (msg: string) => void;
  onEndAnalysis: () => void;
  onPreviewClip: (url: string) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  project,
  timeline,
  onUpdateTimeline,
  onStartAnalysis,
  onEndAnalysis,
  onPreviewClip,
}) => {
  const [feedbackInput, setFeedbackInput] = useState('');
  const [activeReasoningSec, setActiveReasoningSec] = useState<string | null>(null);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);

  const clipMap = new Map<string, ClipMetadata>(project.sourceClips.map((c) => [c.clip_id, c]));

  // Reorder clips inside a section
  const moveClip = (sectionIndex: number, clipIndex: number, direction: 'left' | 'right') => {
    const updated = JSON.parse(JSON.stringify(timeline)) as TimelineSection[];
    const section = updated[sectionIndex];
    if (!section) return;

    const targetIdx = direction === 'left' ? clipIndex - 1 : clipIndex + 1;
    if (targetIdx < 0 || targetIdx >= section.clips.length) return;

    const temp = section.clips[clipIndex];
    section.clips[clipIndex] = section.clips[targetIdx];
    section.clips[targetIdx] = temp;

    onUpdateTimeline(updated);
  };

  // Toggle clip lock
  const toggleLock = (sectionIndex: number, clipIndex: number) => {
    const updated = JSON.parse(JSON.stringify(timeline)) as TimelineSection[];
    const item = updated[sectionIndex].clips[clipIndex];
    item.locked = !item.locked;
    onUpdateTimeline(updated);
  };

  // Delete clip from section
  const deleteClip = (sectionIndex: number, clipIndex: number) => {
    const updated = JSON.parse(JSON.stringify(timeline)) as TimelineSection[];
    updated[sectionIndex].clips.splice(clipIndex, 1);
    onUpdateTimeline(updated);
  };

  // Update clip trim duration
  const updateClipDuration = (sectionIndex: number, clipIndex: number, newTargetDuration: number) => {
    const updated = JSON.parse(JSON.stringify(timeline)) as TimelineSection[];
    const item = updated[sectionIndex].clips[clipIndex];
    item.targetDuration = Math.max(1, newTargetDuration);
    item.endTime = item.startTime + item.targetDuration;
    onUpdateTimeline(updated);
  };

  // Update transition type
  const updateTransition = (
    sectionIndex: number,
    clipIndex: number,
    transition: 'cut' | 'crossfade' | 'fade-black' | 'wipe' | 'zoom'
  ) => {
    const updated = JSON.parse(JSON.stringify(timeline)) as TimelineSection[];
    updated[sectionIndex].clips[clipIndex].transitionToNext = transition;
    onUpdateTimeline(updated);
  };

  // Handle Natural Language User Feedback
  const handleFeedbackSubmit = async (e?: React.FormEvent, customInstruction?: string) => {
    if (e) e.preventDefault();
    const instruction = customInstruction || feedbackInput;
    if (!instruction.trim()) return;

    try {
      onStartAnalysis(`Modifying timeline based on instruction: "${instruction}"...`);
      const res = await ApiClient.modifyTimeline(project.id, instruction, timeline);

      onUpdateTimeline(res.updatedTimeline);
      setLastExplanation(res.explanation);
      setFeedbackInput('');
    } catch (err) {
      console.error(err);
      alert('Failed to modify timeline');
    } finally {
      onEndAnalysis();
    }
  };

  const sampleFeedbackPrompts = [
    'Make the beginning more exciting.',
    'Use more clips of the people talking.',
    'Make this section slower and more emotional.',
    'Remove the funny clips and make it cinematic.',
  ];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>AI Story Timeline & Multi-Track Editor</span>
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Reference Match Active
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Drag, trim, lock, or ask the AI to re-edit specific story sections.
            </p>
          </div>
        </div>
      </div>

      {/* AI Modifying Explanation Banner */}
      {lastExplanation && (
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 text-xs text-indigo-200 flex items-start gap-2.5 shadow-inner">
          <Wand2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">AI Editor Response:</span>
            <p className="text-indigo-200/90 leading-relaxed">{lastExplanation}</p>
          </div>
        </div>
      )}

      {/* Timeline Sections Container */}
      <div className="space-y-4">
        {timeline.map((section, secIdx) => (
          <div
            key={section.id || secIdx}
            className="bg-zinc-950/70 border border-zinc-800/90 hover:border-zinc-700/80 rounded-xl p-4 space-y-3 transition-all"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-2.5 py-1 rounded-lg">
                  {section.name}
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">{section.description}</span>
              </div>

              <button
                onClick={() => setActiveReasoningSec(activeReasoningSec === section.id ? null : section.id)}
                className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-700/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Why did AI choose this order?</span>
              </button>
            </div>

            {/* AI Reasoning Disclosure Card */}
            {activeReasoningSec === section.id && (
              <div className="bg-zinc-900 border border-indigo-500/20 rounded-xl p-3 text-xs text-zinc-300 space-y-1.5 animate-in fade-in duration-150">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Section Selection Rationale:
                </div>
                <p className="text-zinc-400 leading-relaxed">{section.sectionReasoning}</p>
              </div>
            )}

            {/* Clips Block Row inside Section */}
            {section.clips.length === 0 ? (
              <div className="text-xs text-zinc-500 italic py-3 text-center bg-zinc-900/40 rounded-lg border border-dashed border-zinc-800">
                No clips assigned to this section yet.
              </div>
            ) : (
              <div className="flex flex-wrap sm:flex-nowrap gap-3 overflow-x-auto pb-1">
                {section.clips.map((item, clipIdx) => {
                  const clip = clipMap.get(item.clip_id);
                  return (
                    <div
                      key={item.id || clipIdx}
                      className={`min-w-[220px] max-w-[260px] flex-1 bg-zinc-900 border rounded-xl p-3 space-y-2.5 relative transition-all shadow-md ${
                        item.locked
                          ? 'border-amber-500/50 bg-amber-950/10'
                          : 'border-zinc-800 hover:border-indigo-500/40'
                      }`}
                    >
                      {/* Top Bar Controls */}
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveClip(secIdx, clipIdx, 'left')}
                            disabled={clipIdx === 0}
                            className="text-zinc-400 hover:text-white disabled:opacity-30 p-1 rounded hover:bg-zinc-800"
                            title="Move clip left"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveClip(secIdx, clipIdx, 'right')}
                            disabled={clipIdx === section.clips.length - 1}
                            className="text-zinc-400 hover:text-white disabled:opacity-30 p-1 rounded hover:bg-zinc-800"
                            title="Move clip right"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleLock(secIdx, clipIdx)}
                            className={`p-1 rounded transition-colors ${
                              item.locked ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                            title={item.locked ? 'Locked (AI won\'t change)' : 'Lock clip position'}
                          >
                            {item.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => deleteClip(secIdx, clipIdx)}
                            className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Remove clip"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Clip Thumbnail & Title */}
                      <div className="flex items-center gap-2.5 bg-zinc-950/80 p-2 rounded-lg border border-zinc-800/80">
                        <div className="w-12 h-10 bg-zinc-800 rounded border border-zinc-700/60 overflow-hidden relative shrink-0">
                          {clip?.thumbnailUrl ? (
                            <img src={clip.thumbnailUrl} alt={clip.originalName} className="w-full h-full object-cover" />
                          ) : (
                            <Video className="w-4 h-4 text-zinc-500 m-auto" />
                          )}
                          {clip?.url && (
                            <button
                              onClick={() => onPreviewClip(clip.url)}
                              className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                            </button>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-zinc-200 truncate">
                            {clip?.originalName || 'Source Clip'}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Trim: {item.startTime.toFixed(1)}s – {item.endTime.toFixed(1)}s
                          </div>
                        </div>
                      </div>

                      {/* Trim Duration Controls */}
                      <div className="flex items-center justify-between text-[11px] bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                        <span className="text-zinc-400">Duration:</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={20}
                            step={0.5}
                            value={item.targetDuration}
                            onChange={(e) =>
                              updateClipDuration(secIdx, clipIdx, parseFloat(e.target.value) || 2)
                            }
                            className="w-14 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-center text-xs text-zinc-200 focus:outline-none"
                          />
                          <span className="text-zinc-500">s</span>
                        </div>
                      </div>

                      {/* Transition Selector */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400">Transition:</span>
                        <select
                          value={item.transitionToNext || 'cut'}
                          onChange={(e: any) => updateTransition(secIdx, clipIdx, e.target.value)}
                          className="bg-zinc-950 text-zinc-300 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px]"
                        >
                          <option value="cut">Hard Cut</option>
                          <option value="crossfade">Crossfade</option>
                          <option value="fade-black">Fade Black</option>
                          <option value="wipe">Wipe</option>
                        </select>
                      </div>

                      {/* Clip AI Selection Reasoning */}
                      {item.aiSelectionReasoning && (
                        <div className="text-[10px] text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800/80 leading-relaxed">
                          💡 <span className="italic">{item.aiSelectionReasoning}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Feedback Loop Prompt Section */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-semibold text-white">Interactive Natural Language Re-Editor</h3>
        </div>

        {/* Preset Sample Prompts */}
        <div className="flex wrap gap-2">
          {sampleFeedbackPrompts.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleFeedbackSubmit(undefined, promptText)}
              className="text-[11px] bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-zinc-700/60 transition-all cursor-pointer"
            >
              "{promptText}"
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={(e) => handleFeedbackSubmit(e)} className="flex items-center gap-2">
          <input
            type="text"
            placeholder='Type edit instructions e.g. "Make the climax slower and add more dialogue clips"'
            value={feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Apply AI Edit</span>
          </button>
        </form>
      </div>
    </div>
  );
};
