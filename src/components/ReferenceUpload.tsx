import React, { useState } from 'react';
import { Upload, Film, CheckCircle2, Sparkles, BarChart2, Zap, Clock, Layers, Volume2, ShieldAlert } from 'lucide-react';
import { Project, ReferenceStructureBlueprint } from '../types';
import { ApiClient } from '../services/apiClient';

interface ReferenceUploadProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onStartAnalysis: (message: string) => void;
  onEndAnalysis: () => void;
}

export const ReferenceUpload: React.FC<ReferenceUploadProps> = ({
  project,
  onUpdateProject,
  onStartAnalysis,
  onEndAnalysis,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const reference = project.referenceVideo;
  const blueprint = reference?.blueprint;

  const handleFileUpload = async (file: File) => {
    try {
      onStartAnalysis('Uploading reference video...');
      const uploaded = await ApiClient.uploadFile(file, 'reference');

      onStartAnalysis('Analyzing reference video structure with Gemini AI...');
      const res = await ApiClient.analyzeReference(project.id, uploaded.url);

      onUpdateProject({
        referenceVideo: {
          url: uploaded.url,
          filename: uploaded.filename,
          duration: res.blueprint.overallDuration || 30,
          blueprint: res.blueprint,
          analyzing: false,
        },
      });
    } catch (err) {
      console.error(err);
      alert('Failed to upload/analyze reference video');
    } finally {
      onEndAnalysis();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2 rounded-xl">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Step 1 — Upload Reference Video</span>
              {blueprint && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Blueprint Extracted
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400">
              Upload an example video showing your desired storytelling, structure, and editing pattern.
            </p>
          </div>
        </div>
      </div>

      {!reference?.url ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group ${
            dragOver
              ? 'border-indigo-500 bg-indigo-950/20'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/50'
          }`}
        >
          <input
            type="file"
            accept="video/*,.zip,application/zip,application/x-zip-compressed"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="bg-zinc-800 group-hover:bg-indigo-600/20 text-zinc-400 group-hover:text-indigo-400 p-3.5 rounded-2xl border border-zinc-700/50 transition-colors shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200 mb-1">
                Drag & Drop Reference Video or <span className="text-indigo-400 underline">Browse Files</span>
              </p>
              <p className="text-[11px] text-zinc-500">
                MP4, WebM, MOV or AVI up to 100MB. The AI extracts an abstract editing pattern without copying content.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-950/80 border border-zinc-800 rounded-xl p-3.5 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/60 flex items-center justify-center shrink-0">
                {reference.thumbnailUrl ? (
                  <img src={reference.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <Film className="w-5 h-5 text-indigo-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">{reference.filename}</div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    Duration: {reference.duration}s
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-medium">AI Blueprint Active</span>
                </div>
              </div>
            </div>

            <label className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors cursor-pointer self-end sm:self-auto">
              Change Reference
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          {/* AI Extracted Abstract Blueprint Display */}
          {blueprint && (
            <div className="bg-zinc-950/60 border border-indigo-500/20 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                    AI Abstract Editing Blueprint
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    Pacing: {blueprint.pacing.toUpperCase()}
                  </span>
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md">
                    {blueprint.cutFrequency} cuts/min
                  </span>
                </div>
              </div>

              {/* Sections Breakdown Timeline Visual */}
              <div>
                <label className="text-[11px] font-medium text-zinc-400 mb-2 block">
                  Structure & Pacing Timeline Pattern:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                  {blueprint.sections.map((sec, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900 border border-zinc-800/90 rounded-lg p-2.5 space-y-1 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-300 truncate">{sec.name}</span>
                        <span className="text-[10px] text-zinc-500">
                          {sec.startTime}s–{sec.endTime}s
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{sec.description}</p>
                      <div className="text-[9px] bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50 mt-1">
                        {sec.targetShotType}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blueprint Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-[11px]">
                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Intro / Hook Structure</span>
                  <span className="text-zinc-200 font-medium">{blueprint.introHookStructure}</span>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Narrative Progression</span>
                  <span className="text-zinc-200 font-medium">{blueprint.narrativeFlow}</span>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Audio & Dialogue Pattern</span>
                  <span className="text-zinc-200 font-medium">{blueprint.audioPattern}</span>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Emotional Progression</span>
                  <span className="text-zinc-200 font-medium">{blueprint.emotionalProgression}</span>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Shot Types Used</span>
                  <div className="flex wrap gap-1 mt-0.5">
                    {blueprint.shotTypesUsed.map((st, idx) => (
                      <span key={idx} className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block mb-1 font-medium">Ending Pattern</span>
                  <span className="text-zinc-200 font-medium">{blueprint.endingStructure}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
