import { ReferenceStructureBlueprint, ClipMetadata, EditingSettings } from '../types';

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  description: string;
  referenceVideo: {
    title: string;
    url: string;
    duration: number;
    thumbnailUrl: string;
    blueprint: ReferenceStructureBlueprint;
  };
  sourceClips: ClipMetadata[];
  suggestedSettings: EditingSettings;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'travel-vlog',
    title: 'Kyoto Travel Exploration (Unordered Clips)',
    category: 'Travel & Lifestyle',
    description: 'A reference fast-paced cinematic travel edit matched against 6 unordered footage clips from a day trip.',
    referenceVideo: {
      title: 'High-Energy Travel Showcase Reference',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 15,
      thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      blueprint: {
        overallDuration: 30,
        pacing: 'fast',
        averageShotDuration: 2.2,
        cutFrequency: 27,
        sections: [
          {
            name: 'HOOK',
            startTime: 0,
            endTime: 4,
            description: 'Fast energetic motion shot with upbeat sound to grab attention instantly.',
            targetShotType: 'Close-up / Dynamic Motion',
            pacingNote: 'Snappy cuts under 2s'
          },
          {
            name: 'CONTEXT',
            startTime: 4,
            endTime: 10,
            description: 'Wide scenic views establishing the destination and ambiance.',
            targetShotType: 'Wide Landscape / Architecture',
            pacingNote: 'Steady 3s holds'
          },
          {
            name: 'MAIN SEQUENCE',
            startTime: 10,
            endTime: 22,
            description: 'Chronological progression of activities, street walks, and local interaction.',
            targetShotType: 'Medium Tracking / Action',
            pacingNote: 'Rhythmic 2.5s cuts'
          },
          {
            name: 'HIGHLIGHT',
            startTime: 22,
            endTime: 26,
            description: 'Peak emotional climax - stunning golden hour temple vista or reaction.',
            targetShotType: 'Slow-motion Close-up',
            pacingNote: 'Slightly extended beat'
          },
          {
            name: 'ENDING',
            startTime: 26,
            endTime: 30,
            description: 'Warm departure shot with subtle fade and trailing music note.',
            targetShotType: 'Medium / Pull back',
            pacingNote: 'Gentle fade-out'
          }
        ],
        shotTypesUsed: ['Wide Landscape', 'Dynamic Motion', 'Street Medium', 'Close-up Food', 'Slow-motion Sunset'],
        introHookStructure: 'Rapid 1.5s motion cuts establishing high sensory impact',
        narrativeFlow: 'Arrival Hook -> Atmospheric Context -> Street Exploration -> Sunset Climax -> Satisfying Farewell',
        chronologicalVsThematic: 'thematic',
        emotionalProgression: 'Curiosity -> Wonder -> Excitement -> Serenity',
        audioPattern: 'Upbeat acoustic beat syncing cuts with snare hits',
        dialogueVsBrollRatio: '10% Ambient Dialogue / 90% Cinematic B-roll',
        transitionTypes: ['Hard Cut', 'Crossfade', 'Speed Ramp Sync'],
        slowMoFastPacedNotes: 'Slow-motion used exclusively during highlight golden hour sequence',
        repeatedVisualPatterns: 'Panning shot from left to right repeated at structural transitions',
        endingStructure: 'Slow fade to black with lingering ambient temple bell audio'
      }
    },
    suggestedSettings: {
      videoLength: 'short',
      customDurationSeconds: 30,
      editingStyle: 'cinematic',
      creativityLevel: 65,
      includeSubtitles: true,
      audioNormalization: true,
      syncCutsWithMusic: true
    },
    sourceClips: [
      {
        clip_id: 'clip_01_temple_gate',
        filename: 'kyoto_clip_01.mp4',
        originalName: 'Kyoto Torii Gate Walkthrough.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 12,
        thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
        description: 'Traveler walking under vibrant red Fushimi Inari Torii gates with morning sun rays filtering through.',
        actions: ['walking', 'exploring', 'looking around'],
        location: 'Fushimi Inari Shrine, Kyoto',
        peopleAndObjects: ['1 traveler', 'torii gates', 'sunlight'],
        speechOrDialogue: 'Ambient footsteps and bird chirping',
        importantSounds: ['footsteps on gravel', 'wind chimes'],
        mood: 'serene',
        cameraMovement: 'Smooth forward gimbal tracking',
        shotType: 'Medium tracking shot',
        quality: 0.95,
        isDuplicateOrNearDuplicate: false,
        importance: 0.9,
        story_role: 'context',
        inferredChronologyScore: 15,
        timeOfDayContext: 'Morning 8:30 AM',
        usable_segments: [
          { id: 'seg_1a', startTime: 1.0, endTime: 5.5, score: 0.92, description: 'Sunlight breaking through Torii gates', recommendedRole: 'context' },
          { id: 'seg_1b', startTime: 6.0, endTime: 11.0, score: 0.88, description: 'Traveler looking up in awe', recommendedRole: 'main' }
        ]
      },
      {
        clip_id: 'clip_02_ramen_shop',
        filename: 'kyoto_clip_02.mp4',
        originalName: 'Late Night Ramen Chef.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: 14,
        thumbnailUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        description: 'Chef preparing steaming hot tonkotsu ramen in cozy alleyway shop, straining noodles with dramatic steam.',
        actions: ['cooking', 'straining noodles', 'plating food', 'smiling'],
        location: 'Gion Alley Ramen Shop',
        peopleAndObjects: ['ramen chef', 'steaming bowls', 'noodle strainer'],
        speechOrDialogue: 'Chef shouting "Irasshaimase!" with steam sizzle',
        importantSounds: ['boiling broth', 'kitchen sizzle', 'cheerful greeting'],
        mood: 'energetic',
        cameraMovement: 'Close-up tilt down',
        shotType: 'Close-up detail',
        quality: 0.92,
        isDuplicateOrNearDuplicate: false,
        importance: 0.85,
        story_role: 'hook',
        inferredChronologyScore: 75,
        timeOfDayContext: 'Evening 8:00 PM',
        usable_segments: [
          { id: 'seg_2a', startTime: 2.0, endTime: 5.5, score: 0.96, description: 'Dramatic noodle toss in steam', recommendedRole: 'hook' },
          { id: 'seg_2b', startTime: 8.0, endTime: 12.0, score: 0.89, description: 'Garnishing ramen with soft boiled egg', recommendedRole: 'main' }
        ]
      },
      {
        clip_id: 'clip_03_matcha_tea',
        filename: 'kyoto_clip_03.mp4',
        originalName: 'Traditional Matcha Ceremony.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4',
        duration: 10,
        thumbnailUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        description: 'Tea master whisking vibrant green matcha powder with bamboo whisk in traditional tatami room.',
        actions: ['whisking tea', 'pouring water', 'bowing'],
        location: 'Gion Tea House',
        peopleAndObjects: ['tea master', 'bamboo whisk', 'matcha bowl'],
        speechOrDialogue: 'Quiet soft whisking rhythm',
        importantSounds: ['whisking foam', 'pour of hot water'],
        mood: 'peaceful',
        cameraMovement: 'Static top-down Macro',
        shotType: 'Macro close-up',
        quality: 0.9,
        isDuplicateOrNearDuplicate: false,
        importance: 0.78,
        story_role: 'b-roll',
        inferredChronologyScore: 40,
        timeOfDayContext: 'Afternoon 2:00 PM',
        usable_segments: [
          { id: 'seg_3a', startTime: 1.5, endTime: 5.0, score: 0.91, description: 'Rich green matcha whisking motion', recommendedRole: 'b-roll' }
        ]
      },
      {
        clip_id: 'clip_04_bamboo_forest',
        filename: 'kyoto_clip_04.mp4',
        originalName: 'Arashiyama Bamboo Forest Sunset.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        duration: 15,
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        description: 'Tall bamboo stalks swaying gently against golden hour sunset light as traveler pauses and smiles at camera.',
        actions: ['walking slowly', 'turning to camera', 'smiling'],
        location: 'Arashiyama Bamboo Grove',
        peopleAndObjects: ['traveler', 'bamboo trees', 'sunset glow'],
        speechOrDialogue: '"This is the most peaceful place I have ever seen."',
        importantSounds: ['rustling bamboo leaves', 'gentle wind'],
        mood: 'emotional',
        cameraMovement: 'Slow orbit around traveler',
        shotType: 'Medium cinematic portrait',
        quality: 0.98,
        isDuplicateOrNearDuplicate: false,
        importance: 0.95,
        story_role: 'climax',
        inferredChronologyScore: 85,
        timeOfDayContext: 'Golden Hour 6:15 PM',
        usable_segments: [
          { id: 'seg_4a', startTime: 3.0, endTime: 8.5, score: 0.97, description: 'Golden hour sunset rays through bamboo with emotional smile', recommendedRole: 'climax' },
          { id: 'seg_4b', startTime: 10.0, endTime: 14.5, score: 0.93, description: 'Slow departure step turning away into light', recommendedRole: 'ending' }
        ]
      },
      {
        clip_id: 'clip_05_train_arrival',
        filename: 'kyoto_clip_05.mp4',
        originalName: 'Shinkansen Bullet Train Arrival.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        duration: 11,
        thumbnailUrl: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=600&q=80',
        description: 'Sleek bullet train gliding smoothly into Kyoto station platform with reflective windows.',
        actions: ['train arriving', 'doors opening', 'passengers stepping out'],
        location: 'Kyoto Station Platform',
        peopleAndObjects: ['bullet train', 'passengers', 'station signs'],
        speechOrDialogue: 'Station chime announcement',
        importantSounds: ['train brake hiss', 'station melody'],
        mood: 'expectant',
        cameraMovement: 'Whip-pan following train front',
        shotType: 'Wide action shot',
        quality: 0.88,
        isDuplicateOrNearDuplicate: false,
        importance: 0.8,
        story_role: 'context',
        inferredChronologyScore: 5,
        timeOfDayContext: 'Morning 7:45 AM',
        usable_segments: [
          { id: 'seg_5a', startTime: 0.5, endTime: 4.0, score: 0.9, description: 'Bullet train head sweeping into platform', recommendedRole: 'context' }
        ]
      },
      {
        clip_id: 'clip_06_night_street',
        filename: 'kyoto_clip_06.mp4',
        originalName: 'Pontocho Alley Lantern Walk.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        duration: 13,
        thumbnailUrl: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=600&q=80',
        description: 'Lantern-lit traditional wooden buildings along Pontocho alley, traveler waving goodbye to camera as lights glisten.',
        actions: ['walking away', 'waving back', 'dissolving into night glow'],
        location: 'Pontocho Alley, Kyoto',
        peopleAndObjects: ['red paper lanterns', 'traveler', 'wooden storefronts'],
        speechOrDialogue: '"Sayonara Kyoto, until next time!"',
        importantSounds: ['distant music', 'chatter', 'river breeze'],
        mood: 'nostalgic',
        cameraMovement: 'Slow backward track',
        shotType: 'Wide atmosphere shot',
        quality: 0.94,
        isDuplicateOrNearDuplicate: false,
        importance: 0.92,
        story_role: 'ending',
        inferredChronologyScore: 95,
        timeOfDayContext: 'Night 9:30 PM',
        usable_segments: [
          { id: 'seg_6a', startTime: 5.0, endTime: 11.5, score: 0.95, description: 'Waving goodbye under warm red lanterns', recommendedRole: 'ending' }
        ]
      }
    ]
  },
  {
    id: 'fitness-workout',
    title: 'CrossFit High-Energy Transformation (Unordered Clips)',
    category: 'Fitness & Sports',
    description: 'A fast promo reference structure matched with 5 workout clips uploaded out of chronological order.',
    referenceVideo: {
      title: 'Action Sports Commercial Reference',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 20,
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      blueprint: {
        overallDuration: 25,
        pacing: 'fast',
        averageShotDuration: 1.8,
        cutFrequency: 33,
        sections: [
          {
            name: 'HOOK',
            startTime: 0,
            endTime: 3,
            description: 'Explosive lift impact shot with heavy bass hit.',
            targetShotType: 'Macro Close-Up',
            pacingNote: 'Ultra fast 1s cuts'
          },
          {
            name: 'CONTEXT',
            startTime: 3,
            endTime: 8,
            description: 'Athlete tying shoes and chalking hands in quiet gym.',
            targetShotType: 'Medium Detail Shot',
            pacingNote: '2s beats'
          },
          {
            name: 'MAIN SEQUENCE',
            startTime: 8,
            endTime: 18,
            description: 'Intense montage of heavy deadlifts, kettlebells, and battle ropes.',
            targetShotType: 'Dynamic Action Angle',
            pacingNote: 'Synchronized with beat'
          },
          {
            name: 'HIGHLIGHT',
            startTime: 18,
            endTime: 22,
            description: 'PR lift completion shout and fist pump.',
            targetShotType: 'Low Angle Power Shot',
            pacingNote: 'Slow motion impact'
          },
          {
            name: 'ENDING',
            startTime: 22,
            endTime: 25,
            description: 'Exhausted triumph sit-down with brand logo overlay.',
            targetShotType: 'Medium Portrait',
            pacingNote: 'Fade to brand'
          }
        ],
        shotTypesUsed: ['Low Angle Power Shot', 'Chalk Smoke Close-up', 'Tracking Run', 'Sweat Portrait'],
        introHookStructure: 'Chalk burst with heavy metal impact sound',
        narrativeFlow: 'Focus -> Preparation -> Intense Battle -> Breakthrough -> Victory rest',
        chronologicalVsThematic: 'thematic',
        emotionalProgression: 'Focus -> Drive -> Intensity -> Triumph',
        audioPattern: 'Heavy rhythmic electronic beat with real gym acoustics',
        dialogueVsBrollRatio: '5% Heavy breathing sound / 95% Action B-roll',
        transitionTypes: ['Whip Cut', 'Flash Cut', 'Hard Cut'],
        slowMoFastPacedNotes: 'Slow-motion chalk dust burst at hook and PR lift climax',
        repeatedVisualPatterns: 'Subtle screen pulse on bass drum kicks',
        endingStructure: 'Out-of-breath smile facing camera with punchy sound effect'
      }
    },
    suggestedSettings: {
      videoLength: 'short',
      customDurationSeconds: 25,
      editingStyle: 'fast-paced',
      creativityLevel: 80,
      includeSubtitles: false,
      audioNormalization: true,
      syncCutsWithMusic: true
    },
    sourceClips: [
      {
        clip_id: 'fit_01_chalk',
        filename: 'workout_chalk.mp4',
        originalName: 'Hand Chalking Close-Up.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        duration: 8,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        description: 'Athlete clapping hands together causing a cloud of white chalk dust to burst into the air in slow motion.',
        actions: ['chalking hands', 'clapping', 'dust cloud explosion'],
        location: 'CrossFit Box Gym',
        peopleAndObjects: ['athlete hands', 'chalk bowl', 'chalk cloud'],
        speechOrDialogue: 'Focus exhale sound',
        importantSounds: ['chalk clap impact', 'heavy breath'],
        mood: 'intense',
        cameraMovement: 'Macro low tilt',
        shotType: 'Close-up detail',
        quality: 0.96,
        isDuplicateOrNearDuplicate: false,
        importance: 0.94,
        story_role: 'hook',
        inferredChronologyScore: 10,
        usable_segments: [
          { id: 'seg_fit1', startTime: 1.0, endTime: 4.2, score: 0.98, description: 'Explosive chalk cloud impact burst', recommendedRole: 'hook' }
        ]
      },
      {
        clip_id: 'fit_02_deadlift',
        filename: 'workout_deadlift.mp4',
        originalName: 'Heavy Deadlift PR Attempt.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        duration: 16,
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        description: 'Athlete straining up a 220kg barbell deadlift with intense muscle flex, locking out and shouting in victory.',
        actions: ['lifting barbell', 'locking out deadlift', 'shouting in excitement'],
        location: 'Lifting Platform',
        peopleAndObjects: ['heavy barbell', 'athlete', 'weights'],
        speechOrDialogue: '"YEAH! Let\'s go!"',
        importantSounds: ['barbell clatter', 'victory shout'],
        mood: 'triumphant',
        cameraMovement: 'Low angle push in',
        shotType: 'Low angle power shot',
        quality: 0.97,
        isDuplicateOrNearDuplicate: false,
        importance: 0.98,
        story_role: 'climax',
        inferredChronologyScore: 80,
        usable_segments: [
          { id: 'seg_fit2a', startTime: 4.0, endTime: 11.0, score: 0.97, description: 'Barbell lift to lockout strain', recommendedRole: 'main' },
          { id: 'seg_fit2b', startTime: 11.0, endTime: 15.0, score: 0.99, description: 'Victory shout and barbell drop', recommendedRole: 'climax' }
        ]
      },
      {
        clip_id: 'fit_03_ropes',
        filename: 'workout_ropes.mp4',
        originalName: 'Battle Ropes Conditioning.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 10,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        description: 'Heavy battle ropes slamming against rubber floor mats in rapid wave patterns with sweat flying.',
        actions: ['slamming ropes', 'rapid waves', 'sweating'],
        location: 'Turf Area',
        peopleAndObjects: ['heavy ropes', 'mats', 'athlete'],
        speechOrDialogue: 'Rhythmic grunt exhale',
        importantSounds: ['rope mat slaps', 'fast breathing'],
        mood: 'high energy',
        cameraMovement: 'Side tracking',
        shotType: 'Medium dynamic action',
        quality: 0.91,
        isDuplicateOrNearDuplicate: false,
        importance: 0.88,
        story_role: 'main',
        inferredChronologyScore: 50,
        usable_segments: [
          { id: 'seg_fit3', startTime: 2.0, endTime: 6.5, score: 0.92, description: 'Rapid rope wave slams', recommendedRole: 'main' }
        ]
      },
      {
        clip_id: 'fit_04_rest',
        filename: 'workout_rest.mp4',
        originalName: 'Post Workout Water Exhale.mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: 12,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        description: 'Athlete sitting on bench drinking water with satisfied, tired smile as sweat drips off chin.',
        actions: ['drinking water', 'smiling at camera', 'catching breath'],
        location: 'Gym Bench',
        peopleAndObjects: ['water bottle', 'towel', 'athlete'],
        speechOrDialogue: '"Best session of the year."',
        importantSounds: ['water sip', 'exhausted breath'],
        mood: 'satisfied',
        cameraMovement: 'Static medium portrait',
        shotType: 'Medium portrait',
        quality: 0.9,
        isDuplicateOrNearDuplicate: false,
        importance: 0.85,
        story_role: 'ending',
        inferredChronologyScore: 95,
        usable_segments: [
          { id: 'seg_fit4', startTime: 3.0, endTime: 8.5, score: 0.93, description: 'Water sip and looking up at camera with tired smile', recommendedRole: 'ending' }
        ]
      }
    ]
  }
];
