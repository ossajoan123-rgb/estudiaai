// types/index.ts

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type Mood = 'VERY_BAD' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD'
export type LearningStyle = 'VISUAL' | 'AUDITORY' | 'KINESTHETIC' | 'READING_WRITING'
export type HabitCategory = 'STUDY' | 'HEALTH' | 'SLEEP' | 'MINDFULNESS' | 'ORGANIZATION' | 'SOCIAL' | 'OTHER'
export type SubjectStatus = 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'WITHDRAWN'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED'
export type GradeType = 'EXAM' | 'QUIZ' | 'HOMEWORK' | 'PROJECT' | 'PARTICIPATION' | 'MIDTERM' | 'FINAL' | 'OTHER'
export type RecommendationType = 'ACADEMIC' | 'EMOTIONAL' | 'HABIT' | 'PRODUCTIVITY' | 'ALERT' | 'ACHIEVEMENT' | 'SYSTEM'

export interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  onboardingCompleted: boolean
  learningStyle: LearningStyle | null
  academicRiskLevel: RiskLevel
  emotionalRiskLevel: RiskLevel
  studyHoursGoal: number
  createdAt: string
}

export interface SubjectWithStats {
  id: string
  name: string
  code: string | null
  teacher: string | null
  credits: number
  color: string
  semester: string
  targetGrade: number
  minGrade: number
  status: SubjectStatus
  grades: GradeRecord[]
  currentAvg: number | null
  neededScore: number | null
  pendingTasks: number
}

export interface GradeRecord {
  id: string
  name: string
  score: number
  maxScore: number
  weight: number
  type: GradeType
  gradedAt: string
  notes: string | null
}

export interface TaskRecord {
  id: string
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  status: TaskStatus
  type: string
  estimatedMinutes: number | null
  subject: { name: string; color: string } | null
}

export interface HabitRecord {
  id: string
  name: string
  description: string | null
  category: HabitCategory
  icon: string
  color: string
  currentStreak: number
  bestStreak: number
  totalCompletions: number
  targetDays: number[]
  isSystemSuggested: boolean
  logs: { id: string; completedAt: string }[]
}

export interface CheckinRecord {
  id: string
  mood: Mood
  stressLevel: number
  energyLevel: number
  motivation: number
  anxiety: number
  notes: string | null
  date: string
}

export interface RecommendationRecord {
  id: string
  type: RecommendationType
  title: string
  body: string
  priority: Priority
  isRead: boolean
  isDismissed: boolean
  createdAt: string
  expiresAt: string | null
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  details?: unknown
}

export const MOOD_CONFIG: Record<Mood, { emoji: string; label: string; color: string; value: number }> = {
  VERY_BAD: { emoji: '😢', label: 'Muy mal', color: '#ef4444', value: 1 },
  BAD:      { emoji: '😔', label: 'Mal',     color: '#f97316', value: 2 },
  NEUTRAL:  { emoji: '😐', label: 'Neutral', color: '#f59e0b', value: 3 },
  GOOD:     { emoji: '🙂', label: 'Bien',    color: '#6ee7b7', value: 4 },
  VERY_GOOD:{ emoji: '😄', label: 'Muy bien',color: '#10b981', value: 5 },
}

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  LOW:      { label: 'Bajo',     color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  MEDIUM:   { label: 'Medio',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  HIGH:     { label: 'Alto',    color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  CRITICAL: { label: 'Crítico', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}
