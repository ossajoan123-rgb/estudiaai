// app/api/subjects/[id]/grades/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  score: z.number().min(0),
  maxScore: z.number().min(0.1).default(5),
  weight: z.number().min(0).max(100),
  type: z.enum(['EXAM','QUIZ','HOMEWORK','PROJECT','PARTICIPATION','MIDTERM','FINAL','OTHER']).default('EXAM'),
  gradedAt: z.string().transform(s => new Date(s)),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  // Verify subject ownership
  const subject = await prisma.subject.findFirst({ where: { id, userId: session.user.id } })
  if (!subject) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  try {
    const body = schema.parse(await req.json())
    const grade = await prisma.grade.create({ data: { ...body, subjectId: id } })
    return NextResponse.json({ grade }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Datos inválidos', details: e.errors }, { status: 422 })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const grades = await prisma.grade.findMany({ where: { subjectId: id }, orderBy: { gradedAt: 'desc' } })
  return NextResponse.json({ grades })
}
