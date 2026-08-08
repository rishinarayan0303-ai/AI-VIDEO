import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Film,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Maximize2,
  Tv,
} from 'lucide-react';
import { Project, TimelineSection } from '../types';
import { VideoCompositor, PlayheadState } from '../lib/videoCompositor';
import { ApiClient } from '../services/apiClient';

interface VideoPlayerStudioProps {
  project: Project;
  timeline: TimelineSection[];
  onStartAnalysis: (msg: string) => void;
  onEndAnalysis: () => void;
  onSelectVersion: (versionId: string) => void;
}

export const VideoPlayerStudio: React.FC<VideoPlayerStudioProps> = ({
  project,
  timeline,
  onStartAnalysis,
  onEndAnalysis,
  onSelectVersion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositorRef = useRef<VideoCompositor | null>(null);
  const [playState, setPlayState] = useState<PlayheadState>({
    currentTime: 0,
    totalDuration: 30,
    isPlaying: false,
    clipLocalTime: 0,
  });
  const [rendering, setRendering] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);

  const activeVersion =
    project.versions.find((v) => v.id === project.activeVersionId) ||
    project.versions[project.versions.length - 1];

  useEffect(() => {
    if (!canvasRef.current) return;

    const compositor = new VideoCompositor(canvasRef.current);
    compositor.setProjectData(timeline, project.sourceClips);
    compositor.setOnTimeUpdate((state) => setPlayState(state));
    compositor.renderFrame();
    compositorRef.current = compositor;

    return () => {
      compositor.destroy();
      compositorRef.current = null;
    };
  }, [timeline, project.sourceClips]);

  const handlePlayPause = () => {
    if (!compositorRef.current) return;
    if (playState.isPlaying) {
      compositorRef.current.pause();
    } else {
      compositorRef.current.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!compositorRef.current) return;
    const target = parseFloat(e.target.value);
    compositorRef.current.seek(target);
  };

  const handleRenderVideo = async () => {
    try {
      setRendering(true);
      onStartAnalysis('Rendering final video with audio normalization and transitions...');

      const res = await ApiClient.renderVideo(
        project.id,
        activeVersion?.id || project.versions[0]?.id
      );

      setRenderedUrl(res.renderedVideoUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to render final video');
    } finally {
      setRendering(false);
      onEndAnalysis();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-2 rounded-xl">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Video Studio & Playback Preview</h2>
            <p className="text-xs text-zinc-400">
              Live canvas compositor rendering trimmed clips, transitions, and subtitles.
            </p>
          </div>
        </div>

        {/* Version Switcher Tabs */}
        {project.versions.length > 0 && (
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {project.versions.map((ver) => (
              <button
                key={ver.id}
                onClick={() => onSelectVersion(ver.id)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  ver.id === activeVersion?.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                v{ver.versionNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Canvas Player Container */}
      <div className="space-y-3">
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group">
          <canvas ref={canvasRef} width={1280} height={720} className="w-full h-full object-contain" />

          {/* Current Active Section Badge Overlay */}
          {playState.activeSection && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-indigo-300 border border-indigo-500/30 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{playState.activeSection.name}</span>
            </div>
          )}

          {/* Controls Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 space-y-2 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Scrubber Range */}
            <input
              type="range"
              min={0}
              max={playState.totalDuration || 30}
              step={0.1}
              value={playState.currentTime}
              onChange={handleSeek}
              className="w-full accent-indigo-500 bg-zinc-700/80 h-1.5 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {playState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <div className="font-mono text-xs">
                  <span className="text-white font-semibold">{formatTime(playState.currentTime)}</span>
                  <span className="text-zinc-500"> / </span>
                  <span className="text-zinc-400">{formatTime(playState.totalDuration)}</span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 hidden sm:block">
                {playState.activeSourceClip ? (
                  <span>
                    Clip: <span className="text-zinc-200">{playState.activeSourceClip.originalName}</span>
                  </span>
                ) : (
                  <span>Ready for Playback</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar & Video Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/80 gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Timeline Verified — Ready to Render Final Output</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {renderedUrl && (
              <a
                href={renderedUrl}
                download="ai-edited-video.mp4"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4</span>
              </a>
            )}

            <button
              onClick={handleRenderVideo}
              disabled={rendering}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{rendering ? 'Rendering...' : 'Render Final Video'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
