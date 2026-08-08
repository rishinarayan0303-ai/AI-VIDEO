export type EditingStyle = 
  | 'match-reference'
  | 'fast-paced'
  | 'cinematic'
  | 'emotional'
  | 'documentary'
  | 'social-media'
  | 'story-focused';

export type VideoLength = 'short' | 'medium' | 'long' | 'custom';

export type StoryRole = 
  | 'hook'
  | 'context'
  | 'main'
  | 'b-roll'
  | 'climax'
  | 'ending'
  | 'transition'
  | 'unused';

export interface ReferenceStructureBlueprint {
  overallDuration: number; // in seconds
  pacing: 'slow' | 'moderate' | 'fast' | 'dynamic';
  averageShotDuration: number; // seconds
  cutFrequency: number; // cuts per minute
  sections: {
    name: string; // e.g. "Attention-grabbing hook", "Establishing/context shots"
    startTime: number;
    endTime: number;
    description: string;
    targetShotType: string;
    pacingNote: string;
  }[];
  shotTypesUsed: string[]; // e.g. ["Wide establishing", "Close-up detail", "Action movement"]
  introHookStructure: string;
  narrativeFlow: string; // Beginning -> Middle -> Ending progression
  chronologicalVsThematic: 'chronological' | 'thematic' | 'hybrid';
  emotionalProgression: string;
  audioPattern: string; // e.g. "Upbeat acoustic music with minimal dialogue"
  dialogueVsBrollRatio: string; // e.g. "30% Dialogue / 70% B-roll"
  transitionTypes: string[]; // e.g. ["Hard cut", "Crossfade", "Match cut"]
  slowMoFastPacedNotes: string;
  repeatedVisualPatterns: string;
  endingStructure: string;
}

export interface UsableSegment {
  id: string;
  startTime: number;
  endTime: number;
  score: number;
  description: string;
  recommendedRole: StoryRole;
}

export interface ClipMetadata {
  clip_id: string;
  filename: string;
  originalName: string;
  url: string;
  duration: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
  description: string;
  actions: string[];
  location: string;
  peopleAndObjects: string[];
  speechOrDialogue: string;
  importantSounds: string[];
  mood: string;
  cameraMovement: string;
  shotType: string;
  quality: number; // 0.0 to 1.0
  isDuplicateOrNearDuplicate: boolean;
  duplicateNotes?: string;
  importance: number; // 0.0 to 1.0
  story_role: StoryRole;
  usable_segments: UsableSegment[];
  timeOfDayContext?: string;
  inferredChronologyScore?: number; // 0 to 100 estimated order
}

export interface TimelineClipItem {
  id: string;
  clip_id: string;
  segmentId?: string;
  startTime: number; // Start offset in source clip
  endTime: number; // End offset in source clip
  targetDuration: number; // Duration in final timeline
  customLabel?: string;
  storyRole: StoryRole;
  locked?: boolean;
  transitionToNext?: 'cut' | 'crossfade' | 'fade-black' | 'wipe' | 'zoom';
  overlayText?: string;
  volumeMultiplier?: number;
  aiSelectionReasoning?: string;
}

export interface TimelineSection {
  id: string;
  name: string; // HOOK, CONTEXT, MAIN SEQUENCE, HIGHLIGHT, ENDING
  targetStartTime: number;
  targetEndTime: number;
  description: string;
  clips: TimelineClipItem[];
  sectionReasoning: string;
}

export interface EditingSettings {
  videoLength: VideoLength;
  customDurationSeconds: number;
  editingStyle: EditingStyle;
  creativityLevel: number; // 0 (Conservative / Chronological) to 100 (Creative / Atmospheric)
  includeSubtitles: boolean;
  audioNormalization: boolean;
  syncCutsWithMusic: boolean;
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  title: string;
  userPromptHistory?: string[];
  timeline: TimelineSection[];
  totalEstimatedDuration: number;
  renderedVideoUrl?: string;
  renderStatus?: 'idle' | 'rendering' | 'completed' | 'failed';
  renderProgress?: number;
  renderedVideoDetails?: {
    duration: number;
    fileSizeMB: number;
    format: string;
    resolution: string;
  };
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  referenceVideo?: {
    url: string;
    filename: string;
    duration: number;
    thumbnailUrl?: string;
    blueprint?: ReferenceStructureBlueprint;
    analyzing?: boolean;
  };
  sourceClips: ClipMetadata[];
  settings: EditingSettings;
  versions: ProjectVersion[];
  activeVersionId?: string;
  overallStatus: 'draft' | 'analyzing' | 'timeline_ready' | 'rendered';
}

export interface AnalysisProgress {
  step: 'idle' | 'uploading' | 'analyzing_reference' | 'analyzing_clips' | 'building_story' | 'creating_timeline' | 'rendering';
  percentage: number;
  message: string;
}
