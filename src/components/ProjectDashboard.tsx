import React, { useState } from 'react';
import { Film, Video, Sliders, Layers, Tv, Sparkles, CheckCircle2, Clock, Play } from 'lucide-react';
import { Project, TimelineSection, EditingSettings as EditingSettingsType } from '../types';
import { ReferenceUpload } from './ReferenceUpload';
import { ClipsUpload } from './ClipsUpload';
import { EditingSettings } from './EditingSettings';
import { TimelineEditor } from './TimelineEditor';
import { VideoPlayerStudio } from './VideoPlayerStudio';

interface ProjectDashboardProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onStartAnalysis: (msg: string) => void;
  onEndAnalysis: () => void;
  onGenerateTimeline: () => void;
  onSelectVersion: (versionId: string) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  project,
  onUpdateProject,
  onStartAnalysis,
  onEndAnalysis,
  onGenerateTimeline,
  onSelectVersion,
}) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'clips' | 'settings' | 'timeline' | 'preview'>('reference');
  const [previewClipUrl, setPreviewClipUrl] = useState<string | null>(null);

  const activeVersion =
    project.versions.find((v) => v.id === project.activeVersionId) ||
    project.versions[project.versions.length - 1];

  const currentTimeline: TimelineSection[] = activeVersion?.timeline || [];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Dashboard Top Header Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-tight">{project.name}</h1>
            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize">
              {project.overallStatus.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Reference-guided multi-clip AI editing pipeline • Created{' '}
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-zinc-950/80 border border-zinc-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-zinc-300">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ref Video: {project.referenceVideo?.blueprint ? 'Extracted' : 'Not Uploaded'}</span>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-zinc-300">
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Clips: {project.sourceClips.length}</span>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2 text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target: {project.settings.customDurationSeconds || 30}s</span>
          </div>
        </div>
      </div>

      {/* Navigation Step Tabs */}
      <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reference')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reference'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>1. Reference Video</span>
          {project.referenceVideo?.blueprint && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('clips')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'clips'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>2. Source Clips ({project.sourceClips.length})</span>
          {project.sourceClips.length > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. AI Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. AI Story Timeline</span>
          {currentTimeline.length > 0 && <Sparkles className="w-3.5 h-3.5 text-indigo-300 ml-1" />}
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>5. Studio Preview</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'reference' && (
          <ReferenceUpload
            project={project}
            onUpdateProject={onUpdateProject}
            onStartAnalysis={onStartAnalysis}
            onEndAnalysis={onEndAnalysis}
          />
        )}

        {activeTab === 'clips' && (
          <ClipsUpload
            project={project}
            onUpdateProject={onUpdateProject}
            onStartAnalysis={onStartAnalysis}
            onEndAnalysis={onEndAnalysis}
          />
        )}

        {activeTab === 'settings' && (
          <EditingSettings
            settings={project.settings}
            onChangeSettings={(newSettings) => onUpdateProject({ settings: newSettings })}
            onGenerateTimeline={() => {
              onGenerateTimeline();
              setActiveTab('timeline');
            }}
            clipCount={project.sourceClips.length}
            hasReference={!!project.referenceVideo?.blueprint}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineEditor
            project={project}
            timeline={currentTimeline}
            onUpdateTimeline={(updated) => {
              if (activeVersion) {
                const updatedVersions = project.versions.map((v) =>
                  v.id === activeVersion.id ? { ...v, timeline: updated } : v
                );
                onUpdateProject({ versions: updatedVersions });
              }
            }}
            onStartAnalysis={onStartAnalysis}
            onEndAnalysis={onEndAnalysis}
            onPreviewClip={(url) => setPreviewClipUrl(url)}
          />
        )}

        {activeTab === 'preview' && (
          <VideoPlayerStudio
            project={project}
            timeline={currentTimeline}
            onStartAnalysis={onStartAnalysis}
            onEndAnalysis={onEndAnalysis}
            onSelectVersion={onSelectVersion}
          />
        )}
      </div>

      {/* Clip Preview Modal */}
      {previewClipUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-xs font-semibold text-zinc-200">Source Clip Preview</span>
              <button
                onClick={() => setPreviewClipUrl(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-zinc-800 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <video src={previewClipUrl} controls autoPlay className="w-full rounded-xl aspect-video bg-black" />
          </div>
        </div>
      )}
    </div>
  );
};
