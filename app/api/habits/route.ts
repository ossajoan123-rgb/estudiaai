// app/api/habits/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { subDays, startOfDay } from 'date-fns'

const schema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.enum(['STUDY','HEALTH','SLEEP','MINDFULNESS','ORGANIZATION','SOCIAL','OTHER']),
  icon: z.string().default('✨'),
  color: z.string().default('#6366f1'),
  frequency: z.enum(['DAILY','WEEKDAYS','WEEKENDS','CUSTOM']).default('DAILY'),
  targetDays: z.array(z.number()).default([1,2,3,4,5]),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id, isActive: true },
    include: {
      logs: {
        where: { completedAt: { gte: subDays(new Date(), 30) } },
        orderBy: { completedAt: 'desc' },
      }
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ habits })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const habit = await prisma.habit.create({ data: { ...body, userId: session.user.id } })
    return NextResponse.json({ habit }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
