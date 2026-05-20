// app/dashboard/page.tsx
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { subDays, startOfWeek, endOfWeek } from 'date-fns'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [user, subjects, tasks, habits, checkins, recommendations, achievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, studyHoursGoal: true, academicRiskLevel: true, emotionalRiskLevel: true, createdAt: true },
    }),
    prisma.subject.findMany({
      where: { userId, isActive: true },
      include: { grades: true, tasks: { where: { status: 'PENDING' } } },
    }),
    prisma.task.findMany({
      where: { userId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
      take: 5,
      include: { subject: { select: { name: true, color: true } } },
    }),
    prisma.habit.findMany({
      where: { userId, isActive: true },
      include: {
        logs: {
          where: {
            completedAt: { gte: subDays(now, 7) }
          }
        }
      },
    }),
    prisma.emotionalCheckin.findMany({
      where: { userId, date: { gte: subDays(now, 14) } },
      orderBy: { date: 'desc' },
      take: 14,
    }),
    prisma.recommendation.findMany({
      where: { userId, isRead: false, isDismissed: false },
      orderBy: { priority: 'asc' },
      take: 3,
    }),
    prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
      take: 3,
    }),
  ])

  // Calculate GPA
  const calculateSubjectAvg = (grades: Array<{ score: number; maxScore: number; weight: number }>) => {
    if (!grades.length) return null
    const totalWeight = grades.reduce((s, g) => s + g.weight, 0)
    if (totalWeight === 0) return null
    return grades.reduce((s, g) => s + (g.score / g.maxScore) * 5 * (g.weight / totalWeight), 0)
  }

  const subjectsWithAvg = subjects.map(s => ({
    ...s,
    currentAvg: calculateSubjectAvg(s.grades),
    pendingTasks: s.tasks.length,
  }))

  const overallGPA = subjectsWithAvg.reduce((sum, s, _, arr) => {
    if (s.currentAvg === null) return sum
    return sum + s.currentAvg / arr.filter(x => x.currentAvg !== null).length
  }, 0)

  // Study stats this week (mock from sessions)
  const studySessions = await prisma.studySession.findMany({
    where: { userId, startTime: { gte: weekStart, lte: weekEnd } },
  })

  const weeklyStudyMinutes = studySessions.reduce((sum, s) => sum + (s.duration ?? 0), 0)

  // Today's checkin
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayCheckin = await prisma.emotionalCheckin.findFirst({
    where: { userId, date: { gte: todayStart } },
    orderBy: { date: 'desc' },
  })

  // Habit streak (max of active habits)
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak)) : 0

  const dashData = {
    user: user!,
    subjectsWithAvg,
    overallGPA,
    weeklyStudyHours: Math.round(weeklyStudyMinutes / 60 * 10) / 10,
    totalTasks: tasks.length,
    tasks: tasks.map(t => ({
      ...t,
      dueDate: t.dueDate?.toISOString() ?? null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      completedAt: t.completedAt?.toISOString() ?? null,
    })),
    habits: habits.map(h => ({
      ...h,
      targetDays: h.targetDays as number[],
      createdAt: h.createdAt.toISOString(),
      updatedAt: h.updatedAt.toISOString(),
      logs: h.logs.map(l => ({ ...l, completedAt: l.completedAt.toISOString() })),
    })),
    maxStreak,
    checkins: checkins.map(c => ({ ...c, date: c.date.toISOString(), createdAt: c.createdAt.toISOString() })),
    todayCheckin: todayCheckin ? { ...todayCheckin, date: todayCheckin.date.toISOString(), createdAt: todayCheckin.createdAt.toISOString() } : null,
    recommendations: recommendations.map(r => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      expiresAt: r.expiresAt?.toISOString() ?? null,
    })),
    achievements: achievements.map(a => ({ ...a, unlockedAt: a.unlockedAt.toISOString() })),
  }

  return <DashboardClient data={dashData} />
}
