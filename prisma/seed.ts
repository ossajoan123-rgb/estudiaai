// prisma/seed.ts
import { PrismaClient, LearningStyle, StudyMethod, Mood, HabitCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@estudiaai.com' },
    update: {},
    create: {
      name: 'Sofía Martínez',
      email: 'demo@estudiaai.com',
      password: hashedPassword,
      onboardingCompleted: true,
      learningStyle: LearningStyle.VISUAL,
      studyHoursGoal: 6,
      onboardingData: {
        create: {
          studyHoursPerDay: 4,
          procrastinationLevel: 6,
          organizationLevel: 5,
          studyMethod: StudyMethod.POMODORO,
          timeManagementScore: 5,
          distractionsLevel: 7,
          currentSemester: '2025-1',
          academicGoal: 'Mantener promedio por encima de 4.0',
          studySchedule: { morning: false, afternoon: true, night: true },
          currentGPA: 3.8,
          stressLevel: 6,
          anxietyLevel: 5,
          motivationLevel: 7,
          energyLevel: 6,
          sleepHoursPerNight: 6.5,
          academicSelfEsteem: 6,
        }
      }
    },
  })

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        userId: user.id,
        name: 'Cálculo Diferencial',
        code: 'MAT101',
        teacher: 'Prof. Rodríguez',
        credits: 4,
        color: '#EF4444',
        semester: '2025-1',
        targetGrade: 4.0,
        minGrade: 3.0,
        grades: {
          create: [
            { name: 'Parcial 1', score: 3.5, maxScore: 5, weight: 30, type: 'EXAM', gradedAt: new Date('2025-02-20') },
            { name: 'Tarea 1', score: 4.5, maxScore: 5, weight: 10, type: 'HOMEWORK', gradedAt: new Date('2025-02-10') },
            { name: 'Quiz 1', score: 3.0, maxScore: 5, weight: 10, type: 'QUIZ', gradedAt: new Date('2025-03-01') },
          ]
        }
      }
    }),
    prisma.subject.create({
      data: {
        userId: user.id,
        name: 'Programación I',
        code: 'SIS101',
        teacher: 'Prof. García',
        credits: 3,
        color: '#6366F1',
        semester: '2025-1',
        targetGrade: 4.5,
        minGrade: 3.0,
        grades: {
          create: [
            { name: 'Proyecto 1', score: 4.8, maxScore: 5, weight: 25, type: 'PROJECT', gradedAt: new Date('2025-02-28') },
            { name: 'Parcial 1', score: 4.2, maxScore: 5, weight: 30, type: 'EXAM', gradedAt: new Date('2025-03-05') },
          ]
        }
      }
    }),
    prisma.subject.create({
      data: {
        userId: user.id,
        name: 'Física I',
        code: 'FIS101',
        teacher: 'Prof. López',
        credits: 4,
        color: '#F59E0B',
        semester: '2025-1',
        targetGrade: 3.8,
        minGrade: 3.0,
        grades: {
          create: [
            { name: 'Parcial 1', score: 3.2, maxScore: 5, weight: 30, type: 'EXAM', gradedAt: new Date('2025-02-18') },
            { name: 'Laboratorio 1', score: 4.0, maxScore: 5, weight: 15, type: 'PROJECT', gradedAt: new Date('2025-02-25') },
          ]
        }
      }
    }),
    prisma.subject.create({
      data: {
        userId: user.id,
        name: 'Inglés II',
        code: 'ING102',
        teacher: 'Prof. Williams',
        credits: 2,
        color: '#10B981',
        semester: '2025-1',
        targetGrade: 4.5,
        minGrade: 3.5,
        grades: {
          create: [
            { name: 'Speaking Test', score: 4.7, maxScore: 5, weight: 20, type: 'EXAM', gradedAt: new Date('2025-03-03') },
            { name: 'Writing Task', score: 4.5, maxScore: 5, weight: 20, type: 'HOMEWORK', gradedAt: new Date('2025-02-22') },
          ]
        }
      }
    }),
  ])

  // Create habits
  await Promise.all([
    prisma.habit.create({
      data: {
        userId: user.id,
        name: 'Técnica Pomodoro',
        description: '4 sesiones de 25 minutos con descansos de 5 min',
        category: HabitCategory.STUDY,
        icon: '🍅',
        color: '#EF4444',
        currentStreak: 5,
        bestStreak: 12,
        totalCompletions: 23,
        targetDays: [1, 2, 3, 4, 5],
        isSystemSuggested: true,
      }
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        name: 'Dormir 7-8 horas',
        description: 'Acostarse antes de las 11pm y levantarse a las 6am',
        category: HabitCategory.SLEEP,
        icon: '😴',
        color: '#6366F1',
        currentStreak: 3,
        bestStreak: 8,
        totalCompletions: 15,
        targetDays: [1, 2, 3, 4, 5, 6, 7],
        isSystemSuggested: true,
      }
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        name: 'Repaso activo 20 min',
        description: 'Revisar notas del día sin mirarlas y escribir lo que recuerdas',
        category: HabitCategory.STUDY,
        icon: '📝',
        color: '#F59E0B',
        currentStreak: 7,
        bestStreak: 7,
        totalCompletions: 18,
        targetDays: [1, 2, 3, 4, 5],
      }
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        name: 'Ejercicio 30 min',
        description: 'Actividad física para reducir el estrés',
        category: HabitCategory.HEALTH,
        icon: '🏃',
        color: '#10B981',
        currentStreak: 2,
        bestStreak: 14,
        totalCompletions: 30,
        targetDays: [1, 3, 5],
      }
    }),
    prisma.habit.create({
      data: {
        userId: user.id,
        name: 'Meditación 10 min',
        description: 'Respiración profunda y mindfulness antes de estudiar',
        category: HabitCategory.MINDFULNESS,
        icon: '🧘',
        color: '#8B5CF6',
        currentStreak: 4,
        bestStreak: 9,
        totalCompletions: 12,
        targetDays: [1, 2, 3, 4, 5, 6, 7],
        isSystemSuggested: true,
      }
    }),
  ])

  // Create tasks
  await Promise.all([
    prisma.task.create({
      data: {
        userId: user.id,
        subjectId: subjects[0].id,
        title: 'Talleres de integrales - Capítulo 5',
        description: 'Ejercicios 5.1 al 5.30 del libro guía',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'HIGH',
        status: 'PENDING',
        type: 'HOMEWORK',
        estimatedMinutes: 120,
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        subjectId: subjects[1].id,
        title: 'Proyecto: Aplicación CRUD en Python',
        description: 'Desarrollar sistema de gestión de estudiantes con SQLite',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        type: 'PROJECT',
        estimatedMinutes: 480,
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        subjectId: subjects[2].id,
        title: 'Informe de laboratorio - Cinemática',
        description: 'Redactar informe de la práctica de movimiento rectilíneo',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'URGENT',
        status: 'PENDING',
        type: 'HOMEWORK',
        estimatedMinutes: 90,
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        title: 'Estudiar para parcial de Cálculo',
        description: 'Repasar derivadas, límites e integrales',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'URGENT',
        status: 'PENDING',
        type: 'EXAM_PREP',
        estimatedMinutes: 300,
        subjectId: subjects[0].id,
      }
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        title: 'Leer capítulo 3 de Física - Dinámica',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        priority: 'MEDIUM',
        status: 'PENDING',
        type: 'READING',
        estimatedMinutes: 60,
        subjectId: subjects[2].id,
      }
    }),
  ])

  // Create emotional check-ins for the last 14 days
  const moods: Mood[] = ['NEUTRAL', 'GOOD', 'BAD', 'GOOD', 'VERY_GOOD', 'NEUTRAL', 'BAD', 'NEUTRAL', 'GOOD', 'GOOD', 'VERY_GOOD', 'NEUTRAL', 'BAD', 'GOOD']
  for (let i = 13; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    await prisma.emotionalCheckin.create({
      data: {
        userId: user.id,
        mood: moods[i],
        stressLevel: Math.floor(Math.random() * 4) + 4,
        energyLevel: Math.floor(Math.random() * 4) + 4,
        motivation: Math.floor(Math.random() * 4) + 5,
        anxiety: Math.floor(Math.random() * 4) + 3,
        date,
      }
    })
  }

  // Create recommendations
  await Promise.all([
    prisma.recommendation.create({
      data: {
        userId: user.id,
        type: 'ACADEMIC',
        title: '⚠️ Cálculo necesita más atención',
        body: 'Tu promedio en Cálculo está en 3.5 y necesitas al menos 3.0 para aprobar. Con el parcial 2 con peso del 30%, necesitas sacar mínimo 3.8 para asegurar tu nota final.',
        priority: 'HIGH',
      }
    }),
    prisma.recommendation.create({
      data: {
        userId: user.id,
        type: 'EMOTIONAL',
        title: '😤 Tu nivel de estrés está alto',
        body: 'Esta semana tu estrés promedio fue de 7/10. Intenta incorporar técnicas de respiración profunda antes de estudiar y toma descansos activos cada 45 minutos.',
        priority: 'MEDIUM',
      }
    }),
    prisma.recommendation.create({
      data: {
        userId: user.id,
        type: 'HABIT',
        title: '🔥 ¡Racha increíble en Repaso Activo!',
        body: '7 días seguidos haciendo repaso activo. La ciencia dice que esta técnica mejora la retención hasta un 70%. ¡Sigue así!',
        priority: 'LOW',
      }
    }),
    prisma.recommendation.create({
      data: {
        userId: user.id,
        type: 'PRODUCTIVITY',
        title: '🌅 Prueba estudiar en la mañana',
        body: 'Según tus registros, en las tardes tu energía es más baja. Intentar una sesión de estudio de 7am a 9am puede mejorar tu productividad considerablemente.',
        priority: 'MEDIUM',
      }
    }),
  ])

  // Create achievements
  await Promise.all([
    prisma.achievement.create({
      data: {
        userId: user.id,
        badge: '🔥',
        title: 'Primera Semana',
        description: 'Completaste tu primera semana en EstudiaAI',
      }
    }),
    prisma.achievement.create({
      data: {
        userId: user.id,
        badge: '🎯',
        title: 'Objetivo Inicial',
        description: 'Completaste el onboarding y configuraste tu perfil',
      }
    }),
    prisma.achievement.create({
      data: {
        userId: user.id,
        badge: '📚',
        title: 'Estudioso',
        description: 'Acumulaste más de 10 horas de estudio',
      }
    }),
  ])

  console.log('✅ Seed completado!')
  console.log('📧 Demo user: demo@estudiaai.com')
  console.log('🔑 Password: demo123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
