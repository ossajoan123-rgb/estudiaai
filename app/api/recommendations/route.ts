// app/api/recommendations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const recs = await prisma.recommendation.findMany({
    where: { userId: session.user.id, isDismissed: false },
    orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ recommendations: recs })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, action } = await req.json()
  const data = action === 'dismiss' ? { isDismissed: true } : { isRead: true }

  await prisma.recommendation.updateMany({
    where: { id, userId: session.user.id },
    data,
  })
  return NextResponse.json({ ok: true })
}
