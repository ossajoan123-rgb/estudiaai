// app/api/onboarding/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const schema = z.object({
  studyHoursPerDay: z.number().min(0).max(24),

  procrastinationLevel: z.number().min(1).max(10),

  organizationLevel: z.number().min(1).max(10),

  studyMethod: z.enum([
    'POMODORO',
    'DEEP_WORK',
    'SPACED_REPETITION',
    'MIND_MAPPING',
    'ACTIVE_RECALL',
    'CORNELL_NOTES',
    'MIXED',
  ]),

  timeManagementScore: z.number().min(1).max(10),

  distractionsLevel: z.number().min(1).max(10),

  currentSemester: z.string(),

  academicGoal: z.string(),

  studySchedule: z.object({
    morning: z.boolean(),
    afternoon: z.boolean(),
    night: z.boolean(),
  }),

  currentGPA: z.number().min(0).max(5).optional(),

  stressLevel: z.number().min(1).max(10),

  anxietyLevel: z.number().min(1).max(10),

  motivationLevel: z.number().min(1).max(10),

  energyLevel: z.number().min(1).max(10),

  sleepHoursPerNight: z.number().min(0).max(24),

  academicSelfEsteem: z.number().min(1).max(10),

  learningStyle: z.enum([
    'VISUAL',
    'AUDITORY',
    'KINESTHETIC',
    'READING_WRITING',
  ]),
})

function calcAcademicRisk(d: z.infer<typeof schema>) {
  const score =
    d.procrastinationLevel * 2 +
    (10 - d.organizationLevel) +
    d.distractionsLevel +
    (d.studyHoursPerDay < 2 ? 5 : 0)

  if (score >= 30) return 'CRITICAL'

  if (score >= 20) return 'HIGH'

  if (score >= 10) return 'MEDIUM'

  return 'LOW'
}

function calcEmotionalRisk(d: z.infer<typeof schema>) {
  const score =
    d.stressLevel * 1.5 +
    d.anxietyLevel * 1.5 +
    (10 - d.motivationLevel) +
    (10 - d.energyLevel) +
    (d.sleepHoursPerNight < 6 ? 5 : 0)

  if (score >= 40) return 'CRITICAL'

  if (score >= 25) return 'HIGH'

  if (score >= 15) return 'MEDIUM'

  return 'LOW'
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: 'No autorizado',
        },
        {
          status: 401,
        }
      )
    }

    const body = await req.json()

    const data = schema.parse(body)

    // =========================================
    // BUSCAR O CREAR USUARIO
    // =========================================

    let dbUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || '',
          image: session.user.image || '',
        },
      })
    }

    const academicRisk = calcAcademicRisk(data)

    const emotionalRisk = calcEmotionalRisk(data)

    // =========================================
    // ONBOARDING
    // =========================================

    await prisma.onboardingData.upsert({
      where: {
        userId: dbUser.id,
      },

      update: {
        studyHoursPerDay: data.studyHoursPerDay,

        procrastinationLevel: data.procrastinationLevel,

        organizationLevel: data.organizationLevel,

        studyMethod: data.studyMethod,

        timeManagementScore: data.timeManagementScore,

        distractionsLevel: data.distractionsLevel,

        currentSemester: data.currentSemester,

        academicGoal: data.academicGoal,

        studySchedule: data.studySchedule as Prisma.JsonObject,

        currentGPA: data.currentGPA,

        stressLevel: data.stressLevel,

        anxietyLevel: data.anxietyLevel,

        motivationLevel: data.motivationLevel,

        energyLevel: data.energyLevel,

        sleepHoursPerNight: data.sleepHoursPerNight,

        academicSelfEsteem: data.academicSelfEsteem,

        learningStyle: data.learningStyle,
      },

      create: {
        userId: dbUser.id,

        studyHoursPerDay: data.studyHoursPerDay,

        procrastinationLevel: data.procrastinationLevel,

        organizationLevel: data.organizationLevel,

        studyMethod: data.studyMethod,

        timeManagementScore: data.timeManagementScore,

        distractionsLevel: data.distractionsLevel,

        currentSemester: data.currentSemester,

        academicGoal: data.academicGoal,

        studySchedule: data.studySchedule as Prisma.JsonObject,

        currentGPA: data.currentGPA,

        stressLevel: data.stressLevel,

        anxietyLevel: data.anxietyLevel,

        motivationLevel: data.motivationLevel,

        energyLevel: data.energyLevel,

        sleepHoursPerNight: data.sleepHoursPerNight,

        academicSelfEsteem: data.academicSelfEsteem,

        learningStyle: data.learningStyle,
      },
    })

    // =========================================
    // UPDATE USER
    // =========================================

    await prisma.user.update({
      where: {
        id: dbUser.id,
      },

      data: {
        onboardingCompleted: true,

        learningStyle: data.learningStyle,

        studyHoursGoal: Math.ceil(data.studyHoursPerDay),

        academicRiskLevel: academicRisk as any,

        emotionalRiskLevel: emotionalRisk as any,
      },
    })

    return NextResponse.json({
      success: true,
      academicRisk,
      emotionalRisk,
    })
  } catch (error) {
    console.error('[ONBOARDING ERROR]', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors,
        },
        {
          status: 422,
        }
      )
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
      },
      {
        status: 500,
      }
    )
  }
}