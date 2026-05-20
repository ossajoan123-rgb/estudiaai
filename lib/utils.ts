// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatGrade(score: number, maxScore: number): number {
  return Math.round((score / maxScore) * 5 * 100) / 100
}

export function calcWeightedAverage(grades: Array<{ score: number; maxScore: number; weight: number }>): number | null {
  if (!grades.length) return null
  const totalWeight = grades.reduce((s, g) => s + g.weight, 0)
  if (totalWeight === 0) return null
  return grades.reduce((s, g) => s + formatGrade(g.score, g.maxScore) * (g.weight / totalWeight), 0)
}

export function calcNeededScore(grades: Array<{ score: number; maxScore: number; weight: number }>, target: number): number | null {
  const usedWeight = grades.reduce((s, g) => s + g.weight, 0)
  const remaining = 100 - usedWeight
  if (remaining <= 0) return null
  const currentWeighted = grades.reduce((s, g) => s + formatGrade(g.score, g.maxScore) * g.weight, 0)
  const needed = (target * 100 - currentWeighted) / remaining
  return Math.min(5, Math.max(0, needed))
}

export function getRiskColor(level: string): string {
  const colors: Record<string, string> = {
    LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444'
  }
  return colors[level] ?? '#6366f1'
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: '#6366f1', MEDIUM: '#f59e0b', HIGH: '#f97316', URGENT: '#ef4444'
  }
  return colors[priority] ?? '#6366f1'
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '⭕'
  if (streak < 3) return '🌱'
  if (streak < 7) return '🔥'
  if (streak < 14) return '💫'
  if (streak < 30) return '⚡'
  return '🏆'
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.substring(0, len) + '...'
}
