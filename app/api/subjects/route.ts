// app/api/subjects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().optional(),
  teacher: z.string().optional(),
  credits: z.number().min(1).max(20).default(3),
  color: z.string().default('#6366f1'),
  semester: z.string().default('2025-1'),
  targetGrade: z.number().min(0).max(5).default(4.0),
  minGrade: z.number().min(0).max(5).default(3.0),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const subjects = await prisma.subject.findMany({
    where: { userId: session.user.id, isActive: true },
    include: { grades: { orderBy: { gradedAt: 'desc' } }, tasks: { where: { status: { in: ['PENDING','IN_PROGRESS'] } } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ subjects })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const subject = await prisma.subject.create({ data: { ...body, userId: session.user.id } })
    return NextResponse.json({ subject }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
