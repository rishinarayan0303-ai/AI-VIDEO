import { Project, ReferenceStructureBlueprint, ClipMetadata, EditingSettings, TimelineSection, AnalysisProgress } from '../types';

export class ApiClient {
  public static async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  }

  public static async createProject(name: string, presetId?: string): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, presetId }),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  }

  public static async getProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  }

  public static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  }

  public static async deleteProject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  }

  public static async uploadFile(file: File, type: 'reference' | 'source'): Promise<{ url: string; filename: string; originalName?: string; duration?: number; files?: Array<{ url: string; filename: string; originalName: string; size?: number }> }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      let errorMsg = '';
      try {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          errorMsg = json.error || json.message;
        } catch {
          if (text) {
            if (res.status === 413 || text.includes('413') || text.toLowerCase().includes('payload too large')) {
              errorMsg = 'File is too large for upload limit. Please try a smaller file or uncompressed video file.';
            } else {
              errorMsg = text.replace(/<[^>]*>/g, '').trim().slice(0, 200);
            }
          }
        }
      } catch (_) {}
      throw new Error(errorMsg || `Upload failed with status ${res.status} (${res.statusText || 'Error'})`);
    }
    return res.json();
  }

  public static async analyzeReference(projectId: string, referenceVideoUrl: string): Promise<{ blueprint: ReferenceStructureBlueprint }> {
    const res = await fetch('/api/analyze-reference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, referenceVideoUrl }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze reference video');
    }
    return res.json();
  }

  public static async analyzeSourceClips(projectId: string, clips: { url: string; filename: string; originalName: string }[]): Promise<{ analyzedClips: ClipMetadata[] }> {
    const res = await fetch('/api/analyze-clips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, clips }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze source clips');
    }
    return res.json();
  }

  public static async generateTimeline(projectId: string, settings: EditingSettings): Promise<{ timeline: TimelineSection[]; versionId: string; totalEstimatedDuration: number }> {
    const res = await fetch('/api/generate-timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, settings }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate AI timeline');
    }
    return res.json();
  }

  public static async modifyTimeline(projectId: string, instruction: string, currentTimeline: TimelineSection[]): Promise<{ updatedTimeline: TimelineSection[]; newVersionId: string; explanation: string }> {
    const res = await fetch('/api/modify-timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, instruction, currentTimeline }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to modify timeline with prompt');
    }
    return res.json();
  }

  public static async renderVideo(projectId: string, versionId: string, onProgress?: (p: AnalysisProgress) => void): Promise<{ renderedVideoUrl: string }> {
    const res = await fetch('/api/render-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, versionId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to render video');
    }
    return res.json();
  }
}
