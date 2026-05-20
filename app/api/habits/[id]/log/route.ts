// app/api/habits/[id]/log/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params

  const habit = await prisma.habit.findFirst({ where: { id, userId: session.user.id } })
  if (!habit) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  // Check if already logged today
  const existing = await prisma.habitLog.findFirst({
    where: { habitId: id, completedAt: { gte: todayStart, lte: todayEnd } }
  })

  if (existing) {
    // Undo - delete the log
    await prisma.habitLog.delete({ where: { id: existing.id } })
    await prisma.habit.update({
      where: { id },
      data: { currentStreak: Math.max(0, habit.currentStreak - 1) }
    })
    return NextResponse.json({ logged: false })
  }

  // Log it
  const body = await req.json().catch(() => ({}))
  await prisma.habitLog.create({
    data: { habitId: id, userId: session.user.id, completedAt: now, notes: body.notes, mood: body.mood }
  })

  // Update streak
  const newStreak = habit.currentStreak + 1
  await prisma.habit.update({
    where: { id },
    data: {
      currentStreak: newStreak,
      bestStreak: Math.max(habit.bestStreak, newStreak),
      totalCompletions: habit.totalCompletions + 1,
    }
  })

  return NextResponse.json({ logged: true, streak: newStreak })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  await prisma.habit.updateMany({ where: { id, userId: session.user.id }, data: { isActive: false } })
  return NextResponse.json({ ok: true })
}
