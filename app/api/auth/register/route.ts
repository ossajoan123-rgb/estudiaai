// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese correo.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos.', details: error.errors }, { status: 422 })
    }
    console.error('[REGISTER]', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
