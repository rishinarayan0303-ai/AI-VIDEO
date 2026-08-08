import { TimelineSection, TimelineClipItem, ClipMetadata } from '../types';

export interface PlayheadState {
  currentTime: number;
  totalDuration: number;
  activeSection?: TimelineSection;
  activeClipItem?: TimelineClipItem;
  activeSourceClip?: ClipMetadata;
  clipLocalTime: number; // Offset inside source clip
  isPlaying: boolean;
}

export class VideoCompositor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaElements: Map<string, HTMLVideoElement | HTMLImageElement> = new Map();
  private timeline: TimelineSection[] = [];
  private sourceClipsMap: Map<string, ClipMetadata> = new Map();
  private flattenedClips: {
    item: TimelineClipItem;
    section: TimelineSection;
    sourceClip: ClipMetadata;
    timelineStart: number;
    timelineEnd: number;
  }[] = [];
  private totalDuration: number = 0;
  private currentTimelineTime: number = 0;
  private isPlaying: boolean = false;
  private animFrameId: number | null = null;
  private audioContext: AudioContext | null = null;
  private onTimeUpdateCallback?: (state: PlayheadState) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    this.ctx = context;
  }

  public setProjectData(timeline: TimelineSection[], sourceClips: ClipMetadata[]) {
    this.timeline = timeline;
    this.sourceClipsMap = new Map(sourceClips.map((c) => [c.clip_id, c]));
    this.buildFlattenedTimeline();
    this.preloadMedia();
  }

  private buildFlattenedTimeline() {
    this.flattenedClips = [];
    let currentTime = 0;

    for (const section of this.timeline) {
      for (const item of section.clips) {
        const sourceClip = this.sourceClipsMap.get(item.clip_id);
        if (!sourceClip) continue;

        const duration = item.endTime - item.startTime;
        this.flattenedClips.push({
          item,
          section,
          sourceClip,
          timelineStart: currentTime,
          timelineEnd: currentTime + duration,
        });
        currentTime += duration;
      }
    }
    this.totalDuration = currentTime;
  }

  private isImageUrl(url: string, name: string): boolean {
    const ext = (url + name).toLowerCase();
    return /\.(jpg|jpeg|png|webp|heic|heif|bmp|gif|svg)(\?.*)?$/i.test(ext);
  }

  private preloadMedia() {
    for (const entry of this.flattenedClips) {
      const clipId = entry.sourceClip.clip_id;
      if (!this.mediaElements.has(clipId)) {
        const isImg = this.isImageUrl(entry.sourceClip.url, entry.sourceClip.originalName);

        if (isImg) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = entry.sourceClip.url;
          this.mediaElements.set(clipId, img);
        } else {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.src = entry.sourceClip.url;
          video.preload = 'auto';
          video.muted = false;
          video.playsInline = true;
          this.mediaElements.set(clipId, video);
        }
      }
    }
  }

  public setOnTimeUpdate(cb: (state: PlayheadState) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public seek(timelineTime: number) {
    this.currentTimelineTime = Math.max(0, Math.min(timelineTime, this.totalDuration));
    this.renderFrame();
    this.emitPlayheadState();
  }

  public play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!this.isPlaying) return;
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      this.currentTimelineTime += deltaSeconds;
      if (this.currentTimelineTime >= this.totalDuration) {
        this.currentTimelineTime = 0; // Loop or stop
      }

      this.renderFrame();
      this.emitPlayheadState();

      if (this.isPlaying) {
        this.animFrameId = requestAnimationFrame(step);
      }
    };

    this.animFrameId = requestAnimationFrame(step);
  }

  public pause() {
    this.isPlaying = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    // Pause video elements
    this.mediaElements.forEach((el) => {
      if (el instanceof HTMLVideoElement) {
        el.pause();
      }
    });
    this.emitPlayheadState();
  }

  public renderFrame() {
    const { width, height } = this.canvas;
    this.ctx.fillStyle = '#09090b'; // Dark background
    this.ctx.fillRect(0, 0, width, height);

    if (this.flattenedClips.length === 0) {
      this.drawPlaceholder('No clips in timeline');
      return;
    }

    // Find active clip at currentTimelineTime
    const activeEntry = this.flattenedClips.find(
      (c) => this.currentTimelineTime >= c.timelineStart && this.currentTimelineTime <= c.timelineEnd
    ) || this.flattenedClips[this.flattenedClips.length - 1];

    if (!activeEntry) {
      this.drawPlaceholder('End of Timeline');
      return;
    }

    const { item, section, sourceClip, timelineStart } = activeEntry;
    const clipOffset = this.currentTimelineTime - timelineStart;
    const clipDuration = activeEntry.timelineEnd - timelineStart;
    const sourceTime = item.startTime + clipOffset;

    const mediaEl = this.mediaElements.get(sourceClip.clip_id);
    if (!mediaEl) {
      this.drawPlaceholder(`Loading clip ${sourceClip.originalName}...`);
      return;
    }

    if (mediaEl instanceof HTMLImageElement) {
      if (mediaEl.complete && mediaEl.naturalWidth > 0) {
        const imgRatio = mediaEl.naturalWidth / mediaEl.naturalHeight;
        const cRatio = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (imgRatio > cRatio) {
          drawH = width / imgRatio;
          drawY = (height - drawH) / 2;
        } else {
          drawW = height * imgRatio;
          drawX = (width - drawW) / 2;
        }

        // Apply smooth Ken Burns zoom effect for photos
        const progress = Math.min(1, Math.max(0, clipOffset / (clipDuration || 1)));
        const scale = 1.0 + progress * 0.08;

        const transitionProgress = this.calculateTransitionProgress(activeEntry, clipOffset);
        this.ctx.save();
        if (transitionProgress < 1 && (item.transitionToNext === 'crossfade' || item.transitionToNext === 'fade-black')) {
          this.ctx.globalAlpha = transitionProgress;
        }

        // Center zoom transform
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-width / 2, -height / 2);

        this.ctx.drawImage(mediaEl, drawX, drawY, drawW, drawH);
        this.ctx.restore();
      } else {
        this.drawFallbackClipCard(sourceClip, section.name, item);
      }
    } else {
      const videoEl = mediaEl as HTMLVideoElement;
      // Update video element playback position if needed
      if (Math.abs(videoEl.currentTime - sourceTime) > 0.3) {
        videoEl.currentTime = sourceTime;
      }

      if (this.isPlaying && videoEl.paused) {
        videoEl.play().catch(() => {});
      }

      // Draw video frame to canvas
      if (videoEl.readyState >= 2) {
        // Calculate aspect ratio fit (letterbox / fill)
        const vRatio = videoEl.videoWidth / videoEl.videoHeight;
        const cRatio = width / height;
        let drawW = width;
        let drawH = height;
        let drawX = 0;
        let drawY = 0;

        if (vRatio > cRatio) {
          drawH = width / vRatio;
          drawY = (height - drawH) / 2;
        } else {
          drawW = height * vRatio;
          drawX = (width - drawW) / 2;
        }

        // Check transition effect from previous clip
        const transitionProgress = this.calculateTransitionProgress(activeEntry, clipOffset);
        this.ctx.save();
        if (transitionProgress < 1 && (item.transitionToNext === 'crossfade' || item.transitionToNext === 'fade-black')) {
          this.ctx.globalAlpha = transitionProgress;
        }

        this.ctx.drawImage(videoEl, drawX, drawY, drawW, drawH);
        this.ctx.restore();
      } else {
        // Render fallback clip thumbnail or gradient card
        this.drawFallbackClipCard(sourceClip, section.name, item);
      }
    }

    // Render Subtitles / Overlay Text
    this.drawOverlayText(section.name, item, sourceClip);
  }

  private calculateTransitionProgress(activeEntry: any, clipOffset: number): number {
    const transitionDuration = 0.8;
    if (clipOffset < transitionDuration) {
      return clipOffset / transitionDuration;
    }
    return 1;
  }

  private drawPlaceholder(text: string) {
    const { width, height } = this.canvas;
    this.ctx.fillStyle = '#18181b';
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.fillStyle = '#a1a1aa';
    this.ctx.font = 'bold 20px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, width / 2, height / 2);
  }

  private drawFallbackClipCard(clip: ClipMetadata, sectionName: string, item: TimelineClipItem) {
    const { width, height } = this.canvas;
    // Dark sleek gradient card simulation
    const grad = this.ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#0f172a');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);

    // Section Badge
    this.ctx.fillStyle = '#6366f1';
    this.ctx.fillRect(24, 24, 140, 32);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(sectionName, 94, 40);

    // Clip Description
    this.ctx.fillStyle = '#f4f4f5';
    this.ctx.font = '18px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(clip.description, 24, height - 70);

    this.ctx.fillStyle = '#9ca3af';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(`Source: ${clip.originalName} (${item.startTime.toFixed(1)}s - ${item.endTime.toFixed(1)}s)`, 24, height - 40);
  }

  private drawOverlayText(sectionName: string, item: TimelineClipItem, sourceClip: ClipMetadata) {
    const { width, height } = this.canvas;

    // Section Title Badge Top Left
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    this.ctx.fillRect(20, 20, 160, 36);
    this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(20, 20, 160, 36);

    this.ctx.fillStyle = '#818cf8';
    this.ctx.font = 'bold 13px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(sectionName.toUpperCase(), 100, 38);

    // Lower-third Subtitle / AI Commentary if present
    const overlay = item.overlayText || sourceClip.speechOrDialogue || sourceClip.description;
    if (overlay && overlay !== 'Ambient footsteps and bird chirping' && overlay !== 'Quiet soft whisking rhythm') {
      this.ctx.font = '16px sans-serif';
      const textWidth = this.ctx.measureText(overlay).width;
      const padding = 16;
      const boxW = Math.min(textWidth + padding * 2, width - 60);
      const boxX = (width - boxW) / 2;
      const boxY = height - 60;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(boxX, boxY, boxW, 36);

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(overlay, width / 2, boxY + 18, boxW - 20);
    }
  }

  private emitPlayheadState() {
    if (!this.onTimeUpdateCallback) return;

    const activeEntry = this.flattenedClips.find(
      (c) => this.currentTimelineTime >= c.timelineStart && this.currentTimelineTime <= c.timelineEnd
    ) || this.flattenedClips[0];

    const clipLocalTime = activeEntry ? this.currentTimelineTime - activeEntry.timelineStart : 0;

    this.onTimeUpdateCallback({
      currentTime: this.currentTimelineTime,
      totalDuration: this.totalDuration,
      activeSection: activeEntry?.section,
      activeClipItem: activeEntry?.item,
      activeSourceClip: activeEntry?.sourceClip,
      clipLocalTime,
      isPlaying: this.isPlaying,
    });
  }

  public destroy() {
    this.pause();
    this.mediaElements.forEach((el) => {
      if (el instanceof HTMLVideoElement) {
        el.pause();
        el.src = '';
      } else if (el instanceof HTMLImageElement) {
        el.src = '';
      }
    });
    this.mediaElements.clear();
  }
}
