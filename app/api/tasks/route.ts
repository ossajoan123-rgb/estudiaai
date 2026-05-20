// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.string().optional().transform(s => s ? new Date(s) : undefined),
  priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).default('MEDIUM'),
  status: z.enum(['PENDING','IN_PROGRESS','COMPLETED','OVERDUE','CANCELLED']).default('PENDING'),
  type: z.enum(['HOMEWORK','EXAM_PREP','PROJECT','READING','PRACTICE','OTHER']).default('HOMEWORK'),
  subjectId: z.string().optional(),
  estimatedMinutes: z.number().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, status: { notIn: ['COMPLETED','CANCELLED'] } },
    include: { subject: { select: { name: true, color: true } } },
    orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
  })
  return NextResponse.json({ tasks })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const body = schema.parse(await req.json())
    const task = await prisma.task.create({ data: { ...body, userId: session.user.id } })
    return NextResponse.json({ task }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos' }, { status: 422 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
