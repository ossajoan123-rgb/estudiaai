// app/api/stats/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { subDays, startOfWeek, endOfWeek, format } from 'date-fns'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const userId = session.user.id
  const now = new Date()

  const [subjects, tasks, habits, checkins, studySessions] = await Promise.all([
    prisma.subject.findMany({
      where: { userId, isActive: true },
      include: { grades: true },
    }),
    prisma.task.findMany({ where: { userId }, select: { status: true, completedAt: true } }),
    prisma.habit.findMany({
      where: { userId, isActive: true },
      include: { logs: { where: { completedAt: { gte: subDays(now, 30) } } } },
    }),
    prisma.emotionalCheckin.findMany({
      where: { userId, date: { gte: subDays(now, 30) } },
      orderBy: { date: 'asc' },
    }),
    prisma.studySession.findMany({
      where: { userId, startTime: { gte: subDays(now, 30) } },
    }),
  ])

  // GPA calculation
  const calcAvg = (grades: Array<{ score: number; maxScore: number; weight: number }>) => {
    const total = grades.reduce((s, g) => s + g.weight, 0)
    if (!total) return null
    return grades.reduce((s, g) => s + (g.score / g.maxScore) * 5 * (g.weight / total), 0)
  }

  const subjectStats = subjects.map(s => ({
    id: s.id, name: s.name, color: s.color,
    avg: calcAvg(s.grades), targetGrade: s.targetGrade,
  }))

  const overallGPA = subjectStats.filter(s => s.avg !== null).reduce((sum, s, _, arr) =>
    sum + (s.avg! / arr.length), 0)

  // Task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    overdue: tasks.filter(t => t.status === 'OVERDUE').length,
  }

  // Habit stats
  const habitStats = habits.map(h => ({
    id: h.id, name: h.name, icon: h.icon, color: h.color,
    streak: h.currentStreak, best: h.bestStreak, total: h.totalCompletions,
    completionRate: h.logs.length > 0 ? (h.logs.length / 30) * 100 : 0,
  }))

  // Mood trend
  const moodValues: Record<string, number> = { VERY_BAD: 1, BAD: 2, NEUTRAL: 3, GOOD: 4, VERY_GOOD: 5 }
  const moodTrend = checkins.map(c => ({
    date: format(new Date(c.date), 'dd/MM'),
    mood: moodValues[c.mood] ?? 3,
    stress: c.stressLevel,
    energy: c.energyLevel,
    motivation: c.motivation,
  }))

  // Study hours
  const totalStudyMinutes = studySessions.reduce((s, ss) => s + (ss.duration ?? 0), 0)

  return NextResponse.json({
    overallGPA,
    subjectStats,
    taskStats,
    habitStats,
    moodTrend,
    totalStudyHours: Math.round(totalStudyMinutes / 60 * 10) / 10,
    activeHabits: habits.length,
    longestStreak: habits.reduce((m, h) => Math.max(m, h.currentStreak), 0),
  })
}
