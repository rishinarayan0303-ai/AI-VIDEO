import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ProjectDashboard } from './components/ProjectDashboard';
import { AsyncProgressModal } from './components/AsyncProgressModal';
import { Project } from './types';
import { ApiClient } from './services/apiClient';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisModal, setAnalysisModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getProjects();
      setProjects(data);
      if (data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (name: string, presetId?: string) => {
    try {
      setAnalysisModal({ open: true, message: 'Creating new AI Video Editor project...' });
      const created = await ApiClient.createProject(name, presetId);
      setProjects((prev) => [created, ...prev]);
      setActiveProjectId(created.id);
    } catch (err) {
      console.error(err);
      alert('Failed to create project');
    } finally {
      setAnalysisModal({ open: false, message: '' });
    }
  };

  const handleUpdateActiveProject = async (updates: Partial<Project>) => {
    if (!activeProjectId) return;
    try {
      const updated = await ApiClient.updateProject(activeProjectId, updates);
      setProjects((prev) => prev.map((p) => (p.id === activeProjectId ? updated : p)));
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleGenerateTimeline = async () => {
    if (!activeProject) return;
    try {
      setAnalysisModal({
        open: true,
        message: 'Matching reference video structure and generating AI timeline with Gemini...',
      });

      const res = await ApiClient.generateTimeline(activeProject.id, activeProject.settings);

      // Refresh project state
      const refreshed = await ApiClient.getProject(activeProject.id);
      setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? refreshed : p)));
    } catch (err) {
      console.error(err);
      alert('Failed to generate AI timeline');
    } finally {
      setAnalysisModal({ open: false, message: '' });
    }
  };

  const handleSelectVersion = (versionId: string) => {
    handleUpdateActiveProject({ activeVersionId: versionId });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-zinc-400 font-medium animate-pulse">
          Initializing AI Video Editor Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      <Header
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(id) => setActiveProjectId(id)}
        onCreateProject={handleCreateProject}
      />

      <main className="flex-1">
        {activeProject ? (
          <ProjectDashboard
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
            onStartAnalysis={(msg) => setAnalysisModal({ open: true, message: msg })}
            onEndAnalysis={() => setAnalysisModal({ open: false, message: '' })}
            onGenerateTimeline={handleGenerateTimeline}
            onSelectVersion={handleSelectVersion}
          />
        ) : (
          <div className="max-w-md mx-auto my-20 text-center p-8 bg-zinc-900 border border-zinc-800 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-white">No Video Projects Found</h2>
            <p className="text-xs text-zinc-400">
              Create a new project or select a pre-loaded sample set to begin automatic AI video editing.
            </p>
            <button
              onClick={() => handleCreateProject('My First AI Edit', 'travel-vlog')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Start with Sample Project
            </button>
          </div>
        )}
      </main>

      <AsyncProgressModal isOpen={analysisModal.open} message={analysisModal.message} />
    </div>
  );
}
