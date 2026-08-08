import React, { useState } from 'react';
import { Video, Film, Sparkles, FolderPlus, Layers, Plus } from 'lucide-react';
import { Project } from '../types';
import { SAMPLE_PRESETS } from '../data/samplePresets';

interface HeaderProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, presetId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('travel-vlog');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProject(newProjectName || 'New Video Edit', selectedPresetId || undefined);
    setNewProjectName('');
    setShowNewModal(false);
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 text-zinc-100 px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600/20 border border-indigo-500/30 p-2 rounded-xl text-indigo-400 flex items-center justify-center shadow-inner">
            <Film className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">AI Video Editor</h1>
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Gemini Multi-Clip
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Reference-Guided Unordered Clip Storytelling</p>
          </div>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="hidden md:flex items-center gap-2 ml-6 pl-6 border-l border-zinc-800">
            <Layers className="w-4 h-4 text-zinc-400" />
            <select
              value={activeProject?.id || ''}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-zinc-800/80 hover:bg-zinc-800 text-xs text-zinc-200 border border-zinc-700/80 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sourceClips.length} clips)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Create New AI Video Edit</h2>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm p-1 rounded-lg hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kyoto Trip 2026 - High Energy Edit"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Or Start with a Pre-loaded Sample Set:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedPresetId('')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPresetId === ''
                        ? 'bg-indigo-950/40 border-indigo-500 text-zinc-100'
                        : 'bg-zinc-800/50 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-semibold text-zinc-200 mb-1">Blank Project</div>
                    <div className="text-[11px] text-zinc-400">Upload your own reference video and custom clips.</div>
                  </div>

                  {SAMPLE_PRESETS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPresetId === preset.id
                          ? 'bg-indigo-950/40 border-indigo-500 text-zinc-100'
                          : 'bg-zinc-800/50 border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-indigo-400" />
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 line-clamp-2">{preset.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
