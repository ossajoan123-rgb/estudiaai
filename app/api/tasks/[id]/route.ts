// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: Record<string, unknown> = { ...body }
  if (body.status === 'COMPLETED') data.completedAt = new Date()
  const task = await prisma.task.updateMany({ where: { id, userId: session.user.id }, data })
  return NextResponse.json({ task })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  await prisma.task.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ ok: true })
}
