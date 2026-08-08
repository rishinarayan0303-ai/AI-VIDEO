import React, { useState, useMemo } from 'react';
import {
  Upload,
  Video,
  CheckCircle2,
  Sparkles,
  Tag,
  Play,
  Trash2,
  ShieldAlert,
  Clock,
  Layers,
  Star,
  FileArchive,
  Search,
  Filter,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { Project, ClipMetadata } from '../types';
import { ApiClient } from '../services/apiClient';

interface ClipsUploadProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onStartAnalysis: (message: string) => void;
  onEndAnalysis: () => void;
}

export const ClipsUpload: React.FC<ClipsUploadProps> = ({
  project,
  onUpdateProject,
  onStartAnalysis,
  onEndAnalysis,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [playingClipUrl, setPlayingClipUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'chronology' | 'quality' | 'duration' | 'name'>('chronology');
  const [extractionNote, setExtractionNote] = useState<string | null>(null);

  const clips = project.sourceClips;

  const handleMultipleFiles = async (files: FileList | File[]) => {
    try {
      setExtractionNote(null);
      const fileArray = Array.from(files);
      const isZipUpload = fileArray.some(
        (f) =>
          f.name.toLowerCase().endsWith('.zip') ||
          f.type.includes('zip') ||
          f.name.toLowerCase().endsWith('.rar') ||
          f.name.toLowerCase().endsWith('.7z')
      );

      if (isZipUpload) {
        onStartAnalysis(`Extracting video clips from ZIP archive(s)...`);
      } else {
        onStartAnalysis(`Uploading ${fileArray.length} file(s)...`);
      }

      const uploadedClipsList: Array<{ url: string; filename: string; originalName: string }> = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const res = await ApiClient.uploadFile(file, 'source');

        if (res.files && res.files.length > 0) {
          res.files.forEach((f) => {
            uploadedClipsList.push({
              url: f.url,
              filename: f.filename,
              originalName: f.originalName,
            });
          });
        } else {
          uploadedClipsList.push({
            url: res.url,
            filename: res.filename,
            originalName: res.originalName || file.name,
          });
        }
      }

      if (isZipUpload) {
        setExtractionNote(`Extracted ${uploadedClipsList.length} video clip(s) from ZIP archive!`);
      }

      onStartAnalysis(
        `Analyzing ${uploadedClipsList.length} clip(s) in parallel with Gemini AI (Extracting actions, speech, quality, segments)...`
      );

      const res = await ApiClient.analyzeSourceClips(project.id, uploadedClipsList);

      onUpdateProject({
        sourceClips: [...project.sourceClips, ...res.analyzedClips],
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to upload or analyze clips/ZIP file.');
    } finally {
      onEndAnalysis();
    }
  };

  const handleRemoveClip = (clipId: string) => {
    const updated = clips.filter((c) => c.clip_id !== clipId);
    onUpdateProject({ sourceClips: updated });
  };

  const handleClearAll = () => {
    if (confirm(`Are you sure you want to remove all ${clips.length} source clips?`)) {
      onUpdateProject({ sourceClips: [] });
    }
  };

  // Filtered and Sorted clips for unlimited clip management
  const filteredAndSortedClips = useMemo(() => {
    let result = [...clips];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.originalName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.actions.some((a) => a.toLowerCase().includes(q))
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((c) => c.story_role === roleFilter);
    }

    if (sortBy === 'quality') {
      result.sort((a, b) => b.quality - a.quality);
    } else if (sortBy === 'duration') {
      result.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.originalName.localeCompare(b.originalName));
    } else {
      result.sort((a, b) => (a.inferredChronologyScore || 0) - (b.inferredChronologyScore || 0));
    }

    return result;
  }, [clips, searchQuery, roleFilter, sortBy]);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2 rounded-xl">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Step 2 — Upload Unordered Source Clips</span>
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {clips.length} Clips Uploaded
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Upload multiple video clips or a <strong>ZIP archive</strong> containing unlimited footage. Gemini AI automatically analyzes scenes, speech, quality, and trim points.
            </p>
          </div>
        </div>

        {clips.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-medium text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 px-3 py-1.5 rounded-xl bg-zinc-950 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Clips</span>
          </button>
        )}
      </div>

      {extractionNote && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileArchive className="w-4 h-4 text-emerald-400" />
            <span>{extractionNote}</span>
          </div>
          <button onClick={() => setExtractionNote(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleMultipleFiles(e.dataTransfer.files);
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative group ${
          dragOver
            ? 'border-indigo-500 bg-indigo-950/20'
            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900/50'
        }`}
      >
        <input
          type="file"
          accept="video/*,.zip,application/zip,application/x-zip-compressed,.rar,.7z"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleMultipleFiles(e.target.files);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-800 group-hover:bg-indigo-600/20 text-zinc-400 group-hover:text-indigo-400 p-3 rounded-xl border border-zinc-700/50 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="bg-zinc-800/80 group-hover:bg-amber-500/20 text-zinc-400 group-hover:text-amber-400 p-3 rounded-xl border border-zinc-700/50 transition-colors">
              <FileArchive className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-semibold text-zinc-200">
            Drag & Drop Multiple Videos or <span className="text-indigo-400 underline">Upload ZIP Archive</span>
          </p>
          <p className="text-[11px] text-zinc-500 max-w-lg">
            Supports unlimited clips! Upload <strong>.mp4, .mov, .webm</strong> or a <strong>.zip archive</strong> containing dozens/hundreds of clips. Gemini AI will analyze and index every clip in parallel.
          </p>
        </div>
      </div>

      {/* Uploaded Clips Toolbar & Search */}
      {clips.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Search clips by name, action, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Role filter */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Filter className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="all">All Roles ({clips.length})</option>
                  <option value="hook">Hook</option>
                  <option value="context">Context</option>
                  <option value="main">Main Sequence</option>
                  <option value="b-roll">B-Roll</option>
                  <option value="climax">Climax</option>
                  <option value="ending">Ending</option>
                </select>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-2 py-1 focus:outline-none"
                >
                  <option value="chronology">AI Chronology</option>
                  <option value="quality">Quality Rating</option>
                  <option value="duration">Duration</option>
                  <option value="name">File Name</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-zinc-400 px-1">
            <span>
              Showing {filteredAndSortedClips.length} of {clips.length} Clips
            </span>
            <span className="text-[11px] text-zinc-500">
              Unlimited Clips Ready for AI Timeline Matching
            </span>
          </div>

          {/* Grid of Clips */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredAndSortedClips.map((clip, index) => (
              <div
                key={clip.clip_id || index}
                className="bg-zinc-950/80 border border-zinc-800 hover:border-indigo-500/40 rounded-xl p-3 space-y-3 transition-all relative group shadow-md"
              >
                {/* Header & Thumbnail */}
                <div className="flex gap-3">
                  <div className="w-20 h-16 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700/60 relative shrink-0 group/img">
                    {clip.thumbnailUrl ? (
                      <img src={clip.thumbnailUrl} alt={clip.originalName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <Video className="w-6 h-6 text-zinc-600" />
                      </div>
                    )}
                    <button
                      onClick={() => setPlayingClipUrl(clip.url)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white"
                    >
                      <Play className="w-5 h-5 fill-white" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-zinc-200 truncate" title={clip.originalName}>
                        {clip.originalName}
                      </span>
                      <button
                        onClick={() => handleRemoveClip(clip.clip_id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Remove clip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {clip.duration}s
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.2 rounded font-medium border border-indigo-500/20 uppercase">
                        {clip.story_role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-zinc-300 font-semibold">
                        Quality: {Math.round(clip.quality * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Description & Metadata Tags */}
                <div className="space-y-1.5 text-[11px] pt-1 border-t border-zinc-800/80">
                  <p className="text-zinc-300 line-clamp-2 leading-relaxed">{clip.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {clip.actions.map((act, idx) => (
                      <span key={idx} className="bg-zinc-800/90 text-zinc-300 px-1.5 py-0.5 rounded text-[10px]">
                        {act}
                      </span>
                    ))}
                    {clip.location && (
                      <span className="bg-zinc-800/90 text-indigo-300 px-1.5 py-0.5 rounded text-[10px]">
                        📍 {clip.location}
                      </span>
                    )}
                  </div>

                  {clip.speechOrDialogue && (
                    <div className="text-[10px] text-zinc-400 italic bg-zinc-900/60 p-1.5 rounded border border-zinc-800/60 truncate">
                      💬 "{clip.speechOrDialogue}"
                    </div>
                  )}

                  {/* Usable Segments */}
                  {clip.usable_segments && clip.usable_segments.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-zinc-500 block font-medium mb-1">
                        AI Recommended Trim Segment:
                      </span>
                      {clip.usable_segments.map((seg, idx) => (
                        <div
                          key={idx}
                          className="bg-zinc-900 border border-indigo-500/20 p-1.5 rounded text-[10px] flex items-center justify-between text-zinc-300"
                        >
                          <span className="truncate mr-2">
                            {seg.startTime.toFixed(1)}s – {seg.endTime.toFixed(1)}s ({seg.description})
                          </span>
                          <span className="text-emerald-400 font-bold shrink-0">
                            {(seg.score * 100).toFixed(0)}% fit
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clip Preview Modal */}
      {playingClipUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-xs font-semibold text-zinc-200">Clip Preview</span>
              <button
                onClick={() => setPlayingClipUrl(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-zinc-800"
              >
                Close ✕
              </button>
            </div>
            <video src={playingClipUrl} controls autoPlay className="w-full rounded-xl aspect-video bg-black" />
          </div>
        </div>
      )}
    </div>
  );
};
