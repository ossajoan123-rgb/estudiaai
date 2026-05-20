import { NextResponse } from "next/server"
import OpenAI from "openai"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {

  try {

    // SESIÓN
    const session = await auth()

    if (!session?.user) {

      return NextResponse.json(
        {
          error: "No autorizado",
        },
        {
          status: 401,
        }
      )
    }

    const userId =
      (session.user as any).id

    // BODY
    const body = await req.json()

    const message =
      body.message

    if (!message) {

      return NextResponse.json(
        {
          error: "Mensaje requerido",
        },
        {
          status: 400,
        }
      )
    }

    // ===== OBTENER DATOS DEL SISTEMA =====

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

    const subjects =
      await prisma.subject.findMany({
        where: {
          userId,
        },
      })

    const tasks =
      await prisma.task.findMany({
        where: {
          userId,
        },
        orderBy: {
          dueDate: "asc",
        },
        take: 15,
      })

    const habits =
      await prisma.habit.findMany({
        where: {
          userId,
        },
      })

    const emotional =
      await prisma.emotionalCheckin.findMany({
        where: {
          userId,
        },
        take: 7,
        orderBy: {
          date: "desc",
        },
      })

    // ===== IA =====

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [

          {
            role: "system",

            content: `
Eres el asistente oficial de EstudiaAI.

Tu trabajo es ayudar al estudiante académica y emocionalmente.

IMPORTANTE:

- Responde SIEMPRE en español.
- Sé claro y útil.
- Puedes ayudar con:
  - organización
  - hábitos
  - productividad
  - cálculo de notas
  - estrés académico
  - horarios
  - motivación
  - recomendaciones de estudio
  - riesgo académico

DATOS DEL USUARIO:

Usuario:
${JSON.stringify(user)}

Materias:
${JSON.stringify(subjects)}

Tareas:
${JSON.stringify(tasks)}

Hábitos:
${JSON.stringify(habits)}

Check-ins emocionales:
${JSON.stringify(emotional)}

REGLAS:

- Si el usuario pregunta por notas:
  usa cálculos ponderados.

- Si el usuario está estresado:
  recomienda descanso y técnicas de estudio.

- Si detectas bajo rendimiento:
  recomienda acciones concretas.

- Habla como un asesor académico inteligente.
`,
          },

          {
            role: "user",
            content: message,
          },
        ],

        temperature: 0.7,
        max_tokens: 1000,
      })

    const reply =
      completion.choices[0]?.message?.content

    return NextResponse.json({
      reply,
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    )
  }
}