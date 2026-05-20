// app/api/checkin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { subDays } from 'date-fns'

const schema = z.object({
  mood: z.enum(['VERY_BAD','BAD','NEUTRAL','GOOD','VERY_GOOD']),
  stressLevel: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  motivation: z.number().min(1).max(10),
  anxiety: z.number().min(1).max(10).default(5),
  notes: z.string().optional(),
  triggers: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const checkin = await prisma.emotionalCheckin.create({
      data: { ...body, userId: session.user.id }
    })

    // Auto-generate recommendation if stress is very high
    if (body.stressLevel >= 8) {
      await prisma.recommendation.create({
        data: {
          userId: session.user.id,
          type: 'EMOTIONAL',
          title: '🧘 Tu estrés está muy alto hoy',
          body: 'Registraste un nivel de estrés de ' + body.stressLevel + '/10. Considera tomar un descanso activo de 10 minutos: camina, estira o practica respiración profunda. Tu rendimiento académico mejora cuando cuidas tu bienestar.',
          priority: 'HIGH',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
      }).catch(() => {})
    }

    return NextResponse.json({ checkin }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')

  const checkins = await prisma.emotionalCheckin.findMany({
    where: { userId: session.user.id, date: { gte: subDays(new Date(), days) } },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json({ checkins })
}
