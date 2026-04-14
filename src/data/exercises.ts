import type { Exercise } from '../types'

export const preloadedExercises: Exercise[] = [
  // PUSH
  { id: 'ex-push-01', name: 'Push-up', muscleGroups: ['chest', 'triceps', 'shoulders'], movementType: 'push', difficulty: 'beginner', isCustom: false },
  { id: 'ex-push-02', name: 'Diamond Push-up', muscleGroups: ['triceps', 'chest'], movementType: 'push', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-push-03', name: 'Wide Push-up', muscleGroups: ['chest', 'shoulders'], movementType: 'push', difficulty: 'beginner', isCustom: false },
  { id: 'ex-push-04', name: 'Archer Push-up', muscleGroups: ['chest', 'triceps', 'shoulders'], movementType: 'push', difficulty: 'advanced', isCustom: false },
  { id: 'ex-push-05', name: 'Pike Push-up', muscleGroups: ['shoulders', 'triceps'], movementType: 'push', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-push-06', name: 'Pseudo Planche Push-up', muscleGroups: ['shoulders', 'chest', 'triceps'], movementType: 'push', difficulty: 'advanced', isCustom: false },
  { id: 'ex-push-07', name: 'Dips', muscleGroups: ['chest', 'triceps', 'shoulders'], movementType: 'push', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-push-08', name: 'Korean Dip', muscleGroups: ['chest', 'triceps', 'shoulders'], movementType: 'push', difficulty: 'advanced', isCustom: false },
  { id: 'ex-push-09', name: 'Ring Push-up', muscleGroups: ['chest', 'triceps', 'core'], movementType: 'push', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-push-10', name: 'Handstand Push-up (wall)', muscleGroups: ['shoulders', 'triceps'], movementType: 'push', difficulty: 'advanced', isCustom: false },
  { id: 'ex-push-11', name: 'Handstand Push-up (freestanding)', muscleGroups: ['shoulders', 'triceps', 'core'], movementType: 'push', difficulty: 'advanced', isCustom: false },

  // PULL
  { id: 'ex-pull-01', name: 'Pull-up', muscleGroups: ['lats', 'biceps', 'forearms'], movementType: 'pull', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-pull-02', name: 'Chin-up', muscleGroups: ['biceps', 'lats'], movementType: 'pull', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-pull-03', name: 'Neutral Grip Pull-up', muscleGroups: ['lats', 'biceps', 'forearms'], movementType: 'pull', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-pull-04', name: 'Wide Pull-up', muscleGroups: ['lats', 'rear delts'], movementType: 'pull', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-pull-05', name: 'Archer Pull-up', muscleGroups: ['lats', 'biceps'], movementType: 'pull', difficulty: 'advanced', isCustom: false },
  { id: 'ex-pull-06', name: 'Commando Pull-up', muscleGroups: ['lats', 'biceps', 'core'], movementType: 'pull', difficulty: 'advanced', isCustom: false },
  { id: 'ex-pull-07', name: 'Muscle-up (bar)', muscleGroups: ['lats', 'chest', 'triceps'], movementType: 'pull', difficulty: 'advanced', isCustom: false },
  { id: 'ex-pull-08', name: 'Muscle-up (rings)', muscleGroups: ['lats', 'chest', 'triceps', 'core'], movementType: 'pull', difficulty: 'advanced', isCustom: false },
  { id: 'ex-pull-09', name: 'Ring Row', muscleGroups: ['lats', 'biceps', 'rear delts'], movementType: 'pull', difficulty: 'beginner', isCustom: false },
  { id: 'ex-pull-10', name: 'Australian Pull-up', muscleGroups: ['lats', 'biceps', 'rear delts'], movementType: 'pull', difficulty: 'beginner', isCustom: false },
  { id: 'ex-pull-11', name: 'Face Pull (rings)', muscleGroups: ['rear delts', 'traps', 'rotator cuff'], movementType: 'pull', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-pull-12', name: 'Dead Hang', muscleGroups: ['forearms', 'shoulders'], movementType: 'pull', difficulty: 'beginner', isCustom: false },
  { id: 'ex-pull-13', name: 'Band-assisted Pull-up', muscleGroups: ['lats', 'biceps'], movementType: 'pull', difficulty: 'beginner', isCustom: false },

  // LEGS
  { id: 'ex-legs-01', name: 'Squat', muscleGroups: ['quads', 'glutes'], movementType: 'squat', difficulty: 'beginner', isCustom: false },
  { id: 'ex-legs-02', name: 'Bulgarian Split Squat', muscleGroups: ['quads', 'glutes', 'hamstrings'], movementType: 'squat', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-legs-03', name: 'Pistol Squat', muscleGroups: ['quads', 'glutes', 'core'], movementType: 'squat', difficulty: 'advanced', isCustom: false },
  { id: 'ex-legs-04', name: 'Shrimp Squat', muscleGroups: ['quads', 'glutes'], movementType: 'squat', difficulty: 'advanced', isCustom: false },
  { id: 'ex-legs-05', name: 'Jump Squat', muscleGroups: ['quads', 'glutes', 'calves'], movementType: 'squat', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-legs-06', name: 'Lunge', muscleGroups: ['quads', 'glutes', 'hamstrings'], movementType: 'squat', difficulty: 'beginner', isCustom: false },
  { id: 'ex-legs-07', name: 'Nordic Curl', muscleGroups: ['hamstrings'], movementType: 'hinge', difficulty: 'advanced', isCustom: false },
  { id: 'ex-legs-08', name: 'Glute Bridge', muscleGroups: ['glutes', 'hamstrings'], movementType: 'hinge', difficulty: 'beginner', isCustom: false },
  { id: 'ex-legs-09', name: 'Single-Leg Glute Bridge', muscleGroups: ['glutes', 'hamstrings'], movementType: 'hinge', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-legs-10', name: 'Calf Raise', muscleGroups: ['calves'], movementType: 'squat', difficulty: 'beginner', isCustom: false },
  { id: 'ex-legs-11', name: 'Step-up', muscleGroups: ['quads', 'glutes'], movementType: 'squat', difficulty: 'beginner', isCustom: false },

  // CORE
  { id: 'ex-core-01', name: 'Hollow Body Hold', muscleGroups: ['abs', 'hip flexors'], movementType: 'core', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-core-02', name: 'L-Sit', muscleGroups: ['abs', 'hip flexors', 'triceps'], movementType: 'core', difficulty: 'advanced', isCustom: false },
  { id: 'ex-core-03', name: 'Tuck L-Sit', muscleGroups: ['abs', 'hip flexors'], movementType: 'core', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-core-04', name: 'Dragon Flag', muscleGroups: ['abs', 'obliques'], movementType: 'core', difficulty: 'advanced', isCustom: false },
  { id: 'ex-core-05', name: 'Ab Wheel Rollout', muscleGroups: ['abs', 'lats', 'shoulders'], movementType: 'core', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-core-06', name: 'Hanging Knee Raise', muscleGroups: ['abs', 'hip flexors'], movementType: 'core', difficulty: 'beginner', isCustom: false },
  { id: 'ex-core-07', name: 'Hanging Leg Raise', muscleGroups: ['abs', 'hip flexors'], movementType: 'core', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-core-08', name: 'Toes to Bar', muscleGroups: ['abs', 'hip flexors', 'lats'], movementType: 'core', difficulty: 'advanced', isCustom: false },
  { id: 'ex-core-09', name: 'Plank', muscleGroups: ['abs', 'obliques', 'shoulders'], movementType: 'core', difficulty: 'beginner', isCustom: false },
  { id: 'ex-core-10', name: 'Side Plank', muscleGroups: ['obliques', 'abs'], movementType: 'core', difficulty: 'beginner', isCustom: false },
  { id: 'ex-core-11', name: 'Windshield Wiper', muscleGroups: ['obliques', 'abs'], movementType: 'core', difficulty: 'advanced', isCustom: false },

  // SKILLS
  { id: 'ex-skill-01', name: 'Planche Lean', muscleGroups: ['shoulders', 'chest', 'core'], movementType: 'skill', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-skill-02', name: 'Tuck Planche', muscleGroups: ['shoulders', 'chest', 'core'], movementType: 'skill', difficulty: 'advanced', isCustom: false },
  { id: 'ex-skill-03', name: 'Front Lever (tuck)', muscleGroups: ['lats', 'core', 'shoulders'], movementType: 'skill', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-skill-04', name: 'Front Lever (full)', muscleGroups: ['lats', 'core', 'shoulders'], movementType: 'skill', difficulty: 'advanced', isCustom: false },
  { id: 'ex-skill-05', name: 'Back Lever', muscleGroups: ['shoulders', 'biceps', 'core'], movementType: 'skill', difficulty: 'advanced', isCustom: false },
  { id: 'ex-skill-06', name: 'Handstand Hold', muscleGroups: ['shoulders', 'core', 'triceps'], movementType: 'skill', difficulty: 'intermediate', isCustom: false },
  { id: 'ex-skill-07', name: 'Crow Pose', muscleGroups: ['shoulders', 'core', 'wrists'], movementType: 'skill', difficulty: 'beginner', isCustom: false },
  { id: 'ex-skill-08', name: 'Human Flag', muscleGroups: ['obliques', 'lats', 'shoulders'], movementType: 'skill', difficulty: 'advanced', isCustom: false },
  { id: 'ex-skill-09', name: 'Pseudo Planche Lean', muscleGroups: ['shoulders', 'chest', 'wrists'], movementType: 'skill', difficulty: 'intermediate', isCustom: false },
]
